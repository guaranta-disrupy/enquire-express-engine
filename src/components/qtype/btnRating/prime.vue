<template >
    <div class="primeBox" ref="currentPrime" v-if="data.oaat_show" :animation="animation" :layout="$parent.data.setup.itemsLayout" :style="[($parent.data.setup.fontStyle.items != '') && {'--prime-font-size':$parent.data.setup.fontStyle.items}]">
        <!-- <div class="context"></div> -->
        <div class="body"><div class="parent_node"><div class="child_node" ><div class="content" v-html="$parent._pipeText(data.name)"></div></div></div></div>
        <div class="primeArrow" :class="{isLoading:($parent.isLoading)}" :animation="arrow.animation">
            <div class="arrow" v-for="(val) in prime.values" :key="val.value" :color="val.value" :class="{onHover:(val.hover)}" :style="[(val.color != '') && {'--arrowColor':val.color}]"></div>
        </div>
        <loader ref="loader"/>
    </div>   
</template>


<script>
import loader from './loader'
export default{
    data(){
        return {
            data : {},    
            animation : "out",
            arrow : {
                animation : "out"
            }
        }
    },
    props : ['prime'],
    components : {
        loader
    },
    mounted(){
        this.$nextTick(()=>{
            // this._show()
            //console.log(this.prime.values)
            this._preloadImages()
        })
        
    },
    methods:{
        _show(){
            return new Promise((resolve)=>{
                this.data = this.$parent.current.prime
                this.data.values = this.$parent._randomList(this.data.values,this.$parent.data.setup.randomValues)
                
                this._animationIn().then(()=>{

                    this.$nextTick(() => {
                        // Preload images after content is rendered
                        this._preloadImages().then(()=>{
                            this.$parent.$refs['targetElem']._show().then(()=>{
                                resolve()
                            })     
                        })
                    })

                })
            })
        },
         _animationIn(){
            return new Promise((resolve)=>{
                this.data.oaat_show = true
                this.animation = "in"
                // window.addEventListener("resize",()=>{
                //     setTimeout(()=>{
                //         this._fixPrime()
                //     },500)
                   
                // })
                setTimeout(()=>{
                    this._fixPrime()
                },50)
                setTimeout(()=>{
                    this.arrow.animation = "in"
                    resolve()
                },300)               
            })
        },
        _animationOut(){
            return new Promise((resolve)=>{
                this.arrow.animation = "out"
                this.animation = "out"
                setTimeout(()=>{
                    resolve()
                },300)               
            })
        },
        _getArrowColor(val){
            //console.log(val)

            return val.arrowColor
        },
        _fixPrime(){
            const parent_node = this.$refs['currentPrime'].querySelector(".parent_node")
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
        _preloadImages(){
            return new Promise((resolve)=>{
            const contentElement = this.$refs['currentPrime']?.querySelector('.content')
            if (!contentElement) {
                this.$parent.isLoading = false
                this.$refs.loader?._hide()
                resolve()
                return
            }

            const images = contentElement.querySelectorAll('img')
            if (images.length === 0) {
                // No images found, hide loader immediately
                this.$parent.isLoading = false
                this.$refs.loader?._hide()
                resolve()
                return
            }
            this.$parent.isLoading = true
            this.$refs.loader?._show()

            let loadedCount = 0
            const totalImages = images.length

            const onImageLoad = () => {
                loadedCount++
                if (loadedCount === totalImages) {
                    // All images loaded, hide loader
                    this.$parent.isLoading = false
                    this.$refs.loader?._hide()
                    resolve()
                }
            }

            const onImageError = () => {
                loadedCount++
                if (loadedCount === totalImages) {
                    // All images processed (even if some failed), hide loader
                    this.$parent.isLoading = false
                    this.$refs.loader?._hide()
                    resolve()
                }
            }

            // Preload each image
            images.forEach(img => {
                if (img.complete && img.naturalHeight !== 0) {
                    // Image already loaded
                    onImageLoad()
                } else {
                    // Image needs to be loaded
                    img.addEventListener('load', onImageLoad)
                    img.addEventListener('error', onImageError)
                }
            })
        })
    },


    }
}
</script>


<style scoped>
.dQuestion[qtype=btn-rating] .primeBox{
    font-size: var(--fs3);
}

.dQuestion[qtype=btn-rating] .primeBox > .primeArrow.isLoading{
    transform: translate(-50%, -50%) scale(0);
}


</style>



