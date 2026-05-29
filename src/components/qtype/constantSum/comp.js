let _ = require('lodash')
export default {
    data(){
        let colors = [
            "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
            "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
            "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800",
            "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#C2185B",
            "#7B1FA2", "#512DA8", "#303F9F", "#0288D1", "#00838F",
            "#388E3C", "#689F38", "#AFB42B", "#F57C00", "#E64A19"
          ];

        return {
            colors : colors
        }
    },
    watch : {
        total(){
            this._genChartData()
        },
        'data.show'(val){
            if(val){
                setTimeout(()=>{
                    this._genChartData()
                },300)
            }
        }

    },
    created() {
        window.addEventListener("resize", this._responsive);
    },
    unmounted() {
        window.removeEventListener("resize", this._responsive);
    },
    mounted(){
        this._responsive()
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
            this.data.items[index].form.input = 0            
        },
        _onInput(obj){
            // Round the current input to integer
            obj.form.input = Math.round(parseFloat(obj.form.input) || 0)
            
            if(this.data.setup.fixedValue != 1){
                this.total = this._getTotal()
                return
            }
            let overall = this.data.setup.validate3.total
            let total = _.sumBy(this.data.items, (o)=>{
                return parseFloat(o.form.input)
            })
            let diff = overall - total
            
            if(diff < 0){
                // Get all other items excluding the current one
                let otherItems = this.data.items.filter((item) => item !== obj)
                let otherItemsTotal = _.sumBy(otherItems, (o) => parseFloat(o.form.input))
                
                if(otherItemsTotal > 0){
                    // Distribute the negative diff proportionally across other items
                    let reductionNeeded = Math.abs(diff)
                    otherItems.forEach((item) => {
                        let itemValue = parseFloat(item.form.input)
                        if(itemValue > 0){
                            // Reduce proportionally based on current value
                            let reduction = (itemValue / otherItemsTotal) * reductionNeeded
                            let newVal = itemValue - reduction
                            if(newVal < 0){
                                newVal = 0
                            }
                            item.form.input = Math.round(newVal)
                        }
                    })
                }

                this.$nextTick(() => {
                    this._genChartData()
                })

            }
            this.total = this._getTotal()
            // Force chart update after all changes

        },
        _onSliderChange(obj){
            setTimeout(()=>{
                this._onInput(obj)
            },100)


        },
        _getTotal(){
            return parseFloat(_.sumBy(this.data.items, (o)=>{
                return parseFloat(o.form.input)
            }).toFixed(2))
        },
        _genChartData(){
                this.series = []
                this.chartOptions.labels = []
                this.chartOptions.colors = []
                let total = this._getTotal()
                if(this.data.setup.fixedValue == 1){
                    
                    let noDataColor = (this.data.setup.chart.noDataColor) ? this.data.setup.chart.noDataColor : "#f1f1f1" 
                    this.series.push(parseFloat(this.data.setup.validate3.total) - total)
                    this.chartOptions.labels.push("No Data")
                    this.chartOptions.colors.push(noDataColor)
                }
                this.data.items.map((v)=>{
                    this.series.push(parseFloat(v.form.input))
                    this.chartOptions.labels.push(v.name)
                    this.chartOptions.colors.push(v.color)
                })
                if(this.data.setup.fixedValue != 1){
                    if(total == 0){
                        this.series.push(1)
                        this.chartOptions.labels.push("No Data")    
                        let noDataColor = (this.data.setup.chart.noDataColor) ? this.data.setup.chart.noDataColor : "#f1f1f1" 
                        this.chartOptions.colors.push(noDataColor)              
                    }
                }

               this.$nextTick(()=>{
                    if(this.$refs.chart){
                        this.$refs.chart.reflow();
                    }
               })


                

        },
        _responsive(){
             this.$refs.chart?.reflow();
        }   
    }
}