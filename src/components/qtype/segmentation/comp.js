let _ = require('lodash')
export default {
    methods : {      
        _reset(){
            this._show_items()
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
            this.data.items[index].form.selected = this.data.setup.default      
            this.data.items[index].form.selected = null
        },
        _oaat_process(i = 0,type = "next"){
            if(!this.option.one_at_a_time.enable){
                return
            }
            let target = this.data.items[i]
            if(typeof(target) == "undefined"){
 
                if(type == "next"){
                    this._next()
                }else{
                    this._prev()
                }     
                return
            }
            this.data.items.map((v)=>{
                v.oaat_show = false
            })
            if(target.show){
                this.option.one_at_a_time.currentIndex = i
                this.data.items[i].oaat_show = true
                return
            }
            if(type == "next"){
                this._oaat_process(i + 1,"next")
            }else{
                this._oaat_process(i - 1,"prev")
            }         
        },
        _validateItem(item){
            return new Promise((resolve)=>{
                let res = {
                    status : true,
                    error : null
                }

                if(item.show){
                    if(item.optional != 1){
                        let active = _.find(item.values,{active:true})
                        if(!active){
                            res.status = false
                            res.error = {
                                dom : document.querySelector(".dRow[tag='"+item.TAG+"']"),
                                target:item.TAG,
                                message: this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg,
                            }
                        }                   
                    }
                }
                resolve(res)
            })
        }
    }
}