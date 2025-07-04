<template>

    <div class="display">
      <div class="board">
        <div v-for="(columnBlocks, colIndex) in columns" :key="colIndex" class="column">
          <Block v-for="block in columnBlocks" :key="block.colIndex + '-' + block.rowIndex" :block="block" @click="handleBlockClick"></Block>
        </div>
      </div>
    </div>
</template>

<script>
import Block from "./GameObject.vue";
import { calculateOptimalSolution } from "../utils/solver.js";
import {generateLevel} from "../data/levels.js";

export default {
  components: { Block },
  data() {
    return {
      board: [2, 5, 7, 1, 8],
      blocks: [],
      uniqueCount: 0,
      optimalCount: 0,
      MOBILE_MAX_WIDTH: 767,
      isMobile: false,
    }
  },
  created() {
    this.initializeBlocks();
  },
  computed: {
    columns() {
      const cols = {};
      this.blocks.forEach(block => {
        if (!cols[block.colIndex]) {
          cols[block.colIndex] = [];
        }
        cols[block.colIndex].push(block);
      });
      // Сортируем блоки в каждом столбце по убыванию rowIndex
      Object.keys(cols).forEach(colIndex => {
        cols[colIndex].sort((a, b) => b.rowIndex - a.rowIndex);
      });
      return cols;
    },

    blockMatrix() {
      const num_cols = this.board.length;
      const max_height = Math.max(...this.board);
      const matrix = Array.from({ length: max_height }, () => Array(num_cols).fill(0));

      this.blocks.forEach(block => {
        if (block.state === 'connected') {
          const r = max_height - block.rowIndex;
          const c = block.colIndex;
          matrix[r][c] = block.connectionIndex;
        }
      });
      return matrix;
    },
  },
  methods: {
    isValidHeadTail(block) {
      const aboveBlocks = this.blocks.filter(b =>
          b.colIndex === block.colIndex &&
          b.rowIndex > block.rowIndex &&
          b.state === 'connected'
      );
      const belowBlocks = this.blocks.filter(b =>
          b.colIndex === block.colIndex &&
          b.rowIndex < block.rowIndex &&
          b.state === 'connected'
      );
      if (block.type === 'head') {
        return aboveBlocks.every(b => b.type !== 'tail') && belowBlocks.every(b => b.type !== 'tail');
      } else if (block.type === 'tail') {
        return aboveBlocks.every(b => b.type !== 'head') && belowBlocks.every(b => b.type !== 'head');
      }
      return true;
    },

    hasBlockBelow(colIndex, rowIndex) {
      if (rowIndex === 1) return true; // Первый ряд всегда разрешён
      return !!this.blocks.find(b => b.colIndex === colIndex && b.rowIndex === rowIndex - 1 && b.state === 'connected');
    },

    getRightBlock(block) {
      return this.blocks.find(b => b.colIndex === block.colIndex + 1 && b.rowIndex === block.rowIndex);
    },

    initializeBlocks() {
      this.updateUserSolution();

      this.blocks = [];
      this.board.forEach((height, colIndex) => {
        for (let rowIndex = 1; rowIndex <= height; rowIndex++) {
          const block = {
            colIndex,
            rowIndex,
            state: 'inactive',
            connectionIndex: null,
            type: null
          };
          this.blocks.push(block);
        }

        this.optimalCount = calculateOptimalSolution(this.board).totalContainers;
      });
    },

    renumberConnectionIndices() {
      // Собираем все подключенные блоки
      const connectedBlocks = this.blocks.filter(b => b.state === 'connected');
      const uniqueIndices = [...new Set(connectedBlocks.map(b => b.connectionIndex))].sort((a, b) => a - b);
      // Создаём карту для перенумерации: старый индекс -> новый индекс (1, 2, 3, ...)
      const indexMap = {};
      uniqueIndices.forEach((oldIndex, newIndex) => {
        indexMap[oldIndex] = newIndex + 1;
      });
      // Применяем новые индексы к блокам
      connectedBlocks.forEach(b => {
        if (b.connectionIndex in indexMap) {
          b.connectionIndex = indexMap[b.connectionIndex];
        }
      });
      console.log('Перенумерованы индексы:', indexMap);
    },

    destroyTowerAbove(colIndex, rowIndex) {
      const aboveContainers = this.blocks.filter(b =>
          (b.colIndex === colIndex || b.colIndex === colIndex + 1) &&
          b.rowIndex > rowIndex &&
          b.state === 'connected'
      );
      if (aboveContainers.length === 0) return;
      const connectionIndices = new Set(aboveContainers.map(b => b.connectionIndex));
      for (const connIndex of connectionIndices) {
        const containerBlocks = this.blocks.filter(b =>
            b.connectionIndex === connIndex &&
            b.state === 'connected'
        );
        if (containerBlocks.length === 2) {
          containerBlocks.forEach(b => {
            b.state = 'destroying';
          });
          setTimeout(() => {
            containerBlocks.forEach(b => {
              if (b.state === 'destroying') {
                b.state = 'inactive';
                b.connectionIndex = null;
                b.type = null;
              }
            });
          }, 500);
        }
      }

    },

    checkAndDestroyFloatingContainers() {
      return new Promise(resolve => {
        let destroyed = false;
        const connectionIndices = new Set(this.blocks.filter(b => b.state === 'connected').map(b => b.connectionIndex));
        const promises = [];

        for (const connIndex of connectionIndices) {
          const containerBlocks = this.blocks.filter(b => b.connectionIndex === connIndex && b.state === 'connected');
          if (containerBlocks.length === 2) {
            const [block1, block2] = containerBlocks;
            const hasSupport = this.hasBlockBelow(block1.colIndex, block1.rowIndex) && this.hasBlockBelow(block2.colIndex, block2.rowIndex);
            if (!hasSupport && block1.rowIndex > 1) {
              containerBlocks.forEach(b => {
                b.state = 'destroying';
              });
              this.destroyTowerAbove(block1.colIndex, block1.rowIndex);
              promises.push(
                  new Promise(res => {
                    setTimeout(() => {
                      containerBlocks.forEach(b => {
                        if (b.state === 'destroying') {
                          b.state = 'inactive';
                          b.connectionIndex = null;
                          b.type = null;
                        }
                      });
                      res();
                    }, 500);
                  })
              );
              destroyed = true;
            }
          }
        }

        Promise.all(promises).then(() => {
          if (destroyed) {
            this.checkAndDestroyFloatingContainers().then(resolve);
          } else {
            resolve();
          }
        });
      });
    },

    handleBlockClick(block) {
      if (!block || typeof block.colIndex === 'undefined' || typeof block.rowIndex === 'undefined') {
        console.warn('Некорректный блок:', block);
        return;
      }
      this.blocks.forEach(b => {
        if (b.state === 'active') {
          b.state = 'inactive';
          b.type = null;
        }
      });
      if (block.state === 'connected') {
        const connIndex = block.connectionIndex;
        this.blocks.forEach(b => {
          if (b.connectionIndex === connIndex) {
            b.state = 'inactive';
            b.connectionIndex = null;
            b.type = null;
          }
        });
        this.checkAndDestroyFloatingContainers().then(() => {
          this.renumberConnectionIndices();
        });
      } else if (block.state === 'inactive') {
        const rightBlock = this.getRightBlock(block);
        if (rightBlock && rightBlock.state === 'inactive') {
          const canPlaceContainer = this.hasBlockBelow(block.colIndex, block.rowIndex) && this.hasBlockBelow(rightBlock.colIndex, rightBlock.rowIndex);
          if (canPlaceContainer) {
            block.type = 'head';
            rightBlock.type = 'tail';
            const isValid = this.isValidHeadTail(block) && this.isValidHeadTail(rightBlock);
            if (isValid) {
              const nextIndex = this.getNextConnectionIndex();
              block.state = 'connected';
              block.connectionIndex = nextIndex;
              rightBlock.state = 'connected';
              rightBlock.connectionIndex = nextIndex;
              this.checkAndDestroyFloatingContainers().then(() => {
                this.renumberConnectionIndices();
              });
            } else {
              block.type = null;
              rightBlock.type = null;
              block.state = 'active';
            }
          } else {
            block.state = 'active';
          }
        } else {
          block.state = 'active';
        }
      } else if (block.state === 'active') {
        block.state = 'inactive';
        block.type = null;
      }
      this.updateUserSolution();
    },

    getNextConnectionIndex() {
      const maxIndex = Math.max(...this.blocks.map(b => b.connectionIndex || 0));
      return maxIndex + 1;
    },

    getUserSolution(){
      const uniqueItems = new Set();
      const matrix = this.blockMatrix;

      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
          if(matrix[i][j]!=0){
            uniqueItems.add(matrix[i][j]);
          }
        }
      }
      return uniqueItems.size;
    },

    updateUserSolution() {
      this.uniqueCount = this.getUserSolution();
    },

    updateBoard(){
      this.checkScreen();
      
      if(this.isMobile){
        this.board = generateLevel(5).columns;
      }
      else{
        this.board = generateLevel(10).columns;
      }
      
      this.initializeBlocks();
      this.updateUserSolution();
    },

    checkScreen() {
      this.isMobile = window.innerWidth <= this.MOBILE_MAX_WIDTH
    },
  }
}
</script>

<style scoped>


.display {
  z-index: 100000;
  position: absolute;
  border: 1px solid #0048ff;
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-radius: 50px;
  background: rgba(0, 0, 42, 0.5);
  backdrop-filter: blur(87.35px);
}

.board {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

@media (max-width: 800px) {
  .display {
    border-radius: 30px;
  }
}
</style>