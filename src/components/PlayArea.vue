<template>
  <div class="gradient-bg">
    <!-- SVG и градиенты -->
    <svg viewBox="0 0 100vw 100vw" xmlns='http://www.w3.org/2000/svg' class="noiseBg">
      <filter id='noiseFilterBg'>
        <feTurbulence type='fractalNoise' baseFrequency='0.6' stitchTiles='stitch'/>
      </filter>
      <rect width='100%' height='100%' preserveAspectRatio="xMidYMid meet" filter='url(#noiseFilterBg)'/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="svgBlur">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/>
          <feBlend in="SourceGraphic" in2="goo"/>
        </filter>
      </defs>
    </svg>
    <div class="gradients-container">
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div class="interactive"></div>
    </div>

    <!-- Хедер с кнопками (показывается только на мобильных) -->


  </div>
  <div class="game-header" v-if="isMobileView">
    <button class="help-btn" @click="showModal = true">?</button>
    <button class="solve-btn" @click="openResultsModal">Проверить</button>
  </div>

  <!-- Инструкции (показываются только на десктопах) -->
  <div class="instructions-wrapper" v-if="!isMobileView">
    <div class="instructions-card">
      <h2>Как играть:</h2>
      <ol>
        <li>1. Игровое поле состоит из столбцов случайной высоты (от 1 до 9 блоков).</li>
        <li><strong>2. Вы можете разместить контейнер между двумя соседними столбцами, если:</strong>
          <ul>
            <li>Обе колонки достаточно высокие на текущем уровне.</li>
            <li>Контейнер не  висит в воздухе и не сталкиваться с другими.</li>
          </ul>
        </li>
      </ol>

      <div class="controls">
        <h3>3. Управление:</h3>
        <ul>
          <li>Щелкните/коснитесь между столбцами, чтобы разместить контейнер.</li>
          <li>Авторешение — нажмите кнопку «Проверить», чтобы увидеть оптимальное решение.</li>
        </ul>
      </div>
    </div>
    <button class="solve-btn" @click="openResultsModal">Проверить</button>
  </div>

  <!-- Модальное окно с правилами -->
  <RulesModal :show="showRulesModal" @close="showRulesModal = false" />

  <!-- Модальное окно с результатами -->
  <ModalResults ref="resultsModal" 
  :updateBoard="updateBoard"/>

  <!-- Старое модальное окно (оставлено для совместимости) -->
  <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
    <div class="modal-content">
      <button class="close-modal" @click="showModal = false">×</button>
      <h2>Как играть:</h2>
      <ol>
        <li>1. Игровое поле состоит из столбцов случайной высоты (от 1 до 9 блоков).</li>
        <li><strong>2. Вы можете разместить контейнер между двумя соседними столбцами, если:</strong>
          <ul>
            <li>Обе колонки достаточно высокие на текущем уровне.</li>
            <li>Контейнер не  висит в воздухе и не сталкиваться с другими.</li>
          </ul>
        </li>
      </ol>

      <div class="controls">
        <h3>3. Управление:</h3>
        <ul>
          <li>Щелкните/коснитесь между столбцами, чтобы разместить контейнер.</li>
          <li>Авторешение — нажмите кнопку «Проверить», чтобы увидеть оптимальное решение.</li>
        </ul>
      </div>
      <button class="modal-back-btn" @click="showModal = false">ОК</button>
    </div>

  </div>
  <div class="GameBoard" >
    <GameBoard ref="gameBoard" />
  </div>

</template>

<script>
import RulesModal from './RulesModal.vue';
import ModalResults from './ModalResults.vue';
import GameBoard from './HelloWorld.vue';
import { calculateOptimalSolution } from "../utils/solver.js";

export default {
  name: 'PlayArea',
  components: {
    RulesModal,
    ModalResults,
    GameBoard,
  },
  data() {
    return {
      showModal: false,
      showRulesModal: false,
      showGameBoard: true,
      isMobileView: window.innerWidth <= 1400
    };
  },
  mounted() {
    this.initInteractiveBubble();
    window.addEventListener('resize', this.handleResize);
    
    // Показываем модальное окно с правилами через 1 секунду
    setTimeout(() => {
      this.showRulesModal = true;
    }, 1000);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    updateBoard() {
      this.$refs.gameBoard.updateBoard();
    },
    initInteractiveBubble() {
      const interBubble = document.querySelector('.interactive');
      let curX = 0;
      let curY = 0;
      let tgX = 0;
      let tgY = 0;

      const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
      };

      window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
      });

      move();
    },
    handleResize() {
      this.isMobileView = window.innerWidth <= 1400;
    },
    openResultsModal() {
      if (this.$refs.resultsModal) {
        this.$refs.resultsModal.open = true;
        this.$refs.resultsModal.userSolution = this.$refs.gameBoard.uniqueCount;
        this.$refs.resultsModal.optimalSolution = this.$refs.gameBoard.optimalCount;
        this.$refs.resultsModal.optimalMatrix = calculateOptimalSolution(this.$refs.gameBoard.board).solutionMatrix;
      }
    }
  }
};
</script>

<style>
* {
  margin:0;
  padding:0;
  outline:none;
  list-style:none;
  text-decoration:none;
  box-sizing:border-box;
  color:#FFF;
  border:none;
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
/* Основные стили */
:root {
  --color-bg1: rgb(8, 10, 15);
  --color-bg2: rgb(0, 17, 32);
  --color1: 18, 113, 255;
  --color2: 107, 74, 255;
  --color3: 100, 100, 255;
  --color4: 50, 160, 220;
  --color5: 80, 47, 122;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}

.gradient-bg {
  z-index: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  background-size: cover;
}

/* Хедер с кнопками (для мобильных) */
.game-header {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  z-index: 1000;
}

.help-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(14, 26, 43, 0.7);
  border: 1px solid rgba(18, 113, 255);
  color: white;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
}

/* Инструкции для десктопа */
.instructions-wrapper {
  position: absolute;
  top: 80px;
  right: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 320px;
  z-index: 10;
}


/* Кнопка Solve */
.solve-btn {
  padding: 10px 20px;
  background: linear-gradient(45deg, #1e88e5, #0d47a1);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
  font-family: 'Montserrat', sans-serif;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
}

.modal-content {
  position: relative;
  background: rgba(14, 26, 43, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(18, 113, 255);
  color: white;
  font-family: 'Montserrat', sans-serif;
}
.GameBoard {
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 100vh;

}



.instructions-card {
  padding: 30px;
  background: rgba(14, 26, 43, 0.7);
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(18, 113, 255);
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.instructions-card h2, .modal-content h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
  color: white;
}

.instructions-card ol, .instructions-card ul, .modal-content ol, .modal-content ul{
  font-size: 12px;
  line-height: 152%;
}



.instructions-card li, .modal-content li {
  margin-bottom: 8px;
  line-height: 152%;
}

.controls h3, .modal-content .controls h3 {
  font-size: 12px;
}

.controls ul, .modal-content .controls ul {
  margin-left: 20px;
}

/* Кнопка Solve */
.solve-btn {
  padding: 10px 20px;
  background: linear-gradient(45deg, #1e88e5, #0d47a1);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.3);
  font-family: 'Montserrat', sans-serif;
}

.solve-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 71, 161, 0.4);
}

.solve-btn:active {
  transform: translateY(0);
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: rgba(14, 26, 43, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(18, 113, 255);
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-back-btn {
  display: block;
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: linear-gradient(45deg, #1e88e5, #0d47a1);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* Остальные стили фона (без изменений) */
.svgBlur {
    display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.noiseBg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  mix-blend-mode: soft-light;
  opacity: 0.3;
}

.gradients-container {
  filter: url(#goo) blur(40px);
  width: 100%;
  height: 100%;
}

.g1, .g2, .g3, .g4, .g5 {
  position: absolute;
  mix-blend-mode: var(--blending);
  opacity: 1;
  animation-duration: 20s;
  animation-iteration-count: infinite;
}

.g1 {
  background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  animation-name: moveVertical;
}

.g2 {
  background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  animation-name: moveInCircle;
  animation-direction: reverse;
}

.g3 {
  background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2 + 200px);
  left: calc(50% - var(--circle-size) / 2 - 500px);
  animation-name: moveInCircle;
}

.g4 {
  background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  animation-name: moveHorizontal;
  opacity: 0.7;
}

.g5 {
  background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
  width: calc(var(--circle-size) * 2);
  height: calc(var(--circle-size) * 2);
  top: calc(50% - var(--circle-size));
  left: calc(50% - var(--circle-size));
  animation-name: moveInCircle;
}

.interactive {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color-interactive), 0.8) 0, rgba(var(--color-interactive), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: 100%;
  height: 100%;
  top: -50%;
  left: -50%;
  opacity: 0.7;
}

@keyframes moveInCircle {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

@keyframes moveVertical {
  0% { transform: translateY(-50%); }
  50% { transform: translateY(50%); }
  100% { transform: translateY(-50%); }
}

@keyframes moveHorizontal {
  0% { transform: translateX(-50%) translateY(-10%); }
  50% { transform: translateX(50%) translateY(10%); }
  100% { transform: translateX(-50%) translateY(-10%); }
}

/* Адаптация для мобильных устройств */
@media (max-width: 1400px) {
  .GameBoard{
    width: 100vw;
  }
  .instructions-wrapper {
    display: none;
  }
  
  .help-btn {
    
    font-size: 20px;
  }
  
  .solve-btn {
    padding: 8px 16px;
    font-size: 20px;
  }
  
  .modal-content {
    padding-inline: 50px;
    padding: 20px;
  }
}
</style>