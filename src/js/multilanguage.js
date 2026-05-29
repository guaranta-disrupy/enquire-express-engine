export default {
    methods:{
        _setupLanguage(){
            return new Promise((resolve)=>{
                this.project = JSON.parse(JSON.stringify(this.projectUntouched))
                //Object.assign(this.project, JSON.parse(JSON.stringify(this.projectUntouched)))
                let language = this.language
                if(!language){
                    resolve()
                }
                this.project.setup['rtl'] = this.project.setup?.language?.[language]?.rtl ?? this.project.setup?.['rtl'] ?? 0
                //console.log("project",this.project)

                this.project.questions.forEach(question => {
                    question.question = question.setup?.language?.[language]?.question ?? question.question
                    if(question.question_type_id == 2 || question.question_type_id == 3 || question.question_type_id == 20){
                        question.choices.forEach(choice => {
                            choice.name = choice?.language?.[language]?.name ?? choice.name
                            if(choice['enable_wr'] == '1'){
                                choice['wc']['setup']['placeholder'] =  choice?.language?.[language]?.placeholder ?? choice['wc']['setup']['placeholder'] 
                            }
                        });
                    }

                    if(question.question_type_id == 4){
                        question.setup.prependString = question?.setup?.language?.[language]?.prependString ?? question.setup.prependString
                        question.setup.appendString = question?.setup?.language?.[language]?.appendString ?? question.setup.appendString
                    }

                    if(question.question_type_id == 5 || question.question_type_id == 7 || question.question_type_id == 8 || question.question_type_id == 9 || question.question_type_id == 10 || question.question_type_id == 12 || question.question_type_id == 13 || question.question_type_id == 14 || question.question_type_id == 15 || question.question_type_id == 17 || question.question_type_id == 18 || question.question_type_id == 19){
                        question.items.forEach(item => {
                            item.name = item?.language?.[language]?.name ?? item.name
                        });
                    }

                    if(question.question_type_id == 11){
                        question.rows.forEach(row => {
                            row.name = row?.language?.[language]?.name ?? row.name
                        });
                        question.columns.forEach(column => {
                            column.name = column?.language?.[language]?.name ?? column.name
                        });
                    }

                    if(question.question_type_id == 8 || question.question_type_id == 15 || question.question_type_id == 16){
                        question.values.forEach(value => {
                            value.name = value?.language?.[language]?.name ?? value.name
                        });
                    }

                    if(question.question_type_id == 15){
                        question.header = question?.language?.[language]?.header ?? question.header
                        question.footer = question?.language?.[language]?.footer ?? question.footer
                    }

                    // if(question.question_type_id == 16 || question.question_type_id == 20){
                    //     question['labelA'] = question?.language?.[language]?.labelA ?? question['labelA']
                    //     question['labelB'] = question?.language?.[language]?.labelB ?? question['labelB']
                    // }

                    if(question.question_type_id == 16 || question.question_type_id == 20 || question.question_type_id == 22){
                        question.setup.bestWostScale.labelA = question?.setup?.language?.[language]?.labels?.statementA ?? question.setup.bestWostScale.labelA
                        question.setup.bestWostScale.labelB = question?.setup?.language?.[language]?.labels?.statementB ?? question.setup.bestWostScale.labelB
                    }

                    if(question.question_type_id == 16){
                        question.items.forEach(item => {
                            item.statementA = item?.language?.[language]?.statementA ?? item.statementA
                            item.statementB = item?.language?.[language]?.statementB ?? item.statementB
                        });
                    }

                    if(question.question_type_id == 19){
                        let choices = question.choices
                        question.items.forEach(item => {
                            item.statementA = choices.find(v => v.index == item.valueA)?.language?.[language]?.name ?? item.statementA
                            item.statementB = choices.find(v => v.index == item.valueB)?.language?.[language]?.name ?? item.statementB
                        })
                    
                    }
                });

                Object.keys(this.project.setup.language[language]).forEach(key => {
                    if(key == "complete"){
                        this.project.setup.redirects.complete.content = this.project.setup?.language?.[language]?.complete ?? this.project.setup.redirects.complete.content
                    }
                    else if(key == "screenout"){
                        this.project.setup.redirects.screenout.content = this.project.setup?.language?.[language]?.screenout ?? this.project.setup.redirects.screenout.content
                    }
                    else if(key == "qualityControl"){
                        this.project.setup.redirects.qualityControl.content = this.project.setup?.language?.[language]?.qualityControl ?? this.project.setup.redirects.qualityControl.content
                    }
                    else if(key == "connectionLostTitle"){
                        this.project.setup.modals.connectionLost.title = this.project.setup?.language?.[language]?.connectionLostTitle ?? this.project.setup.modals.connectionLost.title
                    }
                    else if(key == "connectionLostContent"){
                        this.project.setup.modals.connectionLost.content = this.project.setup?.language?.[language]?.connectionLostContent ?? this.project.setup.modals.connectionLost.content
                    }
                    else{
                        this.project.setup.messages[key] = this.project.setup?.language?.[language]?.[key] ?? this.project.setup.messages[key]
                    }
                });
                console.log("project",this.project)
                resolve()
            });
        },
    }
}