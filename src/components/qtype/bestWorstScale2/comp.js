

export default {
    watch:{
        'data.show'(t){
            if(t){
                //alert("start")
                this._scheduler()
                
            }
        }
    },
    methods : {      
        _checkBtnDelay(){
            let delay = parseInt(this.data.setup.btn_delay)
            if(delay){
                this.showFooter = false
                setTimeout(()=>{
                    this.showFooter = true
                },delay * 1000)
            }
        },
        _updateData(target,group){
            //console.log("Target",target)
            group.forEach((v)=>{
                if(v.id !== target.id && target.score === v.score){
                    v.score = 0
                }
            })
            this._dataCheck(group)

            //console.log("Group",group)
        },
        _dataCheck(group){
            const hasScoreOne = group.some(item => item.score === 1);
            const hasScoreMinusOne = group.some(item => item.score === -1);
            if (hasScoreOne && hasScoreMinusOne) {
                //console.log("Group contains both a score of 1 and -1.");
                setTimeout(() => {
                    this._nextAttr()
                },300)
            }         
        },
        _nextAttr(){
            
            if(this.schedule.length <= (this.currentTrial + 1)){
                //alert("Done")
                setTimeout(() => {
                    this._next()
                },300)
            }else{
                this.currentTrial += 1
            }
        },
        _scheduler(){
            //return new Promise((resolve) => {
            
            const SETS = this.data.setup.bestWostScale.sets
            // const ITEMS_PER_SET = this.data.setup.bestWostScale.itemsPerSet
            // const REPETITIONS_PER_ITEM = this.data.setup.bestWostScale.repetitionsPerStatement

            let items = []
            let dimensionCollection = this.data.columns
            let getDimensionID = (dimension,dimensionCollection) => {
                return dimensionCollection.find(v => v.name === dimension).index
            }


            this.data.choices.map((v)=>{
                let item = {
                        id : v.TAG,
                        VAR : v.VAR,
                        name : v.name,
                        dimension : v.dimension,
                        dimensionID : getDimensionID(v.dimension,dimensionCollection),
                        score : 0,
                        count : 0  
                }
                items.push(item)
            })
            //console.log("items",items)

            let itemsByDimension = []
            items.forEach((v)=>{
                if(!itemsByDimension[v.dimension]){
                    itemsByDimension[v.dimension] = []
                }
                itemsByDimension[v.dimension].push(v)
            })

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            let sortByCountASC = (itemPerDimension) => {
                itemPerDimension.sort((a, b) => a.count - b.count)
                return itemPerDimension
            }

            let TRIALS = []
            for(let i = 0; i < SETS; i++){
               let GROUP = []
               Object.keys(itemsByDimension).forEach((v)=>{
                    itemsByDimension[v] =shuffle(itemsByDimension[v])  
                    itemsByDimension[v] = sortByCountASC(itemsByDimension[v])
                    GROUP.push(itemsByDimension[v][0])
                    itemsByDimension[v][0].count += 1
               })
               TRIALS.push(GROUP)
            }
            //console.log("TRIALS",TRIALS)
            this.schedule = JSON.parse(JSON.stringify(TRIALS))
            console.log("sets",this.schedule)

        }

    }
}