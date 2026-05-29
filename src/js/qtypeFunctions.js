let _ = require('lodash')
import skiplogicSetup from '@/js/skiplogic'
import helper from '@/js/helper'


export default {
    data(){
        return {
            transition : 'slideRight',
            disableBtn : false,
        }
    },
    mixins : [skiplogicSetup, helper],
    computed:{
        _pipeQuestion(){
                let $ans = this.$parent.responses
                let txt = this.data.question
                _.forOwn($ans, (value, key)=>{ 
                    txt = txt.split("[PIPE:"+key+"]").join(value.text)
                })          
                _.forOwn(this.$route.query, (value, key)=>{ 
                    txt = txt.split("[QUERY:"+key+"]").join(value)
                })
                return txt
        }
    },
    methods:{
        _pipeText(w){
            //let $ans = this.$parent.responses
            let $ans = window['$responses']
            let txt = w
            if(w == null){
                return ""
            }
            _.forOwn($ans, (value, key)=>{ 
                // if(typeof(value.wc) == 'undefined'){
                //     txt = txt.split("[PIPE:"+key+"]").join(value.text)
                // }else{
                //     txt = txt.split("[PIPE:"+key+"]").join(value.wc)
                // }

                let val = value;
                val = val.toString().replace(/<\/?p>/g, '');

                txt = txt.split("[PIPE:"+key+"]").join("<span class='piped'>"+val+"</span>")
               // txt = txt.replace(/<span[^>]*PIPE:Q1[^>]*>.*?<\/span>/g, "<div class='piped'>"+value+"</div>")
              
                let regexPattern = new RegExp(`<span[^>]*data-pipe="PIPE:${key}"[^>]*>.*?</span>`, "g");
                txt = txt.split(regexPattern).join("<span class='piped'>"+val+"</span>")


            })          
            _.forOwn(this.$route.query, (value, key)=>{ 

                let val = value;
                val = val.toString().replace(/<\/?p>/g, '');
                
                txt = txt.split("[QUERY:"+key+"]").join("<span class='piped'>"+val+"</span>")
                //txt = txt.replace(/<span[^>]*QUERY:Q1[^>]*>.*?<\/span>/g, "<div class='piped'>"+value+"</div>")
               // txt = txt.split(/<span[^>]*data-pipe="QUERY:Q1"[^>]*>.*?<\/span>/).join("<div class='piped'>"+value+"</div>")

               let regexPattern = new RegExp(`<span[^>]*data-pipe="QUERY:${key}"[^>]*>.*?</span>`, "g");
               txt = txt.split(regexPattern).join("<span class='piped'>"+val+"</span>")
            })

            
           
            txt = txt.replace(/&nbsp;/gi, " ");
            txt = txt.replace(/\s+/gi, " ");
            //console.log("Executed : ",txt)
            //console.log("Label", txt.match(/&nbsp;/gi))
            return txt
            
        },
        _boxStyle(){
            let style = {}
            if(this.data?.setup?.boxStyle){
              for(let x in this.data.setup.boxStyle){
                  style["--question-"+x] = this.data.setup.boxStyle[x]
              }
            }
            return style
        },
        _show(transition = 'slideLeft'){
            let transitionTime = 200
            this.transition = transition
            this.$parent._fullscreen()
            return new Promise((resolve)=>{
                if(typeof(this._reset) != "undefined"){
                    this._reset()
                }
                this._enter().then(()=>{
                    this.data.show = true
                    setTimeout(()=>{
                        window.dispatchEvent(new CustomEvent(this.data.TAG+'_onEnter'))
                        resolve()
                    },transitionTime)
                })
            })
        },
        _hide(transition = 'slideRight'){
            let transitionTime = 200
            this.transition = transition
            
            return new Promise((resolve)=>{
                this._leave().then(()=>{
                        this.data.show = false
                        setTimeout(()=>{
                            resolve()
                        },transitionTime)
                })
            })        
        },
        _hide2(transition = 'slideRight'){
            let transitionTime = 200
            this.transition = transition
            return new Promise((resolve)=>{
                this.data.show = false
                setTimeout(()=>{
                    resolve()
                },transitionTime)
            })        
        },
        _next(){
            this._setAns().then(()=>{
                this._required().then(()=>{
                    this.$parent._setAllWinVars().then(()=>{
                            let _CONTINUE = ()=>{
                                this._skiplogic().then(()=>{
                                    this._hide('slideLeft').then(()=>{
                                        this._individualSaving().then(()=>{                                    
                                            let next = this.data.display + 1
                                            this.$parent._next({question:next,transition:'slideLeft'})
                                        })
                                    })
                                })                               
                            }

                            let detail = {
                                proceed: true,
                                question:this,
                                _next:()=>{
                                    detail.proceed  = false
                                    this._hide('slideLeft').then(()=>{
                                        let next = this.data.display + 1
                                        this.$parent._next({question:next,transition:'slideLeft'})
                                    })
                                },
                                _prev:()=>{
                                    detail.proceed  = false
                                    this._hide2('slideRight').then(()=>{
                                        this.$parent._prev()
                                    })
                                },
                                _screenout:(obj = {
                                    skiplogic_index : 0,
                                    expression : '-'
                                })=>{
                                    detail.proceed  = false
                                    this._screenout(obj)
                                },
                                _qualityControl:(obj = {
                                    skiplogic_index : 0,
                                    expression : '-'
                                })=>{
                                    detail.proceed  = false
                                    this._qualityControl(obj)
                                },
                                _complete:()=>{
                                    detail.proceed  = false
                                    this._finishSurvey()
                                },
                                _continue:()=>{
                                    detail.proceed  = false
                                    _CONTINUE()
                                },
                                _async:(obj)=>{
                                    detail.proceed  = false
                                    obj.process().then(()=>{
                                       obj.callback()
                                    })
                                }
                            }
                            window.dispatchEvent(new CustomEvent(this.data.TAG+'_onLeave', {detail:detail}))
                            
                            if(!detail.proceed){
                                return false
                            }
                            _CONTINUE()
                            /*this._skiplogic().then(()=>{
                                this._hide('slideLeft').then(()=>{
                                    let next = this.data.display + 1
                                    this.$parent._next({question:next,transition:'slideLeft'})
                                })
                            })*/


                     })
                })

            })
        },
        _prev(){
            this._hide2('slideRight').then(()=>{
                this.$parent._prev()
            })
        },
        _enter(){
            return new Promise((resolve)=>{
                this.$parent.currentTag = this.data.TAG
                this._advanceSkiplogic("enter").then(()=>{
                    resolve()
                })
            })
        },
        _leave(){
            return new Promise((resolve)=>{
                    this._advanceSkiplogic("leave").then(()=>{
                        resolve()
                    })
            })           
        },
        _individualSaving(){
            return new Promise((resolve)=>{
                //this.$parent._getAllWinVars("TAG").then((variables)=>{
                /*
                this.$parent._mergeAllResponses().then((responses)=>{
                    let temp = {
                        last : this.data.TAG,
                        data : responses,
                        question_display : this._getQuestionDisplay()
                    }
                    this.$parent.user.config_data = temp
                    
                    this.$parent.m_queSaving().then(()=>{
                        resolve()
                    })
                })
                */
                this.$parent.m_queSaving().then(()=>{
                    resolve()
                })

            })
        },
          _isGibberish(text){
            const letters = text.replace(/[^a-z]/gi, '').toLowerCase();
            if (!letters || letters.length < 3) return true;
            const vowels = (letters.match(/[aeiou]/g) || []).length;
            const vowelRatio = vowels / letters.length;
            const mashPatterns = /(asdf|qwerty|zxcv)/.test(letters);
            return vowelRatio < 0.2 || mashPatterns;
        },
        _checkGibberish(){
            if (this.data?.setup?.detectGibberish == 1) {
                const eventName = this.data.TAG + '_onLeave';
                const self = this;
                
                const handler = function(d) {
                    //d.detail.proceed = false;
                    //console.log(d.detail.question.data);
                    
                    let hasGibberish = false;
                    const qType = d.detail.question.data?.question_type_id || null;
                    
                    // Check based on question type
                    if (qType === 6) { // openEnded
                        hasGibberish = self._isGibberish(d.detail.question.data.form?.input || "");
                    } else if (qType === 4) { // singleTextbox
                        hasGibberish = self._isGibberish(d.detail.question.data.form?.input || "");
                    } else if (qType === 5) { // multipleTextbox
                        if (d.detail.question.data.items && d.detail.question.data.items.length > 0) {
                            hasGibberish = d.detail.question.data.items.some(item => {
                                return self._isGibberish(item.form?.input || "");
                            });
                        }
                    } else if (qType === 8) { // slider
                        if (d.detail.question.data.items && d.detail.question.data.items.length > 0) {
                            hasGibberish = d.detail.question.data.items.some(item => {
                                return item.wc && self._isGibberish(item.wc?.input || "");
                            });
                        }
                    } else if (qType === 2) { // multipleChoice
                        if (d.detail.question.data.choices && d.detail.question.data.choices.length > 0) {
                            hasGibberish = d.detail.question.data.choices.some(choice => {
                                return choice.wc && self._isGibberish(choice.wc?.input || "");
                            });
                        }
                    } else if (qType === 11 || qType === 12) { // matrix or matrixMulti
                        if (d.detail.question.data.rows && d.detail.question.data.rows.length > 0) {
                            hasGibberish = d.detail.question.data.rows.some(row => {
                                return row.wc && self._isGibberish(row.wc?.input || "");
                            });
                        }
                    }
                    
                    //console.log('hasGibberish:', hasGibberish);
                    // if (!hasGibberish) {
                    //     d.detail._continue();
                    // } else {
                    //     d.detail._qualityControl();
                    // }
                    if(hasGibberish){
                        d.detail._qualityControl();
                    }
                };
                
                window.addEventListener(eventName, handler);
                this._gibberishHandler = handler;
            }
        },
        /*
        _getQuestionDisplay(){
            let temp = []
            this.$parent.project.questions.forEach((q)=>{
                let t = {
                    TAG : q.TAG,
                    VAR : q.VAR,
                    display : q.display
                }
                temp.push(t)
            })
            return temp
        }*/


    }
}