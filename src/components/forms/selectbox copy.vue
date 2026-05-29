<template>
<div class="dSelect" :class="{hasError:hasError}">
    <vue-select :searchable="false" :clear-on-close="true" v-model="_selected" :name="name" :options="_options" label-by="name" :close-on-select="true" :min=1 openDirection="bottom" :placeholder="placeholder" ></vue-select>

</div>
</template>
<script>
let _ = require('lodash')
import VueSelect from 'vue-next-select'

export default({
   props : ["name","selected","options","placeholder"],
   data(){
     return {
         hasError : false
     }
   },
   components : {VueSelect},
   emits: ['update:selected'],
   computed:{
       _selected:{
           get(){
               return _.find(this.options,{value:this.selected})
           },
           set(val){
              this.$emit("update:selected", val.value)
           }
       },
       _options:{
           get(){
            let obj =  _.filter(this.options,{show:true})
            return obj
           }
       }
   },
   methods:{
        _searchChange(){
            alert("hi")
        }
   }

})
</script>