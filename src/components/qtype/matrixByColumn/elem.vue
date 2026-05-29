<template>
    <transition :name="transition">
   <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion column" qtype="matrix" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content" :style="{'--grid':_checkShowColumnLength()}">
                        <!-- MATRIX BIG SCREEN -->
                        <table class="dMatrix" v-if="smallDisplay == false">
                            <tr class="header">
                                <th></th>
                                <template v-for="(col,index) in data.columns">
                                    <th :key="index" v-html="_pipeText(col.name)" v-if="col.show"></th>
                                </template>
                            </tr>
                        <template v-for="(row,index) in data.rows" >
                            <tr v-if="row.show" :key="index" :tag="row.TAG" :style="row.show2">
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
                                            v-model:value="row.wc.input"></formTextbox>
                                        </div>           
                                </td>
                                <template v-for="(item,index2) in row.list">
                                        <td :key="index2" v-if="_checkShowColumn(item)">
                                            <template v-if="data.setup.selectMultiple == 0">
                                                <formRadio                             
                                                    :label="_pipeText(item.name)" 
                                                    :value="row.value" 
                                                    :name="item.TAG" 
                                                    :selected="data.columns[index2].form.selected"
                                                    v-model:checked="data.columns[index2].form.selected" 
                                                    v-show="row.show"
                                                >
                                                </formRadio>
                                            </template>
                                            <!-- 
                                            <template v-else>
                                                <formCheckbox 
                                                    :label="_pipeText(item.name)" 
                                                    :name="item.TAG" 
                                                    :checked="item.checked"
                                                    @change="_onSelect({column:item,row:row})"
                                                    v-model:checked="item.checked" 
                                                    v-show="item.show">                                 
                                                </formCheckbox>
                                            </template> -->
                                        </td>
                                       
                                </template>
                            </tr>
                            
                            <!-- <tr v-if="row.show" class="singleWarn" :key="index">
                                <validateMsg :ref="'vm_'+row.TAG"></validateMsg>
                            </tr> -->
                        </template>
                        </table>
                        <!-- MATRIX SMALL SCREEN -->
                        <table class="dMatrix smallDisplay" v-if="smallDisplay == true">
                            <tr class="header">
                                <th></th>
                                <template v-for="(row,row_index) in data.rows">
                                    <th :key="row_index" v-html="_pipeText(row.name)" v-if="row.show"></th>
                                </template>
                            </tr>

                             <template v-for="(col,col_index) in data.columns" :key="col_index">
                                 <tr :tag="col.TAG"  v-if="col.show">
                                    <td><div v-html="_pipeText(col.name)"></div></td>
                                    <template v-for="(row,row_index) in data.rows" :key="row_index">
                                            <td :key="row_index" v-if="_checkShowColumn(row.list[col_index])">
                                                <template v-if="data.setup.selectMultiple == 0">
                                                    <formRadio                             
                                                        :label="_pipeText(row.name)" 
                                                        :value="row.value" 
                                                        :name="row.list[col_index].TAG" 
                                                        :selected="data.columns[col_index].form.selected"
                                                        v-model:checked="data.columns[col_index].form.selected" 
                                                        v-show="row.show"
                                                        >
                                                    </formRadio>
                                                </template>  
                                            </td>                                 
                                    </template>
                                 </tr>
                            </template>
                        </table>



                    </div>
                </div>
                <div class="combWarn">
                    <validateMsg ref="validateMsg"></validateMsg>
                </div>
                <div class="singleWarn">
                    <validateMsg ref="validateMsg"></validateMsg>
                </div>
                <div v-if="data.setup.displayByRow == 1">
                    <button class="dBtn perRow" @click="current_row--">&nbsp;</button>
                    <button class="dBtn perRow" @click="current_row++">&nbsp;</button>
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
// import formCheckbox from '@/components/forms/checkbox'
import formTextbox from '@/components/forms/textbox'


export default {
    components: { qfooter, validateMsg, formRadio, formTextbox},
    data(){
        return {
            data : null,
            current_row : 0,
            smallDisplay : false
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    async mounted(){
        await this._initQuestion()
        this._checkGibberish()
        if(this.data.setup.displayByRow == 1){
            this._hideRows()
        }
    },
    created(){
        this.$nextTick(()=>{
            this._responsive()
            window.addEventListener("resize", this._responsive);
        })
    },
    // unmounted() {
    //     window.removeEventListener("resize", this._responsive());
    // },
    methods:{
        _initQuestion(){
            return new Promise((resolve)=>{
            this.data = this.item
            let q = this.data
           
            q.rows.forEach((v,k)=>{
                let val = k + 1
                v['value'] = val
                v['TAG'] = `${q.TAG}_${val}`
                v['VAR'] = `${q.VAR}_${val}`
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['show2'] =  'visible'
                v['list'] =  q.columns.map((c,ck)=>{
                                // let col = JSON.parse(JSON.stringify(c))
                                let order = ck + 1
                                c['show'] = true
                                c['order'] = order
                                c['value'] = order
                                c['optional'] = false
                                c['form'] = {
                                    selected : ""
                                }
                                c['TAG'] = `${q.TAG}_${ck+1}`
                                c['VAR'] = `${q.VAR}_${ck+1}`
                                let col = {...c}
                               
                                
                                col['checked'] = false
                                col['checkedVal'] = 0
                               
                                // v.list.push(col)
                                return col
                            })
                v['form'] = {
                    selected : ""
                }
          

               

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
         
            q.rows = this._randomList(q.rows,q.setup.randomRows)
            this.data['response'] = this._initData()
            resolve()
            })
        },
       _initData(){
          // return new Promise((resolve,reject)=>{
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
                        this.data.rows[0].list.map((row)=>{
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
                    // console.log(data)
                    return data
                   //  resolve(data)
               } catch (error) {
                   // reject(error)
               }
            //})
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                                           
                        this.data.columns.map((row)=>{
                            
                            if(row.form.selected){
                                let choice = _.find(this.data.rows, { 'value': row.form.selected})
                                let tag = choice.list[row.order - 1].TAG
                                this.data.response[tag]["desc"] = choice.name
                                this.data.response[tag]["text"] = choice.name
                                this.data.response[tag]["value"] = choice.value
                                this.data.response[tag]["ref"] = choice
                                if(typeof(choice.wc) == "object"){
                                  this.data.response[tag]["wc"] = choice.wc.input
                                }
                            }
                        })
                    
                    resolve()
                }catch(e){
                    console.log(e)
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    this.$refs.validateMsg._hide()
                    let errors = []
                    let r_list = {}
                     if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }  
                    r_list = this.data.columns
                    //console.log(r_list)   
                    
                    r_list.map((row)=>{
                        if(row.show){
                           // console.log(this.$refs)
                                //this.$refs['vm_'+row.TAG]._hide()
                        
                                if(!row.form.selected && row.optional == false){
                                    errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg})
                                    //if(row_key < this.data.rows.length)
                                        // this.$refs['vm_'+row.TAG]._show(this.data.setup.validate.errorMsg)
                                    // row_key
                                    // console.log('pasok')
                                }
                               
                               if(row.form.selected  &&  row.wc ){
                                   if(typeof(row.wc.input) == "string" ){
                                        let valid = this.$refs[row.wc.TAG]._validate()
                                        console.log(this.$refs[row.wc.TAG])
                                        if(!valid.status && row.wc.input.length == 0){
                                            errors.push({target:row.TAG,msg:this.$parent.project.setup.messages.required_warning || valid.message})
                                            this.$refs['vm_'+row.TAG]._show(this.$parent.project.setup.messages.required_warning || valid.message)
                                        }else
                                            this.$refs[row.wc.TAG].hasError = false
                                    }
                               }
                        }

                    })
                      //console.log(errors.length, errors)
                    if(errors.length > 0){
                        //document.querySelector("tr[tag='"+errors[0].target+"']").scrollIntoView({behavior: 'smooth'})
                        this.$refs.validateMsg._show(errors[0].msg)
                        throw errors[0].msg
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
        }, 
        _hideRows(){
            this.data.rows.map((v,k)=>{
                if(k != this.current_row)
                    v.show2 = 'display:none'
            })
        }   
      
    },
    watch:{
        current_row(){
            this.current_row = this.current_row > 0 && this.current_row < this.data.rows.length ? this.current_row : (this.current_row < 0 ? this.data.rows.length -1 : 0)
            this._hideRows()
            this.data.rows[this.current_row]['show2'] = 'display:table-row'
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