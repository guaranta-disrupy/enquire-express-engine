<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
            <div class="dQuestion" qtype="imageSelection" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
            }">
                <div class="body"
                    :set='_initObjProperty(data.setup,"imageSelection",{
                                    "layout_switch" : 0,
                                    "layout_desktop" : 1,
                                    "layout_mobile" : 1,
                                    "layout_tab" : 1,
                                    "grid" : data.setup.grid,
                                    "grid_tab" : 3,
                                    "grid_mobile" : 2,      
                                    "image_dimension" : "20vmin",
                                    "image_dimension_tab" : "20vmin",
                                    "image_dimension_mobile" : "20vmin",
                                    "multiSelect_type" : 1,
                                    "multiSelect_max" : data.setup.validate.max,
                                    "multiSelect_min" : data.setup.validate.min,
                                    "multiSelect_errorMsg_type2" : "Please select at least @min_select to @max_select item(s)",
                                    "multiSelect_errorMsg_type3" : "You have to select @max_select items",
                    })'             
                >
                    <div class="question" v-html="_textReplacer(_pipeText(data.question),{
                        '@min_select':data.setup.imageSelection.multiSelect_min,
                        '@max_select':data.setup.imageSelection.multiSelect_max            
                    })"></div>
                    <div class="choices">
                        <div class="content">
                            <div class="imageSelectionItems" 

                            :class="{
                                'list-view':(option.listView == true)}" 
                            :style="{
                                '--grid':(!parseInt(data.setup.imageSelection.grid)) ? 5 : data.setup.imageSelection.grid,
                                '--grid_tab':(!parseInt(data.setup.imageSelection.grid_tab)) ? 3 : data.setup.imageSelection.grid_tab,
                                '--grid_mobile':(!parseInt(data.setup.imageSelection.grid_mobile)) ? 2 : data.setup.imageSelection.grid_mobile,
                                '--grid_dimension':data?.setup.imageSelection.image_dimension ?? '20vmin',
                                '--grid_dimension_tab':data?.setup.imageSelection.image_dimension ?? '20vmin',
                                '--grid_dimension_mobile':data?.setup.imageSelection.image_dimension ?? '20vmin'}"
                                >
                                <div class="body">
                                        <template v-if="data?.setup.selectMultiple == 0">
                                            <template v-for="choice in data.choices" :key="choice.order">
                                                <div class="imageBox" v-show="choice.show" :ref="choice.TAG" :class="{checked:(data.form.selected == choice.value),'noImage':(!choice?.src)}">
                                                    <label class="body">
                                                        <input type="radio" :name="choice.TAG" :value="choice.value" :selected="data.form.selected" v-model="data.form.selected" v-show="choice.show"/>
                                                        <div class="bg"></div>
                                                        <div class="image" v-if="choice.src"><img :src="choice.src"/></div>
                                                        <div class="name">
                                                               <div class="content" v-html="_pipeText(choice.name)" v-if="(choice.hide_name != 1)"></div>
                                                               <div class="wc" v-if="choice.wc">
                                                                    <formTextbox 
                                                                    :ref="choice.wc.TAG"
                                                                    :name="choice.wc.TAG" 
                                                                    :placeholder="choice.wc.setup.placeholder" 
                                                                    :value="choice.wc.input" 
                                                                    :validate="choice.wc.setup.validate"
                                                                    :disabled="!(data.form.selected == choice.value)"
                                                                    :domStyle="{'max-width':choice.wc.setup['max-width']}"
                                                                    v-model:RTs="choice.wc.RTs"
                                                                    v-model:value="choice.wc.input"></formTextbox>
                                                               </div>
                                                        
                                                        
                                                        </div>
                                                    </label>
                                                </div>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-for="choice in data.choices" :key="choice.order">
                                                <div class="imageBox multiple" v-show="choice.show" :ref="choice.TAG" :class="{checked:choice.checked,'noImage':(!choice?.src)}">
                                                    <label class="body">
                                                        <input type="checkbox" :name="choice.TAG"  :checked="choice.checked" v-model="choice.checked" @change="_onSelect(choice)"/>
                                                        <div class="bg"></div>
                                                        <div class="image" v-if="choice.src"><img :src="choice.src"/></div>
                                                        <div class="name">
                                                            <div class="content" v-html="_pipeText(choice.name)" v-if="(!choice.hide_name)"></div>
                                                                <div class="wc" v-if="choice.wc">
                                                                    <formTextbox 
                                                                    :ref="choice.wc.TAG"
                                                                    :name="choice.wc.TAG" 
                                                                    :placeholder="choice.wc.setup.placeholder" 
                                                                    :value="choice.wc.input" 
                                                                    :validate="choice.wc.setup.validate"
                                                                    :disabled="!choice.checked"
                                                                    :domStyle="{'max-width':choice.wc.setup['max-width']}"
                                                                    v-model:RTs="choice.wc.RTs"
                                                                    v-model:value="choice.wc.input"></formTextbox>
                                                                </div>     
                                                        </div>
                                                        <div class="checked"></div>
                                                    </label>
                                                </div>
                                            </template>                                       
                                        </template>

                                </div>
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
            option : {
                listView : false,
                layout :{
                    size_tab : 1366,
                    size_mobile : 480
                }
            },
            errors : [],
        }
    },
    mixins : [qtypeFunctions,comp,helper],
    props : ["item"],

    mounted(){
        this._initQuestion()
    },
    watch:{
        'item.show'(s){
            let responsive = ()=>{this._responsive()}
            if(s){
                this.$nextTick(()=> {
                     window.addEventListener('resize', responsive)
                     this._responsive()
                })
            }
            else{
                 this.$nextTick(()=> {
                     window.removeEventListener('resize', responsive)
                })               
            }
        }
    },
    methods:{
        _initQuestion(){
            this.data = this.item
            let q = this.data

            this.data.setup['layout'] = (this.data.setup['layout']) ? this.data.setup['layout'] : 1
            this.data.setup['mobile_layout'] = (this.data.setup['mobile_layout']) ? this.data.setup['mobile_layout'] : 2

            this.data.choices.map((v,k)=>{
                let key = k + 1

                v['index'] = this._setVariableValue(v['index'],key)
                v['order'] = v['index']
                
                //RADIO AND DROPDOWN
                if(this.data.setup.selectMultiple == 0){
                    v['TAG'] = q.TAG
                    v['VAR'] = q.VAR
                }else{//CHECKBOX
                    v['TAG'] = q.TAG+"_"+v['index']
                    v['VAR'] = q.VAR+"_"+v['index']                   
                }
                //v['order'] = key
                v['display'] = null
                v['value'] = this._setVariableValue(v.score,v['index'])
                v['checked'] = false
                v['checkedValue'] = 0
                v['show'] = true

                //WRITE IN CHOICE
                if(typeof(v.wc) == "object"){
                    v.wc['TAG'] = q.TAG+"_"+v['index']+"_wc"
                    v.wc['VAR'] = q.VAR+"_"+v['index']+"_wc"
                    v.wc['input'] = ""
                    v.wc['RTs'] = []
                }

                if(typeof(v['hide_name']) == "undefined"){
                    v['hide_name'] = 0
                }




            })
            this.data.choices = this._randomList(this.data.choices,this.data.setup.randomChoices)
            //console.log(this.data.choices)
            this.data['form'] = {
                selected : null
            }
            this.data['response'] = this._initData()
            
        },
        _initData(){
            let q = this.data
            let data = {}
             //RADIO AND DROPDOWN
            if(this.data.setup.selectMultiple == 0){
                let obj = {
                    TAG : q.TAG,
                    VAR : q.VAR,
                    desc : "",
                    text : "",
                    value : "",
                    ref : null
                }
                data[q.TAG] = obj
            }else{
            //CHECKBOX
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
            }
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    //RADIO AND DROPDOWN
                    if(this.data.setup.selectMultiple == 0){
                        if(this.data.form.selected){
                            let choice = _.find(this.data.choices, { 'value': this.data.form.selected})
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = this._convertStrToFloat(choice.name)
                            this.data.response[choice.TAG]["value"] = this._convertStrToFloat(choice.value)
                            this.data.response[choice.TAG]["ref"] = choice
                            if(typeof(choice.wc) == "object"){
                                 this.data.response[choice.TAG]["wc"] = this._convertStrToFloat(choice.wc.input)
                                //  if(typeof(choice.wc.RTs) != "undefined"){
                                //     this.data.response[choice.TAG]["wc_RTs"] = choice.wc.RTs
                                //  }
                            }


                            //scoring...
                            if(this.data.setup.enablePoint){
                                //console.log("choicedata",choice)
                                this.data.response[choice.TAG+"s"] = {}
                                this.data.response[choice.TAG+"s"]["TAG"] = choice.TAG+"s"
                                this.data.response[choice.TAG+"s"]["VAR"] = choice.VAR+"s"
                                this.data.response[choice.TAG+"s"]["desc"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["text"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["value"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["type"] = "scoring"
                                this.data.response[choice.TAG+"s"]["ref"] = choice
                                this.$parent.defaultVariables.gscore += parseFloat(choice.points ?? 0)
                            }

                        }
                    }else{// CHECKBOX
                        this.data.choices.map((choice)=>{
                            choice.checkedValue = (choice.checked) ? 1 : 0
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] =  (choice.checked) ? "true" : "false" 
                            this.data.response[choice.TAG]["value"] = choice.checkedValue
                            if(typeof(choice.checkboxScore) != "undefined"){
                                if(choice.checkedValue == 1){
                                    this.data.response[choice.TAG]["value"] = this._setVariableValue(choice.checkboxScore.active,1)
                                }else{
                                    this.data.response[choice.TAG]["value"] = this._setVariableValue(choice.checkboxScore.inactive,0)
                                }
                            }

                            if(!choice.show){
                                this.data.response[choice.TAG]["text"] = "HIDDEN"
                                this.data.response[choice.TAG]["value"] = -1
                            }

                            this.data.response[choice.TAG]["ref"] = choice
                            if(typeof(choice.wc) == "object"){
                                 this.data.response[choice.TAG]["wc"] = this._convertStrToFloat(choice.wc.input)
                                //  if(typeof(choice.wc.RTs) != "undefined"){
                                //     this.data.response[choice.TAG]["wc_RTs"] = choice.wc.RTs
                                //  }
                            }


                        })
                        if(this.data.setup.enablePoint){
                            let allSelected = this.data.choices.filter((obj)=>{
                                return obj.checked
                            })

                            const totalScore = allSelected.reduce((total, item) => total + parseFloat(item.points ?? 0), 0);
                            this.data.response[this.data.TAG+"s"] = {}
                            this.data.response[this.data.TAG+"s"]["TAG"] = this.data.TAG+"s"
                            this.data.response[this.data.TAG+"s"]["VAR"] = this.data.VAR+"s"
                            this.data.response[this.data.TAG+"s"]["desc"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["text"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["value"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["type"] = "scoring"
                            this.data.response[this.data.TAG+"s"]["ref"] = allSelected         
                            this.$parent.defaultVariables.gscore += parseFloat(totalScore ?? 0)
                        }


                    }
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    let $ans = this.data.response
                    this.$refs.validateMsg._hide()
                    this.errors = []
                    if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }
                    //RADIO AND DROPDOWN
                    if(this.data.setup.selectMultiple == 0){
                        if(!this.data.form.selected){
                            this.$refs.validateMsg._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
                            throw this.data.setup.validate.errorMsg
                        }

                        //WRITE IN CHOICE
                        let selected = _.find(this.data.choices, {value:this.data.form.selected})
                        if(typeof($ans[selected.TAG].wc) == "string" || typeof($ans[selected.TAG].wc) == "number"){
                            let valid = this.$refs[selected.wc.TAG]._validate()
                            if(!valid.status){
                                //this.$refs.validateMsg._show(valid.message)
                                // this.errors.push({
                                //     "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                //     "msg":valid.messag
                                // })
                                //throw valid.message
                                this.errors.push({
                                    "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                    "msg":this.$parent.project.setup.messages.required_warning || valid.message
                                })
                                this._showError()
                            }
                        }




                    }else{//CHECKBOX
                        let checked = _.filter(this.data.choices, {checkedValue:1,show:true})
                        if(checked.length <= 0){
                            this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                            //throw this.data.setup.validate.errorMsg
                            this.errors.push({
                                "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                "msg":this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg
                            })
                            this._showError()



                        }
                        if(this.data.setup.validate){
                            // if((parseFloat(this.data.setup.validate.min) != 0) && (!(checked.length >= parseFloat(this.data.setup.validate.min)))){
                            //     this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                            //     this.errors.push({
                            //         "elem":`.dBox[tag='`+this.data.TAG+`']`,
                            //         "msg":this.data.setup.validate.errorMsg
                            //     })
                            //     this._showError() 
                                

                            // }
                            // if((parseFloat(this.data.setup.validate.max) != 0) && (!(checked.length <= parseFloat(this.data.setup.validate.max)))){
                            //     this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                            //     this.errors.push({
                            //         "elem":`.dBox[tag='`+this.data.TAG+`']`,
                            //         "msg":this.data.setup.validate.errorMsg
                            //     })
                            //     this._showError() 
                            // }

                            if(this.data.setup.imageSelection.multiSelect_type == 2){
                                /* IF RANGE */
                                if (checked.length < parseFloat(this.data.setup.imageSelection.multiSelect_min)
                                    || checked.length > parseFloat(this.data.setup.imageSelection.multiSelect_max)
                                ){
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this._textReplacer(this.data.setup.imageSelection.multiSelect_errorMsg_type2,
                                            {
                                                "@min_select":this.data.setup.imageSelection.multiSelect_min,
                                                "@max_select":this.data.setup.imageSelection.multiSelect_max
                                            }
                                        )
                                    })
                                    this._showError() 
                                }
                            }else if(this.data.setup.imageSelection.multiSelect_type == 3){
                                /* IF FIX */
                                if((parseFloat(this.data.setup.imageSelection.multiSelect_max) != 0) 
                                    && (checked.length != parseFloat(this.data.setup.imageSelection.multiSelect_max))){
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this._textReplacer(this.data.setup.imageSelection.multiSelect_errorMsg_type3,
                                            {
                                                "@max_select":this.data.setup.imageSelection.multiSelect_max
                                            }
                                        )
                                    })
                                    this._showError() 
                                }
                            }


                        }              
                        
                         //WRITE IN CHOICE
                        checked.map((selected)=>{  
                            if(typeof($ans[selected.TAG].wc) == "string" || typeof($ans[selected.TAG].wc) == "number"){                           
                                let valid = this.$refs[selected.wc.TAG]._validate()
                                if(!valid.status){
                                    // this.$refs.validateMsg._show(valid.message)
                                    // throw valid.message
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this.$parent.project.setup.messages.required_warning || valid.message
                                    })
                                    this._showError() 
                                }
                            }                   
                        })                       


                                         
                    }
                    resolve()
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
                   let skiplogics = this.data.setup.skiplogic
                    let responses = this.$parent.responses
                    skiplogics.map((skiplogic)=>{
                        //GET ORDER ID
                        let target = _.find(this.data.choices,{order:skiplogic.choice})
                        let response = responses[target.TAG]
                        if(response){
                            //RADIO AND DROPDOWN
                            if(this.data.setup.selectMultiple == 0){
                                    if(skiplogic.condition == 1){//CHOICE IS
                                        if(response.value == skiplogic.choice){
                                            this._skiplogicProcess(skiplogic)
                                            this.$parent()._abort()
                                        }
                                    }else{//CHOICE IS NOT
                                        if(response.value != skiplogic.choice){
                                            this._skiplogicProcess(skiplogic)
                                            this.$parent()._abort()
                                        }
                                    }
                            }else{
                                //CHECKBOX
                                if(skiplogic.condition == 1){//CHOICE IS
                                    if(response.value == 1){
                                        this._skiplogicProcess(skiplogic)
                                        this.$parent()._abort()
                                    }
                                }else{//CHOICE IS NOT
                                    if(response.value != 1){
                                        this._skiplogicProcess(skiplogic)
                                        this.$parent()._abort()
                                    }
                                }

                            }
                            

                        }

                    })
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },    
    }
}
</script>
