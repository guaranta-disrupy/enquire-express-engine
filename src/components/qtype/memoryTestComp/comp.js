let _ = require('lodash')
export default {
    updated() {
        this.$nextTick(function () {  
            this._start()
        })
    },
    watch: {
        'data.show'(status) {
            if(!status) {
                this._stop()
                this._reset()                   
                if(this.counter != 1) {
                    this._setRandom()                    
                }     
            }
        }
    },
    methods : {  
        _resetSelected() {
            this.isSelected1 = false
            this.isSelected2 = false
        },         
        _clearTimer2() {
            this._stop()            
            this.reactionTime.push(this.elapsedTime)
            this._reset()
        },
        _addSelected(num) {
            if(this.counter != 1) {
                if(num == 1) {
                    this.isSelected1 = true
                    this.isSelected2 = false
                    this.data.item1[this.shuffleIndex[this.imgInd]].checked = true
                    this.data.item2[this.shuffleIndex[this.imgInd]].checked = false 
                    this.data.item1[this.shuffleIndex[this.imgInd]]["reactionTime"] = this.elapsedTime
                    this.data.item2[this.shuffleIndex[this.imgInd]]["reactionTime"] = null  
                    this._clearTimer2()                  
                }
                else {
                    this.isSelected2 = true
                    this.isSelected1 = false
                    this.data.item2[this.shuffleIndex[this.imgInd]].checked = true
                    this.data.item1[this.shuffleIndex[this.imgInd]].checked = false
                    this.data.item2[this.shuffleIndex[this.imgInd]]["reactionTime"] = this.elapsedTime
                    this.data.item1[this.shuffleIndex[this.imgInd]]["reactionTime"] = null
                    this._clearTimer2()
                }
                var len = this.data.item1.length 
                setTimeout(() => {
                    if(this.imgInd < len-1) {
                        this._resetSelected() 
                        this.imgInd += 1
                        this._start()                                                     
                    } else {
                        this.showFooter = true
                        this.counter = 1
                        this.reactionTimer = null
                    }   
                }, 100) 
            }       

        },
        _start() {
            if(this.counter != 1) {
                this.startTime = Date.now()
                this.reactionTimer = setInterval(() => {
                    var dTime = Date.now() - this.startTime
                    this.elapsedTime = (dTime / 1000).toFixed(3)
                }, 100)
            }            
        },
        _stop() {
            clearInterval(this.reactionTimer)
            this.startTime = null
        },
        _reset() {
            this.elapsedTime = 0
        },
        _currentImg1: function(ind) {
            return this.data.item1[ind].name
        },
        _currentImg2: function(ind) {
            return this.data.item2[ind].name
        },
        _setRandom() {
            var len = this.data.item1.length
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
    },
}