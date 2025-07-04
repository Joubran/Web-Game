<template>
  <DialogRoot
    :open="open"
    @update:open="open = $event"
  >
    <DialogPortal>
      <DialogOverlay class="DialogOverlay" @click.stop>
        <!-- SVG noise filter -->
        <svg class="noise" viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="modalNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="6" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#modalNoiseFilter)" />
        </svg>

        <DialogContent class="DialogContent">
          <button class="close-btn" @click="closeDialog">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <form @submit.prevent="handleSubmit">
            <h4>Ваш результат: {{ userSolution }}</h4>
            <h4>Оптимальный результат: {{ optimalSolution }} </h4>
            <div
              class="container"
              :style="{
                '--cols': optimalMatrix[0] ? optimalMatrix[0].length : 0
              }"
            >
              <!-- Render grid cells -->
              <template v-for="(row, rowIndex) in optimalMatrix" :key="rowIndex">
                <div
                  v-for="(cell, colIndex) in row"
                  :key="`${rowIndex}-${colIndex}`"
                  class="cube"
                  :class="{ animate: animateCubes, placeholder: cell === 0 }"
                  :style="{
                    transitionDelay: 
                      animationDelayMatrix.length > 0 && 
                      animationDelayMatrix[rowIndex] && 
                      animationDelayMatrix[rowIndex][colIndex] >= 0 
                        ? `${animationDelayMatrix[rowIndex][colIndex]}ms`
                        : `${((optimalMatrix.length - rowIndex - 1) * optimalMatrix[0].length + colIndex) * 100}ms`
                  }"
                ></div>
              </template>
            </div>
            <div class="btns">
              <button type="submit" class="submit-btn">ОК</button>
              <button type="submit" class="submit-btn" @click="handleNext">ДАЛЬШЕ</button>
            </div>
          </form>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<script>
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'reka-ui'
import { nextTick } from 'vue'

export default {
  props: {
    updateBoard: {
      type: Function,
      required: true
    }
  },
  components: { DialogContent, DialogOverlay, DialogPortal, DialogRoot},
  data() {
    return {
      open: false,
      userSolution: 0,
      optimalSolution: 0,
      optimalMatrix: [
        [1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1],
        [1, 1, 0, 1, 1],
        [0, 0, 1, 1, 0]
      ],
      animateCubes: false,
      animationDelayMatrix: []  // NEW: Store computed animation delays
    }
  },

  watch: {
    open(val) {
      if (val) {
        // wait for DOM then animate cubes
        nextTick(() => {
          this.animateCubes = true
          this.computeAnimationDelays()  // NEW: Compute delays when opening
        })
      } else {
        this.animateCubes = false
        this.animationDelayMatrix = []   // NEW: Reset when closing
      }
    }
  },

  methods: {
    wait() {
      return new Promise(resolve => setTimeout(resolve, 1000))
    },
    handleSubmit() {
      this.wait().then(() => {
        this.closeDialog()
      })
    },
    closeDialog() {
      this.open = false
    },
    handleNext() {
      this.updateBoard();
    },

    // NEW: Compute animation delays based on algorithm
    computeAnimationDelays() {
      if (!this.optimalMatrix || this.optimalMatrix.length === 0) {
        return;
      }
      
      const rows = this.optimalMatrix.length;
      const cols = this.optimalMatrix[0].length;
      const delayMatrix = Array(rows).fill(0).map(() => Array(cols).fill(-1));
      const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
      const maxLevels = rows;
      let groupIndex = 0;

      // Process columns left to right
      for (let col = 0; col < cols; col++) {
        let foundPairInThisCol = false;
        
        // Process rows bottom to top
        for (let row = rows-1; row >=0; row--) {
          if (!visited[row][col] && this.optimalMatrix[row][col] === 1) {
            // Check for adjacent container to form pair
            if (col+1 < cols && this.optimalMatrix[row][col+1] === 1 && !visited[row][col+1]) {
              // Mark both containers as visited
              visited[row][col] = true;
              visited[row][col+1] = true;
              
              // Calculate level from bottom
              const levelInPair = rows - 1 - row;
              
              // Compute delay: groupIndex * maxLevels + levelInPair
              const delay = (groupIndex * maxLevels + levelInPair) * 100;
              
              // Set delay for both containers in pair
              delayMatrix[row][col] = delay;
              delayMatrix[row][col+1] = delay;
              
              foundPairInThisCol = true;
            }
          }
        }
        
        if (foundPairInThisCol) {
          groupIndex++;
        }
      }
      
      this.animationDelayMatrix = delayMatrix;
    }
  }
}
</script>

<style lang="scss">
body {
  background: #FFF;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
}
.DialogOverlay {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center; 
  justify-content: center; 
  z-index: 9999;
}

.noise {
  position: absolute; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.1;
  z-index: 1;
}

.DialogContent {
  padding: 32px; 
  position: relative;
  min-width: 300px;
  max-width: 600px;
  border-radius: 36px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  z-index: 2;
  background: rgba(0, 0, 0, 0.5); 
  -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
  animation: fadeIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;

  h4 {
    margin-top: 10px;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .submit-btn {
    border: none;
    font-size: 16px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    padding: 8px 16px;
    border-radius: 25px;
    background-color: transparent; 
    color: white;
    cursor: pointer;
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s ease;

  svg {
    width: 24px;
    height: 24px;
    stroke: white;
    transition: stroke 0.3s ease;
  }
}

.DialogContent form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.container {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-gap: 4px;
  width: 100%;
  
  max-height: 600px; 
  border-radius: 12px;
  overflow: hidden; 
  padding: 10px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cube {
  height: 50%;
  width: 100%;
  padding-top: 100%;    // square
  background: #764bdb;
  transform: scale(0);
  transition: transform 0.3s ease-out;
  border-radius: 5px;
}


.cube.animate {
  transform: scale(1);
}

.cube.placeholder {
  background: transparent;
  transition: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>