<template>
    <div class="dSliderbox">
        <!-- <input type="range" min="0" max="100" v-model="value"/> -->
        <div class="body">
            <div class="connect">
                <div class="origin" :style="{'width':value+'%'}"></div>
            </div>
            <div class="handle" :style="{'left':value+'%'}"></div>
        </div>
    </div>
</template>
<script>

export default{
    created(){
        window.addEventListener("mousedown",this._dragStart)  
    },
    unmounted(){
        window.removeEventListener("mousedown",this._dragStart)  
        window.removeEventListener("mousemove",this._dragMove)  
        window.removeEventListener("mouseup",this._dragEnd) 
    },
    data(){
        return {
            drag : false,
            steps : 1,
            value : 0,
            max : 100,
            min : 0,
            pos : {
                start : 0,
                curr : 0,
                prev : 0,
            },

        }
    },
    methods : {
        _dragStart(e){
            if(e.target.className == "connect"){
                this.drag = true
                window.addEventListener("mousemove",this._dragMove)  
                window.addEventListener("mouseup",this._dragEnd)  
                this.pos.start = e.clientX

            }
            //console.log("hi")
        },
        _dragMove(e){
            if(this.drag){
                this.pos.cur = e.clientX
                // let ds = this.pos.cur - this.pos.start
                // if(ds > 0){
                //        this.value += this.steps
                // }else{
                //     this.value -= this.steps
                // }
                // console.log(ds)
                // if(ds){

                // }
                
                if(this.pos.prev < this.pos.cur){
                    this.value += this.steps
                }else{
                    this.value -= this.steps
                }


                
                if(this.value > this.max){
                    this.value = this.max
                }
                if(this.value < this.min){
                    this.value = this.min
                }
                this.pos.prev = this.pos.cur

            }
        },
        _dragEnd(){
            this.drag = false
                            window.removeEventListener("mousemove",this._dragMove)  
                window.removeEventListener("mouseup",this._dragEnd) 
        }
    }
}
</script>

<style lang="scss" scoped>
.dSliderbox{
    input[type='range']{
        display:block;
    }

    .body{
        position:relative;
        width:100%;
        height:1vmin;
        margin:.5vmin;

        
        .connect{
            position:relative;
            height:100%;
            width:100%;
            background: #d1d5db;
            border-radius:.5vmin;
            overflow:hidden;
            .origin{
                position:absolute;
                height:100%;
                width:1%;
                background: #1276be;
                pointer-events:none;
            }
        }
        .handle{
            background:white;
            width:1.5vmin;
            height:1.5vmin;
            cursor: grab;
            box-shadow: .5px .5px 2px 1px rgba(0,0,0,.32);
            border-radius:50%;
            top:50%;
            left:50%;
            transform:translateX(-50%) translateY(-50%);
            position:absolute;
            cursor:grab;
            z-index:1;
            pointer-events:none;
        }
    }

}
</style>