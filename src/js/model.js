//let _ = require('lodash')
const axios = require('axios')
const CancelToken = axios.CancelToken;
let CancelSource = null

export default {
    data(){
        return {
            que : {
                controller : null,
                saving :false
            }
        }
    },
    methods:{

        m_getProject(){
            return new Promise((resolve,reject)=>{
                try{
                    let qv = this.$route.query
                    let resURL = process.env.VUE_APP_API+"/show2";
                    if(qv['code']){
                        let obj = {
                            ...qv,
                            questionnaire_code: qv['code'],
                            participant_id: qv['id'],
                        }
                        delete obj.code;
                        delete obj.id;
                        
                        axios.post(resURL,obj).then((res)=>{
                            if(typeof(res.data.questionnaire.questions) == "undefined"){
                                reject("Invalid Project")
                                return false
                            }
                            //console.log(res.data)
                            resolve(res.data)
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

        /*
        VERSION 1
        m_getProject(){
            return new Promise((resolve,reject)=>{
                try{
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
        m_prepareSaving(status){
            return new Promise((resolve,reject)=>{
                try{
                    
                    this._getAllWinVars().then((variables)=>{
                          //console.log(variables)

                          this.user.status = status 
                          this.user.url_data = {
                              internal:variables,
                              external : this.$route.query,
                          } 
                          //console.log(this.user.url_data)
                          this._getAllResponseData().then((data)=>{

                                    this.user.responses = data
                                    this.user.history = this._getHistoryArr()
                                    //console.log(this.user)
                                    if(status == "cp"){
                                        window.dispatchEvent(new CustomEvent('onSave'))
                                    }
                                    this.m_saving().then((res)=>{
                                        if(status != "og"){
                                           if(res.data.status != 1){
                                                reject()
                                                return false
                                           }
                                            resolve(res);
                                        }
                                    }).catch((e)=>{
                                        reject(e.message)
                                    })
                                    if(status == "og"){
                                        resolve(null);
                                    }

                          })
                    })
                          /*this._genQueryData({variables:variables,redirect:redirect}).then((url)=>{
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
  
  
                          })*/
                        

                        }
                catch(e){

                    setTimeout(()=>{
                         console.log(e.message)
                          //reject(e)
                    },3000)
                } 
            })     
        },
        m_saving(){
           return new Promise((resolve,reject)=>{
                 
                if(CancelSource){
                    
                    CancelSource.cancel('Operation canceled by the user.');
                }
                CancelSource = CancelToken.source();
                
                axios.put(process.env.VUE_APP_API+"/"+this.userdetails.id,this.user,{cancelToken:CancelSource.token}).then((res)=>{
                //axios.post(process.env.VUE_APP_API,this.user).then((res)=>{
                    CancelSource = null
                    //console.log(res)
                    resolve(res);
                }).catch((e)=>{
                    reject(e.message)
                })
                //resolve()
                
            })           
        },
        m_configData(){
            return new Promise((resolve)=>{
                this._mergeAllResponses().then((responses)=>{
                    let temp = {
                        last : this.currentTag,
                        data : responses,
                        question_display : this._getQuestionDisplay()
                    }
                    this.user.config_data = temp
                    //console.log(this.user)
                    resolve()
                })
            })     
        },
        _getQuestionDisplay(){
            let temp = []
            this.project.questions.forEach((q)=>{
                let t = {
                    TAG : q.TAG,
                    VAR : q.VAR,
                    display : q.display
                }
                temp.push(t)
            })
            return temp
        },
        m_queSaving(status = "og"){
            return new Promise((resolve,reject)=>{
                this.m_configData().then(()=>{
                    this.m_prepareSaving(status).then((res)=>{
                        resolve(res)
                    }).catch((e)=>{
                        if(status != "og"){
                            reject(e)
                        }
                    })
                })


            })
        },
        _fluentRescordSO(data){
            return new Promise ((resolve)=>{
                let survey_id = this.project.setup.survey_id
                console.log(process.env)
                let resURL = process.env.VUE_APP_FLUENT_API+"screened-respondents/"+survey_id;
                axios.post(resURL,data).then((res)=>{
                    console.log(res)
                    resolve(res)
                }).catch((e)=>{
                    console.log(e)
                    resolve({
                        status:500
                    })
                })
            })
        }

    }
}