<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="memoryTestComp" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content cont">
                         <div class="cImg" :class="{'selected': isSelected1}" @click="_addSelected(1)">
                            <div class="centerImg">
                                <div v-html="_currentImg1(shuffleIndex[imgInd])"></div>
                            </div>
                        </div> 
                        <div class="cImg" :class="{'selected': isSelected2}" @click="_addSelected(2)">
                            <div class="centerImg">
                                <div v-html="_currentImg2(shuffleIndex[imgInd])"></div>
                            </div>
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
            isSelected1: false,
            isSelected2: false,
            counter: 0,
            elapsedTime: 0,
            reactionTimer: undefined,
            reactionTime: [],
            shuffleIndex: [],
            startTime: null,
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
            let q = this.data

            this.data.item1.map((v,k)=>{
                let val = k + 1
                v['TAG'] = q.TAG+"_"+val
                v['VAR'] = q.VAR+"_"+val  
                v['order'] = val
                v['display'] = null
                v['value'] = val
                v['checked'] = false
                v['checkedValue'] = 0
                v['show'] = true
            })

            this.data.item2.map((v,k)=>{
                let val = k + 1
                v['TAG'] = q.TAG+"_"+val
                v['VAR'] = q.VAR+"_"+val  
                v['order'] = val
                v['display'] = null
                v['value'] = val
                v['checked'] = false
                v['checkedValue'] = 0
                v['show'] = true
                
            })

            this.data['response'] = this._initData()
            
        },
        _initData(){
            // let q = this.data
            let data = {}
            this.data.item1.map((v)=>{
                let obj = {
                    TAG : v.TAG,
                    VAR : v.VAR,
                    desc : "",
                    text : "",
                    value : "",
                    ref : null,
                    meta : 0
                }
                data[v.TAG] = obj               
            })

            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data.item1.map((choice)=>{                        
                        if(choice.checked) {
                            choice.checkedValue = (choice.checked) ? 1 : 0
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = choice.checked
                            this.data.response[choice.TAG]["value"] = choice.value
                            this.data.response[choice.TAG]["meta"] = { item_list : 1 }
                            this.data.response[choice.TAG]["ref"] = choice
                        }                        
                    })
                    this.data.item2.map((choice)=>{                        
                        if(choice.checked) {
                            choice.checkedValue = (choice.checked) ? 1 : 0
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = choice.checked
                            this.data.response[choice.TAG]["value"] = choice.value
                            this.data.response[choice.TAG]["meta"] = { item_list : 2 }
                            this.data.response[choice.TAG]["ref"] = choice

                        }                        
                    })
                    resolve()
                }catch(e){
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
    }
}
</script>


