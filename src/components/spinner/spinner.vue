<template>
  <div class="dSpinerCont" v-show="show">
    <div class="body">
        <!-- <div class="dSpiner play" :style="{'background-image': 'url('+require('@/components/spinner/logo.svg')+')'}"></div> -->
        <div class="dSpinerImg">
          <img v-if="logo" :src="logo"/>
          <img v-else :src="img"/>
        </div>
        <div class="content" v-html="content"></div>
    </div>
  </div>
</template>
<script>

export default {
    data(){
        return {
            show : false,
            img : require('@/assets/img/loading.gif'),
            content : null
        }
    },
    props : ['logo'],
    methods : {
        _show(s,content=null){
            this.show = s
            this.content = content
        }
    }
}
</script>

