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
  width: calc((1vh + 1vh) * 3.5);
  height: calc((1vh + 1vh) * 3.5);
  border: 1.11px solid rgb(72, 120, 191);
  border-radius: 10.93px;
  backdrop-filter: blur(87.35px);
  transition: 0.3s ease-in-out;
  margin: 4px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.block-active {
  width: calc((1vh + 1vh) * 3.5);
  height: calc((1vh + 1vh) * 3.5);
  background-color: #9caac3;
  border-radius: 10px;
  margin: 4px;
  transition: 0.3s;
}

.block-connected {
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.block-head {
  /*
  background-color: #ffd700;
  border-color: #d4af37;
  */
  border-radius: 20%;
  background: rgb(11, 86, 193);
}

.block-tail {
  opacity: 0;
}

.block-merged {
  width: calc((1vh + 1vh) * 7);
  margin-right: -8vh;
  z-index: 2;
  border-radius: 10px;
}

.block:hover {
  background-color: rgba(116, 118, 129, 0.61);
}
.block-active:hover {
  background-color: rgba(100, 0, 177, 0.61);
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
@media (max-width: 800px) {
  .block {
    width: calc((1vh + 1vh) * 3);
    height: calc((1vh + 1vh) * 3);
    margin: 3px;
  }
  .block-merged {
  width: calc((1vh + 1vh) * 7);
  margin-right: -6.5vh;
  z-index: 2;
  border-radius: 10px;
}
}
</style>
