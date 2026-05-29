<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="openEnded" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--rows':1}">

                        <formTextarea 
                        :ref="data.TAG"
                        :name="data.TAG" 
                        :value="data.form.input" 
                        :validate="data.setup.validate"
                        :domStyle="data.setup?.style"
                        v-model:value="data.form.input"></formTextarea>

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
import formTextarea from '@/components/forms/textarea'

export default {
    components: { qfooter, validateMsg, formTextarea},
    data(){
        return {
            data : null,
        }
    },
    mixins : [qtypeFunctions,comp],
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
                    this.data.response[this.data.TAG]["text"] = this.data.form.input
                    this.data.response[this.data.TAG]["value"] = this.data.form.input                 
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    this.$refs.validateMsg._hide()
                    try{
                        this.$refs[this.data.TAG]._validate(this.data.setup.validate.required)
                    }catch(e){
                        this.$refs.validateMsg._show(e)
                        throw e
                    }
                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    resolve()
                }catch(e){
                    reject()
                }
            })
        }
    }
}
</script>
