let _ = require('lodash')

export default {
    methods:{
        _randomList(choices,randomList,target = "order"){
            let random = []
            let except = []

            choices.map((v,k)=>{
                let search = v[target]
                let find = _.includes(randomList,search)
                if(find){
                    random.push(v)
                }else{
                    let index = k
                    except.push({
                        index:index,
                        data:v
                    })
                }
            })
            let NewChoices = _.shuffle(random)

            except.map((targetMap)=>{
                NewChoices.splice(targetMap.index,0,targetMap.data)
            })
            NewChoices.map((v,k)=>{
               let val = k + 1
               v["display"] = val
                
            })
            //NewChoices = _.orderBy(NewChoices, ['display'])
            return NewChoices
        },
        _randomListB(choices,randomList,target = "order"){
            let random = []
            let except = []

            choices.map((v,k)=>{
                let search = null
                if(target == "index"){
                        if(typeof(v[target]) == "undefined"){
                            search = v["order"]
                        }else{
                            search = v[target]
                        }
                }else{
                    search = v[target]
                }
                let find = _.includes(randomList,search)
                if(find){
                    random.push(v)
                }else{
                    let index = this._setVariableValue((v['display']),k)

                    except.push({
                        index:index,
                        data:v
                    })
                }
            })
            let NewChoices = _.shuffle(random)

            except.map((targetMap)=>{
                NewChoices.splice(targetMap.index,0,targetMap.data)
            })
            NewChoices.map((v,k)=>{
               let val = k + 1
               v["display"] = val
                
            })
            NewChoices = _.orderBy(NewChoices, ['display'])
            return NewChoices
        },
        _validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },    
        _orderByAlphaNum(obj,target){
            return obj.slice().sort((a,b) => a[target].localeCompare(b[target], undefined, {numeric: true}));
        },
        _sortObjAlphaNumeric(obj){
            let objKeys = Object.keys(obj)
            objKeys.sort(function(a, b){
               return a.toString().localeCompare(b.toString(), 'en', { numeric: true })
            })
            let newList = {}
            objKeys.forEach((key)=>{
                newList[key] = obj[key]
            })
            return newList
        },
        _setVariableValue(vif,velse){
            
            let v = null
            if((typeof(vif) == "undefined") || vif === ""){
                v = velse

            }else{
                v = vif
            }
            return v
        },
        _convertStrToFloat(value){
            //console.log(value)
            if(value === ""){
                return ""
            }
            if(!isNaN(value)){
                if(value == "0"){
                    return value.toString()
                }
                return parseFloat(value)
            }else{
                return value
            }
        },
        _initObjProperty(obj,prop,data = {}){
            if(!obj[prop]){
                obj[prop] = data
            }
        },
        _textReplacer(str,arr){
            let newStr = str
            //console.log(arr)
             _.forOwn(arr, (value, key)=>{ 
                if(value){
                    newStr = newStr.split(key).join(value)
                }
            })
            return newStr
        },
        _scoreVariableMaker(variable, toReplace, append = "s") {
            if (typeof variable !== 'string' || typeof toReplace !== 'string') return variable;
            if (variable.startsWith(toReplace)) {
                return toReplace + append + variable.slice(toReplace.length);
            }
            return variable;
        }
    }
}