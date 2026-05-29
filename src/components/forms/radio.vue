<template>
    <div 
        class="dRadio" 
        :class="{ active: _selected === value }" 
        :style="{'--minHeight':option?.minHeight+'px'}"
    >
        <label>
            <input type="radio" :name="name" :value="value" v-model="_selected"/>
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
   props : ["label","name","value","selected", "option"],
   emits: ['update:checked'],
   computed:{
       _selected:{
           get(){
               return this.selected
           },
           set(val){
              this.$emit("update:checked", val)
           }
       }
   }

})
</script>
