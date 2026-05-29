let _ = require('lodash')
export default {
    watch:{
        'data.show'(status){
            if(!status){
                clearInterval(this.timer)
                if(this.showFooter != true) {
                    this._setRandom()                    
                } 
            }
        }
    },
    updated() {
        this.$nextTick(function () {                     
            this._startInterval() 
        })
    },
    methods : { 
        _startInterval() {
            if(this.showFooter != true) {
                var len = this.data.items.length     
                // this.imgInd = 0  
                // this.showFooter = false        

                this.timer = setInterval(() => {
                    if(this.imgInd < len-1) {
                        this.imgInd += 1
                    } else {
                        this.showFooter = true
                        clearInterval(this.timer)
                        this.timer = null
                    }   
                }, this.data.setup.interval)
            }              
        },   
        _currentImg: function(ind) {
            return this.data.items[ind].name
        },
        _setRandom() {
            var len = this.data.items.length
            if(this.data.setup.random) {
                for(var i = 0; i < len; i++) {
                    this.shuffleIndex.push(i)
                }
                var sh = _.shuffle(this.shuffleIndex)

                while(_.isEqual(this.shuffleIndex, sh)) {
                    sh = _.shuffle(this.shuffleIndex)
                }
                this.shuffleIndex = sh
            } else {
                for(var j = 0; j < len; j++) {
                    this.shuffleIndex.push(j)
                }
            }
        },   
    }
}