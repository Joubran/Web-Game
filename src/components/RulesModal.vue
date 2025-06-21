<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content">
      <button class="close-modal" @click="close">×</button>
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
      <button class="modal-back-btn" @click="close">ОК</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style>
ol, ul {
  list-style-type: none;
  padding-left: 0; /* Дополнительно убираем отступ слева */
}
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
  width: 320px;
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
</style>