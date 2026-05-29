<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
         <template v-if="data">
            <div class="dQuestion" qtype="bestWorstScale" :class="{
              required:false,
              noAsterisk:($parent.project.setup?.display_asterisk == 0)
            }">
                <div class="body">
                    <div class="question" v-html="_pipeText(data.question)"></div>
                    <div class="choices">
                        <div class="content">
                            
                            <template class="group-trial" v-for="(group,k) in schedule" :key="k">
                                <Transition name="bws_animation">
                                <table class="item-trial" v-show="currentTrial === k">
                                    <template v-for="(item,ik) in group" :key="ik">
                                        <tr v-if="ik==0">
                                            <th><div v-html="data.setup.bestWostScale.labelA"></div></th>
                                            <th></th>
                                            <th><div v-html="data.setup.bestWostScale.labelB"></div></th>
                                        </tr>
                                        <tr>
                                            <td :style="{'--radio-selected-color':data.setup.bestWostScale.labelAColor}">
                                                <formRadio 
                                                    ref="choice.TAG" 
                                                    :value=1 
                                                    :name="data.TAG+'_G'+k+'A'" 
                                                    :selected="item.score"
                                                    v-model:checked="item.score" 
                                                    @update:checked="()=> {
                                                        _updateData(item,group)
                                                    }"
                                                    v-show="true"
                                                ></formRadio>
                                            </td>
                                            <td v-html="item.name"></td>
                                            <td :style="{'--radio-selected-color':data.setup.bestWostScale.labelBColor}">
                                                <formRadio 
                                                    ref="choice.TAG" 
                                                    :value=-1
                                                    :name="data.TAG+'_G'+k+'B'" 
                                                    :selected="item.score"
                                                    v-model:checked="item.score"
                                                    @update:checked="()=> {
                                                        _updateData(item,group)
                                                    }"
                                                    v-show="true"
                                                ></formRadio>
                                            </td>
                                        </tr>
                                    </template>
                                </table>
                                </Transition>
                            </template>

                        </div>
                    </div>


                    <qfooter v-show="showFooter" ref="footer"></qfooter>
                    <!-- <qfooter ref="footer"></qfooter> -->
                </div>
            </div>
         </template>
    </div>
    </transition>
</template>
<script>
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import qfooter from '@/components/qfooter'
import formRadio from '@/components/forms/radio'
export default {
    components: {qfooter,formRadio},
    data(){
        return {
            data : null,
            schedule : [],
            currentTrial : 0,
            showFooter : false,
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    mounted(){
        this._initQuestion()
    },
    methods:{
       _initQuestion(){
            this.data = this.item
            let q = this.data
            this.data.choices.map((v,k)=>{
                let key = k + 1
                v['index'] = this._setVariableValue(v['index'],key)
                v['TAG'] = q.TAG+"_"+v['index']
                v['VAR'] = q.VAR+"_"+v['index']  
                v['show'] = true
            })
            //console.log("test",this.data.choices)
            this.data['response'] = this._initData()
            //this.schedule = await this._scheduler()
            
        },
        _initData(){
            let data = {}
            this.data.choices.map((v)=>{
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
                    //let dimensionListData = []
                    this.schedule.map((v)=>{
                        v.map((item)=>{
                            if(item.score === ''){
                                this.data.response[item.id]["text"] = 0
                                this.data.response[item.id]["value"] = 0
                            }else{
                                if(this.data.response[item.id]["text"] === ''){
                                    this.data.response[item.id]["text"] = 0
                                }
                                if(this.data.response[item.id]["value"] === ''){
                                    this.data.response[item.id]["value"] = 0
                                }
                                this.data.response[item.id]["text"] += parseInt(item.score)
                                this.data.response[item.id]["value"] += parseInt(item.score)
                            }
                            this.data.response[item.id]["desc"] = item.name
                           // dimensionListData[item.dimensionID].push(item.score)
                        })
                    })   
                    // const scoreByDimension = {};
                    // this.schedule.flat().forEach(item => {
                    //     const { dimensionID, score } = item;
                    //     scoreByDimension[dimensionID] = (scoreByDimension[dimensionID] || 0) + score;
                    // });

                    const scoreByDimension = {};
                    this.schedule.flat().forEach(({ dimensionID, dimension, score }) => {
                    if (!scoreByDimension[dimensionID]) {
                        scoreByDimension[dimensionID] = { name: dimension, score: 0 };
                    }
                    scoreByDimension[dimensionID].score += score;
                    });

                    //console.log(scoreByDimension);            


                    Object.keys(scoreByDimension).forEach(key => {
                        let dim = scoreByDimension[key]
                        this.data.response[this.data.TAG+"_D"+key] = {
                            TAG : this.data.TAG+"_D"+key,
                            VAR : this.data.VAR+"_D"+key,
                            desc : dim.name,
                            text : dim.score,
                            value : dim.score
                        }
                    });
                    
                    // console.log("scoreByDimension",scoreByDimension);
                    // console.log("this.schedule",this.schedule)
                    // console.log("this.data.response",this.data.response)
                   // console.log("dimensionListData",dimensionListData)
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    resolve()
            })
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },    
    }
}
</script>

<style lang="css" scoped>
.dQuestion[qtype='bestWorstScale'] .choices > .content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top:2vmin;
}
.dQuestion[qtype='bestWorstScale'] :deep .dRadio > label{
    border:0px;

}
.dQuestion[qtype='bestWorstScale'] :deep .dRadio > label > .inputStyle {
    top: 0vmin;
    display: block;
    margin: auto;
    position:relative;
}

.dQuestion[qtype='bestWorstScale'] :deep .dRadio > label > .txt {
    display: none;
}
.dQuestion[qtype='bestWorstScale'] .item-trial{
    text-align: center;
    border: 1px solid #e9e9e9;
    border-collapse: collapse;
    width:100%;
}
.dQuestion[qtype='bestWorstScale'] .item-trial th{  
    font-size: var(--font-sm);
    font-weight: 500;
    border: 1px solid #e9e9e9;
    background: #f5f5f5;
    padding:1vmin 1vmin;
}
.dQuestion[qtype='bestWorstScale'] .item-trial td{  
    border: 1px solid #e9e9e9;
    padding:1vmin 1vmin;
    font-size: var(--font);
}
.bws_animation-enter-active {
  animation: bws_animation .5s ease-in;
  
}
.bws_animation-leave-active {
  animation: bws_animation-out .5s ease-in;
}
@keyframes bws_animation {
  0% {
    /* position:absolute; */
    opacity:0;
    transform: translateX(100%);
  }
  100% {
    opacity:1;
    transform: translateX(0%);
  }
}

@keyframes bws_animation-out {
  0% {
    opacity:1;
    position:absolute;
    transform: translateX(0%);
    pointer-events: none;
    touch-action: none;
  }
  100% {
    opacity:0;
    position:absolute;
    transform: translateX(-100%);
    pointer-events: none;
    touch-action: none;

  }
}

</style>
