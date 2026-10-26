<template>
  <div class="dLogo" v-show="show">
    <div class="body">
        <!-- <div class="logo play" :style="{'background-image': 'url('+require('@/components/loading/logo.svg')+')'}"></div> -->
        <div class="dLogoImg">
          <img v-if="logo" :src="logo"/>
          <img v-else class="ns-default" :src="img"/>
        </div>
    </div>
  </div>
</template>
<script>

export default {
    data(){
        return {
            show : false,
            img : require('@/assets/img/nextsensus/nextsensus-carregando.svg')
        }
    },
    props : ['logo'],
    methods : {
        _show(s){
            this.show = s
        }
    }
}
</script>

<style scoped>
@keyframes aLogo {
  0%,25% {
    background-position: 0px 0px;
  }
  75%,100% {
    background-position: -9540px 0px;
  }
}
.dLogo{
   position:fixed;
   width:100%;
   height: 100%;
   left:0px;
   top:0px;
   z-index:500;
}
.dLogo > .body{
    position:relative;
    width:90%;
    height:auto;
    left:50%;
    top:10%;
    transform:translateX(-50%);
}
.dLogoImg{
  width: 120px;
  height: 70px;
  position:relative;
  left:50%;
  transform: scale(1) translateX(-50%);
  pointer-events:none;
}
.dLogoImg img{
  position:absolute;
  max-width:100%;
  max-height:100%;
  width: unset;
  height: unset;
  margin:unset;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.dLogo .logo {
  position:relative;
  left:50%;
  transform:scale(.6) translateX(-50%);
  transform-origin: left;
  animation-duration: 1500ms;
  animation-timing-function: steps(60);
  animation-direction: alternate;
  animation-iteration-count: infinite;
  width: 159px;
  height: 100px;
  background-repeat: no-repeat;
}
.dLogo .logo.play {
  animation-name: aLogo;
}

/* nextsensus: a animação padrão é larga; logos personalizados seguem o limite original */
.dLogoImg img.ns-default{
  width: 220px;
  max-width: none;
  height: auto;
  max-height: none;
}
</style>