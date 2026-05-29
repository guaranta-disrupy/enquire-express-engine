<template>
    <div class="footer" v-if="(question?.data) && (question.data.show)">
        <button class="dBtn prev" @click="_go('prev')" v-show="btn.prev" :disabled="question.disableBtn" v-html="project.setup.messages.prevBtn"></button>
        <button class="dBtn next" @click="_go()" v-if="btn.next" :disabled="question.disableBtn" v-html="project.setup.messages.nextBtn"></button>
        <button class="dBtn next" @click="_go()" v-else :disabled="question.disableBtn" v-html="project.setup.messages.finalBtn"></button>
    </div>
</template>

<script>
export default{
   data(){
       return {
           project : null,
           question : null,
           btn : {
               prev : false,
               next : true,
           }
       }
   },
   props : ['option'],
   mounted(){
        this.question =  this.$parent.$parent 
        this.project = this.question.$parent.project
   },
   watch:{
       'option.currentIndex'(){
           this._checkBtn("prev")
           this._checkBtn("next")
       }
   },   
   methods:{
       _go(type = "next"){
           if(type == "prev"){
                this.question._oaat_process(this.option.currentIndex - 1,type)
                return
           }
           this.question._oaat_process(this.option.currentIndex + 1,type)
        //    let target = this.question.data.rows[this.option.currentIndex]
        //    this.question.$refs['vm_'+target.TAG]._hide()
        //    this.question._validateItem(target).then((res)=>{
        //         if(!res.status){
        //             this.question.$refs['vm_'+res.error.target]._show(res.error.message)
        //             return
        //         }
        //         this.question._oaat_process(this.option.currentIndex + 1,type)
        //    })
       },
       _checkBtn(type){
           if(type == "prev"){
                if(this.project.setup.hidePrevBtn == 1){
                    this.btn.prev = false
                    return
                }
                if(this.question.$parent.sched[0].TAG != this.question.data.TAG){
                    this.btn.prev = true
                    return
                }

                let target = this.option.currentIndex - 1
                let end = 0
                let k = 0
                for (let v of this.question.data.rows) {
                    if(v.show){
                        end = k
                        break;
                    }
                    k += 1    
                }
                if(target < end){
                    this.btn.prev = false
                }else{
                    this.btn.prev = true
                }
           }else{
                
                let target = this.option.currentIndex + 1
                let end = 0
                let k = 0
                for (let v of this.question.data.rows) {
                    if(v.show){
                        end = k
                    }
                    k += 1
                }
                if(target > end){

                    if(this.question.$parent.sched[this.question.$parent.sched.length - 1].display != this.question.data.display){
                        this.btn.next = true
                    }else{
                         this.btn.next = false                 
                    }

                }else{
                     this.btn.next = true
                }

           }
       }
   }

}
</script>

