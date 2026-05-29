<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="slider" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':1}" >
                        <br>
                        <template v-for="(target,index) in data.items" :key="index">
                        <transition name="oaat_animation" @before-leave="(el) => _beforeLeave(el)">
                         <div class="dRow" :tag="target.TAG" v-show="target.show && target.oaat_show">
                             <div class="dSlider" :class="{'notselected':(!target.form.selectedObj)}" :style="{'--labels':data.values.length,'--color':((target.form.selectedObj?.color) ? target.form.selectedObj.color : '#fff')}">
                                <div class="dFormGroup">
                                    <div class="title" >
                                        <div class="content" v-html="_pipeText(target.name)"></div>
                                        <div class="wc" v-if="target.wc">
                                            <formTextbox 
                                            :ref="target.wc.TAG"
                                            :name="target.wc.TAG" 
                                            :placeholder="target.wc.placeholder" 
                                            :value="target.wc.input" 
                                            :validate="target.wc.validate"
                                            v-model:RTs="target.wc.RTs"
                                            :disabled="target.wc.disabled" 
                                            :domStyle="{'max-width':'400px'}"
                                            v-model:value="target.wc.input"></formTextbox>
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
                <qfooter ref="footer" v-show="!option.one_at_a_time.enable && showFooter"></qfooter>
                <qfooter2 ref="footer2" v-show="option.one_at_a_time.enable && showFooter" :option="option.one_at_a_time"></qfooter2>

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
import formTextbox from '@/components/forms/textbox'

export default {
    components: { qfooter, validateMsg, Slider, formTextbox, qfooter2},
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
            showFooter : false,
            footerTimeout : null,
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    computed: {
        hasVisibleTarget() {
            if (!this.data || !this.data.items) return false
            return this.data.items.some(target => target.show && target.oaat_show)
        }
    },
    watch:{
        // 'option.one_at_a_time.currentIndex'(){
            
        // }
        // 'item.show'(s){

        // }
        'data.show'(s){
            if(s){
                if(s){
                    setTimeout(()=>{
                        this._oaat_process(this.option.one_at_a_time.currentIndex,"next")
                    },1000)
                }
                
            }
        },
        hasVisibleTarget(newVal) {
            // Clear any existing timeout
            if (this.footerTimeout) {
                clearTimeout(this.footerTimeout)
                this.footerTimeout = null
            }
            
            if (newVal) {
                // Show footer after 1 second delay
                this.footerTimeout = setTimeout(() => {
                    this.showFooter = true
                }, 1000)
            } else {
                // Hide footer immediately when no target is visible
                this.showFooter = false
            }
        }
    },
    mounted(){
        this._initQuestion()
        this._checkGibberish()
    },
    beforeUnmount(){
        if (this.footerTimeout) {
            clearTimeout(this.footerTimeout)
            this.footerTimeout = null
        }
    },
    methods:{
        _beforeLeave(el){
            const parent = el.offsetParent || el.parentElement
            if (parent) {
                const top = el.offsetTop
                el.style.top = top + 'px'
            }
        },
        _clickLabel(label,target){
            target.form.selected = label.value
            this._update(target)
        },
        _update(target){
            target.values.map((v)=>{
                v.active = false
            })
            let selected = _.find(target.values,{value:target.form.selected})
            selected.active = true
            target.form.selectedObj = selected
            //console.log(selected)
        },
        _initQuestion(){
            this.data = this.item
            let q = this.data
             this.data.values.map((v,k)=>{
                 let val = k + 1
                 v['value'] = val
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

                //WRITE IN CHOICE
                if(typeof(v.wc) == "object"){
                    v.wc['TAG'] = q.TAG+"_"+val+"_wc"
                    v.wc['VAR'] = q.VAR+"_"+val+"_wc"
                    v.wc['input'] = ""
                    v.wc['RTs'] = []
                    v.wc['disabled'] = true
                }

            })
            
            this.ready = true
            this.data.items = this._randomList(this.data.items,this.data.setup.randomItems)

            //this._oaat_process(0,"next")
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
                        let selected = _.find(item.values,{value:item.form.selected})
                        this.data.response[item.TAG]["desc"] = item.name
                        
                        this.data.response[item.TAG]["text"] = ""
                        this.data.response[item.TAG]["value"] = ""
                        if(item.form.selectedObj != null){
                            this.data.response[item.TAG]["text"] = selected.name
                            if(item.form.selectedObj.score == ""){
                                this.data.response[item.TAG]["value"] = item.form.selected
                            }else{
                                this.data.response[item.TAG]["value"] = item.form.selectedObj.score
                            }
                        }
                        this.data.response[item.TAG]["ref"] = item
                        if(typeof(item.wc) == "object"){
                                this.data.response[item.TAG]["wc"] = item.wc.input
                                if(typeof(item.wc.RTs) != "undefined"){
                                this.data.response[item.TAG]["wc_RTs"] = item.wc.RTs
                                }
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
                                this.$refs['vm_'+res.error.target]._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
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

<style>
.choices > .content {
  position: relative;
}
/*
.oaat_animation-enter-active{
  animation-name: oaat_animation-in;
  animation-duration: .4s;
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  will-change: opacity, transform;
}
.oaat_animation-leave-from,.oaat_animation-leave-active,.oaat_animation-leave-to{
  position: absolute!important;
  top:0px!important;
  left:0px!important;
  right: 0px!important;
  width: 100%!important;
  pointer-events:none;
}

.oaat_animation-leave-active{
  animation-name: oaat_animation-out;
  animation-duration: .4s;
  animation-timing-function: cubic-bezier(0.55, 0.06, 0.68, 0.19);
  will-change: opacity, transform;
}

@keyframes oaat_animation-in {
  0% {
    opacity:0;
    transform: translateX(100%) scale(.95);
  }
  25%{
    opacity:1;
  }
  100% {
    z-index:2;
    transform: translateX(0%) scale(1);
}
}


@keyframes oaat_animation-out {
  0% {
    opacity:1;
    z-index:1;
    transform: translateX(0%) scale(1);
  }
  75%{
    
  }
  100% {
    opacity:0;
    transform: translateX(100%) scale(.95);
}
}
*/
</style>
