<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" >
         <template v-if="data">
            <div class="dQuestion" qtype="fast" :class="{
              required:true,
              noAsterisk:($parent.project.setup?.display_asterisk == 0)
            }"
            >
                <div class="body">
                    <!-- <div class="question" v-html="_pipeText(data.question)"></div> -->
                        <div class="fastBox" :style="{transform:'scale('+zoomScale+')'}" :targets="data?.targets.length">
                            <div class="header">HEADER HERE...</div>
                            <div class="targets">
                                <div class="target" draggable="true" :style="{'--posX':'-32vmin','--posY':'0vmin'}">
                                    <div class="body">
                                        <div class="content">Item1</div>
                                    </div>
                                </div>
                                <div class="target" draggable="true" :style="{'--posX':'32vmin','--posY':'0vmin'}">
                                    <div class="body">
                                        <div class="content">Item2</div>
                                    </div>
                                </div>
                                <div class="target" draggable="true" :style="{'--posX':'0vmin','--posY':'-32vmin'}">
                                    <div class="body">
                                        <div class="content">Item3</div>
                                    </div>
                                </div>


                            </div>
                            <div class="prime" droppable="true">
                                <div class="body">
                                    <div class="content">PRIME</div>
                                </div>
                                <div class="hint">HINT HERE...</div>
                            </div>
                        </div>
                    <qfooter ref="footer" v-show="false"></qfooter>
                </div>
            </div>
         </template>
    </div>
    </transition>
</template>
<script>
// let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import qfooter from '@/components/qfooter'

export default {
    components: {qfooter},
    data(){
        return {
            data : null,
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    mounted(){
        this._initQuestion()
    },
    methods:{
        _initQuestion(){
            this.data = this.item
            this.data['form'] = {
                input : ""
            }
            this.data['response'] = this._initData()
        },
        _initData(){
            let q = this.data
                this.data['primes'] = [
                    {
                        name : "Prime 1",
                        value : 1
                    },
                    {
                        name : "Prime 2",
                        value : 2
                    },
                    {
                        name : "Prime 3",
                        value : 3
                    },                    

                ]
                this.data['targets'] = [
                    {
                        name : "Yes",
                        value : 1
                    },
                    {
                        name : "No",
                        value : 2
                    }
                ]
            let data = []
            let obj = {
                TAG : q.TAG,
                VAR : q.VAR,
                desc : "",
                text : "",
                value : "",
                ref : null
            }
            data[q.TAG] = obj
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    this.data.response[this.data.TAG]["text"] = "descriptive"
                    this.data.response[this.data.TAG]["value"] = "descriptive"              
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },    
    }
}
</script>
