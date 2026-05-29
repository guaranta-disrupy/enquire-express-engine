export default {
    data(){
        return {
            elem : {
                box : null,
                target : null,
                prime : null
            },
            pos : {
                p1 : 0,
                p2 : 0,
                p3 : 0,
                p4 : 0,
            },
            zoomScale : 1,
            responsiveTime : null
        }
    },
    watch : {
        'data.show'(s){
            if(s){
                this.$nextTick(()=>{
                    document.querySelector(".dExpressBody").classList.add("full")
                    document.body.classList.add("lock")
                    this.elem.box = document.querySelector(".dBox[tag='"+this.data.TAG+"']")
                    this._onDrag();
                    setTimeout(()=>{
                        window.onresize = ()=>{
                            this._responsive();
                        }
                        this._responsive();
                    },500)
                })
            }else{
                document.querySelector(".dExpressBody").classList.remove("full")
                document.body.classList.remove("lock")
            }
        }
    },
    methods : {      
        _onDrag(){
            this.pos = {
                p1 : 0,
                p2 : 0,
                p3 : 0,
                p4 : 0,
            }
            this.$nextTick(()=>{
                this.elem.box.querySelectorAll(".targets .target").forEach((targetDom)=>{
                    targetDom.onmousedown = ()=>{ this._onDragStart(targetDom) }
                    targetDom.ontouchstart =  ()=>{ this._onDragStart(targetDom) }
                })
            })
        },
        _onDragStart(targetDom,e){
            e = e || window.event;
            e.preventDefault();
            targetDom.classList.add("dragging")
            // get the mouse cursor position at startup:
            if(!e.touches){
                this.pos.p3 = e.clientX;
                this.pos.p4 = e.clientY;
            }else{
                this.pos.p3 = e.touches[0].clientX;
                this.pos.p4 = e.touches[0].clientY;               
            }
            document.onmouseup = ()=>{this._onDrop(targetDom);}
            document.ontouchend = ()=>{this._onDrop(targetDom);}
            // call a function whenever the cursor moves:
            //document.onmousemove = this._elemDrag();   
            document.onmousemove = ()=>{this._setDragPos(targetDom);}  
            document.ontouchmove = ()=>{this._setDragPos(targetDom);} 
                  
        },
        _onDrop(targetDom){
            /* stop moving when mouse button is released:*/
            //let targetDom = this.elem.box.querySelector(".target")
            targetDom.classList.remove("dragging")
            document.onmouseup = null;
            document.onmousemove = null;     
            document.ontouchend = null;
            document.ontouchmove = null;

            console.log(this.elem.prime)
            if(!this.elem.prime){
                    targetDom.classList.add("reset")
                    targetDom.style.top = "50%";
                    targetDom.style.left = "50%";
                    setTimeout(()=>{
                        targetDom.classList.remove("reset")
                    },300)
            }else{
                targetDom.classList.add("dropped")
            }
        },
        _setDragPos(elmnt,e){
            e = e || window.event;
            
            let zoomScale = this.zoomScale;
            //let elmnt = this.elem.box.querySelector(".target")
            // calculate the new cursor position:

            let pos = this.pos;
            if(!e.touches){
                e.preventDefault();
                pos.p1 = (pos.p3 - e.clientX) / zoomScale;
                pos.p2 = (pos.p4 - e.clientY) / zoomScale;
                pos.p3 = e.clientX;
                pos.p4 = e.clientY;
                this._setHoverTarget(elmnt,e.clientX, e.clientY);

            }else{
                pos.p1 = (pos.p3 -  e.touches[0].clientX) / zoomScale;
                pos.p2 = (pos.p4 -  e.touches[0].clientY) / zoomScale;    
                pos.p3 =  e.touches[0].clientX;
                pos.p4 =  e.touches[0].clientY;   
                this._setHoverTarget(elmnt,e.touches[0].clientX, e.touches[0].clientY);         
            }

            // set the element's new position:  
            let offsetTop =  (elmnt.offsetTop - pos.p2);
            let offsetLeft = (elmnt.offsetLeft - pos.p1);
            elmnt.style.top = offsetTop + "px";
            elmnt.style.left = offsetLeft + "px";
        },
        _setHoverTarget(targetDom,x,y){
            let target = document.elementFromPoint(x, y);
            // this.elem.box.querySelectorAll(".targets .target").forEach((i)=>{
            //     i.classList.remove("active");
            // })
            if(target.classList.contains('prime')){
                target.classList.add("active");
                targetDom.classList.add("readyToDrop")
                this.elem.prime = target
            }else{
                targetDom.classList.remove("readyToDrop")
                this.elem.prime = null
            }
        },
        _responsive(){
            let $targets = document.querySelectorAll(".fastBox .targets > .target");
            
                this.zoomScale = 1;
                clearTimeout(this.responsiveTime);
                this.responsiveTime = setTimeout(()=>{
                    let least = 0
                    $targets.forEach((t)=>{
                            let start = t.getBoundingClientRect().x 
                            let end = window.outerWidth - (t.getBoundingClientRect().x + t.getBoundingClientRect().width)
                            if(start < 0 || end < 0){   
                                if(start < least){
                                    least = start
                                }
                                if(end < least){
                                    least = end
                                }
                            }
                    })
    
                    if(least < 0){
                        let perScale = (window.outerWidth / 100) / 2
                        let diff = (Math.abs(least) / perScale) / 100
                        this.zoomScale = 1 - diff;
                    }else{
                        this.zoomScale = 1;
                    }
                },300)

        }

    }
}