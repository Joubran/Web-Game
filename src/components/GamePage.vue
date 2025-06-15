<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Правила игры</h2>
      <ol>
        <li>Контейнер занимает 2 горизонтальные ячейки в одной колонке</li>
        <li>Голова (слева) должна стоять только на голове</li>
        <li>Хвост (справа) должен стоять только на хвосте</li>
      </ol>
      <button @click="$emit('close')">Понятно!</button>
    </div>
  </div>
</template>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
}

.modal ol {
  margin: 20px 0;
  line-height: 1.6;
}
</style>