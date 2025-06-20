<template>
  <div :class="['block', {
    'block-active': state === 'active',
    'block-connected': state === 'connected',
    'block-head': type === 'head',
    'block-tail': type === 'tail',
    'block-merged': state === 'connected' && type === 'head'
  }]" @click="clickHandler">
    <span v-if="state === 'connected' && type === 'head'">{{ connectionIndex }}</span>
  </div>
</template>

<script>
export default {
  props: {
    block: {
      type: Object,
      required: true,
      validator: (block) => {
        const hasRequiredProps = 'colIndex' in block &&
            'rowIndex' in block &&
            'state' in block &&
            'connectionIndex' in block &&
            'type' in block;
        if (!hasRequiredProps) {
          console.warn('Некорректный блок. Требуемые свойства: colIndex, rowIndex, state, connectionIndex, type. Получено:', block);
        }
        return hasRequiredProps;
      }
    }
  },
  computed: {
    state() {
      return this.block.state || 'inactive';
    },
    type() {
      return this.block.type || null;
    },
    connectionIndex() {
      return this.block.connectionIndex || null;
    }
  },
  methods: {
    clickHandler() {
      this.$emit('click', this.block);
    }
  }
}
</script>

<style scoped>
.block {
  width: 8vh;
  height: 8vh;
  border: 2px solid #a8a599;
  border-radius: 10px;
  transition: 0.3s ease-in-out; /* Плавное расширение */
  margin: 2px;
  box-sizing: border-box;
  position: relative; /* Для z-index */
  z-index: 1;
}

.block-active {
  background-color: #a8a599;
  border: 2px solid #ff7171;
}

.block-connected {
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.block-head {
  background-color: #ffd700;
  border-color: #d4af37;
}
.block-tail {
  opacity: 0;
}

.block-merged {
  width: 16vh;
  margin-right: -8vh;
  z-index: 2;
  border-radius: 10px;
}

.block:hover {
  background-color: rgba(129, 124, 116, 0.61);
}
.block-active:hover {
  background-color: rgba(177, 154, 0, 0.61);
}
.block-destroying {
  animation: destroy 0.5s ease-in-out forwards;
}
@keyframes destroy {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>