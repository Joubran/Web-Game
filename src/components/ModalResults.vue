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
            <h4>Your score:</h4>
            <h4>Optimal score: </h4>
            <div class="container">
              <!-- Сюда можно вставить карту -->
            </div>
            <div class="btns">
               <button type="submit" class="submit-btn">OK</button>
              <button type="submit" class="submit-btn">NEXT</button>
            </div>
          </form>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<script>
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot} from 'reka-ui'

export default {
  components: {
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
  },
  data() {
    return {
      open: false
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
  padding: 32px;
  border-radius: 36px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5); 
  -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);

  animation: fadeIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 

  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  h4 {
    margin-bottom: 0;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  p {
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    text-align: center;
  }

  .submit-btn {
    border: none;
    font-size: 16px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    padding: 8px 16px;
    border-radius: 25px;
    display: inline-block;
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
  width: 100%;
  min-height: 300px; 
  max-height: 600px; 
  background-color: #f0f0f0; 
  border-radius: 12px;
  overflow: hidden; 
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
// .btns {
//   display: flex;
// }
</style>
