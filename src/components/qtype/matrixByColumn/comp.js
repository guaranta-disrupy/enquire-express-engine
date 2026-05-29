

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
        _onSelect(obj){
            this._unSelectAllRowData(obj)
            this._selectAllRowData(obj)
        },
        _unSelectAllRowData(obj){
            if(!obj.column.checked){
                return false
            }
            let columnIndex = _.indexOf(this.data.setup.unSelectAll,obj.column.order)
            if(columnIndex >= 0){
                obj.row.list.map((c)=>{
                    if(c.order != obj.column.order)
                        c.checked = false
                })
            }else{
                this.data.setup.unSelectAll.map((unselect)=>{
                    let rowIndex = _.findIndex(obj.row.list,{order:unselect})
                    if(rowIndex >= 0){
                        obj.row.list[rowIndex].checked = false
                    }
                })
            }

        },
        _selectAllRowData(obj){
            let columnIndex = _.indexOf(this.data.setup.selectAll,obj.column.order)
            if(columnIndex >= 0){
                obj.row.list.map((c)=>{
                    if(c.order != obj.column.order)
                        c.checked = true
                })
            }else{
                this.data.setup.selectAll.map((select)=>{
                    let rowIndex = _.findIndex(obj.row.list,{order:select})
                    if(rowIndex >= 0){
                        obj.row.list[rowIndex].checked = false
                    }
                })
            }
        },
        _checkCheckboxWC(row){
            return _.filter(row.list,{checked : true}).length <= 0 
        },
        _responsive(){
            let w = window.innerWidth
            let h = window.innerHeight
            if((w > 700) && (h > 400)){
                this.smallDisplay = false
            }else{
                this.smallDisplay = true
            }
            return true
        }
    }
}