<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="constantSum" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0),
            noChart:(data.setup.chart.enable != 1),
            noSlider:(data.setup.enableSlider != 1)
        }">
            <div class="body">
                <div class="question" v-html="
                    _textReplacer(_pipeText(data.question),{
                        '@min':data.setup.validate2.minValue,
                        '@total':data.setup.validate3.total            
                    })"></div>
                <div class="choices">
                    <div class="content">
                        <div class="section">
                         <table class="dConstantSumTbl">
                             <template v-for="obj in data.items" :key="obj.order">
                             <tr v-show="obj.show">
                                <td class="info">
                                    <div class="color" :style="{background:obj.color}"></div>
                                    <div class="name" v-html="_pipeText(obj.name)"></div>
                                </td>
                                <td v-show="data.setup.enableSlider == 1">
                                    <Slider 

                                    :style="{
                                        '--slider-connect-bg':obj.color,
                                        '--slider-handle-ring-color': obj.color
                                    }"
                                    :ref="'sldr_'+obj.TAG" v-model="obj.form.input" :step="steps" :min="data.setup.range.min" :max="data.setup.range.max" :tooltips="false" @change="_onSliderChange(obj)"/>
                                    <!-- <formSliderbox></formSliderbox> -->
                                </td>
                                <td>
                                    <div>
                                        <div class="prefix" v-html="data.setup.prefix" ></div>
                                        <div class="dInput">
                                            <input type="number" 
                                            min=0
                                            :name="obj.TAG" 
                                            v-model="obj.form.input" 
                                            @input="_onInput(obj)" 
                                            autocomplete="off" 
                                            @focus="$event.target.select()"
                                            @blur="($event)=>{if(!$event.target.value.trim()){obj.form.input = 0}}"
                                            />
                                        </div>
                                        <div class="suffix" v-html="data.setup.suffix"></div>     
                                    </div>                             
                                </td>
                             </tr>
                             </template>
                             <tr>
                                 <td colspan="3" v-if="data.setup.totalLabel.enable == 1" :set="TotalCount=_getTotal()">
                                     <div class="total"><span v-html="data.setup.totalLabel.text"></span> : {{data.setup.prefix}} {{TotalCount}}{{data.setup.suffix}}</div>
                                 </td>
                             </tr>
                         </table>
                        </div>
                        <div class="section" v-show="data.setup.chart.enable == 1">
                            <apexchart ref="chart" type="pie" :options="chartOptions" :series="series"></apexchart>
                        </div>
                    </div>
                </div>
                <validateMsg ref="validateMsg"></validateMsg>
                <qfooter ref="footer"></qfooter>
            </div>
        </div>
        </template>
    </div>
    </transition>
</template>
<script>
let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import qfooter from '@/components/qfooter'

import validateMsg from '@/components/validateMsg'
import Slider from '@vueform/slider'
import helper from '@/js/helper'
// import formSliderbox from '@/components/forms/sliderbox'

//import VueApexCharts from "vue3-apexcharts";
import VueApexCharts from "@/js/plugin/apexcharts.js";

export default {
    components: { qfooter, validateMsg, Slider, apexchart: VueApexCharts },
    data(){
        return {
            data : null,
            total : 0,
            steps : 1,
            //     chart: {
            //         type: 'pie',
            //         width:500,
            //         height:300,
            //         backgroundColor: 'rgba(255, 255, 255, 0.0)',
            //         plotBackgroundColor: null,
            //         plotBorderWidth: null,
            //         plotShadow: false,

            //     },
            //     title: {
            //         text: ''
            //     },
            //     credits: {
            //         enabled: false
            //     },
            //     tooltip: {
            //         useHTML: true,
            //         formatter:  function(){
            //             let prefix = (this.point.prefix != null) ? this.point.prefix : ""
            //             let suffix = (this.point.suffix != null) ? this.point.suffix : ""
            //             return `<div class="dChartToolTip">
            //                    <div class="body">
            //                      <div class="color" style="background:`+this.point.color+`;"></div>
            //                      <div class="name">`+this.point.name+`</div>
            //                      <div class="value">`+prefix+` `+this.point.y+suffix+`</div>
            //                    </div>
            //                 </div>`;
            //         }
            //     },
            //     plotOptions: {
            //         pie:{
            //             allowPointSelect: true,
            //             cursor: 'pointer',
            //             dataLabels: {
            //                 enabled: false
            //             },
            //             showInLegend: false                    
            //         }
            //     },
            //     series: [
            //         {data: []}
            //     ]
            // },
            series: [],
            chartOptions: {
                    chart: {
                    type: "pie",
                    height: 350,
                    animations: {
                        enabled: true, // Enables animations
                        speed: 800, // Animation speed in milliseconds
                        animateGradually: {
                            enabled: true,
                            delay: 150 // Delay between each slice animation
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350 // Animation speed when data updates
                        }
                    }
                },
                events: {
                    click: function(event) {
                        event.stopPropagation(); // Prevents click events from propagating
                    },
                    dataPointSelection: function(event) {
                        event.stopPropagation(); // Prevents selection clicks
                    }
                },
                labels: [],
                colors: [],
                dataLabels: {
                    enabled: 
                    false, // Disables labels inside the pie slices
                    style: {
                        textShadow: "none" // Removes text shadow
                    }
                },
                legend: {
                    show: false, // Hides the legend
                    style: {
                    textShadow: "none" // Removes text shadow
                    }
                },
                states: {
                    hover: {
                        filter: {
                            type: "none" // Disables hover effects
                        }
                    }
                },
                tooltip: {
                    enabled: true, // Disables tooltips on hover
                    custom: ({series, seriesIndex, dataPointIndex, w})=> {
                        console.log(w)
                        if(w.config.labels[seriesIndex] == "No Data"){
                           w.stopPropagation()
                        }
                        console.log(dataPointIndex)
                        return '<div class="custom_tooltip">' +
                        '<span class="content">' + w.config.labels[seriesIndex] + ' = </span>' +
                        '<span class="value">'+(this.data.setup.prefix || '')+""+ series[seriesIndex]+(this.data.setup.suffix || '')+'</span>' +
                        
                        '</div>'
                    }

                }


            }           
        }
    },
    mixins : [qtypeFunctions,comp,helper],
    props : ["item"],

    mounted(){
        this._initQuestion()
        
    },
    // watch : {
    //     'data.show'(val){
    //         if(val == true){
    //             new ApexCharts(this.$refs.chartContainer, this.chartOptions2).render();
    //         }
    //     }
    // },
    methods:{
        _initQuestion(){
            this.data = this.item

            if(this.data.setup.enableDecimal == 1){
                this.steps = -1
            }

             this.data.items.map((v,k)=>{
                let val = k + 1
                v['TAG'] = this.data.TAG+"_"+val
                v['VAR'] = this.data.VAR+"_"+val 
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['form'] = {
                    input : parseFloat(this.data.setup.range.origin),
                }
                if(!v.color){
                    v['color'] = this.colors[k]
                }
            })

            this.data.items = this._randomList(this.data.items,this.data.setup.randomChoices)
            this.data['response'] = this._initData()
            this._genChartData()
            
        },
        _initData(){
            let data = {}
            this.data.items.map((v)=>{
                let obj = {
                    TAG : v.TAG,
                    VAR : v.VAR,
                    desc : "",
                    text : "",
                    value : "",
                    ref : null
                }
                data[v.TAG] = obj                   
            })
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    this.data.items.map((item)=>{
                        this.data.response[item.TAG]["desc"] = item.name
                        this.data.response[item.TAG]["text"] = this._convertStrToFloat(item.form.input)
                        this.data.response[item.TAG]["value"] = this._convertStrToFloat(item.form.input)
                        this.data.response[item.TAG]["ref"] = item
                    })
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{

                    if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }
                    this.$refs.validateMsg._hide()
                    let items = _.filter(this.data.items,{"show":true})
                    let total = parseFloat(this._getTotal())
                    if(this.data.setup.fixedValue == 1){
                        
                        if(total != parseFloat(this.data.setup.validate3.total)){
                            this.$refs.validateMsg._show(
                                this._textReplacer(this.data.setup.validate3.errorMsg,
                                    {
                                        "@min":parseFloat(this.data.setup.validate2.minValue),
                                        "@total":parseFloat(this.data.setup.validate3.total)
                                    }
                                )
                            )



                            throw this.data.setup.validate3.errorMsg
                        }
                    }
                    // else{

                    // }

                    if(total <= 0){
                        this.$refs.validateMsg._show(this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg)
                        throw this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg                            
                    }
                    items.map((item)=>{
                        let input = parseFloat(item.form.input)
                        if(input < this.data.setup.validate2.minValue){
                            this.$refs.validateMsg._show(
                                this._textReplacer(this.data.setup.validate2.errorMsg,
                                    {
                                        "@min":parseFloat(this.data.setup.validate2.minValue),
                                        "@total":parseFloat(this.data.setup.validate3.total)
                                    }
                                )
                            )
                            throw this.data.setup.validate2.errorMsg                               
                        }
                    })




                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    //skiplogic
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },    
    }
}
</script>
<style scoped>
.dQuestion[qtype='constantSum'] /deep/ .custom_tooltip{
    /* background:blue; */
    padding:1vmin;
}
.dQuestion[qtype='constantSum'] /deep/ .custom_tooltip *{
    font-size: var(--font-xs)!important;
    display:inline-block!important;
    color:white!important;
}
.dQuestion[qtype='constantSum'] /deep/ .custom_tooltip img{
    width: 5vmin!important;
    max-width: 120px!important;
    height: auto!important;
    object-fit: contain!important;
}
.dQuestion[qtype='constantSum'] /deep/ .custom_tooltip .content{
    padding-right:.5vmin;
}
</style>
