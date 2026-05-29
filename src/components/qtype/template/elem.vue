<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="template" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':1}">
                         
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
import validateMsg from '@/components/validateMsg'
import qfooter from '@/components/qfooter'

export default {
    components: { qfooter, validateMsg},
    data(){
        return {
            data : null,
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
            //let q = this.data
            //set qustions

            this.data['response'] = this._initData()
            
        },
        _initData(){
            let data = {}
            //set answer storage
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    //assign answer
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    console.log("validations")
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
