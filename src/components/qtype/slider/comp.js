let _ = require('lodash')
export default {
    watch : {
        'data.items':{
            handler(){
                this.$nextTick(()=>{
                    this.data.items.forEach((item)=>{
                        if(typeof(item.wc) != 'undefined'){
                            if(item.form.selectedObj != null){
                                item.wc.disabled = false
                            }else{
                                item.wc.disabled = true
                            }
                        }
                    })
                })
            },
            deep : true
        }
    },
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
            //console.log(i)
            if(!this.option.one_at_a_time.enable){
                return
            }
            let target = this.data.items[i]
            if(typeof(target) == "undefined"){
                if(type == "next"){
                    //console.log(type,target)
                    //console.log(this.$parent)
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
                //this.option.one_at_a_time.currentIndex = i + 1
            }else{
                this._oaat_process(i - 1,"prev")
                //this.option.one_at_a_time.currentIndex = i - 1
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
                                message:this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg,
                            }
                        }
                        if(item.form.selectedObj != null){
                            let wc_res = this._validateItemWC(item)
                            if(!wc_res.status){
                                res.status = false
                                res.error = this.$parent.project.setup.messages.required_warning || wc_res.error                                   
                            }
                        }                        
                    }
                    else{
                        if(item.form.selectedObj != null){
                            let wc_res = this._validateItemWC(item)
                            if(!wc_res.status){
                                res.status = false
                                res.error = this.$parent.project.setup.messages.required_warning || wc_res.error                             
                            }
                        }
                    }
                }
                resolve(res)
            })
        },
        _validateItemWC(item){
             let res = {
                 status : true,
                 error : null
             }
            if(typeof(item.wc) == "object"){
                let valid = this.$refs[item.wc.TAG]._validate()
                if(!valid.status){
                    res.status = false
                    res.error = {
                        dom : document.querySelector(".dRow[tag='"+item.TAG+"']"),
                        target:item.TAG,
                        message:valid.message,                        
                    }
                }
            }  
            return res
        }
    }
}