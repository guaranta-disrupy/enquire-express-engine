<template>
<transition name="dWarn">
  <div class="dWarn" v-if="show" v-html="content"></div>
</transition>
</template>

<script>
export default {
    data(){
        return {
            show : false,
            content : null,
        }
    },
    methods:{
        _show(msg = "This question is required!"){
            setTimeout(()=>{
                this.show = true
                this.content = msg
            },100)

        },
        _hide(){
            setTimeout(()=>{
                this.show = false
                this.content = null
            },100)
        }
    }
}
</script>