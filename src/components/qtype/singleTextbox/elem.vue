<template>
    <transition :name="transition">
   <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="singleTextbox" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body"
                    :set='_initObjProperty(data.setup,"textBox",{
                        "textbox_dimension" : "50vmin",
                        "textbox_dimension_tab" : "50vmin",
                        "textbox_dimension_mobile" : "50vmin",
                    })'
            >
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content">
                        <div class="singleTextboxCont"
                        >
                            <formTextbox 
                            :ref="data.TAG"
                            :name="data.TAG" 
                            :value="data.form.input" 
                            :validate="data.setup.validate"
                            :domStyle="{
                                'max-width': data.setup.textBox.textbox_dimension,
                                '--max-width-tab': data.setup.textBox.textbox_dimension_tab,
                                '--max-width-mobile': data.setup.textBox.textbox_dimension_mobile
                            }"
                            :appendText="data.setup?.appendString"
                            :prependText="data.setup?.prependString"
                            :minorUnitSymbol="data.setup?.minorUnitSymbol"
                            v-model:value="data.form.input"
                            ></formTextbox>
                        </div>
                    </div>
                </div>
                <validateMsg ref="validateMsg"></validateMsg>
                <qfooter ref="footer"></qfooter>

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

import validateMsg from '@/components/validateMsg'
import formTextbox from '@/components/forms/textbox'
import helper from '@/js/helper'

export default {
    components: { qfooter, validateMsg, formTextbox},
    data(){
        return {
            data : null,
        }
    },
    mixins : [qtypeFunctions,comp,helper],
    props : ["item"],

    mounted(){
        this._initQuestion()
        this._checkGibberish()
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
                    this.data.response[this.data.TAG]["text"] =  this._convertStrToFloat(this.data.form.input)
                    this.data.response[this.data.TAG]["value"] =  this._convertStrToFloat(this.data.form.input)                
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    this.$refs.validateMsg._hide()
                    let valid = this.$refs[this.data.TAG]._validate(this.data.setup.validate.required)
                    console.log("validate",valid)
                    if(!valid.status){
                        
                        this.$refs.validateMsg._show(valid.message)
                        throw valid.message
                    }
                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    let skiplogics = this.data.setup.skiplogic
                    let responses = this.$parent.responses

                    skiplogics.map((skiplogic)=>{
                        let response = responses[this.data.TAG]
                         if(response){
                            if(skiplogic.condition == 1){//CHOICE IS
                                if(response.value == skiplogic.choice){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                }
                            }else if(skiplogic.condition == 2){//CHOICE IS NOT
                                if(response.value != skiplogic.choice){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                }
                            }else if(skiplogic.condition == 3){//LESS THAN
                                if(response.value < skiplogic.choice){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                 
                                }
                                
                            }else if(skiplogic.condition == 4){//GREATER THAN
                                if(response.value > skiplogic.choice){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                }
                            }
                         }
                        
                        
                    })

                    resolve()
                }catch(e){
                    reject()
                }
            })
        }
    }
}
</script>


