<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="segmentation" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:1
        }">
            <div class="body">
                <div class="question txt-center" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':1}" >
                        <br>
                        <template v-for="(target,index) in data.items" :key="index">
                        <transition name="oaat_animation" mode="out-in">
                         <div class="dRow" :tag="target.TAG" v-show="target.show && target.oaat_show">
                             <div class="dSegmentation smallSize" :class="{'notselected':(!target.form.selectedObj)}" :style="{'--labels':data.values.length,'--color':((target.form.selectedObj?.color) ? target.form.selectedObj.color : '#fff')}">
                                <div class="dFormGroup">
                                    <div class="title" >
                                        <div class="content">
                                            <div class="statementA" :style="{'--statementColor':_getStatementColor(target)}">
                                                <div class="title" v-html="data.setup.labels.statementA"></div>
                                                <div class="body" v-html="_pipeText(target.statementA)"></div>
                                            </div>
                                            <div class="statementB" :style="{'--statementColor':_getStatementColor(target,true)}">
                                                <div class="title" v-html="data.setup.labels.statementB"></div>
                                                <div class="body" v-html="_pipeText(target.statementB)"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="body">
                                        <div class="list">
                                            <div class="pointerObjs">
                                                <div v-for="label,lbl_index in target.values" :key="lbl_index" :style="{left:(((lbl_index) / (target.values.length - 1)) *100)+'%'}" @click="_clickLabel(label,target)"></div>
                                            </div>
                                            <Slider v-model="target.form.selected" :step="1" :min="1" :max="data.values.length" :tooltips="false" @update="_update(target)"/>
                                        </div>
                                        <div class="labels">
                                            <div class="label" v-for="label,lbl_index in target.values" :key="lbl_index" :class="{active:label.active}" :style="{'--active':label.color}" @click="_clickLabel(label,target)">
                                                <div class="content" v-html="label.name"></div>
                                            </div>
                                        </div>
                                        <validateMsg :ref="'vm_'+target.TAG"></validateMsg>
                                    
                                    </div>
                                </div>
                             </div>
                         </div>
                        </transition>
                        </template>
                         
                    </div>
                </div>
                <validateMsg ref="validateMsg"></validateMsg>
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
import Slider from '@vueform/slider'

export default {
    components: { qfooter, validateMsg, Slider, qfooter2},
    data(){
        return {
            data : null,
            option : {
                one_at_a_time : {
                    enable : 1,
                    currentIndex : 0,
                },
            },
            errors : [],
            ready : false,
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    watch:{
        // 'option.one_at_a_time.currentIndex'(){
            
        // }
        // 'item.show'(s){

        // }
    },
    mounted(){
        this._initQuestion()
    },
    methods:{
        _getStatementColor(target,last = false){

            if(!last){
                return target.values[0].color;
            }
            return target.values[target.values.length - 1].color;

        },
        _clickLabel(label,target){
            // select by position (1..N), store actual score in 'value'
            target.form.selected = label.pos
            this._update(target)
        },
        _update(target){
            target.values.map((v)=>{
                v.active = false
            })
            let selected = _.find(target.values,{pos:target.form.selected})
            selected.active = true
            target.form.selectedObj = selected
            //console.log(selected)
        },
        _initQuestion(){
            this.data = this.item
            let q = this.data
             this.data.values.map((v,k)=>{
                 const pos = k + 1
                 v['pos'] = pos // position on slider
                 // use score from builder if present; fallback to position
                 let score = (v && (v.score !== undefined && v.score !== null && v.score !== '')) ? parseFloat(v.score) : pos
                 if(Number.isNaN(score)) { score = pos }
                 v['value'] = score
             })
             this.data.items.map((v,k)=>{
                let val = k + 1
                v['TAG'] = q.TAG+"_"+val
                v['VAR'] = q.VAR+"_"+val 
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['oaat_show'] = (!this.option.one_at_a_time.enable) ? true : false
                v['form'] = {
                    selected : this.data.setup.default,
                    selectedObj : null
                }

                let values = JSON.parse(JSON.stringify(this.data.values))
                values.map((item)=>{
                    item['active'] = false
                })
                v['values'] = values


            })
            
            this.ready = true
            this.data.items = this._randomList(this.data.items,this.data.setup.randomItems)
            this._oaat_process(0)
            this.data['response'] = this._initData()
        },
        _initData(){
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
                        let selected = _.find(item.values,{pos:item.form.selected})
                        this.data.response[item.TAG]["desc"] = item.name
                        
                        this.data.response[item.TAG]["text"] = ""
                        this.data.response[item.TAG]["value"] = ""
                        if(item.form.selectedObj != null){
                            this.data.response[item.TAG]["text"] = selected.name
                            // store actual score value
                            this.data.response[item.TAG]["value"] = selected.value
                        }
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
                 (async ()=>{
                    
                        if(this.data.setup.validate.required != 1){
                            resolve()
                            return
                        }
                        
                        this.errors = [];
                        let items = this.data.items;
                        for(let item of items){
                            this.$refs['vm_'+item.TAG]._hide()
                            let res = await this._validateItem(item)
                            if(!res.status){
                                this.$refs['vm_'+res.error.target]._show(this.$parent.project.setup.messages.required_warning ||this.data.setup.validate.errorMsg)
                                this.errors.push(res.error)
                            }
                        }

                        if(this.errors.length > 0){
                            this.errors[0].dom.scrollIntoView({behavior: 'smooth'})
                            throw this.errors[0].message
                        }

                        resolve()
                })();
            })
                    /* let errors = []
                    

                    let items = this.data.items
                    items.map((item)=>{

                        let validateWC = (target)=>{
                                if(typeof(target.wc) == "object"){
                                    this.$refs['vm_'+target.TAG]._hide()
                                    let valid = this.$refs[target.wc.TAG]._validate()
                                    if(!valid.status){
                                       this.$refs['vm_'+target.TAG]._show(valid.message)
                                       errors.push({target:target.TAG,msg:valid.message})
                                    }
                                }
                        }


                        if(item.show){
                            if(item.optional != 1){
                                this.$refs['vm_'+item.TAG]._hide()
                                let active = _.find(item.values,{active:true})
                                if(!active){
                                    this.$refs['vm_'+item.TAG]._show(this.data.setup.validate.errorMsg)
                                    errors.push({target:item.TAG,message:this.data.setup.validate.errorMsg})
                                }
                                if(item.form.selectedObj != null){
                                    validateWC(item)
                                }
                            }else{
                                if(item.form.selectedObj != null){
                                    validateWC(item)
                                }
                            }
                        }            
                    })


                    if(errors.length > 0){
                        document.querySelector(".dRow[tag='"+errors[0].target+"']").scrollIntoView({behavior: 'smooth'})
                        throw this.data.setup.validate.errorMsg
                    }
                    */




                    //validate answer
                    //resolve()
            //})
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
