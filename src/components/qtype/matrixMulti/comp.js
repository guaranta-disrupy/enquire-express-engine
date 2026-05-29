let _ = require('lodash')
export default {
    methods : {     
        _reset(){
            this._show_columns()
            this._show_rows() 
        },
        _hide_columns(list){
   
            list.map((c)=>{
                this._hideColumn(c)
            })
        },
        _hide_rows(list){
            //console.log(list)
            //console.log('hide_row')
            list.map((r)=>{
                this._hideRow(r)
            })
        },
        _show_columns(){
            this.data.columns.map((c)=>{
                c.show = true
            })
        },
        _show_rows(){
            this.data.rows.map((c)=>{
                c.show = true
            })
        }, 
        _checkShowColumn(col){
            let c = _.find(this.data.columns,{'order':col.order})
            return c.show
        },
        _checkShowColumnLength(){
            let list = _.filter(this.data.columns,{'show':true})
            return list.length
        },
        _hideColumn(order){
            let index = _.findIndex(this.data.columns,{"order":order})
            this.data.columns[index].show = false
        },
        _hideRow(order){
            let index = _.findIndex(this.data.rows,{"order":order})
            this.data.rows[index].show = false
            this.data.rows[index].form.selected = "" 
            this.data.rows[index].list.map((v)=>{
                v['checked'] = false
                v['checkedVal'] = 0             
            })   
        },
        _showColumn(order){
            let index = _.findIndex(this.data.columns,{"order":order})
            this.data.columns[index].show = true
        },
        _showRow(order){
            let index = _.findIndex(this.data.rows,{"order":order})
            this.data.rows[index].show = true            
        },
     
    }
}