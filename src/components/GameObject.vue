<template>
  <div :class="['block', {
    'block-active': state === 'active',
    'block-connected': state === 'connected',
    'block-head': type === 'head',
    'block-tail': type === 'tail',
    'block-destroying': type === 'destroying',
  }]" @click="clickHandler">
    <span v-if="state === 'connected'">{{ connectionIndex }}</span>
  </div>
</template>

<script>
export default {
  props: {
    block: {
      type: Object,
      required: true,
      validator: (block) => {
        const hasRequiredProps = 'colIndex' in block && 'rowIndex' in block && 'state' in block && 'connectionIndex' in block && 'type' in block;
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
  },
  created() {
  }
}
</script>

<style scoped>
.block-connected {
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.block {
  width: calc((1vh + 1vh) * 3.5);
  height: calc((1vh + 1vh) * 3.5);


  border: 1.11px solid rgb(72, 120, 191);
  border-radius: 10.93px;
  backdrop-filter: blur(87.35px);



  transition: 0.3s;
  position: relative;
  margin: 4px;
}

.block-active {
  width: calc((1vh + 1vh) * 3.5);
  height: calc((1vh + 1vh) * 4);
  background-color: #a8a599;
  border-radius: 10px;
  margin: 2px;
  transition: 0.3s;
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
  /*
  background-color: #800080;
  border-color: #4b0082;
  color: white;
  */
  border-radius: 20%;
  background: rgb(11, 86, 193);
}

.block:hover {
  background-color: rgba(99, 143, 239, 0.61);
}

.block-active:hover {
  background: rgb(219, 234, 255);
}

@media (max-width: 800px) {
  .block {
    width: calc((1vh + 1vh) * 3);
    height: calc((1vh + 1vh) * 3);
    margin: 3px;
  }
}
</style>
