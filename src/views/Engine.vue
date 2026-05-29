<template >
<div :style="_setupCustomTheme()" class="dExpressBody">
  <div class="dMainCont" v-if="state.asset" :rtl="project?.setup?.rtl">
      <template v-for="item in sched" :key="item?.TAG">
         <descriptive :ref="item?.TAG" v-if="item?.question_type_id == 1" :item="item" :key="item?.TAG"></descriptive>
         <multipleChoice :ref="item?.TAG" v-if="item?.question_type_id == 2" :item="item" :key="item?.TAG"></multipleChoice>
         <imageSelection :ref="item?.TAG" v-if="item?.question_type_id == 3" :item="item" :key="item?.TAG"></imageSelection>  
         <singleTextbox :ref="item?.TAG" v-if="item?.question_type_id == 4" :item="item" :key="item?.TAG"></singleTextbox> 
         <multipleTextbox :ref="item?.TAG" v-if="item?.question_type_id == 5" :item="item" :key="item?.TAG"></multipleTextbox>
         <openEnded :ref="item?.TAG" v-if="item?.question_type_id == 6" :item="item" :key="item?.TAG"></openEnded>
         <constantSum :ref="item?.TAG" v-if="item?.question_type_id == 7" :item="item" :key="item?.TAG"></constantSum>
         <slider :ref="item?.TAG" v-if="item?.question_type_id == 8" :item="item" :key="item?.TAG"></slider>
         <ranking :ref="item?.TAG" v-if="item?.question_type_id == 9" :item="item" :key="item?.TAG"></ranking>
         <starRating :ref="item?.TAG" v-if="item?.question_type_id == 10" :item="item" :key="item.TAG"></starRating>
         <matrix :ref="item?.TAG" v-if="item?.question_type_id == 11 && (item?.setup.displayByColumn == 0 || typeof(item?.setup.displayByColumn) == 'undefined')" :item="item" :key="item?.TAG"></matrix>
         <matrixByColumn :ref="item?.TAG" v-if="item?.question_type_id == 11 && item?.setup.displayByColumn == 1" :item="item" :key="item?.TAG"></matrixByColumn>
         <matrixMulti :ref="item?.TAG" v-if="item?.question_type_id == 12" :item="item" :key="item?.TAG"></matrixMulti>
         <memoryTestDesc :ref="item?.TAG" v-if="item?.question_type_id == 13" :item="item" :key="item?.TAG"></memoryTestDesc>
         <memoryTestComp :ref="item?.TAG" v-if="item?.question_type_id == 14" :item="item" :key="item?.TAG"></memoryTestComp>
         <btnRating :ref="item?.TAG" v-if="item?.question_type_id == 15" :item="item" :key="item?.TAG"></btnRating>
         <segmentation :ref="item?.TAG" v-if="item?.question_type_id == 16" :item="item" :key="item?.TAG"></segmentation>
         <hotspot :ref="item?.TAG" v-if="item?.question_type_id == 17" :item="item" :key="item?.TAG"></hotspot>
         <videoPlayer :ref="item?.TAG" v-if="item?.question_type_id == 18" :item="item" :key="item?.TAG"></videoPlayer>
         <!-- <imageViewer :ref="item?.TAG" v-if="item?.question_type_id == 19" :item="item" :key="item?.TAG"></imageViewer> -->
         <pairwiseComparison :ref="item?.TAG" v-if="item?.question_type_id == 19" :item="item" :key="item?.TAG"></pairwiseComparison>
         <bestWorstScale :ref="item?.TAG" v-if="item?.question_type_id == 20" :item="item" :key="item?.TAG"></bestWorstScale>
         <barChart :ref="item?.TAG" v-if="item?.question_type_id == 21" :item="item" :key="item?.TAG"></barChart>
         <bestWorstScale2 :ref="item?.TAG" v-if="item?.question_type_id == 22" :item="item" :key="item?.TAG"></bestWorstScale2>
      </template>
        <!-- <fast :ref="item?.TAG" v-if="item?.question_type_id == 1" :item="item" :key="item?.TAG"></fast> -->   


      <endPage ref="endPage" :logo="project?.setup.footer.logo"></endPage>
    </div>
    <div class="dFooter" :class="{noLine:(project.setup.footer.logo != '')}" v-if="(project?.setup.footer.enable == 1) && (this.state.init)">
        <div class="body">
        <img class="logo" v-if="!project?.setup.footer.logo" src="@/assets/img/logo_poweredby.gif"/>
        <img class="logo" v-else :src="project?.setup.footer.logo"/>
        </div>
    </div>
    <progressLine ref="progress" v-show="((project?.setup.showProgressBar == 1) && (sched.length > 0))" :curr="(question) ? (question.display - 1) : sched.length" :limit="sched.length"></progressLine>
    <div class="BG" v-if="(this.state.init)"></div>
    <dLoading ref="loading" :logo="project?.setup.footer.logo"></dLoading>
    <!-- MODALS -->
     <modal ref="defaultError" :data="defaultError"></modal>
    <template v-if="project">
        <template v-for="(obj, key) in project.setup.modals" :key="key">
            <modal :ref="key" :data="obj"></modal>
        </template>
    </template>

</div>
</template>

<script>
let _ = require('lodash')
import model from '@/js/model'
import helper from '@/js/helper'
import multilanguage from '@/js/multilanguage'

//const axios = require('axios')

import modal from '@/components/modal/elem'
import endPage from '@/components/spinner/spinner'
import progressLine from '@/components/progress'
import dLoading from '@/components/loading/loading'
import multipleChoice from '@/components/qtype/multipleChoice/elem'
import singleTextbox from '@/components/qtype/singleTextbox/elem'
import multipleTextbox from '@/components/qtype/multipleTextbox/elem'
import openEnded from '@/components/qtype/openEnded/elem'
import matrix from '@/components/qtype/matrix/elem'
import matrixByColumn from '@/components/qtype/matrixByColumn/elem'
import descriptive from '@/components/qtype/descriptive/elem'
import slider from '@/components/qtype/slider/elem'
import segmentation from '@/components/qtype/segmentation/elem'
import imageSelection from '@/components/qtype/imageSelection/elem'
import ranking from '@/components/qtype/ranking/elem'
import matrixMulti from '@/components/qtype/matrixMulti/elem'
import memoryTestDesc from '@/components/qtype/memoryTestDesc/elem'
import memoryTestComp from '@/components/qtype/memoryTestComp/elem'
import constantSum from '@/components/qtype/constantSum/elem'
import starRating from '@/components/qtype/starRating/elem'
import hotspot from '@/components/qtype/hotspot/elem'
import videoPlayer from '@/components/qtype/videoPlayer/elem'
import btnRating from '@/components/qtype/btnRating/elem'
import bestWorstScale from '@/components/qtype/bestWorstScale/elem'
import pairwiseComparison from '@/components/qtype/pairwiseComparison/elem'
import barChart from '@/components/qtype/barChart/elem'
import bestWorstScale2 from '@/components/qtype/bestWorstScale2/elem'

// import fast from '@/components/qtype/fast/elem'

export default {
  name: 'Engine',
  components: {
      modal,
      dLoading,
      progressLine,
      endPage,
      descriptive,
      multipleChoice,
      singleTextbox,
      multipleTextbox,
      openEnded,
      matrix,
      matrixByColumn,
      slider,
      segmentation,
      imageSelection,
      ranking,
      matrixMulti,
      memoryTestDesc,
      memoryTestComp,
      constantSum,
      starRating,
      hotspot,
      btnRating,
      videoPlayer,
      bestWorstScale,
      pairwiseComparison,
      barChart,
      bestWorstScale2
    //   fast
  },
  mixins : [helper,model,multilanguage],
  computed:{
      _getCurrentQdisplay(){
          return (this.question) ? this.question.display : 0
      }
  },
  data(){
      return {
          G_TAG : "Q",
          currentTag : null,
          project : null,
          projectUntouched : null,
          sched : [],
          history : [],
          browser : null,
          device : null,
          question : null,
          responses : {},
          state : {
            init : false,
            asset : false,
            ready : false
          },
          user : {
            participant_id : null,
            questionnaire_id : null,
            status : null,
            url_data : null,	
            responses : null,
            history : null,
            config_data : null,
          },
          defaultVariables : {
            gscore : 0
          },
          userdetails : {},
          defaultError : {
              title:"Application Error",
              content:"An error has occured, Please contact technical support."
          },
          language : null
      }
  },
  mounted(){
        this.language = this.$route.query.langc ?? null
        this._disableBack()
        this.m_getProject().then((res)=>{
                this._addTemporaryData(res).then(async(data)=>{
                    //this.project = data.questionnaire
                    this.projectUntouched = JSON.parse(JSON.stringify(data.questionnaire))
                    await this._setupLanguage()
                    this.userdetails = data.temp_data
                    document.title = this.project.name

                    this._setupUser().then(()=>{
                        this._errorChecker().then(()=>{
                            this.$refs['loading']._show(true)
                                this._initProject().then(()=>{
                                    this.state.init = true
                                    window.dispatchEvent(new CustomEvent('onInit'))      
                                    this._loadAssets().then(()=>{
                                        this.state.asset = true
                                        this._loadQueryVariables().then(()=>{
                                                this.state.ready = true
                                                this.$refs['progress']._animate(false)
                                                this.$refs['loading']._show(false)
                                                this._start()
                                        })
                                    })
                                })
                        })
                    })
                })
        }).catch((e)=>{
            console.log(e)
            this.$refs['defaultError']._show()
        })


  },
  methods:{
      _addTemporaryData(res){
      return new Promise((resolve)=>{
            res.questionnaire['temporary_data'] = res.temp_data.config_data
            resolve(res)
      })
        /*proj['temporary_data'] = {
            last : "Q1",
            data : {
                        "Q1" : {
                            "TAG": "Q1",
                            "VAR": "a1",
                            "desc": "Item2",
                            "text": "Item2",
                            "value": 2,
                            "ref": {
                                "name": "Item2",
                                "enable_wr": 0,
                                "TAG": "Q1",
                                "VAR": "a1",
                                "order": 2,
                                "display": 2,
                                "value": 2,
                                "checked": false,
                                "checkedValue": 0,
                                "show": true
                            },
                            "question_id": 7138,
                            "order": 1,
                            "display": 1
                        }
            },
            question_display : [
                {
                    'TAG':'Q1',
                    'display':1,
                },{
                    'TAG':'Q2',
                    'display':3,
                },{
                    'TAG':'Q3',
                    'display':2,
                }
            ],
        }
        console.log(proj)  
        proj['temporary_data'] = null
        return proj*/
      },
      _loadTemporaryData(){
        
        return new Promise((resolve)=>{
            this.$nextTick(()=>{

                if(!this.project.temporary_data){
                    resolve()
                    return
                }

                let temp_data = this.project.temporary_data

                if(temp_data.data?.["gscore"]){
                    this.defaultVariables.gscore = parseFloat(temp_data.data.gscore.value ?? 0)
                    window['$gscore'] = this.defaultVariables.gscore
                }
                for (var tag in temp_data.data) {
                        let question_tag = temp_data.data[tag].TAG.split("_")[0]
                        let data = temp_data.data[tag]
                        if(data.value == null){
                            data.value = ""
                            data.text = ""
                        }
                        try{
                            if(this.$refs[question_tag]){
                               this.$refs[question_tag].data.response[tag] = data
                            }else{
                               let qDisplay = this.sched.find((q)=>{
                                   return q.id == data.question_id
                               })
                               this.$refs[qDisplay.TAG].data.response[tag] = data
                            }
                        }catch(e){
                            console.log("question_tag",question_tag)
                            console.log("error",e)
                        }
                }  
                temp_data.question_display.forEach((q)=>{
                       let index = this.project.questions.findIndex((o)=>{
                            return o.TAG == q.TAG
                       })
                       if(index >= 0){
                        this.project.questions[index].display = q.display
                       }
                })
                
                //STATUS CHECKER
                if(this.userdetails.status != "og"){
                    this._getAllWinVars().then((variables)=>{
                        let redirect = this._getRedirectSetup(this.userdetails.status)
                        this._genQueryData({variables:variables,redirect:redirect}).then((url)=>{
                            let next = url
                            setTimeout(()=>{
                                window.location.href =  next.url
                            },next.duration)
                        })
                    })
                    return
                }
                resolve()
            })
        })
      },
      _disableBack(){
                let currentURL = window.location.href;
                window.history.pushState(null, "", currentURL);  
                //setInterval(()=>{ currentURL = window.location.href; window.history.pushState(null, "", currentURL); },300); 
                window.addEventListener("popstate", () => { window.history.pushState(null, "", currentURL); });
      },
      _setupCustomTheme(){
          let style = {}
          if(typeof(this.project?.setup?.design) != 'undefined'){
            if((typeof(this.project?.setup?.design.backgroundImg) != 'undefined') || (this.project?.setup?.design.backgroundImg != "")){
                  this.project.setup.design['background-img-content'] = "url("+this.project.setup.design['background-img']+")"
                  //this.project.setup.design['background-img-after-opacity'] = 0
            }
            for(let x in this.project.setup.design){
                style["--"+x] = this.project.setup.design[x]
            }
          }
          return style
      },
      /*
      _getProject(){
        return new Promise((resolve,reject)=>{
            try{
                //create xmlhttp request for testing
                let qv = this.$route.query
                let resURL = process.env.VUE_APP_API+"/"+ qv['code'];
                if(qv['code']){
                    axios.get(resURL).then((res)=>{
                        if(typeof(res.data.questionnaire.questions) == "undefined"){
                            reject("Invalid Project")
                            return false
                        }
                        resolve(res.data.questionnaire)
                    }).catch((e)=>{
                        reject(e.message)
                    })
                }else
                    reject("Error: No project code.")
            }catch(e){
                reject("Error")
            }
        })
      },
      */
      _setupUser(){
          return new Promise((resolve)=>{
              this.user.participant_id = this.$route.query.id
              this.user.questionnaire_id = this.userdetails.questionnaire_id
              //this.user.started_at = this.project.started_at
              this.user.code = this.$route.query.code
              resolve()
          })
      },
      _errorChecker(){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    if(this.project.status == 0){
                        this.$refs['surveyClosed']._show()
                        reject()
                        return false
                    }
                    if(!this.$route.query.id){
                        this.$refs['noIdAssigned']._show()
                        reject()
                        return false
                    }
                    resolve()
                },500)
                
            })
      },
      _initProject(){
        return new Promise((resolve,reject)=>{
            try{
                this._setCustomCSS()
                this._setCustomJS()
                setTimeout(async ()=>{
                    const promises = [];
                    // let s =  new Promise((resolve2)=>{
                    //     setTimeout(()=>{
                    //         console.log("timeout")
                    //         resolve2()
                    //     },10000)
                    // })
                    // promises.push(s)
                    window.dispatchEvent(new CustomEvent('onSet',{
                        detail: {
                           project : this.project,
                           registerPromise: (p) => {
                              promises.push(p)
                           },
                        }
                    }))
                    await Promise.all(promises);
                 
                    this._generateSchedule().then(()=>{
                        setTimeout(()=>{
                            resolve()
                        },0)
                    }).catch((e)=>{this._abort(e)})
                },500)
                
            }catch(e){
                reject(e.message)
            }
        })
      },
      _setCustomCSS(){
          this.$nextTick(()=> {
                document.head.insertAdjacentHTML("beforeend", `<style type='text/css'>`+this.project.setup.customCSS+`</style>`)
          })
      },
      _setCustomJS(){
          window.addEventListener("getSurveyInfo",(d)=>{
                d.detail.callback(this.project)
          })

          this.$nextTick(()=> {
              try{
                eval(this.project.setup.customJS)
              }catch(e){
                console.log(e.message)
              }
          })
      },
      _loadAssets(){
        return new Promise((resolve,reject)=>{
            try{
                setTimeout(()=>{
                    resolve()
                },0)
            }catch(e){
                reject("Error")
            }
        })
      },
      _loadQueryVariables(){
            return new Promise((resolve)=>{
                let qv = this.$route.query

                window.dispatchEvent(new CustomEvent('onStart'))
                this._loadTemporaryData().then(()=>{
                    this._setAllWinVars().then(()=>{
                        
                        //IF GO TO QUESTION
                        if(qv['gtq']){
                            this.$refs['progress']._animate(false)
                            this.$refs['loading']._show(false)
                            this._next({question:qv['gtq'],transition:'slideLeft'})
                            return
                        }
                        // IF HAS TEMP DATA    

                        // console.log("project",this.project.setup.hidePrevBtn)  
                        // console.log("last",this.project.temporary_data.last)  
                        if(this.project.setup.hidePrevBtn == 1){
                            if(this.project.temporary_data){
                                if(typeof(this.project.temporary_data.last) != "undefined"){
                                    this.$refs['progress']._animate(false)
                                    this.$refs['loading']._show(false)
                                    this._prepare(this.project.temporary_data.last)
                                    return                           
                                }
                            }
                        }
                        resolve()
                    })
                })
            })         
      },
      _generateSchedule(){
            return new Promise((resolve,reject)=>{
                let proj = this.project
                try{
                    let starting_variable = 0
                    // alert(typeof(proj.setup.variable_start))
                    // console.log(proj.setup)

                    if((typeof(proj.setup.variable_start) != "undefined") ){
                        starting_variable = parseInt(proj.setup.variable_start) - 1
                        starting_variable = (starting_variable > 0) ? starting_variable : 0
                    }
                    //Set Orders
                    proj.questions = _.orderBy(proj.questions, ['order'], ['asc'])
                    proj.questions.map((q,k)=>{
                        let order = k + 1 + starting_variable
                        q['order'] = order
                    })
                    //Random Questions
                    if(proj.setup.random == 1){
                        proj.questions = _.shuffle(proj.questions)
                    }
                   
                    if(typeof(proj.setup.randomiseSQ) != "undefined"){
                        proj.questions = this._randomList(proj.questions,proj.setup.randomiseSQ,"id")
                    }
                    //Create Question Schedule
                    proj.questions.map((q,k)=>{
                        q['TAG'] = this.G_TAG+q['order']
                        q['VAR'] = proj.setup.variable+q['order']
                        q['show'] = false
                        q['display'] = k + 1
                        q['response'] = null
                    })
                    this.sched = proj.questions
                    resolve()

                }catch(e){
                    reject(e.message )
                }
            })
      },
      _start(){
         // window.dispatchEvent(new CustomEvent('onStart'))
           // this._setAllWinVars().then(()=>{
                this._next()
           // })
      },
      _prepare(tag){
        let q = _.find(this.sched,{'TAG':tag})
        this._next({question:(q.display + 1),transition:'slideLeft'})
      },
      _next(obj = null){
          if(!obj){
              obj = {
                  question : 1,
                  transition : 'slideLeft'
              }
          }
          obj.question = parseInt(obj.question)
          this.question = this._getQuestion(obj.question)
          
          if(!this.question){
              this._redirect("cp")
              this._abort()
          }
          this.$refs[this.question.TAG]._show(obj.transition).then(()=>{
            this.history.push(this.question)
          })
      },
      _prev(){
         this.history.pop()
          let prev = this.history[this.history.length - 1]
         this.history.pop()
          this._next({question:prev.display,transition:'slideRight'})
      },
      _getQuestion(questionDisplay){
          return _.find(this.sched,{display:questionDisplay})
      },
      _mergeAllResponses(){
           return new Promise((resolve)=>{
              let list = {}
              window['$responses'] = {}
              this.sched.map((q)=>{                
                _.forOwn(q.response, (value, key)=>{ 
                    value['question_id'] = q.id
                    value['order'] = q['order']
                    value['display'] = q['display']
                    list[key] = this._convertStrToFloat(value)
                    if(typeof(value.wc) == "undefined"){
                        window['$responses'][value.TAG] = this._convertStrToFloat(value.text)
                    }else{
                        window['$responses'][value.TAG] = this._convertStrToFloat(value.wc)
                    }
                })
              })

              list['gscore'] = {
                "TAG": "gscore",
                "VAR": "gscore",
                "desc": "OVERALL SCORE",
                "text": this.defaultVariables.gscore,
                "value" : this.defaultVariables.gscore,
                "type": "scoring",
                "ref": null
              }
              resolve(list)
                //   this._applyScoring(list).then((res)=>{
                //      resolve(res)    
                //   })
             
           })
      },
      _applyScoring(list){
        return new Promise((resolve)=>{
            let nlist = list
            console.log("nlist",nlist)
            let allItems = []
            _.forOwn(list, (value)=>{ 
                if(value.type == "scoring"){
                    allItems.push(value)
                }
            })
            console.log("allitems",allItems)
            if(allItems.length > 0){
                const totalScore = allItems.reduce((total, item) => total + parseFloat(item.value ?? 0), 0);
                console.log(totalScore)
                // Object.assign(nlist,{"SCORE":{
                //     "TAG": "SCORE",
                //     "VAR": "SCORE",
                //     "desc": "OVERALL SCORE",
                //     "text": totalScore,
                //     "value" : totalScore
                // }})
            }
            resolve(nlist)
        })
      },
      _setAllWinVars(){
            return new Promise((resolve)=>{
                this._getAllWinVars("TAG").then(($ans)=>{
                    if(!$ans){
                        resolve()
                        return
                    }
                    _.forOwn(this.$route.query, (value, key)=>{ 
                        if(key == "id"){
                            window['$'+key] = value
                        }else{
                            window['$'+key] = this._convertStrToFloat(value)
                        }
                    })  
                    _.forOwn($ans, (value, key)=>{ 
                        window['$'+key] = this._convertStrToFloat(value)
                    })


                    window['$gscore'] = parseFloat(this.defaultVariables.gscore ?? 0)
                    resolve()
                })
            })
      },
      _getAllWinVars($key = "VAR"){
           return new Promise((resolve)=>{
              let data = {}
              this._mergeAllResponses().then((responses)=>{
                    _.forOwn(responses, (value)=>{ 
                        data[value[$key]] = this._convertStrToFloat(value.value)
                       
                        if(value.wc){
                            data[value.VAR+"_wc"] = this._convertStrToFloat(value.wc)
                            if(typeof(value.wc_RTs) != "undefined"){
                                data[value[$key]+"_wc_RTs"] = this._convertStrToFloat(value.wc_RTs)
                            }
                        }
                    })
              })
              
              resolve(data)
          })         
      },
      _getAllResponseData(need = ["question_id","TAG","VAR","value","text","order","display","meta","rt"]){
           return new Promise((resolve)=>{
                let data = []
                this._mergeAllResponses().then((responses)=>{
                        _.forOwn(responses, (value)=>{
                            let x = {}
                            need.forEach((v)=>{
                                x[v] = value[v]
                            })
                            if(value.wc){
                                x["wc"] = value.wc
                                if(typeof(value.wc_RTs) != "undefined"){
                                    x["wc_RTs"] = value.wc_RTs
                                }
                            }
                            data.push(x)
                        })
                        data = this._orderByAlphaNum(data,"TAG")
                        resolve(data)
                })
           })

      },
      /*
      _generateResponses(){
          return new Promise((resolve)=>{
              let list = {}
              this.sched.map((q)=>{                
                _.forOwn(q.response, (value, key)=>{ 
                    value['question_id'] = q.id
                    value['order'] = q['order']
                    value['display'] = q['display']
                    list[key] = value
                })
              })
              //list = this._sortObjAlphaNumeric(list)
              this.responses = list
              //console.log(this.responses)
              resolve()
          })
      },
      _getResponseVariables($key = "VAR"){
          return new Promise((resolve)=>{
              let data = {}
              _.forOwn(this.responses, (value)=>{ 
                  data[value[$key]] = value.value
                  if(value.wc){
                      data[value.VAR+"_wc"] = value.wc
                      if(typeof(value.wc_RTs) != "undefined"){
                           data[value.VAR+"_wc_RTs"] = value.wc_RTs
                      }
                  }
              })
              resolve(data)
          })
      },
        _generateWVariables(){
            return new Promise((resolve)=>{
                this._getResponseVariables("TAG").then(($ans)=>{
                    if(!$ans){
                        resolve()
                        return
                    }
                    _.forOwn(this.$route.query, (value, key)=>{ 
                        window['$'+key] = value
                    })  
                    _.forOwn($ans, (value, key)=>{ 
                        window['$'+key] = value
                    })
                    resolve()
                })
            })
        },

      _getResponseVarArr(need = ["question_id","TAG","VAR","value","text","order","display","meta"]){
               let data = []
              _.forOwn(this.responses, (value)=>{
                  let x = {}
                  need.forEach((v)=>{
                      x[v] = value[v]
                  })
                  if(value.wc){
                      x["wc"] = value.wc
                      if(typeof(value.wc_RTs) != "undefined"){
                          x["wc_RTs"] = value.wc_RTs
                      }
                  }
                  data.push(x)
              })
              data = this._orderByAlphaNum(data,"TAG")
              return data
      },
      */
      _getHistoryArr(need = ["id","TAG","VAR","display","order"]){
          let data = []
          this.history.map((value)=>{
                let x = {}
                need.forEach((v)=>{
                    x[v] = value[v]
                })
                data.push(x)
          })
           return data
      },
      _arrayToURI(arr,ex = [],ChangeEmptyStr = false){
          let uri = ""
          _.forOwn(arr,(v,k)=>{
              if(_.indexOf(ex,k) < 0){
                if(ChangeEmptyStr){
                    if(v !== ''){
                        //v = '-'
                        uri += k+"="+encodeURIComponent(v)+"&"
                    }
                }else{
                    uri += k+"="+encodeURIComponent(v)+"&"
                }
                
              }
          })
          uri = uri.slice(0, -1)
          return uri
      },
      _abort(msg = ''){
          throw msg
      },
      _getRedirectSetup(status){
                let redirect = null
                if(status == "cp"){
                    redirect = this.project.setup.redirects.complete
                }else if(status == "so"){
                    redirect = this.project.setup.redirects.screenout
                }else if(status == "qc"){
                    redirect = this.project.setup.redirects.qualityControl
                }

                if((typeof(this.project.setup.redirects2) != "undefined") && (this.project.setup.redirects2.length > 0)){
                    let panels = this.project.setup.redirects2
                    panels.forEach((obj,key)=>{
                         if(typeof(this.$route.query[obj.variable]) != "undefined"){
                             if(key == this.$route.query[obj.variable]){
                                if(status == "cp"){
                                    redirect = obj.complete
                                }else if(status == "so"){
                                    redirect = obj.screenout
                                }else if(status == "qc"){
                                    redirect = obj.qualityControl
                                }
                             }
                         }
                    })
                }
           // console.log(redirect)
            return redirect

      },
      _storeData(status){
          /* Status variable is use to determine if the respondent qualified or not */
          return new Promise((resolve,reject)=>{
              try{
                  this._getAllWinVars().then((variables)=>{
                        let redirect = this._getRedirectSetup(status)
                        this._genQueryData({variables:variables,redirect:redirect}).then((url)=>{
                            redirect = url
                            this.user.status = status 
                            this.user.url_data = {
                                internal:variables,
                                external : this.$route.query,
                            }     

                            this._getAllResponseData().then((data)=>{
                                    window.dispatchEvent(new CustomEvent('onSave'))
                                    this.user.responses = data
                                    this.user.history = this._getHistoryArr()
                                
                                    this.m_saving().then((res)=>{
                                        console.log(res)
                                        resolve(redirect);
                                    }).catch((e)=>{
                                        reject(e.message)
                                    })
                            })


                        })
                   })
              }catch(e){
                  /* Error checking */
                  setTimeout(()=>{
                       console.log(e.message)
                        reject(e)
                  },3000)
              }
          })
      },
      _genQueryData(obj){
            return new Promise((resolve,reject)=>{
                try {
                      let variables = obj.variables
                      let redirect = obj.redirect
                      let vars = this._arrayToURI(variables,[],true)

                      //PASS EXTERNAL VARIABLES
                      if(redirect.passExternalVars == 1){
                        let query = this._arrayToURI(this.$route.query,["code"])
                        if (redirect.url.includes("?")) {
                            redirect.url = redirect.url+"&"+query
                        }else{
                            redirect.url = redirect.url+"?"+query
                        }                         
                      }

                      //PASS INTERNAL VARIABLES
                      if(redirect.passInternalVars == 1){
                        if (redirect.url.includes("?")) {
                            redirect.url = redirect.url+"&"+vars
                        }else{
                            redirect.url = redirect.url+"?"+vars
                        }
                      }

                      //PASS CUSTOM VARIABLES
                      _.forOwn(variables, (value, key)=>{ 
                            redirect.url = redirect.url = redirect.url.split("["+key+"]").join(value)
                      })
                      _.forOwn(this.$route.query, (value, key)=>{ 
                            redirect.url = redirect.url = redirect.url.split("["+key+"]").join(value)
                      }) 
                      
                    
                    resolve(redirect)
                  
              }catch(e){
                  setTimeout(()=>{
                        reject(e)
                  },3000)
              }
          })
      },
      /*
      _redirect(status){
          let redirect = null
          this.$refs['progress']._animate(true)
          if(status == "cp"){
            redirect = this.project.setup.redirects.complete
          }else if(status == "so"){
            redirect = this.project.setup.redirects.screenout
          }else if(status == "qc"){
            redirect = this.project.setup.redirects.qualityControl
          }else{
            redirect = null
          }
          this.$refs['endPage']._show(true,this.project.setup.messages.saving)

          
                this._storeData(status,redirect).then((next)=>{
                        this.$refs['endPage']._show(true,next.content)
                        setTimeout(()=>{
                            window.location.href =  next.url
                        },next.duration)
                }).catch(()=>{
                        this.$refs['connectionLost']._show().then(()=>{
                            setTimeout(()=>{
                                this.$refs['connectionLost']._hide().then(()=>{
                                    this._redirect(status)
                                })
                            },5000)
                        })
                })

      },*/
      _redirect(status){
          this.$refs['progress']._animate(true)
          this.$refs['endPage']._show(true,this.project.setup.messages.saving)
          this.m_queSaving(status).then((res)=>{
                if(res.data.status == 1){
                    let redirect = this._getRedirectSetup(status)
                    this._genQueryData({variables:this.user.url_data.internal,redirect:redirect}).then((url)=>{
                        let next = url
                        this.$refs['endPage']._show(true,next.content)
                        setTimeout(()=>{
                            window.location.href =  next.url
                        },next.duration)
                    })
                }
          }).catch(()=>{
                    this.$refs['connectionLost']._show().then(()=>{
                    setTimeout(()=>{
                        this.$refs['connectionLost']._hide().then(()=>{
                            this._redirect(status)
                        })
                    },5000)
                })           
          })

          /*
                this._storeData(status,redirect).then((next)=>{
                        this.$refs['endPage']._show(true,next.content)
                        setTimeout(()=>{
                            window.location.href =  next.url
                        },next.duration)
                }).catch(()=>{
                        this.$refs['connectionLost']._show().then(()=>{
                            setTimeout(()=>{
                                this.$refs['connectionLost']._hide().then(()=>{
                                    this._redirect(status)
                                })
                            },5000)
                        })
                })
            */
            

      },
      _fullscreen(){
          try{
                // let elem = document.querySelector("body")
                // if (elem.requestFullscreen) {
                //     elem.requestFullscreen()
                // } else if (elem.webkitRequestFullscreen) { /* Safari */
                //     elem.webkitRequestFullscreen()
                // } else if (elem.msRequestFullscreen) { /* IE11 */
                //     elem.msRequestFullscreen()
                // }
          }
          catch(e){
              console.log(e.message)
          }
      }
      
  }



}
</script>
