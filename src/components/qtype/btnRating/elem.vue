<template>
    <transition :name="transition">
        <div class="dBox" v-show="(data?.show && (!gameFrame.show))" :tag="data?.TAG" :style="_boxStyle()">
            <template v-if="data">
                <div class="dQuestion" qtype="descriptive" :class="{
                required:false,
                noasterisk:($parent.project.setup?.display_btn-ratingerisk == 0)
                }">
                    <div class="body">
                        <div class="question txt-center" v-html="_pipeText(data.question)"></div>
                        <qfooterIns ref="footer"></qfooterIns>
                    </div>
                </div>
            </template>
        </div>
    </transition>


    <div class="dBox-full" ref="parentElem" qtype="btn-rating" v-show="gameFrame.show" :state="gameFrame.state" :tag="data?.TAG">
        <template v-if="data">
            <div class="dQuestion" qtype="btn-rating" :class="{
            required:true,
            noasterisk:($parent.project.setup?.display_btn-ratingerisk == 0),
            onResizing:(resizing)
            }"
            :targetSize="data.values.length"
            >
            <div class="body">
                <div class="choices">
                    <div class="content">
                        <div class="question-btn-rating" v-if="current.prime" v-html="_displayEQ(_pipeText(data.setup.header))"></div>
                        <prime_comp ref="primeElem" v-if="current.prime" :prime="current.prime"></prime_comp>
                        <div class="targetList">
                            <target_comp ref="targetElem" v-if="current.prime" :prime="current.prime"></target_comp>                  
                        </div>
                        <div class="question-btn-rating-footer" v-if="current.prime" v-html="_displayEQ(_pipeText(data.setup.footer))"></div>
                    </div>
                </div>
                <qfooter v-show="false" ref="footer"></qfooter>
            </div>
        </div>
        </template>
    </div>

</template>
<script>
//let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import prime_comp from './prime'
import target_comp from './target'
import qfooterIns from './footer-ins'
import qfooter from '@/components/qfooter'


export default {
    components: { qfooter, qfooterIns , prime_comp, target_comp},
    data(){
        return {
            data : null,
            current : {
                index : 0,
                prime : null,
                startTime : null,
                endTime : null,
            },
            isLoading : true,
            
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    mounted(){
        this._initQuestion()

        window.addEventListener("resize",()=>{
            this._responsive()
        })
    },
    watch:{
        // 'current.prime'(data){
        //     console.log(data)
        // }
    },  
    methods:{
        _initQuestion(){
            this.data = this.item
            let q = this.data
            let defColorSet = this.defaultColors[this.data.values.length - 1]

             this.data.values.map((v,k)=>{
                 //let val = k + 1
                //  v['value'] = val
                //  v['order'] = val
                 let key = k + 1
                 v['index'] = this._setVariableValue(v['index'],key)
                 v['value'] = this._setVariableValue(v.score,v['index'])
                 v['order'] = v['index']

                 if(v.color == "" || v.color == null){
                    v.color = defColorSet[k]
                 }
             })
             //console.log(this.data.values)
             
             //console.log(this.data.values)
             this.data.items.map((v,k)=>{
                //let val = k + 1
                let key = k + 1
                v['index'] = this._setVariableValue(v['index'],key)
                v['order'] = v['index']

                v['TAG'] = q.TAG+"_"+v['index']
                v['VAR'] = q.VAR+"_"+v['index'] 
                //v['order'] = val
                v['display'] = null
                v['show'] = true
                v['oaat_show'] = false
                v['form'] = {
                    text : '',
                    value : '',
                    rt : '',
                    obj : null
                }
                let values = JSON.parse(JSON.stringify(this.data.values))
                
                values.map((item)=>{

                    item['active'] = false
                    item['animation'] = "static"
                    item['hover'] = false
                    
                })
                v['values'] = values
            })

            this.data.items = this._randomList(this.data.items,this.data.setup.randomItems)
            this.data['response'] = this._initData()
            this.current.index = 0
            //this._start()



            
        },
        async _start(){

            if(!this.gameFrame.show){
                await this._gameFrameAnimationState("show")
            }       

            if(typeof(this.data.items[this.current.index]) == "undefined"){
                /* CHECKING IF ITEM ENDS */
                await this._gameFrameAnimationState("hide")
                this._next()
                return false
            }else{
                //this.data.items[this.current.index].show = false
                //alert(this.data.items[this.current.index].show)
                /* CHECK IF CURRENT INDEX IS NOT HIDDEN */
                if(!this.data.items[this.current.index].show){
                    this.current.index += 1
                    this._start()
                    return false
                }

            }

            this.current.prime = this.data.items[this.current.index]
            this.$nextTick(()=>{
                
                this.current.startTime = null
                this.current.endTime = null
                this.$refs['primeElem']._show().then(()=>{
                    this.current.startTime = new Date().getTime()
                })
                   // console.log(this.current.prime)
            })
        },
        _nextStep(){
            this._setAns().then(()=>{
                this.current.prime.oaat_show = false
                this.current.index += 1
                let sectionRate = this._getCurrentSection()
                this.$parent.$refs['progress']._forceAdd(sectionRate)
                setTimeout(()=>{
                    this._start()
                },100)
            })
        },
        _record(){
            return new Promise((resolve)=>{

                resolve()
            })
        },
        _getCurrentSection(){
            let current = this.current.index
            let list = this.data.items

            let res = (((current) / list.length) * 100).toFixed(0)
            if(res > 100){
                res = 100
            }
            return res

        },  
        _initData(){
            let data = {}
            this.data.items.map((v)=>{
                let obj = {
                    TAG : v.TAG,
                    VAR : v.VAR,
                    desc : "",
                    text : "",
                    rt : "",
                    value : "",
                    ref : null
                }
                data[v.TAG] = obj       
                
                //PASS REACTION TIME
                if(Object.hasOwn(this.data.setup, 'passRTToURL')){
                    if(this.data.setup.passRTToURL == 1){
                            data[v.TAG+"_rt"] = {
                                TAG : v.TAG+"_rt",
                                VAR : v.VAR+"_rt",
                                desc : "",
                                text : "",
                                value : ""
                            }
                    }
                }


            })
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    //assign answer
                    this.data['response'] = this._initData()
                    this.data.items.map((item)=>{                  
                        this.data.response[item.TAG]["desc"] = ""
                        this.data.response[item.TAG]["text"] = ""
                        this.data.response[item.TAG]["value"] = ""
                        this.data.response[item.TAG]["rt"] = ""
                        if(item.form.obj != null){
                            this.data.response[item.TAG]["text"] = item.form.text
                            this.data.response[item.TAG]["desc"] = item.form.text
                            this.data.response[item.TAG]["value"] = item.form.value
                            this.data.response[item.TAG]["rt"] = item.form.rt

                            //PASS REACTION TIME
                            if(Object.hasOwn(this.data.response, item.TAG+"_rt")){
                                this.data.response[item.TAG+"_rt"]["text"] = item.form.rt
                                this.data.response[item.TAG+"_rt"]["desc"] = item.form.text
                                this.data.response[item.TAG+"_rt"]["value"] =item.form.rt
                            }


                        }
                        this.data.response[item.TAG]["ref"] = item
                    })     
                    this.$parent._setAllWinVars().then(()=>{
                        this._advanceSkiplogic("leave").then(()=>{
                            resolve()
                        }).catch((e)=>{
                            console.log(e)
                            this._gameFrameAnimationState("hide")
                        })
                    })              
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve)=>{
                    //console.log("validations")
                    //validate answer
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
.dBox-full[qtype="btn-rating"] .dQuestion .choices .content{
    transition-duration: 0s!important;
}
.dQuestion[qtype=btn-rating].onResizing .primeBox {
    transition-duration: 0s!important;
}
.dQuestion[qtype=btn-rating].onResizing /deep/ .targetBox {
    transition-duration: 0s!important;
}


.dQuestion[qtype=btn-rating] {
    --fs1: 2vmin;
    --fs2: 2.5vmin;
    --fs3: 3vmin;
    --fs4: 3.5vmin;
    --fsl: 4vmin;
    font-size: var(--fs3);
}


.dQuestion[qtype=btn-rating] /deep/ .ssr-import-image {
    width: var(--imgwidth, 70%) !important;
}


/* Tablet */
@media screen and (max-width: 1366px) {
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Small']{
        font-size:calc(var(--fs1) + 0%);
        line-height:calc(var(--fs1) + 0%);
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Normal']{
        font-size:calc(var(--fs2) + 0%);
        line-height:calc(var(--fs2) + 0%);
        
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Large']{
        font-size:calc(var(--fs3) + 0%);
        line-height:calc(var(--fs3) + 0%);
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Huge']{
        font-size:calc(var(--fs4) + 0%);
        line-height:calc(var(--fs4) + 0%);
    }
}
  
  /* Mobile */
  @media screen and (max-width: 480px) {
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Small']{
        font-size:calc(var(--fs1) + 0%);
        line-height:calc(var(--fs1) + 0%);
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Normal']{
        font-size:calc(var(--fs2) + 0%);
        line-height:calc(var(--fs2) + 0%);
        
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Large']{
        font-size:calc(var(--fs3) + 0%);
        line-height:calc(var(--fs3) + 0%);
    }
    .dQuestion[qtype=btn-rating] /deep/ font[data-fs='Huge']{
        font-size:calc(var(--fs4) + 0%);
        line-height:calc(var(--fs4) + 0%);
    }
}
</style>