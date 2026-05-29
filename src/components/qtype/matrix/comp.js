

let _ = require('lodash')
export default {
    watch:{
        'data.show'(t){
            if(t){
                this._oaat_process(this.option.one_at_a_time.currentIndex)
            }
        },
        'data.columns':{
            handler(){
                this._genDomStyle()
            },
            deep : true
        },
        'data.rows':{
            handler(){
                if(this.data.setup.selectMultiple == 1){
                    this.data.rows.forEach((row)=>{
                        let list = row.list.filter((o)=>{
                            return ((typeof(o.wc) == "object") && (o.checked))
                        })
                        if(list.length <= 0){
                            if(row.wc){
                                row.wc.input = ""
                                row.wc.RTs = ""
                            }
                        }
                    })
                }
            },
            deep:true
        }    
    },
    methods : {   
        _genDomStyle(){
            this.$nextTick(()=>{
                let s = this.data.columns.filter((v)=>{
                    return v.show
                })
                let mainwidth = 100
                s.map((v)=>{
                    mainwidth -= parseInt(v.style.width) 
                })
                if(mainwidth != 100){
                  this.mainHeaderStyle = {width:mainwidth+'%'}
                }
            })
            
        },
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
        _oaat_process(i = 0,type = "next"){
            if(i == null){
                i = 0
            }
            if(!this.option.one_at_a_time.enable){
                return
            }
            //Current Row
            let target = this.data.rows[i]
            
            /* Check if end */
            if(typeof(target) == "undefined"){
                if(type == "next"){
                    this._next()
                }else{
                    this._prev()
                }     
                return
            }

            this.data.rows.map((v)=>{
                v.oaat_show = false
            })

            if(target.show){
                this.option.one_at_a_time.currentIndex = i
                this.data.rows[i].oaat_show = true
                return
            }
            if(type == "next"){
                this.option.one_at_a_time.currentIndex = i + 1
                this._oaat_process(this.option.one_at_a_time.currentIndex ,"next")
            }else{
                this.option.one_at_a_time.currentIndex = i - 1
                this._oaat_process(this.option.one_at_a_time.currentIndex ,"prev")
            }         
        },
        _validateItem(item){
            return new Promise((resolve)=>{
                console.log(item)
                let res = {
                    status : true,
                    error : null
                }

                

                resolve(res)
            })
        }
    }
}