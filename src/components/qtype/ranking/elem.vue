<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="ranking" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body">
                <div class="question" v-html="_pipeText(data.question)"></div>
                <div class="choices">
                    <div class="content">
                        <div    class="rank-con-flex" :data-position="positionMode" v-if="mode == 0" :data-mode="mode">
                            <div class="drop-zone" data-role="sources" :set="nn = 0">
                                 
                                <template v-for="(itm, indx) in notChosen" 
                                :key="indx">

                                <DropItem   
                                            :text="itm.name"
                                            :dataId="indx"
                                            :itemData="itm"
                                            :itemFixedHeight="itemFixedHeight"
                                            :showItem="itm.show"
                                            v-if="itm.show"
                                            :set="nn+=1"
                                            />
                                </template>
                            </div>
                            <div style="width: 16px; height: 16px;"></div>
                            <div class="drop-zone-container">
                                <div class="drop-zone-header" v-if="data.setup?.mostPreferred">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                        </svg>
                                    </div>
                                    <div  v-html="data.setup?.mostPreferred"></div>
                                </div>
                                <div  class="rank-con-flex" style="flex: 1; overflow: hidden;">
                                    <div class="lbl-dropzone">
                                        <div v-if="!data.setup.dropzone">Drop Zone</div>
                                        <div v-else v-html="data.setup.dropzone"></div>
                                    </div>
                                    <div class="drop-zone" data-role="chosen" :set="nn = 0">
                                        
                                        <template v-for="(itm, indx) in chosen" 
                                        :key="indx">
                                        <DropItem
                                                    :text="itm.name"
                                                    :dataId="nn"
                                                    :itemData="itm"
                                                    :itemFixedHeight="itemFixedHeight"
                                                    v-if="itm.show"
                                                    :set="nn+=1"
                                                    />
                                        </template>
                                        
                                    </div>
                                </div>
                                <div class="drop-zone-footer" v-if="data.setup?.leastPreferred">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                        </svg>
                                    </div>
                                    <div v-html="data.setup?.leastPreferred"></div>
                                </div>
                            </div>
                        </div>
                        <!-- <div    class="rank-con-flex" :data-position="positionMode" v-if="mode == 1" :data-mode="mode">
                            <div    class="drop-zone sorting-con" 
                                    :style="{'--container-height': _getContainerHeight() + 'px'}" 
                                    data-role="chosen" :set="nn = 0"> -->

                         <div    class="rank-con-flex" :data-position="positionMode" v-if="mode == 1" :data-mode="mode">
                            <div    class="drop-zone sorting-con" :style="{'--numberOfColumns':data.setup.numberOfColumns,'--numberOfColumnsTab':(data.setup.numberOfColumns_tab ?? 1),'--numberOfColumnsMobile':(data.setup.numberOfColumns_mobile ?? 1),'--sortableLimit':(data.setup.limit ?? 0)}"
                                    data-role="chosen" :set="nn = 0">

                                <!-- <div class="lbl-dropzone">Drop Zone</div> -->
                                <template v-for="(itm, indx) in chosen" 
                                :key="indx" >
                                <DropItem
                                            :text="itm.name"
                                            :dataId="nn"
                                            :itemData="itm"
                                            :itemFixedHeight="itemFixedHeight"
                                            v-if="itm.show"
                                            :set="nn+=1"
                                            />
                                </template>
                            </div>
                        </div>
                    </div>
                    <!-- <button @click="_checkData">Test Check Data</button> -->
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
// let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import validateMsg from '@/components/validateMsg'
import Sortable from 'sortablejs';
import DropItem from './drop-items.vue';
import qfooter from '@/components/qfooter';
import helper from '@/js/helper'

const _console = {
    enabled: false,
    log: function(){
        if(this.enabled) console.log(...arguments);
        
    },
};

const dragDelay = 0;

export default {
    name: "ranking",
    components: { validateMsg, DropItem, qfooter},
    data(){
        return {
            data : null,
            startingPointX: 0,
            startingPointY: 0,
            currentTarget: null,
            isActive: false,
            limitCount: 0,
            chosen: [],
            notChosen: [],
            positionMode: 1,
            mode: 0,
            itemFixedHeight: null,

        }
    },
    mixins : [qtypeFunctions,comp,helper],
    props : ["item"],

    watch: {
        'data.show'(val){
            _console.log("ranking tag: ", this.data?.TAG);
            if(this.data?.show === false) return;
            _console.log("ranking watch 'data.show' executed");
            // _console.log("ranking show status: ", this.data?.show);
            // if(this.data?.show === false) return;
            this.positionMode = this.data.setup.position;
            this.limitCount = this.data.setup.limit;
            this.mode = this.data.setup.mode;
            this.itemFixedHeight = this.data.setup.fixedHeight === 0 ? null : this.data.setup.fixedHeight;
            this._checkOldState();
            _console.log("responses: ", this.data.response);
            if(val){
                // _console.log("this.data.setup: ", this.data.setup);
                setTimeout(() => {
                    let [d1, d2] = [
                        document.querySelector(`[tag="${this.data?.TAG}"] .drop-zone[data-role="chosen"]`),
                        document.querySelector(`[tag="${this.data?.TAG}"] .drop-zone[data-role="sources"]`)
                    ];
                    _console.log(d1);
    
                    if(d1){
                        new Sortable(d1, {
                            delay: dragDelay,
                            group: 'shared',
                            swap: true,
                            animation: 150,
                            // handle: '.item-drag-handler',
                            handle: '.rank-drop-item',
                            chosenClass: "selected-item",
                            
                            onChange: () => {
                                // _console.log(evt.item, evt.newIndex);
                                console.log("element")
                                console.log(d1)
                                let chosenIndex = 1;
                                d1.querySelectorAll('.rdi-num').forEach((itm) => {
                                    if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                                        itm.textContent = chosenIndex;
                                        chosenIndex++;
                                    }

                                    // _console.log((ind + 1) + ": ",itm.parentNode.className);
                                });

                                if(d2){
                                    let notChosenIndex = 1;
                                    // d2.querySelectorAll('.rdi-num').forEach((itm, ind) => {
                                    //     itm.textContent = ind + 1;
                                    // });
                                    d2.querySelectorAll('.rdi-num').forEach((itm) => {
                                        if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                                            itm.textContent = notChosenIndex;
                                            notChosenIndex++;
                                        }
    
                                        // _console.log((ind + 1) + ": ",itm.parentNode.className);
                                    });
                                }
                            }
                        });
                    }
    
                    if(d2){
                        new Sortable(d2, {
                            group: 'shared',
                            animation: 300,
                            delay: dragDelay,
                            // handle: '.item-drag-handler',
                            handle: '.rank-drop-item',
                            chosenClass: "selected-item",
                            onMove: (evt) => {
                                /**
                                 * add some limit action
                                 */
                                _console.log("asdf: ", evt.target);
                                _console.log("d1.childElementCount: ", d1.childElementCount);
                                _console.log("this.limitCount: ", this.limitCount);
                                if(this.limitCount > 0){
                                    if(d1.childElementCount >= this.limitCount){
                                        return false;
                                    }
                                }
                                // return false to cancel
                            },
                            onChange: () => {
                               
                                let chosenIndex = 1;
                                d1.querySelectorAll('.rdi-num').forEach((itm) => {
                                    if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                                        itm.textContent = chosenIndex;
                                        chosenIndex++;
                                    }

                                    // _console.log((ind + 1) + ": ",itm.parentNode.className);
                                });
                                let notChosenIndex = 1;
                                // d2.querySelectorAll('.rdi-num').forEach((itm, ind) => {
                                //     itm.textContent = ind + 1;
                                // });
                                d2.querySelectorAll('.rdi-num').forEach((itm) => {
                                    if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                                        itm.textContent = notChosenIndex;
                                        notChosenIndex++;
                                    }

                                    // _console.log((ind + 1) + ": ",itm.parentNode.className);
                                });
                            }
                        });
                    }
                }, 500);
    
            }
        }
    },

    mounted(){
        _console.log("ranking mounted() executed");
        this._initQuestion();
        
    },
    methods:{
        
       _getContainerHeight(){
           if(this.data?.show === false) return;
           _console.log("ranking _getContainerHeight() executed");
        //    if(this.data?.show === false) return 0;
            let res = 0;
            // res = Math.ceil(10 / this.data.setup.numberOfColumns)  * 56;
            // _console.log("this.data.setup.numberOfColumns: ", this.data.setup.numberOfColumns);
            if(this.chosen.length > 10){
                _console.log("more than 10");
                res = Math.ceil(
                        (
                            (this.chosen.length % this.data.setup.numberOfColumns === 0) ? 
                            this.chosen.length 
                            : 
                            this.chosen.length + 1
                        ) / this.data.setup.numberOfColumns
                    )  * 56;
                _console.log(res);
            }else{
                _console.log("10 and below");

                res = Math.ceil(10 / (this.data.setup.numberOfColumns === 0 ? 1 : this.data.setup.numberOfColumns))  * 56;
            }
            
            return res;
        },

        _initQuestion(){
            // if(this.data?.show === false) return;
            _console.log("ranking _initQuestion() executed");
            this.data = this.item
            let q = this.data
             this.data.items.map((v,k)=>{
                let val = k + 1
                v['TAG'] = q.TAG+"_"+val
                v['VAR'] = q.VAR+"_"+val 
                v['order'] = val
                v['display'] = null
                v['show'] = true
                v['value'] = ''
            })

            this.data.items = this._randomList(this.data.items,this.data.setup.randomItems)
            // alert("INIT QUESTION")
            this.data['response'] = this._initData()
            
        },
        _initData(){
            // if(this.data?.show === false) return;
            _console.log("ranking _initData() executed");
            //let q = this.data
            let data = {}
            this.data.items.map((v)=>{
                let obj = {
                    ...v,
                    TAG : v.TAG,
                    VAR : v.VAR,
                    desc : "",
                    text : "",
                    value : '',
                    ref : null,
                }
                data[v.TAG] = obj                   
            })
            _console.log("this.data: ", this.data);
            return data
        },
        _setAns(){
            // _console.log("ranking setAns called");
            // if(this.data?.show === false) return;
            _console.log("ranking _setAns() executed");
            return new Promise((resolve,reject)=>{
                try{
                    //assign answer
                    this.data['response'] = this._initData()
                    let _data = this._checkData();
                    _console.log("_data: ", _data);
                    _console.log("this.data['response']: ", this.data['response']);
                    
                    _data.map((item)=>{
                        _console.log("this.data.response[item.TAG]: ", this.data.response[item.TAG]);
                        if(this.data.response[item.TAG]){
                            let rank = item.rank
                            let score = this._invertScore(rank,_data)
                            if(item.rank == ''){
                                rank = 0
                                score = 0                           
                            }

                            this.data.response[item.TAG]["desc"] = item.name
                            this.data.response[item.TAG]["text"] = item.name
                            this.data.response[item.TAG]["value"] = rank
                            
                            // this.data.response[item.TAG]["ref"] = item

                            //console.log(score)
                            if((this.data.setup.limit > 0 && (this.data.setup.limit == this.data.setup.validate2.minValue)) || (this.data.setup.mode != 0)){

                                let STAG = this._scoreVariableMaker(item.TAG,this.data.TAG+"_",'s')
                                let SVAR = this._scoreVariableMaker(item.VAR,this.data.VAR+"_",'s')
                            
                                this.data.response[STAG] = {}
                                
                                this.data.response[STAG]["TAG"] = STAG
                                this.data.response[STAG]["VAR"] = SVAR
                                this.data.response[STAG]["desc"] = ''
                                this.data.response[STAG]["text"] = score
                                this.data.response[STAG]["value"] = score
                                console.log(score)
                            }

                        }
                    })
                    resolve()
                }catch(e){
                    reject(e)
                }
            })
        },
        _invertScore(score,allData){
            const maxScore = Math.max(...allData.map(d => d.rank));
            return maxScore + 1 - score
        },  
        _required(){
            // if(this.data?.show === false) return;
            _console.log("ranking _required() executed");
            return new Promise((resolve, reject)=>{
                try{
                    /**
                     * reset alert modal
                     */
                    this.$refs.validateMsg._hide()

                    /**
                     * check chosen count if empty
                     */
                    if(this._getItemCount() <= 0){
                        /**
                         * show error message modal / toast
                         */
                        this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)

                        /**
                         * for stopping next button
                         */
                        throw this.data.setup.validate.errorMsg; 
                    }else{
                        /**
                         * if "NOT EMPTY"
                         * if minValue is greater than zero meaning you have to validate it
                         * if it is zero skip validation
                         * "minValue" means that the minimum item count of the chosen items
                         */
                        if(this.data.setup.validate2.minValue > 0){
                            if(this._getItemCount() < this.data.setup.validate2.minValue){
                                /**
                                 * show error message modal / toast
                                 * put "{{count}}" inside the error message string if you want to display the minValue 
                                 */
                                this.$refs.validateMsg._show(this.data.setup.validate2.errorMsg.replace(/{{count}}/gi, this.data.setup.validate2.minValue));
    
                                /**
                                 * for stopping next button
                                 * put "{{count}}" inside the error message string if you want to display the minValue 
                                 */
                                throw this.data.setup.validate2.errorMsg.replace(/{{count}}/gi, this.data.setup.validate2.minValue); 
                            }
                        }
                    }

                    resolve()
                }catch(err){
                    reject(err);
                }
                    
            })
        },
        _skiplogic(){
            // if(this.data?.show === false) return;
            _console.log("ranking _skiplogic() executed");
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
<style>
.drop-zone-container{
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.1);
    flex: 1;
    padding: 4px;
    border-radius: 1vmin;
    overflow: hidden;
    border: solid 1px rgba(0, 0, 0, 0.1);

}
.drop-zone-container .drop-zone-header{
    padding: 2vmin 2vmin 1vmin 2vmin;
    background-color: #b3f5b5;
    margin-top: -1vmin;
    margin-left: -1vmin;
    margin-right: -1vmin;
    box-shadow: 0vmin 0vmin 1vmin rgba(0,0,0,0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1vmin;
}
.drop-zone-container .drop-zone-header div:first-child{
    width: 2.5vmin;
    height: 2.5vmin;
}
.drop-zone-container .drop-zone-header div:last-child{
    font-size: var(--font);
    font-weight: 600;
    flex: 1;
}
.drop-zone-container .drop-zone-footer{
    padding: 1vmin 2vmin 2vmin 2vmin;
    background-color: #ffcdd2;
    margin-bottom: -1vmin;
    margin-left: -1vmin;
    margin-right: -1vmin;
    box-shadow: 0vmin 0vmin 1vmin rgba(0,0,0,0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1vmin;
}
.drop-zone-container .drop-zone-footer div:first-child{
    width: 2.5vmin;
    height: 2.5vmin;
}
.drop-zone-container .drop-zone-footer div:last-child{
    font-size: var(--font);
    font-weight: 600;
    flex: 1;
}
.rank-con-flex{
    position: relative;
    display: flex;
    flex-direction: row;
    --container-height: 0px;
    --fixed-height: 40px;

}

.rank-con-flex[data-position="1"]{
    flex-direction: row;
}

.rank-con-flex[data-position="2"]{
    flex-direction: row-reverse;
}

.rank-con-flex[data-position="3"]{
    flex-direction: column;
}

.rank-con-flex[data-position="4"]{
    flex-direction: column-reverse;
}



.drop-zone{
    position: relative;
    /* width: 100%; */
    box-sizing: border-box;
    min-height: 50vmin;
    background-color: rgba(0,0,0,0.1);
    flex: 1;

    padding: 4px;
    border-radius: 1vmin;
    overflow: hidden;
    border: solid 1px rgba(0,0,0,0.1);
    /* max-width: 600px; */
    /* margin: auto; */
    /* display: flex;
    flex-direction: column;
    justify-content: center; */
    /* overflow-x: hidden;
    overflow-y: auto; */
    /* overflow: hidden; */
    gap: 1vmin;
    padding:1vmin;
    display: flex;
    width: 100%;
    flex-direction: column;

}
.drop-zone:nth-child(2){
    border: none;
    background-color: transparent;
}
.rank-drop-item{
    /* flex: 1; */
    display: flex;
    flex-direction: row;
    background-color: #FFF;
    /* margin: 4px; */
    /* border-radius: 8px; */
    align-items: stretch;
    cursor: pointer;
    border-bottom: solid 1px rgba(0,0,0,0.1);
    border-radius: 1vmin;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 5vmin;
    -webkit-tap-highlight-color: transparent;
}


.rdi-num{
    /* height: 40px; */
    /* height: 100%; */
    width: 56px;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    pointer-events: none;
    /* font-size: 16px; */
    font-size: var(--font-lg);
    /* border-right: solid 1px rgba(0,0,0,.1); */
    /* background-color: #0c5ba8; */
    background-color: var(--ssrcolor3);
    color: #FFF;
}

.drop-zone[data-role="chosen"] .rdi-num{
    display: flex;
}

.drop-zone[data-role="sources"] .rdi-num{
    display: none;
}

.item-drag-handler{
    width: 56px;
    /* border: solid 1px #AAA; */
    display: flex;
    align-items: center;
    justify-content: center;
}

.rdi-lbl{
    display: flex;
    align-items: center;
    pointer-events: none;
    flex: initial;
    overflow: hidden;
    box-sizing: border-box;
    padding: 2vmin 3vmin 2vmin 2vmin;
    font-size: var(--font);
}

.rdi-lbl > div{
        white-space: normal !important;
        word-break: break-word;
        text-overflow: unset !important;
        /* padding-left: 16px;
        text-indent: -16px; hanging indent for wrapped lines */
    }


.rdi-btn{
    pointer-events: all;
    display:none;
    width:4vmin;
    min-width:25px;
    min-height:25px;
    height:4vmin;
    border-radius:50%;
    border:0px;
    background:transparent;
    /* background:#009688;
    color:white; */
    align-self: center;
    margin:1vmin .5vmin;
    font-weight: 800;
    font-size: 2vmin;
    cursor:pointer;
}

.drop-zone[data-role="sources"]  .rdi-btn.addItem{
    display:block;
}
.drop-zone[data-role="chosen"]  .rdi-btn.removeItem{
    display:block;
    /* background:#f96969; */
}

.drop-zone
.rank-drop-item:last-child{
    border-bottom: solid 0px rgba(0,0,0,.1);
}

.t{
    background-color: rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 200px;
    overflow: auto;
    margin-top: 16px;
}

.tt{
    width: 50%;
    box-sizing: border-box;
    background-color: #FFF;
    border: solid 1px #333;
    padding: 8px;
    
}
/* .sortable-ghost{
    display:none;
} */
.sorting-con{
    display: grid;
    grid-template-columns: repeat(var(--numberOfColumns),1fr);
    /* flex-direction: row; */
    flex-wrap: wrap;
    min-height: 0px;
    gap: .2vmin .2vmin;
    /* max-height: 360px; */
    /* height: var(--container-height); */
    height:auto;
    box-sizing: content-box;
    /* box-sizing: border-box; */
    position: relative;
    gap: 1vmin;
    padding: 2vmin;
}
.rank-drop-item{
    width:100%;
    margin:0px!important;
    padding:0px!important;
}

.sorting-con
.rank-drop-item
{
    margin-left: .2vmin;
    margin-right: .2vmin;
    min-height: 8vmin;
    /* margin: 2px; */
    position: relative;
}

.sorting-item:nth-child(1) .rdi-num, .ranking-item:nth-child(1) .rdi-num{
    background-color: #ff9800;
    box-shadow: inset 0vmin 0vmin 2vmin #e17a00;
}

.sorting-item:nth-child(2) .rdi-num, .ranking-item:nth-child(2) .rdi-num{
    background-color: #a1a1a1;
    box-shadow: inset 0vmin 0vmin 2vmin #818181;
}

.sorting-item:nth-child(3) .rdi-num, .ranking-item:nth-child(3) .rdi-num{
    background-color: #CD7F32;
    box-shadow: inset 0vmin 0vmin 2vmin #a55c00;
}




.rank-con-flex
.lbl-dropzone{
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
    font-size: 24px;
    color: rgba(0,0,0,0.3);
    transform: rotate(-20deg);
    pointer-events: none;
    animation: scale-anim .3s both infinite alternate;
    font-weight: 600;
}

.selected-item{
    background-color: rgb(255, 234, 207);
}

@media screen and (max-width: 600px) {


    
    .rank-drop-item{
        min-height: 40px;
    }

    
    .rdi-num{
        width: 40px;
        /* font-size: 14px; */
        font-size: var(--font-lg);
    }

    .item-drag-handler{
        width: 40px;
    }

    .item-drag-handler svg{
        transform: scale(0.75);
    }

    /* .sorting-con{
        display: block;
        flex-direction: column;
        flex-wrap: nowrap;
        min-height: 0px;
        max-height: fit-content;
    } */

    /* [data-mode="0"]
    .drop-zone{
        overflow-y: auto;
        max-height:  56vmin;
        min-height:  56vmin;
    } */

    /* [data-mode="1"] 
    .drop-zone{
        overflow-y: auto;
        max-height:  92vmin;
        min-height:  92vmin;
    } */

    /* .rank-con-flex{
        height: 75%;
    } */
}

.drop-zone[data-role="chosen"] 
.sortable-drag 
.rdi-num{
    display: none;
}

@keyframes scale-anim {
    from{
        transform: scale3d(1, 1, 1) rotateZ(-20deg);
    }

    to{
        transform: scale3d(0.9, 0.9, 0.9) rotateZ(-20deg);
    }
}


/* Tablet */
@media screen and (max-width: 1366px) {
    .sorting-con{
        grid-template-columns: repeat(var(--numberOfColumnsTab),1fr);
    }

    .rank-con-flex[data-position="1"]{
        flex-direction: column-reverse;
    }

    .rank-con-flex[data-position="2"]{
        flex-direction: column-reverse;
    }

}

/* Mobile */
@media screen and (max-width: 480px) {
    .sorting-con{
        grid-template-columns: repeat(var(--numberOfColumnsMobile),1fr);
    }
}


</style>
