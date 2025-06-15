<template>
  <div class="app">
    <h1>Water Container Problem Solver</h1>

    <div class="controls">
      <label for="columnCount">Количество колонок:</label>
      <input
          id="columnCount"
          type="number"
          v-model.number="columnCount"
          min="2"
          max="20"
      />
      <button @click="generateNewLevel">Сгенерировать</button>
    </div>

    <div class="level-display">
      <h2>Колонки (высоты):</h2>
      <div class="columns">
        <div
            v-for="(height, index) in currentLevel.columns"
            :key="index"
            class="column"
            :style="{ height: `${height * 30}px` }"
        >
          {{ height }}
        </div>
      </div>

      <h2>Оптимальное количество контейнеров: {{ currentLevel.optimalContainers }}</h2>

      <h2>Матрица решения:</h2>
      <div class="matrix">
        <div
            v-for="(row, rowIndex) in currentLevel.solutionMatrix"
            :key="rowIndex"
            class="matrix-row"
        >
          <div
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              class="matrix-cell"
              :class="{ 'filled': cell === 1 }"
          >
            {{ cell }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateLevel } from '@/data/levels';

const columnCount = ref(4); // По умолчанию 4 колонки
const currentLevel = ref({
  columns: [],
  optimalContainers: 0,
  solutionMatrix: []
});

// Генерация уровня при загрузке
onMounted(() => {
  generateNewLevel();
});

function generateNewLevel() {
  currentLevel.value = generateLevel(columnCount.value);
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.controls {
  margin: 20px 0;
}

input {
  padding: 5px;
  margin: 0 10px;
}

button {
  padding: 5px 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.columns {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.column {
  width: 40px;
  background: #42b983;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  border-radius: 4px 4px 0 0;
}

.matrix {
  margin: 20px auto;
  display: inline-block;
}

.matrix-row {
  display: flex;
}

.matrix-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matrix-cell.filled {
  background: #42b983;
  color: white;
}
</style>