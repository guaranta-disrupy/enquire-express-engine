<template v-if="prime">
    <template v-for="(val) in prime.values" :key="val?.value">
        <div class="targetBox" :ref="'target_'+val.value" :class="{onHover:(val.hover),isLoading:($parent.isLoading)}" :layout="$parent.data.setup.valuesLayout" :animation="val.animation" @click="_selected(val)" :style="_style(val)" @mouseover="val.hover = true" @mouseleave="val.hover = false">
            <div class="body">
                <div v-if="$parent.data.setup.valuesLayout==1 || $parent.data.setup.valuesLayout==4" class="parent_node"><div class="child_node" ><div class="content" v-html="$parent._pipeText(val.name)"></div></div></div>
                <img v-else :src="val.name"/>
            </div>
        </div>
    </template>
</template>


<script>
export default{
    data(){
        return {
            data : {}
        }
    },
    props : ['prime'],
    mounted(){

    },
    methods:{
        _show(){
            this.data = this.prime
            return new Promise((resolve)=>{
                
                this.$nextTick(()=>{
                    this.data.values.map((v)=>{
                        v['animation'] = "start"
                        this._fixTarget(this.$refs['target_'+v.value])
                    })
                    //console.log(this.$refs)
                    setTimeout(()=>{
                        resolve()
                    },300)
                     
                })
            })
        },
        _selected(target){
            
            let $main = this.$parent
            let prime = $main.current.prime

            prime.form['text'] = target.name
            prime.form['value'] = target.value
            prime.form['obj'] = target
            $main.current.endTime = new Date().getTime()
            const rt = $main.current.endTime - $main.current.startTime
            prime.form['rt'] = rt
            
            prime.values.map((v)=>{
                if(v.value != target.value){
                    v['animation'] = "dissolved"
                }else{
                    v['animation'] = "selected"
                }
            })
            setTimeout(()=>{
                $main.$refs['primeElem']._animationOut().then(()=>{
                    $main._nextStep();
                })
            },500)

        },
        _style(target){
           const style = {}
           if(target.color != ""){
              style["--br-targetColor"] = target.color
           }
           if(this.$parent.data.setup.fontStyle.values != ""){
             style["--target-font-size"] = this.$parent.data.setup.fontStyle.values
           }
           return style
        },
        _fixTarget(elem){
            if(this.$parent.data.setup.valuesLayout == 2 || this.$parent.data.setup.valuesLayout == 3){
                return
            }
            const parent_node = elem.querySelector(".parent_node")
            const child_node =  parent_node.querySelector(".child_node")
            // console.log(child_node.clientWidth)
            // console.log(parent_node.clientWidth)
            this._getScaleFactorOfItems(parent_node,child_node)
        },
        _getScaleFactorOfItems(node,child_node){
            // let scaleFactor = 1 / Math.max(child_node.querySelector(".content").clientWidth / node.clientWidth, child_node.querySelector(".content").clientHeight / node.clientHeight);
            // let scale = Math.min(scaleFactor, 1)
            let scale = 1
            child_node.style.transform = "translateX(-50%) scale("+scale+")";
            child_node.style.height = (100 / scale)+"%"
            child_node.style.width = (100 / scale)+"%"
            child_node.style.transformOrigin = "top center";
        },

    }
}
</script>


<style scoped>
.dQuestion[qtype=btn-rating] .targetBox{
    font-size: var(--fs3);
}
.dQuestion[qtype=btn-rating] .targetBox.isLoading{
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) rotate(40deg) scale(1);
    z-index:1;
}


</style>
