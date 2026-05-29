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
                let primeDom = this.elem.box.querySelector(".prime")
                this.elem.prime = primeDom
                primeDom.onmousedown = ()=>{ this._onDragStart() }
                primeDom.ontouchstart =  ()=>{ this._onDragStart() }
            })
        },
        _onDragStart(e){
            e = e || window.event;
            e.preventDefault();
            let primeDom = this.elem.box.querySelector(".prime")
            primeDom.classList.add("dragging")
            // get the mouse cursor position at startup:
            if(!e.touches){
                this.pos.p3 = e.clientX;
                this.pos.p4 = e.clientY;
            }else{
                this.pos.p3 = e.touches[0].clientX;
                this.pos.p4 = e.touches[0].clientY;               
            }
            document.onmouseup = ()=>{this._onDrop();}
            document.ontouchend = ()=>{this._onDrop();}
            // call a function whenever the cursor moves:
            //document.onmousemove = this._elemDrag();   
            document.onmousemove = ()=>{this._setDragPos();}  
            document.ontouchmove = ()=>{this._setDragPos();} 
                  
        },
        _onDrop(){
            /* stop moving when mouse button is released:*/
            let primeDom = this.elem.box.querySelector(".prime")
            primeDom.classList.remove("dragging")
            document.onmouseup = null;
            document.onmousemove = null;     
            document.ontouchend = null;
            document.ontouchmove = null;
            if(!this.elem.target){
                    primeDom.classList.add("reset")
                    primeDom.style.top = "50%";
                    primeDom.style.left = "50%";
                    setTimeout(()=>{
                        primeDom.classList.remove("reset")
                    },300)
            }else{
                alert("Drop")
                primeDom.classList.add("dropped")
            }
        },
        _setDragPos(e){
            e = e || window.event;
            
            let zoomScale = this.zoomScale;
            let elmnt = this.elem.box.querySelector(".prime")
            // calculate the new cursor position:

            let pos = this.pos;
            if(!e.touches){
                e.preventDefault();
                pos.p1 = (pos.p3 - e.clientX) / zoomScale;
                pos.p2 = (pos.p4 - e.clientY) / zoomScale;
                pos.p3 = e.clientX;
                pos.p4 = e.clientY;
                //console.log(document.elementFromPoint(e.clientX, e.clientY));
                this._setHoverTarget(e.clientX, e.clientY);

            }else{
                pos.p1 = (pos.p3 -  e.touches[0].clientX) / zoomScale;
                pos.p2 = (pos.p4 -  e.touches[0].clientY) / zoomScale;    
                pos.p3 =  e.touches[0].clientX;
                pos.p4 =  e.touches[0].clientY;   
                //console.log(document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)); 
                this._setHoverTarget(e.touches[0].clientX, e.touches[0].clientY);         
            }

            // set the element's new position:  
            //let magicNum = document

            let offsetTop =  (elmnt.offsetTop - pos.p2);
            let offsetLeft = (elmnt.offsetLeft - pos.p1);
            elmnt.style.top = offsetTop + "px";
            elmnt.style.left = offsetLeft + "px";
        },
        _setHoverTarget(x,y){
            let primeDom = this.elem.box.querySelector(".prime")
            let target = document.elementFromPoint(x, y);
            this.elem.box.querySelectorAll(".targets .target").forEach((i)=>{
                i.classList.remove("active");
            })
            if(target.classList.contains('target')){
                target.classList.add("active");
                primeDom.classList.add("readyToDrop")
                this.elem.target = target
            }else{
                primeDom.classList.remove("readyToDrop")
                this.elem.target = null
            }
        },
        _responsive(){
            let $targets = document.querySelectorAll(".fastBox .targets > .target");
            //this.$nextTick(()=>{
            
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

           // })

        }

    }
}