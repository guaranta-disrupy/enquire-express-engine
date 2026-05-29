<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="memoryTestDesc" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content">
                        <div class="cImg">
                            <div class="centerImg" v-html="_currentImg(shuffleIndex[imgInd])"></div>
                        </div>                       
                    </div>
                </div>
                <validateMsg ref="validateMsg"></validateMsg>
                <qfooter ref="footer" v-if="showFooter"></qfooter>
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
import validateMsg from '@/components/validateMsg'
import qfooter from '@/components/qfooter'

export default {
    components: { validateMsg, qfooter},
    data(){
        return {
            data : null,
            imgInd : 0,
            showFooter : false,
            timer : null,
            shuffleIndex: [],
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
            //let q = this.data
            //set qustions

            this.data['response'] = this._initData()           
            
        },
        _initData(){
            let q = this.data
            let data = {}
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
                    console.log(e)
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    //console.log("validations")
                    //validate answer
                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    //skiplogic
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
    },
}
</script>

