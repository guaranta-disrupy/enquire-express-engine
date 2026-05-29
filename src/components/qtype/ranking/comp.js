import { nextTick } from 'vue';

let _ = require('lodash')
const _console = {
    enabled: false,
    log: function(){
        if(this.enabled) console.log(...arguments);
        
    },
};

export default {
    methods : {    
        /**
         * 
         * @returns {Array} GET CURRENT STATE OF FORM RESULT
         */

        _hide_items(item){
            // alert("HIDE CHOICE")
            item.map((c)=>{
                this._hideItem(c)
            })
        },
        _hideItem(choiceOrder){
            let index = _.findIndex(this.data.items,{order:choiceOrder})
            this.data.items[index].show = false
            let index2 = _.findIndex(this.response,{order:choiceOrder})
            //console.log("xxxxxx",this.response)
            this.response[index2].show = false

        },
        _checkData(){
            if(this.data?.show === false) return;
            _console.log("ranking _checkData() executed");
            // if(this.data?.show === false) return null;
            /**
             * get all chosen item element
             */
            let chosenItems = [...document.querySelectorAll(`[tag="${this.data?.TAG}"] .drop-zone[data-role="chosen"] .rank-drop-item`)];
            _console.log("chosenItems: ", chosenItems);
            let data = chosenItems.map((item, itemIndex) => {
                /**
                 * grabbing the raw data attached to the element
                 * rank value is also added
                 */
                return {...item.itemData, rank: itemIndex + 1};
            });
            _console.log("chosen: ", data);


            /**
             * get all sources/not chosen item element
             */
            let sourceItems = [...document.querySelectorAll(`[tag="${this.data?.TAG}"] .drop-zone[data-role="sources"] .rank-drop-item`)];
            _console.log("sourceItems: ", sourceItems);
            let data2 = sourceItems.map((item) => {
                /**
                 * grabbing the raw data attached to the element
                 * rank value is also added
                 */
                return {...item.itemData, rank: 0};
            });
            _console.log("not chosen: ", data2);

            /**
             * merge and return array the data
             */
            return [...data, ...data2];
        },   

        /**
         * restore old state
         */
        async _checkOldState(){
            if(this.data?.show === false) return;
            _console.log("ranking _checkOldState() executed");
            // if(this.data?.show === false) return null;
            // _console.log("Checking old State", this.data.response);
            let chosen = [];
            let notChosen = [];

            /**
             * grab the old data from the response object 
             */
            await nextTick()
            for(let key in this.data.response){
                /**
                 * if value is not equal to zero, add it to chosen array
                 * if value is zero add it to not chosen array 
                 */
                if(this.data.response[key]['value'] !== ''){
                    chosen.push({...this.data.response[key]})
                }else{
                    // console.log(key)
                    // console.log(this.data.items)
                    let index = _.findIndex(this.data.items,(r)=>{
                        return r.TAG == key
                    })
                    //console.log(this.data.items[index].show)
                    this.data.response[key].show = this.data.items[index].show
                    //alert(this.data.items[key].show)
                    notChosen.push({...this.data.response[key]})
                }
            }

            /**
             * RESTORE RANKING SEQUENCE USING "value" KEY
             * by default it is not sorting according to the RANK/VALUE that is why we need to sort it again by rank/value
             */
            chosen.sort((a, b) => {
                return a.value - b.value;
            });

            _console.log("chosen: ", chosen);
            _console.log("notChosen: ", notChosen);


            /**
             * parse string number into number data type
             */
            if(typeof this.mode === 'string'){
                if(this.mode.match(/^[0-9]+$/gi)){
                    this.mode = Number(this.mode);
                }else{
                    this.mode = 0;
                }
            }
            
            /**
             * assign the values to update/bind the UI
             */
            if(this.mode === 0){
                /**
                 * if mode = 0 (RANKING)
                 */
                this.chosen = chosen;
                this.notChosen = notChosen;
            }else{
                /**
                 * if mode = 1 (SORTING)
                 * Throw all items to chosen container
                 */
                this.chosen = [...chosen, ...notChosen];
            }
            
        },


        /**
         * 
         * @returns {number} Chosen Item Count
         */
        _getItemCount(){
            if(this.data?.show === false) return;
            _console.log("ranking _getItemCount() executed");
            // if(this.data?.show === false) return null;
            let chosenItems = [...document.querySelectorAll(`[tag="${this.data?.TAG}"] .drop-zone[data-role="chosen"] .rank-drop-item`)];
            return chosenItems.length;
        }




    },


    

}