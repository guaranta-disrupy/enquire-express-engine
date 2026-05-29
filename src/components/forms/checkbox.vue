<template>
    <div class="dCheckbox" :class="{ active: _checked }"  :style="{'--minHeight':option?.minHeight+'px'}">
        <label>
            <input type="checkbox" :name="name" :value="value" @change="change" v-model="_checked"/>
            <div class="inputStyle"></div>
            <div class="txt">
                <div class="content"  v-html="label"></div>
                <slot></slot>
            </div>
        </label>
    </div>  
</template>
<script>
export default({
   props : ["label","name","value","checked","change",'option'],
   emits: ['update:checked'],
   computed:{
       _checked:{
           get(){
               return this.checked
           },
           set(val){
              this.$emit("update:checked", val)
           }
       }
   }

})
</script>
