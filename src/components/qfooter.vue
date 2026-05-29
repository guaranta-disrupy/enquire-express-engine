<template>
    <div class="footer" v-if="(question?.data) && (question.data.show)">
        <button class="dBtn prev" ref="prev" @click="question._prev()" v-show="(question.$parent.history.length > 1) && (project.setup.hidePrevBtn != 1)" :disabled="question.disableBtn" v-html="project.setup.messages.prevBtn"></button>
        <button class="dBtn next" ref="next" @click="question._next()" v-if="(question.$parent.sched[question.$parent.sched.length - 1].display != question.data.display)" :disabled="question.disableBtn" v-html="project.setup.messages.nextBtn"></button>
        <button class="dBtn next" ref="next" @click="question._next()" v-else :disabled="question.disableBtn" v-html="project.setup.messages.finalBtn"></button>
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

