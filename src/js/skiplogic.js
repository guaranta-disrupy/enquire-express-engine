let _ = require('lodash')

export default {
    methods : {
        _hasQVariable(conditions = []) {
            let found = false
            const walk = (conds) => {
                (conds || []).forEach((con) => {
                    if (found) return
                    if (con.method === 'process' && con.var === 'Q') {
                        found = true
                        return
                    }
                    if (con.method === 'segment' && Array.isArray(con.conditions)) {
                        walk(con.conditions)
                    }
                })
            }
            walk(conditions)
            return found
        },
        _advanceSkiplogic(process = "enter"){
            return new Promise((resolve)=>{
                //this.$parent._getResponseVariables("TAG").then(($ans)=>{
                        //if(!$ans){return}

                 //TEMP REMOVE
                 //this.$parent._generateWVariables().then(()=>{
                        if(typeof(this.data.setup.advanceSkiplogic) == "undefined"){
                            resolve()
                            return
                        }
                        if(typeof(this.data.setup.advanceSkiplogic[process]) == "undefined"){
                            resolve()
                            return
                        }
                        // Map URL query params into $Q variables, but only in preview
                        const isPreviewUrl = this.$route && this.$route.query && this.$route.query.preview === '1'
                        if (isPreviewUrl && this.$route && this.$route.query) {
                            _.forOwn(this.$route.query, (value, key)=>{ 
                                // e.g. &Q1_1=1 ⇒ window["$Q1_1"] = 1
                                window['$'+key] = value
                            })  
                        }
                        // _.forOwn($ans, (value, key)=>{ 
                        //     window['$'+key] = value
                        // })  
                        //this.data.setup.advanceSkiplogic[process].some((sk)=>{

                        //PRIORITIZE AUTOCODES
                        let autocodeSK = this.data.setup.advanceSkiplogic[process].filter((obj)=>{
                            return obj.action == "auto_code"
                        })
                        let otherSK = this.data.setup.advanceSkiplogic[process].filter((obj)=>{
                            return obj.action != "auto_code"
                        })

                        let allSKs = [...autocodeSK, ...otherSK]
                        //console.log("sks",allSKs)

                            // console.log(autocodeSK)
                        //for(let x = 0; x < this.data.setup.advanceSkiplogic[process].length; x++){
                        for(let x = 0; x < allSKs.length; x++){
                            //let sk = this.data.setup.advanceSkiplogic[process][x]
                            let sk = allSKs[x]

                            // PREVIEW-ONLY: ignore this logic if any condition uses var === 'Q'
                            const isPreview = this.$route && this.$route.query && this.$route.query.preview === '1'
                            if (isPreview && this._hasQVariable(sk.conditions)) {
                                continue
                            }
                            let condition = this._criteriaToString(sk.conditions)
                            let conditionForDataSaving = this._criteriaToStringForDataSaving(sk.conditions)
                            //console.log(condition)
                            let pass = true
                            if(sk.conditioning == "custom"){
                                condition = sk.custom
                                conditionForDataSaving = sk.custom
                            }
                            try{
                                // console.log(this.data.TAG)
                                // console.log(sk)
                                // console.log(process+' '+condition+' '+sk.action +' '+eval(condition))   
                                if(eval(condition)){          
                                    if(sk.action == "screenout"){
                                        pass = false
                                        
                                        this.$parent.user.status = "so"
                                       
                                        
                                        this._screenout({
                                            skiplogic_index : (x + 1),
                                            expression : conditionForDataSaving
                                        })
                                        return false   
                                    }else if(sk.action == "quality_control"){
                                        pass = false

                                        this.$parent.user.status = "qc"

                                        this._qualityControl({
                                            skiplogic_index : (x + 1),
                                            expression : conditionForDataSaving
                                        })
                                        return false                                       
                                    }else if(sk.action == "complete"){
                                        pass = false
                                        this._finishSurvey()
                                        return false                                       
                                    }else if(sk.action == "jump_to"){
                                        pass = false
                                        this._jumpTo(sk.jump_to)
                                        return false                                       
                                    }else if(sk.action == "skip"){
                                        //console.log("PARENT",this.$parent)
                                        //alert(this.data.display)
                                        //console.log("DATA",this.data)
                                        let next = this.data.display + 1
                                        //let next = this.data.order + 1
                                        pass = false
                                        this._jumpTo(next)
                                        return false                             
                                    }else if(sk.action == "auto_code"){
                                        //console.log("sk",sk)
                                        this._auto_code(sk.autocode)
                                    }
                                    else{
                                        if(typeof(this["_"+sk.action]) != "undefined"){
                                            this["_"+sk.action](sk.value)
                                        }
                                    }
                                }
                            }
                            catch(e){
                                if(!pass){
                                    throw e.message
                                }
                                //console.log(e.message)
                            }
                        }
                        //})
                        resolve()
                //})//TEMP REMOVE
            }) 
        },
        // _skiplogicEnter(){
        //     return new Promise((resolve)=>{
        //         let $Q = this
        //         let $ans = this.$parent.responses
        //         try{
        //             if($Q || $ans){
        //                 eval(this.data.setup.customSkiplogic.enter)
        //                 resolve()
        //             }
        //         }catch(e){
        //             console.log(e.message)
        //         }
        //         resolve()
        //     }) 
        // },
        // _skiplogicLeave(){
        //     return new Promise((resolve)=>{
        //         let $Q = this
        //         let $ans = this.$parent.responses
        //         try{
        //             if($Q || $ans){
        //                 eval(this.data.setup.customSkiplogic.leave)
        //                 resolve()
        //             }
        //         }catch(e){
        //             console.log(e.message)
        //         }
        //         resolve()
        //     }) 
        // },
        _skiplogicProcess(skiplogic){
            switch(skiplogic.action){
                case 1 ://DISQUALIFY RESPONDENT
                    this._screenout(skiplogic.question)
                break;
                case 2 ://JUMP TO
                    this._jumpTo(skiplogic.question)
                break;
                case 3 ://FINISH SURVEY
                    this._finishSurvey(skiplogic.question)
                break;
                case 4 ://QUALITY CONTROL
                    this._qualityControl(skiplogic.question)
                break;
            }
        },
        _criteriaToString(conditions) {
            var string = ''

           conditions.forEach((con,key)=>{
                if (key == 0) {
                    string += '('
                }else {
                    string += ' '+con.left_operator + ' ('
                }
                if (con.method == 'process') {
                    string += 'window["$'+con.var+'"]'+ con.operator + con.val
                }else {
                    string += this._criteriaToString(con.conditions)
                }
                string += ')'
            })


            return string
        },
        _criteriaToStringForDataSaving(conditions) {
            var string = ''

           conditions.forEach((con,key)=>{
                if (key == 0) {
                    string += '('
                }else {
                    string += ' '+con.left_operator + ' ('
                }
                if (con.method == 'process') {
                    string += con.var + con.operator + con.val
                }else {
                    string += this._criteriaToStringForDataSaving(con.conditions)
                }
                string += ')'
            })


            return string
        },       
        _jumpTo(questionOrder){
            let sched = this.$parent.sched
            //let target = _.find(sched,{order:parseInt(questionOrder)})
            let target = _.find(sched,{display:parseInt(questionOrder)})
            this._hide2('slideLeft').then(()=>{
                if((!target)){
                   this._finishSurvey()
                   return
                }
                let next = target.display
                this.$parent._next({question:next,transition:'slideLeft'})
            })      
            this.$parent._abort()
        },
        _finishSurvey(){
            this._hide2('slideLeft').then(()=>{
                this.$parent._redirect("cp")
            })
            this.$parent._abort()
        },
        _screenout(obj){
                let question = this.data
                let meta = {
                    TAG : question.TAG,
                    VAR : question.VAR,
                    question : question.question,
                    question_type_id : question.question_type_id,
                    questionnaire_id : question.questionnaire_id,
                    choices : question.choices,
                    form : question.form,
                    item1 : question.item1,
                    item2 : question.item2,
                    item3 : question.item3,
                    rows: question.rows,
                    columns : question.columns
                }
                let fluentData = {
                    participant_id : this.$route.query.id,
                    variable : question.VAR,
                    source : 'express',
                    meta : meta,
                    skiplogic_index : 0,
                    expression : ''
                }
                Object.assign(fluentData,obj)
                this._hide2('slideLeft').then(()=>{
                    this.$parent._fluentRescordSO(fluentData).then((res)=>{
                        if(res.status == 200){
                            this.$parent._redirect("so")
                        }else{
                           this.$parent.$refs['connectionLost']._show().then(()=>{
                                setTimeout(()=>{
                                    this.$parent.$refs['connectionLost']._hide().then(()=>{
                                        this._screenout(obj)
                                    })
                                },5000)
                           }) 
                        }
                    })   
                })
            
            this.$parent._abort()
        
        },
        _qualityControl(obj){
            let question = this.data
            let meta = {
                TAG : question.TAG,
                VAR : question.VAR,
                question : question.question,
                question_type_id : question.question_type_id,
                questionnaire_id : question.questionnaire_id,
                choices : question.choices,
                form : question.form,
                item1 : question.item1,
                item2 : question.item2,
                item3 : question.item3,
                rows: question.rows,
                columns : question.columns
            }
            let fluentData = {
                participant_id : this.$route.query.id,
                variable : question.VAR,
                source : 'express',
                meta : meta,
                skiplogic_index : 0,
                expression : ''
            }
            Object.assign(fluentData,obj)
            this._hide2('slideLeft').then(()=>{
                this.$parent._fluentRescordSO(fluentData).then((res)=>{
                    if(res.status == 200){
                        this.$parent._redirect("qc")
                    }else{
                       this.$parent.$refs['connectionLost']._show().then(()=>{
                            setTimeout(()=>{
                                this.$parent.$refs['connectionLost']._hide().then(()=>{
                                    this._qualityControl(obj)
                                })
                            },5000)
                       }) 
                    }
                })   
            })

            // this._hide2('slideLeft').then(()=>{
            //     this.$parent._redirect("qc")
            // })
            this.$parent._abort()
        },
        _auto_code(autocode){
            //console.log("this...",this)
            let vs = autocode.variable.split("_")
            // console.log(vs)
            // console.log("autocode...",autocode)
            // console.log("ref...",this.$parent.$refs[vs[0]])
            this.$parent.$refs[vs[0]].data.response[autocode.variable].value = autocode.value
            this.$parent.$refs[vs[0]].data.response[autocode.variable].text = autocode.text
            this.$parent._setAllWinVars().then(()=>{
                
            })
        }
    }
}