<template>
    <div class="dProgress" ref="progressElement" v-if="show" :style="{'--prog':_getProgress+'%'}" :class={loading:(animate)}>
        <div class="bar" :data-prog="_getProgress"></div>
        <div class="line"></div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            show : true,
            animate : false,
        }
    },
    props:['curr','limit'],
    computed:{
        _getProgress(){
            return (((this.curr) / this.limit) * 100).toFixed(0)
        }
    },
    methods:{
        _show(s){
            this.show = s
        },
        _animate(s){
            setTimeout(()=>{
                this.animate = s
            },700)
        },
        _forceAdd(percent){
            
            let perTick = (((1) / this.limit) * 100).toFixed(0)
            let currentTick = (((this.curr) / this.limit) * 100).toFixed(0)
            let newTick = ((perTick * (percent / 100)) + parseFloat(currentTick)).toFixed(0)
            // console.log(newTick)
            this.$refs['progressElement'].style.setProperty("--prog",newTick+"%")
            this.$refs['progressElement'].querySelector(".bar").setAttribute("data-prog",newTick)
        },
    }
}
</script>
