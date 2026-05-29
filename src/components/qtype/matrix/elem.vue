<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="matrix" :class="{required:(data?.setup.validate.required == 1),noAsterisk:($parent.project.setup?.display_asterisk == 0)}">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':_checkShowColumnLength()}">
                        <table class="dMatrix">
                            <tr class="header">
                                <th :style="mainHeaderStyle"></th>
                                <template v-for="(col,index) in data.columns">
                                    <th :key="index" v-html="_pipeText(col.name)" v-if="col.show" :style="col?.style"></th>
                                </template>
                            </tr>
                        
                        <template v-for="(row,index) in data.rows" >
                            <tr v-if="row.show" v-show="row.oaat_show" :key="index" :tag="row.TAG">
                                <td >
                                    <div v-html="row.name"></div>
                                    <div class="wc" v-if="row.wc">
                                            <formTextbox 
                                            :ref="row.wc.TAG"
                                            :name="row.wc.TAG" 
                                            :placeholder="row.wc.placeholder" 
                                            :value="row.wc.input" 
                                            :validate="row.wc.validate"
                                            :disabled="data.setup.selectMultiple == 0 ? row.form.selected == '' : _checkCheckboxWC(row)"
                                            :domStyle="{'max-width':'400px'}"
                                            v-model:value="row.wc.input"></formTextbox>            
                                    </div>           
                                </td>
                                <template v-for="(item,index2) in row.list">
                                        <td :key="index2" v-if="_checkShowColumn(item)">
                                            <template v-if="data.setup.selectMultiple == 0">
                                                <formRadio                             
                                                    :label="_pipeText(item.name)" 
                                                    :value="item.value" 
                                                    :name="row.TAG" 
                                                    :selected="row.form.selected"
                                                    v-model:checked="row.form.selected" 
                                                    v-show="row.show"
                                                    >
                                                </formRadio>

                                            </template>

                                            <template v-else>
                                                <formCheckbox 
                                                    :label="_pipeText(item.name)" 
                                                    :name="item.TAG" 
                                                    :checked="item.checked"
                                                    @change="_onSelect({column:item,row:row})"
                                                    v-model:checked="item.checked" 
                                                    v-show="item.show">                                 
                                                </formCheckbox>
                                            </template>

                                        </td>
                                </template>
                            </tr>
                            <tr v-if="row.show" v-show="row.oaat_show" class="singleWarn" :key="index">
                                <validateMsg :ref="'vm_'+row.TAG"></validateMsg>
                            </tr>
                        </template>
                        </table>
                    </div>
                </div>
                <div class="combWarn">
                    <validateMsg ref="validateMsg"></validateMsg>
                </div>

                <qfooter ref="footer" v-show="!option.one_at_a_time.enable"></qfooter>
                <qfooter2 ref="footer2" v-show="option.one_at_a_time.enable" :option="option.one_at_a_time"></qfooter2>

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
import qfooter2 from './footer'

import validateMsg from '@/components/validateMsg'
import formRadio from '@/components/forms/radio'
import formCheckbox from '@/components/forms/checkbox'
import formTextbox from '@/components/forms/textbox'


export default {
    components: { qfooter, qfooter2, validateMsg, formRadio, formCheckbox, formTextbox},
    data(){
        return {
            data : null,
            option : {
                one_at_a_time : {
                    enable : 0,
                    currentIndex : null,
                },
            },
            errors : [],
            mainHeaderStyle:{}
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    async mounted(){
        await this._initQuestion()
        this._genDomStyle()
        this._checkGibberish()
        if(this.data.setup.displayByRow == 1){
            this.option.one_at_a_time.enable = 1
        }
    },
    methods:{
        _initQuestion(){
            return new Promise((resolve)=>{
            this.data = this.item
            let q = this.data
           
            q.columns.map((c,k)=>{
                let order = k + 1
                c['show'] = true
                c['order'] = order
                c['value'] = order
            })
            
            q.rows.map((v,k)=>{
                let val = k + 1
                v['TAG'] = q.TAG+"_"+val
                v['VAR'] = q.VAR+"_"+val
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['oaat_show'] = (!this.option.one_at_a_time.enable) ? true : false
                v['list'] = []
                v['form'] = {
                    selected : ""
                }
          

                q.columns.map((c)=>{
                    let col = JSON.parse(JSON.stringify(c))
                    col['TAG'] = v.TAG+"_"+col['order']
                    col['VAR'] = v.VAR+"_"+col['order']
                    col['checked'] = false
                    col['checkedVal'] = 0
                    v.list.push(col)
                })

                //WRITE IN CHOICE
                    if(q.setup.selectMultiple == 1){
                        v.list.map((v2,k2)=>{
                            let val2 = k2 + 1
                            if(typeof(v.wc) == "object"){
                                v2['wc'] = {}
                                v2.wc['TAG'] = q.TAG+"_"+val+"_"+val2+"_wc"
                                v2.wc['VAR'] = q.VAR+"_"+val+"_"+val2+"_wc"
                                v2.wc['input'] = ""
                            }        
                        })
                    }
                    if(typeof(v.wc) == "object"){
                        v.wc['TAG'] = q.TAG+"_"+val+"_wc"
                        v.wc['VAR'] = q.VAR+"_"+val+"_wc"
                        v.wc['input'] = ""
                    }
               
                
                
            })
            //this._oaat_process(0)
            q.rows = this._randomList(q.rows,q.setup.randomRows)
            //console.log(this._initData())
            this.data['response'] = this._initData()
            resolve()
            })
        },
        _initData(){
               try {
                    let data = {}
                    //CHECKBOX
                    if(this.data.setup.selectMultiple == 1){
                        this.data.rows.map((row)=>{
                            row.list.map((item)=>{
                                let obj = {
                                    TAG : item.TAG,
                                    VAR : item.VAR,
                                    desc : "",
                                    text : "",
                                    value : "",
                                    ref : null
                                }
                                data[item.TAG] = obj                         
                            })
                        })
                    }
                    else{
                        
                        //RADIO
                        this.data.rows.map((row)=>{
                            let obj = {
                                TAG : row.TAG,
                                VAR : row.VAR,
                                desc : "",
                                text : "",
                                value : "",
                                ref : null
                                }
                                data[row.TAG] = obj         
                        })
                        
                    }
                    return data
               } catch (error) {
                    console.log(error)
               }
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    //CHECKBOX
                    if(this.data.setup.selectMultiple == 1){
                        
                        this.data.rows.map((row)=>{
                            row.list.map((choice)=>{
                                    choice.checkedValue = (choice.checked) ? 1 : 0
                                    this.data.response[choice.TAG]["desc"] = choice.name
                                    this.data.response[choice.TAG]["text"] = choice.checked
                                    this.data.response[choice.TAG]["value"] = choice.checkedValue
                                    this.data.response[choice.TAG]["ref"] = choice
                                    if(typeof(choice.wc) == "object"){
                                        this.data.response[choice.TAG]["wc"] = row.wc.input
                                        // add write in value to checked boxes
                                    }
                            })
                        })                        
                        
                    }else{//RADIO
                        
                        this.data.rows.map((row)=>{
                            if(row.form.selected){
                                let choice = _.find(this.data.columns, { 'value': row.form.selected})
                                this.data.response[row.TAG]["desc"] = choice.name
                                this.data.response[row.TAG]["text"] = choice.name
                                this.data.response[row.TAG]["value"] = choice.value
                                this.data.response[row.TAG]["ref"] = choice
                                // if(typeof(choice.wc) == "object"){
                                //  this.data.response[row.TAG]["wc"] = choice.wc.input
                                // }
                                if(typeof(row.wc) == "object"){
                                   this.data.response[row.TAG]["wc"] = row.wc.input
                                }

                            }
                        })
                    }
                    
                    resolve()
                }catch(e){
                    console.log(e)
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                (async ()=>{
                    this.$refs.validateMsg._hide()
                    let errors = []
                     if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }  
                       

                    this.data.rows.map((row)=>{
                        if(row.show){
                            this.$refs['vm_'+row.TAG]._hide()
                            //CHECKBOX
                            if(this.data.setup.selectMultiple == 1){
                                let checked = _.filter(row.list,{'checked':true})

                                if(checked.length <= 0 && row.optional == false){
                                    if(!(_.find(errors,{target:row.TAG}))){
                                        errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg})
                                        this.$refs['vm_'+row.TAG]._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
                                    }
                                    
                                } 

                                // if(this.data.validate){
                                //     if((parseFloat(this.data.validate.min) != 0) && (!(checked.length >= parseFloat(this.data.validate.min)))){                             
                                //         if(!(_.find(errors,{target:row.TAG}))){
                                //             errors.push({target:row.TAG,msg:this.data.setup.validate.errorMsg})
                                //             this.$refs['vm_'+row.TAG]._show(this.data.setup.validate.errorMsg)
                                //         } 
                                                                     
                                //     }
                                //     if((parseFloat(this.data.validate.max) != 0) && (!(checked.length <= parseFloat(this.data.validate.max)))){
                                //         if(!(_.find(errors,{target:row.TAG}))){
                                //             errors.push({target:row.TAG,msg:this.data.setup.validate.errorMsg})
                                //             this.$refs['vm_'+row.TAG]._show(this.data.setup.validate.errorMsg)
                                //         } 
                                        
                                //     }
                                // }
                                
                                if(checked.length > 0  &&  row.wc){
                                    if(typeof(row.wc.input) == "string" || typeof(row.wc.input) == "number"){
                                        let valid = this.$refs[row.wc.TAG]._validate()
                                        if(!valid.status){
                                            errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || valid.message})
                                            this.$refs['vm_'+row.TAG]._show(this.$parent.project.setup.messages.required_warning || valid.message)
                                        }
                                    }
                               }else if(checked.length <= 0  &&  row.wc){
                                    this.$refs[row.wc.TAG].hasError = false
                               }
                            }
                            else{//RADIO
                                if(!row.form.selected && row.optional == false){
                                    errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg})
                                    this.$refs['vm_'+row.TAG]._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
                                    
                                }
                               
                               if(row.form.selected  &&  row.wc ){
                                   if(typeof(row.wc.input) == "string" || typeof(row.wc.input) == "number"){
                                   
                                        let valid = this.$refs[row.wc.TAG]._validate()
                                        //console.log(this.$refs[row.wc.TAG])
                                        if(!valid.status){
                                        //if(!valid.status && row.wc.input.length == 0){
                                            errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || valid.message})
                                            this.$refs['vm_'+row.TAG]._show(this.$parent.project.setup.messages.required_warning || valid.message)
                                        }else
                                            this.$refs[row.wc.TAG].hasError = false
                                    }
                               }
                               
                                
                                
                            }
                        }

                    })
                      
                    if(errors.length > 0){
                        // console.log(errors)
                        document.querySelector("tr[tag='"+errors[0].target+"']").scrollIntoView({behavior: 'smooth'})
                        this.$refs.validateMsg._show(errors[0].msg)
                        throw errors[0].msg
                    }

                    resolve()
                 })();
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    let skiplogics = this.data.setup.skiplogic
                    let responses = this.$parent.responses

                    skiplogics.map((skiplogic)=>{
                        let response = {} 
                        let target = {}
                        if(this.data.setup.selectMultiple == 1){
                            //response = responses[this.data.TAG + "_" + skiplogic.row + "_" + skiplogic.column]
                            target =  _.find(this.data.rows,{ order : skiplogic.row } )
                            target = _.find(target.list, { order : skiplogic.column })
                            response = responses[target.TAG]
                        }else{
                            // response = responses[this.data.TAG + "_" + skiplogic.choice ]
                            target =  _.find(this.data.rows,{ order : skiplogic.row } )
                            response = responses[target.TAG]
                        }
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

<style scoped>
.perRow{
    font-size: 2vmin;
    padding: 1vmin 3vmin;    
    min-width: 7vmin;
}

</style>