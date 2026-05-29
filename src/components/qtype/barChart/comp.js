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
                let newVal = parseFloat(obj.form.input) + diff
                if(newVal < 0){
                    newVal = 0
                }
                obj.form.input = newVal 
            }
            this.total = this._getTotal()
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
                this.series[0].data = []
                this.chartOptions.xaxis.categories = []

                this.data.items.map((v)=>{
                    this.series[0].data.push(
                        {
                            x : v.name,
                            y : parseFloat(v.form.input),
                            fillColor : v.color
                    })

                })

               this.$nextTick(()=>{
                    this.$refs.chart.reflow();
               })


                

        },
        _responsive(){
             this.$refs.chart?.reflow();
        }   
    }
}