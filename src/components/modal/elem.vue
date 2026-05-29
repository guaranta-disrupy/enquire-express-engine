<template>
    <div class="dModal" v-if="show" :ani="animate" :rtl="$parent.project?.setup?.rtl">
        <div class="body">
            <div class="icon">
                <div class="errorDef"></div>
            </div>
            <div class="title" v-html="data?.title"></div>
            <div class="content" v-html="data?.content"></div>
            <div class="footer"></div>
        </div>
        <div class="bg"></div>
    </div>
</template>
<script>


export default {
  props : ["data"],
  data(){
      return {
          show : false,
          animate : null
      }
  },
  methods:{
      _show(){
          return new Promise((resolve)=>{
                this.show = true
                setTimeout(()=>{
                    this.animate = "open"
                    //this.animate = null
                    setTimeout(()=>{
                        resolve()
                    },500)
                },100)
          })
      },
      _hide(){
          return new Promise((resolve)=>{
                this.show = true
                this.animate = "close"
                setTimeout(()=>{
                    this.show = false
                    this.animate = null
                    resolve()
                },500)
          })
      }
  }
}
</script>
