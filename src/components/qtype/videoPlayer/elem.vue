<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
         <template v-if="data">
            <div class="dQuestion" qtype="descriptive" :class="{
              required:false,
              noAsterisk:($parent.project.setup?.display_asterisk == 0)
            }">
                <div class="body">
                    <div class="question"  v-html="_pipeText(data.question)"></div>

                    <div class="footer">
                            <button class="dBtn playVideo" v-if="showPlayBtn" @click="_playVideo()" v-html="data?.setup.layout_video.play_text"></button>
                            <button class="dBtn playAgain" v-if="showPlayAgainBtn" v-html="data?.setup.layout_video.play_again_text" @click="_playVideo()"></button>
                            <button class="dBtn" v-if="showNextBtn" v-html="$parent.project.setup.messages.nextBtn" @click="_done()"></button>
                            
                    </div>

                    <qfooter v-show="showFooter" ref="footer"></qfooter>
                </div>
            </div>
         </template>
         <videoPlayerModal ref="videoPlayerModalElem" :data="data" @video:ended="_videoDone() "></videoPlayerModal>
    </div>

    </transition>
</template>
<script>
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import qfooter from '@/components/qfooter'
import videoPlayerModal from './modal'
import { nextTick } from 'vue';
export default {
    components: {qfooter,videoPlayerModal},
    data(){
        return {
            data : null,
            showFooter : false,
            showNextBtn : false,
            showPlayAgainBtn: false,
            showPlayBtn:true
        }
    },
    mixins : [qtypeFunctions,comp],
    props : ["item"],
    mounted(){
        this._initQuestion()
        nextTick().then(()=>{
            console.log("footer",this.$refs['footer'])
        })
        
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
                    this.data.response[this.data.TAG]["text"] = "videoplayer"
                    this.data.response[this.data.TAG]["value"] = "videoplayer"              
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
        _videoDone(){
            this.showNextBtn = true
            this.showPlayAgainBtn = true
            this.showPlayBtn = false
        },
        _done(){
            this.$refs['footer'].$refs['next'].click()

        }  
    }
}
</script>
<style scoped>
.playVideo::after{
    display:none;
}
/* .playAgain::after{
    display:none;
} */
</style>
