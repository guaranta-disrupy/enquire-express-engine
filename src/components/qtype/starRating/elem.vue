<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="starRating" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
            
        }"
        :style="{'--star_count':(data.setup.size)}"
        >
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content">
                        <table class="starRatingTbl">
                            <template v-for="obj in data.items" :key="obj.order">
                            <tr v-show="obj.show">
                                <td><div class="name" v-html="_pipeText(obj.name)"></div></td>
                                <td>
                                    <div class="collections">
                                        <template v-for="n in data.setup.size" :key="n">
                                            <img 
                                            v-show="n <= obj.value"
                                            class="star" 
                                            :value="n" 
                                            draggable="false" 
                                            :src="data.setup.design.selected"
                                            @click="obj.value = n"/>
                                            <img 
                                            v-show="n > obj.value"
                                            class="star" 
                                            :value="n" 
                                            draggable="false" 
                                            :src="data.setup.design.notSelected"
                                            @click="obj.value = n"/>                                            
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            </template>
                        </table>   
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

export default {
    components: { qfooter, validateMsg},
    data(){
        return {
            data : null,
            value : 3,
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
            this._setDefaultStar()

            this.data.items.map((v,k)=>{
                let val = k + 1
                v['TAG'] = this.data.TAG+"_"+val
                v['VAR'] = this.data.VAR+"_"+val 
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['value'] = 0
            })
            this.data.items = this._randomList(this.data.items,this.data.setup.randomItems)
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
                        this.data.response[item.TAG]["desc"] = item.name
                        this.data.response[item.TAG]["text"] = item.name
                        this.data.response[item.TAG]["value"] = item.value
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
                    if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }
                    this.$refs.validateMsg._hide()
                    let items = _.filter(this.data.items,{"show":true})
                    items.map((item)=>{
                            let value = parseFloat(item.value)
                            if(value <= 0){
                                this.$refs.validateMsg._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
                                throw this.data.setup.validate.errorMsg                            
                            }                       
                    })
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
