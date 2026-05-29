<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
         <!-- Timer Display -->
          <teleport to="body">
            <div class="timer-display" v-if="timerDisplay.show">
                <div class="circular-timer">
                    <svg class="timer-svg" viewBox="0 0 100 100">
                        <!-- Background circle -->
                        <circle 
                            class="timer-bg" 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="rgba(0, 0, 0, 0.15)" 
                            stroke-width="8"
                        />
                        <!-- Progress circle -->
                        <circle 
                            class="timer-progress" 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#1276be" 
                            stroke-width="8"
                            stroke-linecap="round"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="progressOffset"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div class="timer-countdown">{{ timerDisplay.countdown }}</div>
                </div>
            </div>
        </teleport>
         <template v-if="data">
            <div class="dQuestion" qtype="descriptive" :class="{
              required:false,
              noAsterisk:($parent.project.setup?.display_asterisk == 0)
            }">
                <div class="body">
                    <div class="question" v-if="(data.setup?.layout && data.setup?.layout > 1)">
                         <div class="layout" :type="data.setup?.layout" :style="_layoutVars()">
                            <div class="section img"><img :src="data.setup.layout_img.src"/></div>
                            <div class="section txt" v-html="_pipeText(data.question)"></div>
                         </div>
                    </div>
                    <div class="question" v-else  v-html="_pipeText(data.question)"></div>
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
            showFooter : true,
            timerDisplay: {
                show: false,
                countdown: 0,
                totalDuration: 0,
                intervalId: null
            }
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    computed: {
        circumference() {
            // Circle circumference = 2 * π * radius (radius = 45)
            return 2 * Math.PI * 45;
        },
        progressOffset() {
            if (!this.timerDisplay.show || this.timerDisplay.totalDuration === 0) {
                return 0; // Start with full ring when timer begins
            }
            
            const totalTime = this.timerDisplay.totalDuration;
            const remainingTime = this.timerDisplay.countdown;
            const progress = remainingTime / totalTime;
            
            // Calculate offset so ring decreases clockwise from top (countdown effect)
            return this.circumference - (progress * this.circumference);
        }
    },
    mounted(){
        this._initQuestion()
    },
    beforeUnmount(){
        this._clearTimer()
    },
    methods:{
        _initQuestion(){
            this.data = this.item
            // this.data.setup['layout'] = 2
            // this.data.setup['layout_img'] = {
            //     src : "https://express.splitsecondsurveys.co.uk/ide/gallery/ZjDvT51h1owGe2eqZ502T4MS8BOYwa8EBVyvinh0.png",
            //     width : "40vmin",
            //     height : "40vmin",
            // }
            // this.data.setup['btn_delay'] = 6
            this.data['form'] = {
                input : ""
            }
            this.data['response'] = this._initData()
        },
        _layoutVars(){
            const layoutImg = this.data?.setup?.layout_img || {}
            const isEnabled = !!layoutImg.image_dimension_enabler
            const desktopDim = isEnabled ? (layoutImg.image_dimension || layoutImg.width) : layoutImg.width
            const tabletDim = isEnabled ? (layoutImg.image_dimension_tab || desktopDim) : (layoutImg.image_dimension_tab || desktopDim)
            const mobileDim = isEnabled ? (layoutImg.image_dimension_mobile || tabletDim) : (layoutImg.image_dimension_mobile || tabletDim)

            return {
                '--layout-img-width': desktopDim,
                '--layout-img-width-tab': tabletDim,
                '--layout-img-width-mobile': mobileDim,
                '--layout-img-height': layoutImg.height,
            }
        },
        _initData(){
            let q = this.data
            let data = {}
            let obj = {
                TAG : q.TAG,
                VAR : q.VAR,
                desc : "",
                text : "",
                value : "",
                ref : null
            }
            data[q.TAG] = obj
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    this.data.response[this.data.TAG]["text"] = "descriptive"
                    this.data.response[this.data.TAG]["value"] = "descriptive"              
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

<style scoped>
.timer-display {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.circular-timer {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timer-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.timer-bg {
    transition: stroke 0.3s ease;
}

.timer-progress {
    transition: stroke-dashoffset 0.3s ease;
}

.timer-countdown {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--fontFam);
    font-size: 20px;
    font-weight: bold;
    color: #1276be;
    z-index: 10;
    min-width: 30px;
    text-align: center;
    animation: numberPulse 1s ease-in-out infinite alternate;
}

@keyframes numberPulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        transform: translate(-50%, -50%) scale(1.1);
    }
}

/* Responsive adjustments */
@media (max-width: 1366px) {
    .timer-display {
        width: 40px;
        height: 40px;
        top: 5px;
        right: 5px;
    }
    
    .timer-countdown {
        font-size: 14px;
    }
}

/* Animation when timer starts */
.timer-display {
    animation: timerAppear 0.5s ease-out;
}

@keyframes timerAppear {
    0% {
        transform: scale(0) rotate(180deg);
        opacity: 0;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}
</style>
