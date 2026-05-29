<template >
    <div ref="domSelection">
    <div class="dSelect"  :class="{hasError:hasError}">
        <div class="dMultipleSelectedItems">
            <transition-group name="checkedItems">
            <div class="item" v-for="item in _checked" :key="item.value" @click="_unselect(item)">
                <div class="name" v-html="item.name" :class="{removed:(!item.checked)}"></div>
                <div class="icon">x</div>
            </div>
            </transition-group>
        </div>
        <vue-select  :searchable="true" :clear-on-close="true" :multiple="true" :hide-selected="true" v-model="_selected" :name="name" :options="_options" label-by="name" :close-on-select="true" openDirection="bottom" :placeholder="placeholder" :search-placeholder="setup.searchPlaceholder" @selected="_onSelect($event)" @removed="_unselect($event)" @search:blur="_blur()">
        </vue-select>
    </div>
    </div>
    </template>
    <script>
    let _ = require('lodash')
    import VueSelect from 'vue-next-select'
    
    export default({
       props : ["name","selected","options","placeholder","setup"],
       data(){
         return {
             hasError : false,
         }
       },
       components : {VueSelect},
       emits: ['update:selected'],
       computed:{
           _selected:{
               get(){
                    let data = []
                    this.options.map((o)=>{
                        if(o.checked == true){
                            data.push(o)
                        }
                    })
                    return data
               }
               /*
               set(val){
                    for (var i = 0; i < this.options.length; i++) {
                        let o = this.options[i]
                        let index = val.map(function(e) { return e.TAG; }).indexOf(o.TAG);
                        if(index < 0){
                            o.checked = false
                            o.checkedValue = 0
                            o.selectedTime = null
                        }else{
                            if(!o.checked){
                                o.checked = true
                                o.checkedValue = 1
                                o.selectedTime = new Date()
                            }        
                        }
                    }
                    this.$emit("update:selected", this.options)

               }*/
           },
           _options:{
               get(){
                let obj =  _.filter(this.options,{show:true})
                return obj
               }
           },
           _checked:{
               get(){
                let obj =  _.filter(this.options,{checked:true})
                obj.sort(function(b, a) {
                    var aa = new Date(a.selectedTime),
                        bb = new Date(b.selectedTime);

                    if (aa !== bb) {
                        if (aa > bb) { return 1; }
                        if (aa < bb) { return -1; }
                    }
                    return aa - bb;
                })

                return obj
                
               }
           },
       },
       methods:{
        _unselect(item){
            item.checked = false
            item.checkedValue = 0
            item.selectedTime = null
            
           // setTimeout(()=>{
                this._unSelectAll(item)
                this._selectAll(item)      
                this.$emit("update:selected", this.options) 
                this._blur()
            //},100)

        },
        _onSelect(choice){
            
            choice.checked = true
            choice.checkedValue = 1
            choice.selectedTime = new Date()
            //setTimeout(()=>{
                this._unSelectAll(choice)
                this._selectAll(choice)       
                this.$emit("update:selected", this.options)

                
            //},100)
    
        },
        
        _unSelectAll(choice){
            if(!choice.checked){
                return false
            }
            let obj = this.options
            let targetLoc = _.indexOf(this.setup.unSelectAll,choice.order)
            if(targetLoc >= 0){
                obj.map((c)=>{
                    if(c.order != choice.order){
                        c.checked = false
                    }
                })
            }else{
                this.setup.unSelectAll.map((unselect)=>{
                    let index = _.findIndex(obj,{order:unselect})
                    if(index >= 0){
                        let o = this.options[index]
                        o.checked = false
                    }
                })
            }
           // this.$emit("update:selected", this.options)
        },
        _selectAll(choice){
            let targetLoc = _.indexOf(this.setup.selectAll,choice.order)
            if(targetLoc >= 0){
                this.options.map((c)=>{
                    if(c.order != choice.order)
                        c.checked = true
                    })
            }else{
                this.setup.selectAll.map((select)=>{
                    let index = _.findIndex(this.options,{order:select})
                    if(index >= 0){
                        let o = this.options[index]
                        o.checked = false
                    }
                })
            }   
           // this.$emit("update:selected", this.options)         
        },  
        _blur(){
            this.$nextTick(()=>{
                let selected = this.$refs['domSelection'].querySelector(".vue-select").getAttribute("data-selected-length")
                if(selected > 0){
                    let txt = (this.setup?.selectedPlaceholder) ? this.setup.selectedPlaceholder : "selected";
                    this.$refs['domSelection'].querySelector("input").setAttribute("placeholder",selected+" "+txt)
                }
            })
        }
        
       }
    
    })
    </script>