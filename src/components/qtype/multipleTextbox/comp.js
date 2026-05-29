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
            this.data.items[index].value = ""            
        }

    }
}