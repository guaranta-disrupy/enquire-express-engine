let _ = require('lodash')
export default {
    methods : {    
        _reset(){
            this._show_choices() 
        },
        _hide_choices(choices){
            choices.map((c)=>{
                this._hideChoice(c)
            })
        },
        _show_choices(){
            this.data.choices.map((c)=>{
                c.show = true
            })
        },
        _hideChoice(choiceOrder){
            let index = _.findIndex(this.data.choices,{order:choiceOrder})
            this.data.choices[index].show = false
            this.data.choices[index]['checked'] = false
            this.data.choices[index]['checkedValue'] = 0
            if(this.data.form.selected == this.data.choices[index]['value']){
                this.data.form.selected = null
            }
        }, 
        _numberAppend(num,append = "px"){
            if(!isNaN(num)){
                num = num+append
            }
            return num
        },
        _onSelect(choice){
            console.log("change")
            this._unSelectAll(choice)
            this._selectAll(choice)           
        },
        _unSelectAll(choice){
            if(!choice.checked){
                return false
            }
            let targetLoc = _.indexOf(this.data.setup.unSelectAll,choice.order)
            if(targetLoc >= 0){
                this.data.choices.map((c)=>{
                    if(c.order != choice.order){
                        c.checked = false
                    }
                })
            }else{
                this.data.setup.unSelectAll.map((unselect)=>{
                    let index = _.findIndex(this.data.choices,{order:unselect})
                    if(index >= 0){
                        this.data.choices[index].checked = false
                    }
                })
            }
        },
        _selectAll(choice){
            let targetLoc = _.indexOf(this.data.setup.selectAll,choice.order)
            if(targetLoc >= 0){
                this.data.choices.map((c)=>{
                    if(c.order != choice.order)
                        c.checked = true
                    })
            }else{
                this.data.setup.selectAll.map((select)=>{
                    let index = _.findIndex(this.data.choices,{order:select})
                    if(index >= 0){
                        this.data.choices[index].checked = false
                    }
                })
            }            
        },  
        _responsive(){
            this.option.listView = false
            if(this.data.setup.imageSelection['layout_desktop'] == 2){
                this.option.listView = true
                //return
            }
            if(this.option.layout.size_mobile >= window.innerWidth){
                if(this.data.setup.imageSelection['layout_mobile'] == 2){
                    this.option.listView = true
                    return
                }else{
                    this.option.listView = false
                }
            }

            if(this.option.layout.size_tab >= window.innerWidth){
                if(this.data.setup.imageSelection['layout_tab'] == 2){
                    this.option.listView = true
                    return
                }else{
                    this.option.listView = false
                }
            }


            //this.$nextTick(()=> {
                // let x = document.querySelectorAll('.dBox[tag="'+this.data.TAG+'"] .imageBox')
                // for (let i = 0; i < x.length; i++) {
                //     if(x[i].querySelector("label").clientHeight > this.option.minHeight){
                //         this.option.minHeight = x[i].querySelector("label").clientHeight
                //     }
                // }
            //})
        }
    }
}