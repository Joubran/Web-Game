<template>
  <div class="card">
    <svg
        viewBox="0 0 100% 100%"
        xmlns="http://www.w3.org/2000/svg"
        class="noise"
    >
      <filter id="noiseFilter">
        <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="6"
            stitchTiles="stitch" />
      </filter>
      <rect
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          filter="url(#noiseFilter)" />
    </svg>
    <div class="content">
      <h1>Авторы:</h1>
      <div class="au">
        <p>Махно София @fudori_kaito</p>
        <p>Ванчикова Юмжана @mtifyuu</p>
        <p>Бобрунов Егор @bobrunov_e</p>
        <p>Диких Олег @krovan06</p>
        <p>Альбуний Джобран @Joubran13</p>
      </div>
    </div>
    <button class="btn-back" @click="goBack">Назад</button>
  </div>
  <div class="gradient-bg">
    <svg
        viewBox="0 0 100vw 100vw"
        xmlns="http://www.w3.org/2000/svg"
        class="noiseBg"
    >
      <filter id="noiseFilterBg">
        <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch" />
      </filter>
      <rect
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          filter="url(#noiseFilterBg)" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="svgBlur">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
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
  </div>
</template>

<script>
export default {
  name: 'MainMenu',
  mounted() {
    this.initInteractiveBubble();
  },
  methods: {
    goBack() {
      console.log('Router:', this.$router); // Проверяем, что $router доступен
      if (this.$router) {
        this.$router.push('/');
      } else {
        console.error('$router is undefined!');
      }
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
  },
};
</script>



<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
  /* Глобальные переменные и стили */
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


* {
  margin:0;
  padding:0;
  outline:none;
  list-style:none;
  text-decoration:none;
  box-sizing:border-box;
  color:#FFF;
  // background: transparent;
  border:none;
}

html, body {
  font-family: 'Dongle', sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #FFF;
  overflow: hidden;
}
</style>



<style scoped>

body {
  background: #FFF;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
}

h1 {
  text-align: center;
}
h1, h2, h3 {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
}


.btn-back {
  font-size: 20px;
  transition: transform 0.3s ease, background-color 0.3s ease;
  padding: 16px;
  border-radius: 25px;
  background: none;
  color: white;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

.btn-back:hover {
  transform: scale(1.1);
  background-color: rgba(175, 182, 213, 0.2);
}


.card {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  max-width: 600px;
  padding: 48px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 90px rgba(0,0,0,0.1);
  overflow: hidden;
  text-align: center;
  &:before {
    content: "";
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgb(255,255,255);
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 34%, rgba(255,255,255,1) 89%, rgba(255,255,255,0) 100%);
    opacity: 0.3;
    filter: blur(.5px);
    mix-blend-mode: hard-light;
  }
  .noise {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    opacity: 0.1;
    pointer-events: none;
  }

  .content {
    position: relative;
    z-index: 2;
    text-shadow: -3px 0px 2px rgba(0,0,0,0.1);
    padding-bottom: 14px;
  }
}

h1 {
  font-size: 3rem;
  margin-bottom: 16px;
}

p {
  line-height: 1.6;
}


@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}


.gradient-bg {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  top: 0;
  left: 0;

  .svgBlur {
    display: none;
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
    filter: url(#goo) blur(40px) ;
    width: 100%;
    height: 100%;
  }

  .g1 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: center center;
    animation: moveVertical 30s ease infinite;

    opacity: 1;
  }

  .g2 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;

    opacity: 1;
  }

  .g3 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);

    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;

    opacity: 1;
  }

  .g4 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);

    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;

    opacity: 0.7;
  }


  .g5 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
    mix-blend-mode: var(--blending);

    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));

    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;

    opacity: 1;
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
}
</style>
