<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" qtype="pairwiseComparison" :style="_boxStyle()">
         <template v-if="data">
            <div class="dQuestion" qtype="pairwiseComparison" :class="{
              required:false,
              noAsterisk:true
            }">
                <div class="body">
                    <div class="question" v-html="_pipeText(data.question)"></div>
                    <div class="choices">
                        <div class="content">
                            
                            <template class="group-trial" v-for="(item,k) in schedule" :key="k">
                                <Transition name="bws_animation">
                                        <div class="pairwiseComparisonItem" :class="[{'isDisabled':disabledItem}]" v-show="currentTrial === k">
                                            <div class="statementBox" data-label="A">
                                                <label v-html="data.setup.labels.statementA"></label>
                                                <button class="statementTarget" :disabled="disabledItem" :class="{'active':(item.selected?.value == item.statement1.value)}" v-html="item.statement1.text" @click="_nextAttr(item.statement1)"></button>
                                            </div>
                                            <div class="lineBox">
                                                <div class="line"></div>
                                            </div>
                                            <div class="statementBox" data-label="B">
                                                <label v-html="data.setup.labels.statementB"></label>
                                                <button class="statementTarget" :disabled="disabledItem" :class="{'active':(item.selected?.value == item.statement2.value)}" v-html="item.statement2.text" @click="_nextAttr(item.statement2)"></button>
                                            </div>
                                        </div>
                                </Transition>
                            </template>
                            <div class="pc_footer" v-html="data.setup.footer"></div>

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
export default {
    components: {qfooter},
    data(){
        return {
            data : null,
            schedule : [],
            currentTrial : null,
            startTime : null,
            showFooter : false,
            disabledItem : true,
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
            this.data.items.map((v)=>{
                // let key = k + 1
                // v['index'] = key
                v['TAG'] = q.TAG+"_T"+v['index']
                v['VAR'] = q.VAR+"_T"+v['index']  
                v['show'] = true


            })
            this.data['response'] = this._initData()    
        },
        _initData(){
            let data = {}
            this.data.items.map((v)=>{
                    let obj = {
                        TAG : v.TAG,
                        VAR : v.VAR,
                        desc : "Trial"+v.index,
                        text : "",
                        value : "",
                        ref : null
                    }
                    data[v.TAG] = obj
                    let objA = {
                        TAG : this.data.TAG+"_"+v.valueA,
                        VAR : this.data.VAR+"_"+v.valueA,
                        desc : v.statementA,
                        text : "",
                        value : "",
                        ref : null
                    } 
                    data[objA.TAG] = objA

                    let objB = {
                        TAG : this.data.TAG+"_"+v.valueB,
                        VAR : this.data.VAR+"_"+v.valueB,
                        desc : v.statementB,
                        text : "",
                        value : "",
                        ref : null
                    } 
                    data[objB.TAG] = objB

                    let objA2 = {
                        TAG : this.data.TAG+"_P"+v.valueA,
                        VAR : this.data.VAR+"_P"+v.valueA,
                        desc : v.statementA,
                        text : "",
                        value : "",
                        ref : null
                    } 
                    data[objA2.TAG] = objA2

                    let objB2 = {
                        TAG : this.data.TAG+"_P"+v.valueB,
                        VAR : this.data.VAR+"_P"+v.valueB,
                        desc : v.statementB,
                        text : "",
                        value : "",
                        ref : null
                    } 
                    data[objB2.TAG] = objB2
            })
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                
                try{
                    this.data['response'] = this._initData()
                    // console.log("RS",this.data['response'])
                    //console.log("SCHEDULE",this.schedule)
                    let itemCount = this._countUniqueValues(this.schedule)
                    //console.log("ITEM COUNT",itemCount)
                    this._generateSetVariables().then(()=>{
                        this.schedule.map((i,k)=>{
                              //console.log(i)
                              if(i.selected){
                                      this.data.response[i.TAG]["text"] = i.selected.text
                                      this.data.response[i.TAG]["value"] = i.selected.value
                                      this.data.response[i.TAG]["display"] = k + 1
                                      this.data.response[i.TAG]["order"] = k + 1
                                      this.data.response[i.TAG]["ref"] = i.selected

                                      if(this.data.response[this.data.TAG+"_"+i.selected.value].value == ""){
                                          this.data.response[this.data.TAG+"_"+i.selected.value].value = 0
                                          this.data.response[this.data.TAG+"_"+i.selected.value].text = 0
                                          this.data.response[this.data.TAG+"_P"+i.selected.value].value = 0
                                          this.data.response[this.data.TAG+"_P"+i.selected.value].text = 0
                                      }
                                      this.data.response[this.data.TAG+"_"+i.selected.value].value += 1
                                      this.data.response[this.data.TAG+"_"+i.selected.value].text += 1

                                      this.data.response[this.data.TAG+"_P"+i.selected.value].value = Math.floor(parseInt(this.data.response[this.data.TAG+"_"+i.selected.value].value) / (itemCount - 1) * 100)
                                      this.data.response[this.data.TAG+"_P"+i.selected.value].text = Math.floor(parseInt(this.data.response[this.data.TAG+"_"+i.selected.value].value) / (itemCount - 1) * 100)

                                      this.data.response[i.TAG+"_rt"] = {
                                          TAG : i.TAG+"_rt",
                                          VAR : i.VAR+"_rt",
                                          value : i.rt,
                                          text : i.rt,
                                          desc : "RT for "+i.VAR,
                                      }

                              }
                      })
                      //console.log("RESPONSE",this.data.response)   
                      resolve()
                    })


                    
                }catch(e){
                    reject()
                }
            })
        },
        _generateSetVariables(){
            return new Promise((resolve)=>{
                this.schedule.map((i)=>{
                      let statement1 = i.statement1
                      let statement2 = i.statement2

                      this.data.response[this.data.TAG+"_"+statement1.value]["text"] = statement1.text
                      this.data.response[this.data.TAG+"_"+statement1.value]["value"] = 0
                      this.data.response[this.data.TAG+"_"+statement1.value]["display"] = null
                      this.data.response[this.data.TAG+"_"+statement1.value]["order"] = null

                      this.data.response[this.data.TAG+"_"+statement2.value]["text"] = statement2.text
                      this.data.response[this.data.TAG+"_"+statement2.value]["value"] = 0
                      this.data.response[this.data.TAG+"_"+statement2.value]["display"] = null
                      this.data.response[this.data.TAG+"_"+statement2.value]["order"] = null

                      this.data.response[this.data.TAG+"_P"+statement1.value]["text"] = statement1.text
                      this.data.response[this.data.TAG+"_P"+statement1.value]["value"] = 0
                      this.data.response[this.data.TAG+"_P"+statement1.value]["display"] = null
                      this.data.response[this.data.TAG+"_P"+statement1.value]["order"] = null

                      this.data.response[this.data.TAG+"_P"+statement2.value]["text"] = statement2.text
                      this.data.response[this.data.TAG+"_P"+statement2.value]["value"] = 0
                      this.data.response[this.data.TAG+"_P"+statement2.value]["display"] = null
                      this.data.response[this.data.TAG+"_P"+statement2.value]["order"] = null
                })
                resolve()
            })
        },
        _countUniqueValues(data){
          const uniqueSet = new Set();
          data.forEach(item => {
            uniqueSet.add(item.statement1.value);
            uniqueSet.add(item.statement2.value);
          });
          return uniqueSet.size;
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



.dQuestion[qtype='pairwiseComparison'] .question{
    text-align: center;
}

.dQuestion[qtype='pairwiseComparison'] .choices > .content{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top:0vmin;
    min-height: 35vmin;
    position: relative;
}

.pairwiseComparisonItem{
    display:grid;
    grid-template-columns: 1fr 6vw 1fr;
    text-align: center;
    margin-top:6vmin;
    justify-content: stretch;
    width: 100%;
    min-height: 25vmin;
    position: relative;
}
.pairwiseComparisonItem .lineBox{
    position:relative;
    width:100%;
    display: flex;
    align-items: center;
    z-index:3;
    animation: lineBoxEnter 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    opacity: 0;
    transform: scaleX(0);
    animation-delay: 0.2s;
}
.pairwiseComparisonItem .line{
    width:100%;
    height: 5px;
    position:absolute;
    background: #808080;
    animation: lineDraw 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: 0.4s;
    transform: scaleX(0);
    transform-origin: center;
}

@keyframes lineBoxEnter {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes lineDraw {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

.pairwiseComparisonItem .line::after{
    content:"";
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent; 
    border-right: 10px solid transparent; 
    border-bottom: 10px solid #808080; 
    transform:rotate(-90deg);
    position: absolute;
    left:-8px;
    top:-2.5px;
}
.pairwiseComparisonItem .line::before{
    content:"";
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent; 
    border-right: 10px solid transparent; 
    border-bottom: 10px solid #808080; 
    transform:rotate(90deg);
    position: absolute;
    right:-8px;
    top:-2.5px;
}
.pairwiseComparisonItem .statementBox{
    position:relative;
    padding:.5vmin;
    z-index:2;
    opacity: 0;
}

.pairwiseComparisonItem .statementBox[data-label="A"] {
    animation: statementBoxSlideFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: 0.3s;
}

.pairwiseComparisonItem .statementBox[data-label="B"] {
    animation: statementBoxSlideFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: 0.3s;
}

@keyframes statementBoxSlideFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-80px) scale(0.95);
  }
  60% {
    opacity: 0.8;
    /* transform: translateX(-10px) scale(0.98); */
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes statementBoxSlideFromRight {
  0% {
    opacity: 0;
    transform: translateX(80px) scale(0.95);
  }
  60% {
    opacity: 0.8;
    /* transform: translateX(10px) scale(0.98); */
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes statementBoxSlideOutLeft {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-80px) scale(0.95);
  }
}

@keyframes statementBoxSlideOutRight {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(80px) scale(0.95);
  }
}
.pairwiseComparisonItem .statementBox > label{
    position: absolute;
    font-size: var(--font-sm);
    top:0px;
    right:0px;
    transform:translateY(-100%);
    font-weight: 700;
    padding:0vmin 1.5vmin;
}
.pairwiseComparisonItem .statementBox[data-label="A"]{
    text-align: right;
}
.pairwiseComparisonItem .statementBox[data-label="B"]{
    text-align: left;
}

.pairwiseComparisonItem .statementBox[data-label="A"] > label{
    position: absolute;
    top:0px;
    left:unset;
    right:0px;
    transform:translateY(-100%);
    width: 100%;
    
}
.pairwiseComparisonItem .statementBox[data-label="B"] > label{
    position: absolute;
    top:0px;
    left:0px;
    right:unset;
    transform:translateY(-100%);
    width: 100%;
}
.pairwiseComparisonItem .statementBox .statementTarget{
    padding:1vmin 1.5vmin;
    border-radius:1vmin;
    cursor:pointer;
    font-size: var(--font-md);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border:.5vmin solid #e1e1e1;
    background-color:rgba(255,255,255,.8);
    height: 100%;
    width: 100%;
    min-width: 20vmin;
    min-height: 20vmin;
    max-width: 450px;
    transform-origin: center center;
    position: relative;
    overflow: hidden;
    color: var(--question-txt-color);
}

.pairwiseComparisonItem:not(.isDisabled) .statementBox .statementTarget:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--ssrcolor4);
}

.pairwiseComparisonItem:not(.isDisabled) .statementBox .statementTarget:active {
    transform: translateY(0) scale(0.98);
    transition: all 0.1s ease-out;
}
 .pairwiseComparisonItem .statementBox[data-label="A"] .statementTarget.active{
    transform: scale(1.05);
    background-color: var(--ssrcolor4)!important;
    color: white;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: var(--ssrcolor4);
    animation: activePulse 0.6s ease-out;
}

 .pairwiseComparisonItem .statementBox[data-label="B"] .statementTarget.active{
    transform: scale(1.05);
    background-color: var(--ssrcolor4)!important;
    color: white;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: var(--ssrcolor4);
    animation: activePulse 0.6s ease-out;
}

@keyframes activePulse {
  0% {
    transform: scale(1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
}

.dQuestion[qtype='pairwiseComparison'] .pc_footer{
    padding-top:4vmin;
    font-size: var(--font);
}

.bws_animation-enter-active {
  animation: pc_animation 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  animation-delay: 0.1s;
  opacity: 0;
  position: relative;
  z-index: 2;
}
.bws_animation-leave-active {
  animation: pc_animation-out 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19);
  pointer-events: none;
  touch-action: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.bws_animation-leave-active .pairwiseComparisonItem .statementBox[data-label="A"] {
  animation: statementBoxSlideOutLeft 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

.bws_animation-leave-active .pairwiseComparisonItem .statementBox[data-label="B"] {
  animation: statementBoxSlideOutRight 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
}

@keyframes pc_animation {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pc_animation-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

/* .dBox[qtype='pairwiseComparison']{
    display: flex;
    flex-direction: column;
} */



@media screen and (max-width: 480px) {

}

</style>
