// function printMousePos(event) {
//     alert(
//       "clientX: " + event.clientX +
//       " - clientY: " + event.clientY)
//   }
//   document.addEventListener("click", printMousePos);

let _ = require('lodash')
export default {
    data(){
        return {
            gameFrame : {
                show : false,
                state : 0
            },
            resizeTimer : 0,
            resizing : false,
            defaultColors : [
                ["#00ac00"],
                ["#00ac00","#f73b3b"],
                ["#00ac00","#ff9d2e","#f73b3b"],
                ["#00ac00","#5ee25e","#ff5b5b","#f73b3b"],
                ["#00ac00","#5ee25e","#ff9d2e","#ff5b5b","#f73b3b"],
                ["#00ac00","#00b5fa","#ff9d2e","#fa4e00","#fd4674","#4c367f"],
                ["#00ac00","#00b5fa","#ff9d2e","#fa4e00","#fd4674","#880e4f","#4c367f"],
                ["#00ac00","#00b5fa","#ff9d2e","#fa4e00","#fd4674","#880e4f","#4c367f","#151b5b"],
            ]
        }
    },
    watch:{
        'gameFrame.show'(){
            this._responsive()
        },
        'data.show'(s){
             if(s){
                if(this.data.setup.hideQuestionFrame){
                    this._start()
                }
             }
        }
    },
    methods : {
        _displayEQ(w){
            if(!Object.hasOwn(this.current.prime,"equivalent")){
                Object.assign(this.current.prime,{"equivalent":""});
            }
            w = w.split("@label").join(this.current.prime?.label ?? '').trim().replace(/<\/?p>/g, ' ')
            return w.split("[EQ]").join(this.current.prime.equivalent);
        },
        _show_items(){
            this.data.items.map((i)=>{
                i.show = true
            }) 
        },
        _hide_items(items){
            
            items.map((i)=>{
                this._hideItem(i)
            })
        },
        _hideItem(item){
            
            let index = _.findIndex(this.data.items,{order:item})
            this.data.items[index].show = false
            this.data.items[index].form.obj = ''      
        },
        _gameFrameAnimationState(animation){
             let process = null
             switch(animation){
                case "show":
                    process = new Promise((resolve)=>{
                        this.gameFrame.show = true
                        this.gameFrame.state = 1
                        setTimeout(()=>{
                            resolve()
                        },500)
                    })
                break;
                case "hide":
                    process = new Promise((resolve)=>{
                        this.gameFrame.show = false
                        this.data.show = false
                        setTimeout(()=>{  
                            resolve()
                        },500)
                    })

                break;

             }
             return process
        },
        _responsive(){
            if (this.resizeTimer){
                this.resizing = true
                clearTimeout(this.resizeTimer);
            }
            //console.log(this.resizing)
            this.resizeTimer = setTimeout(()=>{
                //console.log(this.resizeTimer)
                this.resizing = false
                //console.log(this.resizing)
                this._fixTargetElement()
            },500)
        },
        _fixTargetElement(){
            let objs = [];
            let header = this.$refs['parentElem'].querySelector(".question-btn-rating")
            let footer = this.$refs['parentElem'].querySelector(".question-btn-rating-footer")

            let primeElem = this.$refs['parentElem'].querySelector(".choices > .content > .primeBox")
            let targetElem = this.$refs['parentElem'].querySelector(".choices > .content > .targetList")
            
            let headerFix = this._getObjectPostion(header)
                headerFix.top = headerFix.target.offsetTop - headerFix.target.offsetHeight
                objs.push(headerFix)

            let footerFix = this._getObjectPostion(footer)
               // footerFix.bottom = footerFix.target.offsetBottom + footerFix.target.offsetHeight
              footerFix.bottom = footerFix.target.offsetTop + (footerFix.target.offsetHeight)
                objs.push(footerFix)

            
            objs.push(this._getObjectPostion(primeElem))

            targetElem.querySelectorAll(".targetBox").forEach((v)=>{
                objs.push(this._getObjectPostion(v))
            })

            this._ratioFixer(objs)
        },
        _getObjectPostion(obj){
            let pos = {
                target : obj,
                left:obj.getBoundingClientRect().left,
                right:obj.getBoundingClientRect().left + obj.offsetWidth,
                top : obj.offsetTop - (obj.offsetHeight / 2),
                bottom : obj.offsetTop + (obj.offsetHeight / 2),
            }
            return pos
        },
        _ratioFixer(objs){

                let scale = 1
                //X
                let scaleX = 1
                var minValue = Math.min.apply(Math, objs.map(function (o) {
                    return o.left;
                 }))
                 var maxValue = Math.max.apply(Math, objs.map(function (o) {
                    return o.right;
                 }))
                 let objXRange = maxValue
                 if(minValue < 0){
                    objXRange += Math.abs(minValue)
                 }
                 
                 if(objXRange > window.innerWidth){
                    let pass = false             
                    while(!pass){
                        scaleX -= .1
                        if((objXRange * scaleX) < window.innerWidth){
                           pass = true 
                        }
                    }
                 }

                 //Y
                 let scaleY = 1
                 var minValueY = Math.min.apply(Math, objs.map(function (o) {
                    return o.top;
                 }))
                 var maxValueY = Math.max.apply(Math, objs.map(function (o) {
                    return o.bottom;
                 }))

                 let objYRange = maxValueY
                 let topY = 0

                 if(minValueY < 0){
                    objYRange += (Math.abs(minValueY))
                    topY = (Math.abs(minValueY))
                 }

                 console.log(objYRange+"="+window.innerHeight)
                 if(objYRange > window.innerHeight){
                    console.log("resizing...")
                    let pass = false
                    
                    while(!pass){
                        scaleY -= .1
                        if((objYRange * scaleY) < window.innerHeight){
                           pass = true 
                        }
                    }
                 }
                 console.log(scaleY)
                 
                scale = Math.min.apply(Math, [{s:scaleX},{s:scaleY}].map(function (o) {
                    return o.s;
                 }))       

                 topY = topY * scale;

                 this.$refs['parentElem'].querySelector(".choices > .content").style.transform = "scale("+scale+")"
                 this.$refs['parentElem'].querySelector(".choices > .content").style.top = topY+"px";
                //  this.$refs['parentElem'].querySelector(".choices > .content").style.transformOrigin = "center top";
                 
        },
        _getStimatedWidth(){

        }
    }
}