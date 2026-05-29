

let _ = require('lodash')
export default {
    watch:{
        'data.show'(t){
            if(t){
                //alert("start")
                this._scheduler()
                this.currentTrial = 0
                
            }
        },
        'currentTrial'(){
            setTimeout(() => {
               this.startTime = new Date().getTime()
               this.disabledItem = false
            }, 1000)
            
        }
    },
    methods : {      
        _nextAttr(data){
            
            //console.log("record",data)
            this.disabledItem = true
            this.schedule[this.currentTrial].selected = data
            this.schedule[this.currentTrial].rt = new Date().getTime() - this.startTime
            //alert(this.schedule[this.currentTrial].rt)


            if(this.schedule.length <= (this.currentTrial + 1)){
                //alert("Done")
                setTimeout(() => {
                    this._next()
                    //this.$parent._next()
                },300)
            }else{
                this.currentTrial += 1
            }
        },
        
        _scheduler(){
            //return new Promise((resolve) => {
            let items = []
            
            this.data.items.map((v)=>{
                let statements = [{text : v.statementA, value : v.valueA},{text : v.statementB, value : v.valueB}]
                statements = _.shuffle(statements)
                let item = {
                        TAG : v.TAG,
                        VAR : v.VAR,
                        statement1 : statements[0],
                        statement2 :  statements[1],
                        selected : null,
                        rt : null
                }
                items.push(item)
            })
            //console.log("ITEMS...",this.data.items)
            this.schedule = _.shuffle(items)
        }

    }
}