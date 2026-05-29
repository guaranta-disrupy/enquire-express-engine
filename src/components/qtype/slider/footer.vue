<template>
    <div class="footer" v-if="(question?.data) && (question.data.show)">
        <button class="dBtn prev" @click="_go('prev')" v-show="(question.$parent.history.length > 1) && (project.setup.hidePrevBtn != 1)" :disabled="question.disableBtn" v-html="project.setup.messages.prevBtn"></button>
        <!-- <button class="dBtn next" @click="_go()" v-if="(question.$parent.sched[question.$parent.sched.length - 1].display != question.data.display)" :disabled="question.disableBtn" v-html="project.setup.messages.nextBtn"></button> -->
        <button class="dBtn next" @click="_go()" v-if="_EnableBtnNext()" :disabled="question.disableBtn" v-html="project.setup.messages.nextBtn"></button>
    </div>
</template>

<script>
export default{
   data(){
       return {
           project : null,
           question : null
       }
   },
   props : ['option'],
   mounted(){
        this.question =  this.$parent.$parent 
        this.project = this.question.$parent.project
   },
   methods:{
       _go(type = "next"){
           if(type == "prev"){
                this.question._oaat_process(this.option.currentIndex - 1,type)
                return
           }
           let target = this.question.data.items[this.option.currentIndex]
           console.log(target)
           this.question.$refs['vm_'+target.TAG]._hide()
           this.question._validateItem(target).then((res)=>{
                if(!res.status){
                    this.question.$refs['vm_'+res.error.target]._show(res.error.message)
                    return
                }
                this.question._oaat_process(this.option.currentIndex + 1,type)
           })
       },
       _EnableBtnNext(){
            return true
       }
   }

}
</script>

