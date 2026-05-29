<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
    <template v-if="data">
        <div class="dQuestion" qtype="multipleTextbox" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body"
                :set='_initObjProperty(data.setup,"multipleTextSelection",{
                    "grid" : 1,
                    "grid_tab" : 1,
                    "grid_mobile" : 1, 
                })'
            >
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{
                        '--grid':data.setup.multipleTextSelection.grid,
                        '--grid_tab':data.setup.multipleTextSelection.grid_tab,
                        '--grid_mobile':data.setup.multipleTextSelection.grid_mobile
                        }">
                        <div class="multipleTextboxCont">
                         <template v-for="item in data.items" :key="item.order">
                            <div class="mtRow" v-show="item.show">
                                <div class="dFormGroup">
                                    <div class="title" v-html="_pipeText(item.name)"></div>
                                    <div class="body">
                                        <formTextbox 
                                        :ref="item.TAG"
                                        :name="item.TAG" 
                                        :value="item.form.input" 
                                        :validate="item.validate"
                                        :appendText="data.setup?.appendString"
                                        :prependText="data.setup?.prependString"
                                        :minorUnitSymbol="data.setup?.minorUnitSymbol"
                                        v-model:value="item.form.input"></formTextbox> 
                                        <validateMsg :ref="'vm_'+item.TAG"></validateMsg>
                                    </div>
                                </div>
                            </div>
                         </template>
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
let _ = require('lodash')
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
            let q = this.data
             this.data.items.map((v,k)=>{
                let key = k + 1

                v['index'] = this._setVariableValue(v['index'],key)
                v['order'] = v['index']


                v['TAG'] = q.TAG+"_"+v['index']
                v['VAR'] = q.VAR+"_"+v['index'] 
                //v['order'] = val
                v['display'] = null
                v['show'] = true
                v['form'] = {input : ""}
            })

            this.data.items = this._randomList(this.data.items,this.data.setup.randomChoices)
            this.data['response'] = this._initData()
            
        },
        _initData(){
            //let q = this.data
            let data = {}
            this.data.items.map((v)=>{
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
                    this.data['response'] = this._initData()
                    this.data.items.map((item)=>{
                        this.data.response[item.TAG]["desc"] = item.name
                        this.data.response[item.TAG]["text"] =  this._convertStrToFloat(item.form.input)
                        this.data.response[item.TAG]["value"] =  this._convertStrToFloat(item.form.input)
                        this.data.response[item.TAG]["ref"] = item
                       
                    })
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    this.$refs.validateMsg._hide()
                    let errors = []
                        let items = _.filter(this.data.items,{"show":true})
                        items.map((item)=>{
                            this.$refs['vm_'+item.TAG]._hide()
                            let valid = this.$refs[item.TAG]._validate(this.data.setup.validate.required)
                            if(!valid.status){
                                errors.push({target:item.TAG,message:valid.message})
                                this.$refs['vm_'+item.TAG]._show(valid.message)
                            }
                        })
                        if(errors.length > 0){
                            throw errors
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
                        let target = _.find(this.data.items,{order:skiplogic.choice})
                        let response = responses[target.TAG]
                        if(response){
                            if(skiplogic.condition == 1){//CHOICE IS
                                if(response.value == skiplogic.value){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                }
                            }else if(skiplogic.condition == 2){//CHOICE IS NOT
                                if(response.value != skiplogic.value){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                }
                            }else if(skiplogic.condition == 3){//LESS THAN
                                if(response.value < skiplogic.value){
                                    this._skiplogicProcess(skiplogic)
                                    this.$parent()._abort()
                                 
                                }
                                
                            }else if(skiplogic.condition == 4){//GREATER THAN
                                if(response.value > skiplogic.value){
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
<style lang="css" scoped>
.multipleTextboxCont{
    display:grid;
    grid-template-columns: repeat(var(--grid),1fr);
    gap:2vmin;
    padding-top:2vmin;
}

/* Tablet */
@media screen and (max-width: 1366px) {
  .multipleTextboxCont{
    grid-template-columns: repeat(var(--grid_tab),1fr);
  }
}

/* Mobile */
@media screen and (max-width: 480px) {
  .multipleTextboxCont{
    grid-template-columns: repeat(var(--grid_mobile),1fr);
  }
}

</style>