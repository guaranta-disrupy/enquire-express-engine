<template>
    <template v-if="ready">
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
                        :disabled="row.form.selected == ''"
                        v-model:value="row.wc.input"></formTextbox>
                        
                        
                    </div>           
            </td>
            <template v-for="(item,index2) in row.list" >
                    <td :key="index2" v-if="_checkShowColumn(item)">
                            <formRadio                             
                                :label="item.name" 
                                :value="c_tags[row.order - 1].value" 
                                :name="c_tags[index2].TAG" 
                                v-show="row.show"
                                :selected="c_tags[index2].form.selected"
                                 v-model:checked="c_tags[index2].form.selected" 
                                >
                            </formRadio>
                    </td>
            </template>
        </tr>
    </template>
    </template>
    <hr><hr><hr><hr><hr>
</template>

<script>
import comp from './comp.js'

import formRadio from '@/components/forms/radio'
import formTextbox from '@/components/forms/textbox'
export default {
    data(){
        return{
            ready : false,
            c_tags : []
        }
    },
    async mounted(){
        await this.setData()
        this.ready = true
    },
    methods:{
        setData(){
            //set TAG
            return new Promise((resolve)=>{
                this.data.columns.map((c)=>{
                    this.c_tags.push({TAG : `${this.data.TAG}_${c.order}`, value : c.order, form : {}, show:c.show, optional:false})
                })
                resolve()
            })
        }
    },
    components : {formRadio, formTextbox },
    mixins : [comp],
    props : ["data"],
}
</script>

<style>

</style>