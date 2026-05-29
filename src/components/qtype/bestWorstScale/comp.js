

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

            console.log("Group",group)
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
        _schedulerBU(){
            let items = []
            let sets = []
            const maxSets = this.data.setup.bestWostScale.sets
            const itemsPerSet = this.data.setup.bestWostScale.itemsPerSet

            this.data.choices.map((v)=>{
                let item = {
                        id : v.TAG,
                        VAR : v.VAR,
                        name : v.name,
                        score : 0     
                }
                items.push(item)
            })
            //items = JSON.parse(JSON.stringify(items))

            // Shuffle function
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            // Initialize usage count
            let itemCounts = {};
            items.forEach(item => {
            itemCounts[item.id] = 0;
            });

            while (sets.length < maxSets) {
                // Sort by least used
                const sortedItems = [...items].sort(
                    (a, b) => itemCounts[a.id] - itemCounts[b.id]
                );

                // Take 8 least used, shuffle, pick 4
                const leastUsedItems = shuffle(sortedItems.slice(0, 8));
                const newSet = leastUsedItems.slice(0, itemsPerSet).sort((a, b) =>
                    a.id.localeCompare(b.id)
                );

                const setKey = newSet.map(item => item.id).join(',');

                const duplicate = sets.some(existingSet => {
                    const existingKey = existingSet.map(item => item.id).sort().join(',');
                    return existingKey === setKey;
                });

                if (!duplicate) {
                    sets.push(newSet);
                    newSet.forEach(item => itemCounts[item.id]++);
                }
            }
            return JSON.parse(JSON.stringify(sets))
            //console.log("sets",sets)
        },
        _scheduler(){
            //return new Promise((resolve) => {
            let items = []
            let sets = []
            const maxSets = this.data.setup.bestWostScale.sets
            const itemsPerSet = this.data.setup.bestWostScale.itemsPerSet

            this.data.choices.map((v)=>{
                let item = {
                        id : v.TAG,
                        VAR : v.VAR,
                        name : v.name,
                        score : 0     
                }
                items.push(item)
            })

            // Calculate total repetitions required
            const totalRepetitions = maxSets * itemsPerSet;

            // Check if equal repetition is possible
            if (totalRepetitions % items.length !== 0) {
                alert("Equal repetition is not possible with the given configuration.");
                return;
                //resolve([])
            }

            const repetitionsPerItem = totalRepetitions / items.length;

            // Prepare the item pool with equal repetitions
            let itemPool = [];
            items.forEach((item) => {
                for (let i = 0; i < repetitionsPerItem; i++) {
                    itemPool.push(item);
                }
            });

            // Shuffle the item pool for randomness
            itemPool = itemPool.sort(() => Math.random() - 0.5);
            let icount = 0;
            // Generate sets without repeating items within a set
            let isBreak = false
            while (sets.length < maxSets) {
                let newSet = [];
                while (newSet.length < itemsPerSet) {
                    // Ensure no duplicate items in the current set
                    const item = itemPool.shift();
                    if (!newSet.some((existingItem) => existingItem.id === item.id)) {
                        newSet.push(item);
                    } else {
                        if(icount > 100){
                            isBreak = true
                            console.log("Break")
                            this._scheduler()
                            break;
                         }
                        // Put the item back if it already exists in the current set
                        icount += 1
                        //console.log("icount",icount)
                        itemPool.push(item);
                        itemPool = itemPool.sort(() => Math.random() - 0.5); // Shuffle to avoid bias

                    }
                }
                sets.push(newSet);
            }

            // Count repetitions of each item
            const itemCounts = items.reduce((counts, item) => {
                counts[item.id] = 0;
                return counts;
            }, {});

            sets.forEach((set) => {
                set.forEach((item) => {
                    itemCounts[item.id]++;
                });
            }); 
            if(!isBreak){
                console.log("Item Counts",itemCounts)
                //console.log("sets",sets);
                this.schedule = JSON.parse(JSON.stringify(sets))
            } 
               // resolve(JSON.parse(JSON.stringify(sets)))
            //})       
        }

    }
}