let _ = require('lodash')
export default {
    watch : {
        'data.form.selected'(val){
            this.data.choices.map((c)=>{
                if(c.wc){
                    if(c.value != val){
                        c.wc.input = ""
                        c.wc.RTs = ""
                    }
                }
            })
        },
        'data.choices':{
            handler(){
                if(this.data.setup.selectMultiple == 1){
                    this.data.choices.map((c)=>{
                        if(c.wc){
                            if(!c.checked){
                                c.wc.input = ""
                                c.wc.RTs = ""
                            }
                        }
                    })
                }
            },
            deep : true
        },
    },
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
        _onSelect(choice){
            this._unSelectAll(choice)
            this._selectAll(choice)           
        },
        _unSelectAll(choice){
            if(!choice.checked){
                return false
            }

            // When paginated, limit unselect logic to currently visible choices
            const scopeChoices = (typeof this._hasPagination === 'function' && this._hasPagination())
                ? (this.displayedChoices || [])
                : (this.data.choices || [])

            let targetLoc = _.indexOf(this.data.setup.unSelectAll,choice.order)
            if(targetLoc >= 0){
                scopeChoices.map((c)=>{
                    if(c.order != choice.order){
                        c.checked = false
                    }
                })
            }else{
                this.data.setup.unSelectAll.map((unselect)=>{
                    scopeChoices.map((c)=>{
                        if(c.order == unselect){
                            c.checked = false
                        }
                    })
                })
            }
        },
        _selectAll(choice){
            // When paginated, limit select-all logic to currently visible choices
            const scopeChoices = (typeof this._hasPagination === 'function' && this._hasPagination())
                ? (this.displayedChoices || [])
                : (this.data.choices || [])

            let targetLoc = _.indexOf(this.data.setup.selectAll,choice.order)
            if(targetLoc >= 0){
                scopeChoices.map((c)=>{
                    if(c.order != choice.order)
                        c.checked = true
                    })
            }else{
                this.data.setup.selectAll.map((select)=>{
                    scopeChoices.map((c)=>{
                        if(c.order == select){
                            c.checked = false
                        }
                    })
                })
            }            
        },  
        _responsive(){
            this.option.minHeight = 0
            this.$nextTick(()=> {
                let x = null
                if(this.data.setup.grid != 1){
                    //RADIO
                    if(this.data.setup.selectMultiple == 0){
                        x = document.querySelectorAll('.dBox[tag="'+this.data.TAG+'"] .dRadio')
                    }else{//CHECKBOX  
                        x = document.querySelectorAll('.dBox[tag="'+this.data.TAG+'"] .dCheckbox')          
                    }

                    for (let i = 0; i < x.length; i++) {
                        
                        if(x[i].querySelector("label").clientHeight > this.option.minHeight){
                            this.option.minHeight = x[i].querySelector("label").clientHeight
                        }
                    }
                }
            })
        }         
    }
}