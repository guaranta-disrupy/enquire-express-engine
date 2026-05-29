<template>
    <transition :name="transition">
    <div class="dBox-full" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
         <template v-if="data">
            <div class="dQuestion" qtype="hotspot" :class="{
              required:true,
              noAsterisk:true
            }">
                <div class="body">
                    <div class="question"  v-html="_pipeText(data.question)"></div>
                    <div class="choices">
                        <div class="hotspotContainer">
                            <div class="content">
                                <img class="hotspotTarget" :src="data.setup.target_image"/>
                                <div class="hotspotMap">
                                    <template v-for="choice in data.choices" :key="choice.order">
                                        <div class="map" :class="{active:(choice.checked)}" :style="{'--hotspotX':(choice.setup.x), '--hotspotY':(choice.setup.y), '--hotspotW':(choice.setup.width), '--hotspotH':(choice.setup.height)}" @click="_selectItem(choice)"></div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <validateMsg ref="validateMsg"></validateMsg>
                    <!-- <qfooter ref="footer"></qfooter> -->
                </div>
            </div>
         </template>
    </div>
    </transition>
</template>
<script>
let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import validateMsg from '@/components/validateMsg'
// import qfooter from '@/components/qfooter'

export default {
    components: {validateMsg},
    data(){
        return {
            data : null,
            errors : [],
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
            this.data.choices.map((v,k)=>{
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
            this.data.choices = this._randomList(this.data.choices,this.data.setup.randomChoices)
            this.data['response'] = this._initData()
        },
        _initData(){
            let data = {}
            this.data.choices.map((v)=>{
                    let obj = {
                        TAG : v.TAG,
                        VAR : v.VAR,
                        desc : "",
                        text : "",
                        value : "",
                        ref : null
                    }
                    data[v.TAG] = obj                   
            })
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                     
                    this.data.choices.map((choice)=>{
                            choice.checkedValue = (choice.checked) ? 1 : 0
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = choice.checked
                            this.data.response[choice.TAG]["value"] = choice.checkedValue
                            this.data.response[choice.TAG]["ref"] = choice
                    })                   
                    
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve,reject)=>{
                console.log(this.data.setup)
                try{
                    this.$refs.validateMsg._hide()
                    this.errors = []

                    if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }

                    let checked = _.filter(this.data.choices, {checkedValue:1,show:true})
                    if(checked.length <= 0){
                        this.errors.push({
                            "elem":`.dBox[tag='`+this.data.TAG+`']`,
                            "msg":this.data.setup.validate.errorMsg
                        })
                        this._showError()
                    }

                    if(this.data.setup.validate){
                            if((parseFloat(this.data.setup.validate.min) != 0) && (!(checked.length >= parseFloat(this.data.setup.validate.min)))){
                                this.errors.push({
                                    "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                    "msg":this.data.setup.validate.errorMsg
                                })
                                this._showError() 
                            }
                            if((parseFloat(this.data.setup.validate.max) != 0) && (!(checked.length <= parseFloat(this.data.setup.validate.max)))){
                                this.errors.push({
                                    "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                    "msg":this.data.setup.validate.errorMsg
                                })
                                this._showError() 
                            }
                     }    

                    resolve()
                }catch(e){
                    console.log(e)
                    reject()
                }                   
            })
        },
        _showError(){
            if(this.errors.length > 0){
                let error = this.errors[0]
                this.$refs.validateMsg._show(error.msg)
                //document.querySelector(error.elem).scrollIntoView({behavior: 'smooth'})
                throw error.msg
            }
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
