<template>
    <div class="footer" v-if="(question?.data) && (question.data.show)">
        <button class="dBtn prev" @click="question._prev()" v-show="(question.$parent.history.length > 1) && (project.setup.hidePrevBtn != 1)" :disabled="question.disableBtn" v-html="project.setup.messages.prevBtn"></button>
        <button class="dBtn next" @click="question._start()" :disabled="question.disableBtn" v-html="project.setup.messages.nextBtn"></button>
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
   mounted(){
        this.question =  this.$parent.$parent 
        this.project = this.question.$parent.project
   },
}
</script>
