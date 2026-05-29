<template>
    <div class="dTextArea" :class="{hasError:hasError}">
        <textarea type="text" :name="name" :placeholder="placeholder" :style="style" v-model="_value" autocomplete="off" :disabled="disabled" :maxlength="((typeof(validate) != undefined) && (validate.max != 0)) ? validate?.max : null"></textarea>
        <div class="info" v-if="validate.max > 0">{{_characters}} / {{validate.max}}</div>
   </div>
   
</template>
<script>
import helper from '@/js/helper'
export default({
   data(){
       return {
           hasError : false,
           characters : 0,
           style : {},
       }
   },
   mounted(){
       this._genDomStyle()
   },
   watch:{
       style(){
           this._genDomStyle()
       }
   },
   props : ["name","value","placeholder","disabled","validate","domStyle"],
   emits: ['update:value'],
   mixins : [helper],
   computed:{
       _value:{
           get(){
               return this.value
           },
           set(val){
              this.$emit("update:value", val)
           }
       },
       _characters:{
           get(){
               return this.value.trim().length
           },
           set(val){
               this.characters = val.trim().length
           }
       }
   },
   methods:{
       _genDomStyle(){
           this.$nextTick(()=>{
                if(typeof(this.domStyle) != undefined){
                    if(typeof(this.domStyle['width']) != undefined){
                        this.style['width'] = this.domStyle['width']
                    }
                    if(typeof(this.domStyle['height']) != undefined){
                        this.style['height'] = this.domStyle['height']
                    }

                }
           })
       },
      _validate(required = 1){
        
        let Project = null
        window.dispatchEvent(new CustomEvent('getSurveyInfo', {
            detail: {
                callback : (res) => {
                    // console.log(res)
                    Project = res
                }
            }
        }))


        if(!this.validate){
            return true
        }
        let input = this.value.trim()
        this.hasError = false

        if((required == 1) && (input == "")){
            this.hasError = true
            throw Project.setup.messages.required_warning || this.validate.errorMsg
        }
        if(input != ""){
            // if (!(input.length >= this.validate.min && input.length <= this.validate.max)) {
            //     this.hasError = true
            //     throw this.validate.errorMsg
            // }  

            if(this.validate.min && this.validate.min > input.trim().length){
                if(Project.setup.messages.input1_warning_min){
                    let errorMsg = this._textReplacer(Project.setup.messages.input1_warning_min,{
                        "@min" : this.validate.min
                    })
                    this.hasError = true
                    throw errorMsg

                }               
            }

            if(this.validate.max && this.validate.max < input.trim().length){
                if(Project.setup.messages.input1_warning_max){
                   let errorMsg = this._textReplacer(Project.setup.messages.input1_warning_max,{
                        "@max" : this.validate.max
                    })
                    this.hasError = true
                    throw errorMsg
                }                
            }
        }
        return true
      }
   }

})
</script>