<template >
<span class="ssr-loader" v-show="show"></span>
</template>

<script>
export default {
    data() {
        return {
            show: false
        }
    },
    methods: {
        _hide() {
            this.show = false
        },
        _show() {
            this.show = true
        }
    }
}
</script>

<style scoped>
.ssr-loader {
  font-size: 10px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: absolute;
  text-indent: -9999em;
  animation: mulShdSpin 1.1s infinite ease;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
}


@keyframes mulShdSpin {
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em #333333, 1.8em -1.8em 0 0em rgba(51,51,51, 0.2), 2.5em 0em 0 0em rgba(51,51,51, 0.2), 1.75em 1.75em 0 0em rgba(51,51,51, 0.2), 0em 2.5em 0 0em rgba(51,51,51, 0.2), -1.8em 1.8em 0 0em rgba(51,51,51, 0.2), -2.6em 0em 0 0em rgba(51,51,51, 0.5), -1.8em -1.8em 0 0em rgba(51,51,51, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.7), 1.8em -1.8em 0 0em #333333, 2.5em 0em 0 0em rgba(51,51,51, 0.2), 1.75em 1.75em 0 0em rgba(51,51,51, 0.2), 0em 2.5em 0 0em rgba(51,51,51, 0.2), -1.8em 1.8em 0 0em rgba(51,51,51, 0.2), -2.6em 0em 0 0em rgba(51,51,51, 0.2), -1.8em -1.8em 0 0em rgba(51,51,51, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.5), 1.8em -1.8em 0 0em rgba(51,51,51, 0.7), 2.5em 0em 0 0em #333333, 1.75em 1.75em 0 0em rgba(51,51,51, 0.2), 0em 2.5em 0 0em rgba(51,51,51, 0.2), -1.8em 1.8em 0 0em rgba(51,51,51, 0.2), -2.6em 0em 0 0em rgba(51,51,51, 0.2), -1.8em -1.8em 0 0em rgba(51,51,51, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.2), 1.8em -1.8em 0 0em rgba(51,51,51, 0.5), 2.5em 0em 0 0em rgba(51,51,51, 0.7), 1.75em 1.75em 0 0em #333333, 0em 2.5em 0 0em rgba(51,51,51, 0.2), -1.8em 1.8em 0 0em rgba(51,51,51, 0.2), -2.6em 0em 0 0em rgba(51,51,51, 0.2), -1.8em -1.8em 0 0em rgba(51,51,51, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.2), 1.8em -1.8em 0 0em rgba(51,51,51, 0.2), 2.5em 0em 0 0em rgba(51,51,51, 0.5), 1.75em 1.75em 0 0em rgba(51,51,51, 0.7), 0em 2.5em 0 0em #333333, -1.8em 1.8em 0 0em rgba(51,51,51, 0.2), -2.6em 0em 0 0em rgba(51,51,51, 0.2), -1.8em -1.8em 0 0em rgba(51,51,51, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.2), 1.8em -1.8em 0 0em rgba(51,51,51, 0.2), 2.5em 0em 0 0em rgba(51,51,51, 0.2), 1.75em 1.75em 0 0em rgba(51,51,51, 0.5), 0em 2.5em 0 0em rgba(51,51,51, 0.7), -1.8em 1.8em 0 0em #333333, -2.6em 0em 0 0em rgba(51,51,51, 0.2), -1.8em -1.8em 0 0em rgba(51,51,51, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.2), 1.8em -1.8em 0 0em rgba(51,51,51, 0.2), 2.5em 0em 0 0em rgba(51,51,51, 0.2), 1.75em 1.75em 0 0em rgba(51,51,51, 0.2), 0em 2.5em 0 0em rgba(51,51,51, 0.5), -1.8em 1.8em 0 0em rgba(51,51,51, 0.7), -2.6em 0em 0 0em #333333, -1.8em -1.8em 0 0em rgba(51,51,51, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(51,51,51, 0.2), 1.8em -1.8em 0 0em rgba(51,51,51, 0.2), 2.5em 0em 0 0em rgba(51,51,51, 0.2), 1.75em 1.75em 0 0em rgba(51,51,51, 0.2), 0em 2.5em 0 0em rgba(51,51,51, 0.2), -1.8em 1.8em 0 0em rgba(51,51,51, 0.5), -2.6em 0em 0 0em rgba(51,51,51, 0.7), -1.8em -1.8em 0 0em #333333;
  }
}

</style>