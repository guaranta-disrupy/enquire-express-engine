<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="matrix" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':6}">
                        <table class="dMatrix">
                            <tr class="header">
                                <th></th>
                                <template v-for="(col,index) in data.items" :key="index">
                                    <th  v-html="_pipeText(col.title == null ? ' ' : col.title)" :colspan="col.column.length"></th>
                                </template>
                            </tr>
                            <tr class="header">
                                <th></th>
                                <template v-for="(col,index) in data.items" :key="index">
                                    <template v-for="(col2,index2) in col.column" :key="index2" >
                                        <th v-html="_pipeText(col2.name)" ></th>
                                    </template>
                                </template>
                            </tr>
                            <template v-for="(row,index) in data.rows" :key="index">
                                <tr :tag="row.TAG" v-if="row.show">
                                    <td v-html="_pipeText(row.name)"></td>
                                    <template v-for="(item, index2) in row.list" :key="index2">
                                        <td > 
                                            <template v-if="item.type == 1"><!--dropdown!-->
                                                <!-- <div class="dInput">
                                                    <select 
                                                        :name="item.TAG"
                                                        v-model="item.value" 
                                                    >
                                                        <template v-for="(item2,index3) in item.items" :key="index3">
                                                            <option v-html="item2.name" :value="index3+1"></option>
                                                        </template>
                                                    </select>
                                                    
                                                </div> -->
                                                <formSelectbox 
                                                        :ref="item.TAG"
                                                        v-model:selected="item.value"
                                                        :name="item.TAG" 
                                                        :options="item.items"
                                                        :placeholder="item.placeholder"
                                                ></formSelectbox>
                                            </template>
                                            <template v-if="item.type == 2"><!--radio!-->
                                                <div class="domStyle-col2"  v-html="item.domStyle.col2"></div>
                                                <formRadio
                                                    :name="item.TAG"
                                                    :label="item.name" 
                                                    :value="index2" 
                                                    :selected="row.form.selected[item.order-1]"
                                                    v-model:checked="row.form.selected[item.order-1]" 
                                                    v-show="row.show"
                                                >
                                                </formRadio>
                                            </template>
                                            <template v-if="item.type == 3"><!--textbox!-->
                                                <formTextbox 
                                                    :ref="item.TAG"
                                                    :name="item.TAG"
                                                    :validate="item.validate"
                                                    v-model:value="item.value"
                                                ></formTextbox>
                                            </template>
                                        </td>
                                    </template>
                                </tr>
                                <tr v-if="row.show" class="singleWarn" :key="index">
                                    <validateMsg :ref="'vm_'+row.TAG"></validateMsg>
                                </tr>
                            </template>
                        </table>
                    </div>
                </div>
                <div class="combWarn">
                    <validateMsg ref="validateMsg"></validateMsg>
                </div>
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
import formRadio from '@/components/forms/radio'
import formTextbox from '@/components/forms/textbox'
import formSelectbox from '@/components/forms/selectbox'

export default {
    components: { qfooter, validateMsg, formRadio, formTextbox, formSelectbox},
    data(){
        return {
            data : null,
            radioCount : 0,
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],

    mounted(){
        this._initQuestion()
        window['matrix_multi'] = this
    },
    methods:{
        _initQuestion(){
            this.data = this.item
            let q = this.data
            //set qustions
            let order = 1 // declare order outside loop
            let prevK = -1
            q.items.map((v,k)=>{//loop items set column order
               v.column.map((c, ck)=>{
                    c['show'] = true
                    c['order'] = order
                    
                    switch(c.type){
                        // case 1:
                        case 2:
                            c['value'] = ck + 1
                            break;
                        case 3:
                            c['value'] = ""
                            break;
                    }
                    if(c.type != 2 || (c.type == 2 && prevK == k)){ //don't increment order when type is 2=radio
                        order += 1
                        if(c.type==2)
                            this.radioCount += 1
                    }
                    if(prevK != k) // added to check if radio has 2 or more columns/title
                      prevK = k
               })
            })

            q.rows.map((r,k)=>{//loop row/choices
                let val = k + 1
                r['TAG'] = q.TAG+"_"+val
                r['VAR'] = q.VAR+"_"+val
                r['order'] = val
                r['display'] = null
                r['show'] = true
                r['list'] = []
                r['form'] = {
                    selected : []
                }
                
                q.items.map((i)=>{
                    let prev_col2 = null
                    i.column.map((c)=>{
                        let col = JSON.parse(JSON.stringify(c))
                        col['TAG'] = r['TAG']+"_"+c['order']
                        col['VAR'] = r['VAR']+"_"+c['order']
                        col['checked'] = false
                        col['checkedVal'] = 0
                        col['show'] = true

                        let col2 = (this.data.items[c['order'] - 1].title != prev_col2) ? this.data.items[c['order'] - 1].title : null   
                        col['domStyle'] = {col2:col2}
                        prev_col2 = col2
                        if(col.type == 1){
                            col.items.map((ci,cik)=>{
                                
                                ci['value'] = cik + 1
                                ci['show'] = true
                            })
                           
                        }
                        if(col.type == 3)
                            col['value'] = ""
                        r.list.push(col)
                    })
                    
                })
            })

            this.data['response'] = this._initData()
            
            
        },
        _initData(){
            let data = {}
            //set answer storage
             this.data.rows.map((row)=>{
                row.list.map((item)=>{
                    let obj = {
                        TAG : item.TAG,
                        VAR : item.VAR,
                        desc : "",
                        text : "",
                        value : "",
                        name : "",
                        ref : null
                    }
                    
                    data[item.TAG] = obj                         
                    
                    
                })
            })
            
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    let t1 = {} //t1 for type 1 dropdown
                    let t2 = 0 //t2 for type 2 radio
                    //assign answer
                    this.data.rows.map((row)=>{
                        row.list.map((list)=>{
                            switch(list.type){
                                case 1: // dropdown
                                    t1 = list.items[list.value - 1] 
                                    if(t1){
                                        this.data.response[list.TAG]["desc"] = t1.name
                                        this.data.response[list.TAG]["text"] = t1.name
                                        this.data.response[list.TAG]["value"] = list.value
                                    }
                                    break;
                                case 2://radio
                                    t2 = row.form.selected[list.order - 1]
                                    if(t2 !== undefined)
                                    {
                                        this.data.response[list.TAG]["desc"] = row.list[t2].name
                                        this.data.response[list.TAG]["text"] = row.list[t2].name
                                        this.data.response[list.TAG]["value"] = row.list[t2].value     
                                    }
                                    break;
                                case 3://textbox
                                    this.data.response[list.TAG]["desc"] = list.value
                                    this.data.response[list.TAG]["text"] = list.value
                                    this.data.response[list.TAG]["value"] = list.value 
                                    break;
                            }
                            //same for all qtypes
                            this.data.response[list.TAG]["ref"] = list //save all object to ref for reference
                        })
                       
                    })
                    //  console.log(this.data.response)
                    resolve()
                }catch(e){
                   console.log(e)
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                //console.log("validations")
                //validate answer
                this.$refs.validateMsg._hide()
                let errors = []
                // let pass = true
                let rlen = {} /// for row length storage
                if(this.data.setup.validate.required != 1){
                    resolve()
                    return
                } 

                this.data.rows.map((row)=>{
                    if(row.show){
                        //console.log('row-show')
                        this.$refs['vm_'+row.TAG]._hide()
                       
                        rlen = {}
                        row.list.map((list)=>{
                            if(list.show){
                                switch(parseInt(list.type)){
                                    case 1:                                        
                                    case 3:
                                        if(list["value"].toString() == ""){
                                            errors.push({target:row.TAG,msg:this.data.setup.validate.errorMsg})
                                            this.$refs['vm_'+row.TAG]._show(this.data.setup.validate.errorMsg)
                                            this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                                           // throw this.data.setup.validate.errorMsg
                                           if(list.type == 1){
                                                this.$refs[list.TAG].hasError = true
                                                //console.log(list.TAG)
                                           }
                                               
                                          
                                        }else 
                                            this.$refs[list.TAG].hasError = false
                                        
                                        break;
                                    case 2:
                                        rlen = _.filter(row.form.selected, (o)=>{ return o != undefined})
                                        if(rlen.length != this.radioCount){
                                            this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                                            errors.push({target:row.TAG,msg:this.data.setup.validate.errorMsg})
                                            this.$refs['vm_'+row.TAG]._show(this.data.setup.validate.errorMsg)
                                            //throw this.data.setup.validate.errorMsg
                                        }
                                        break;
                                }
                                if(list.type == 3){
                                        let valid = this.$refs[list.TAG]._validate()
                                        if(!valid.status){
                                            errors.push({target:row.TAG,msg:valid.message})
                                            this.$refs['vm_'+row.TAG]._show(valid.message)
                                        }
                                    }
                            }
                        })
                    }
                })
                if(errors.length > 0){
                        document.querySelector("tr[tag='"+errors[0].target+"']").scrollIntoView({behavior: 'smooth'})
                        this.$refs.validateMsg._show(errors[0].msg)
                        throw errors[0].msg
                }
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
<style scope>
#explicit .dInput input, #explicit .dInput select{
    width:100%;
    margin: 0;
}
#explicit .dQuestion[qtype=matrix] .dMatrix tr td:not(:nth-child(1)) {
    /* padding:1.5vmin; */
    padding-left:4vmin;
}
.domStyle-col2{
    display:none;
    text-align:left;
    padding:2vmin;
    font-size:4.5vmin;
    font-style:italic;
}

@media only screen and (max-width: 700px), screen and (max-height: 400px){
    #explicit .dInput select {
        font-size: 4vmin;
    }

    .domStyle-col2{
        display:block;
    }
}


</style>
