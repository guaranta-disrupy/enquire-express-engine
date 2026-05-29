<template>
    <div class="dInput" :class="{hasError:hasError}">
        <div class="prependTxt" v-if="prependText && !(validate && (validate.type == 10 || validate.type == 11))" v-html="prependText"></div>
        <!-- <input v-if="validate.type == 2" type="text" :style="style" :name="name" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" @input="_numberOnly" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null"/> -->
        <input :maxlength="validate?.max ? validate.max.toString().length : false" v-if="validate.type == 2" type="text" :style="style" :name="name" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" @input="_numberOnly"/>
        <input v-else-if="validate.type == 3" type="text" :style="style" :name="name" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" @input="_decimalOnly"/>
        <div v-else-if="validate.type == 4 && validate.filter_domain != null" class="input-span-wrapper">
            <input v-if="validate.type == 4 && validate.filter_domain != null" type="text" :name="name" :style="style" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null" @keyup="_onInput($event)" />
            <span v-if="validate.type == 4 && validate.filter_domain != null">{{ validate.filter_domain }}</span>
        </div>

        <!-- <input v-else-if="validate.type == 3" type="text" :style="style" :name="name" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" @input="_decimalOnly" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null"/> -->
        <flat-pickr class="dDatepicker" v-else-if="validate.type == 5" v-model="_value" :config="_datepickerConfig"></flat-pickr>
        <flat-pickr class="dDatepicker" v-else-if="validate.type == 6" v-model="_value" :config="_timepickerConfig"></flat-pickr>
        <flat-pickr class="dDatepicker" v-else-if="validate.type == 7" v-model="_value" :config="_datetimepickerConfig"></flat-pickr>
        <input v-else-if="validate.type == 8" type="text" :name="name" :style="style" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null" @keyup="_onInputAlpha($event)"/>
        <input v-else-if="validate.type == 9" type="text" :name="name" :style="style" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null" @keyup="_onInputAlphaNum($event)"/>
        <div v-else-if="validate.type == 10 || validate.type == 11" class="pricing-inr customInput">
            <div class="pricing-inr__symbol">{{ pricingSymbol }}</div>
            <div class="pricing-inr__major">
                <input type="number" :value="currencyMajor" @input="_onCurrencyMajor($event)" />
            </div>
            <div class="pricing-inr__dot" v-if="currencyConfig.minorDigits > 0">.</div>
            <div class="pricing-inr__minor" v-if="currencyConfig.minorDigits > 0">
                <input type="number" :value="currencyMinor" @input="_onCurrencyMinor($event)" />
            </div>
            <div class="pricing-inr__suffix" v-if="currencyConfig.minorDigits > 0">{{ pricingSuffix }}</div>
        </div>
        <input v-else type="text" :name="name" :style="style" :placeholder="placeholder" v-model="_value" autocomplete="off" :disabled="disabled" :maxlength="((typeof(validate) != 'undefined') && (validate.max != 0)) ? validate?.max : null" @keyup="_onInput($event)"/>

        <div class="appendTxt" v-if="appendText && !(validate && (validate.type == 10 || validate.type == 11))" v-html="appendText"></div>
   </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import helper from '@/js/helper'
export default({
   data(){
       return {
           hasError : false,
           enableRT : 1,
           startTime : null,
           overallRT : null,
           splitCharacters : [],
           currencyMajor : "",
           currencyMinor : "",
           datepickerConfig : {
                wrap: true,
                altFormat: 'j F Y',
                altInput: true,
                dateFormat: 'd/m/Y',
                disableMobile: true
           },
           timepickerConfig : {
                wrap: true,
                altFormat: 'h:i K',
                altInput: true,
                disableMobile: true,
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i K",
                time_24hr: false
           },
           datetimepickerConfig : {
                wrap: true,
                altFormat: 'j F Y h:i K',
                altInput: true,
                dateFormat: 'd/m/Y H:i',
                disableMobile: true,
                enableTime: true
           },
           style : {},
       }
   },
   props : ["name","value","placeholder","disabled","validate","RTs","connection","domStyle","appendText","prependText","minorUnitSymbol"],
   emits: ['update:value','update:RTs'],
   mixins : [helper],
   components: {
        flatPickr
   },
   mounted(){
       this._genDomStyle()
       this._initPricingFromValue()
   },
   watch:{
       style(){
           this._genDomStyle()
       }
   },
   computed:{
       _value:{
           get(){
               return this.value
           },
           set(val) {
               this.$emit("update:value", val); // Emit the updated value
               if(this.validate && (this.validate.type == 10 || this.validate.type == 11)){
                   this._syncCurrencyFromString(val)
               }
        }
       },
       currencyConfig(){
           // Defaults per currency 
           const code = (this.validate && (this.validate.currencyFormat || this.validate.currency)) ? (this.validate.currencyFormat || this.validate.currency) : 'GBP'
           const map = {
               USD: { symbol: '$', suffix: '', minorDigits: 2 },
               EUR: { symbol: '€', suffix: '', minorDigits: 2 },
               INR: { symbol: '₹', suffix: 'p', minorDigits: 2 },
               GBP: { symbol: '£', suffix: '', minorDigits: 2 },
               CAD: { symbol: '$', suffix: '', minorDigits: 2 },
               JPY: { symbol: '¥', suffix: '', minorDigits: 2 },
               PHP: { symbol: '₱', suffix: '', minorDigits: 2 },
               CNY: { symbol: '¥', suffix: '', minorDigits: 2 },
           }
           const base = map[code] || map['GBP']
           const cfg = { ...base }
           // If builder disables minor unit, force 0 digits regardless of currency
           const mus = (typeof this.minorUnitSymbol !== 'undefined') ? this.minorUnitSymbol : (this.validate && typeof this.validate.minorUnitSymbol !== 'undefined' ? this.validate.minorUnitSymbol : null)
           if(mus === 0 || mus === '0'){
               cfg.minorDigits = 0
           }
           return cfg
       },
       pricingSymbol(){
           const raw = (this.prependText || "").toString()
           const t = raw.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
           if(t.length > 0){ return t }
           return this.currencyConfig.symbol
       },
       pricingSuffix(){
           const raw = (this.appendText || "").toString()
           const t = raw.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
           if(t.length > 0){ return t }
           return this.currencyConfig.suffix
       },
       _datepickerConfig(){
           let config = {
                wrap: true,
                altFormat: 'j F Y',
                altInput: true,
                dateFormat: 'd/m/Y',
                disableMobile: true
           }
           
           // Use custom dateFormat if provided in validate object
           if(this.validate && this.validate.dateFormat){
               config.dateFormat = this._convertDateFormat(this.validate.dateFormat)
               config.altFormat = this._convertDateFormat(this.validate.dateFormat)
           }
           
           return config
       },
       _timepickerConfig(){
           let config = {
                wrap: true,
                altFormat: 'h:i K',
                altInput: true,
                disableMobile: true,
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i K",
                time_24hr: false
           }
           
           // Use custom timeFormat if provided in validate object
           if(this.validate && this.validate.timeFormat){
               config = this._convertTimeFormat(this.validate.timeFormat)
           }
           
           return config
       },
       _datetimepickerConfig(){
           let config = {
                wrap: true,
                altFormat: 'j F Y h:i K',
                altInput: true,
                dateFormat: 'd/m/Y H:i',
                disableMobile: true,
                enableTime: true
           }
           
           // Use custom datetimeFormat if provided in validate object
           if(this.validate && this.validate.datetimeFormat){
               config = this._convertDateTimeFormat(this.validate.datetimeFormat)
           }
           
           return config
       }
   },
  methods:{
       _initPricingFromValue(){
           if(this.validate && (this.validate.type == 10 || this.validate.type == 11)){
               this._syncCurrencyFromString(this.value || "")
           }
       },
       _syncCurrencyFromString(val){
           let str = (val || "").toString().trim()
           if(str === ""){
               this.currencyMajor = ""
               this.currencyMinor = ""
               return
           }
           const parts = str.split('.')
           this.currencyMajor = parts[0].replace(/[^0-9]/g, '').slice(0,10)
           const md = this.currencyConfig.minorDigits
           this.currencyMinor = (md > 0 ? (parts[1] || "").replace(/[^0-9]/g, '').slice(0,md) : "")
       },
       _onCurrencyMajor(e){
           let v = (e.target.value || "").replace(/[^0-9]/g, '')
           if(v.length > 10){ v = v.slice(0,10) }
           e.target.value = v
           this.currencyMajor = v
           this._emitCurrencyCombined()
       },
       _onCurrencyMinor(e){
           let v = (e.target.value || "").replace(/[^0-9]/g, '')
           const md = this.currencyConfig.minorDigits
           if(v.length > md){ v = v.slice(0,md) }
           e.target.value = v
           this.currencyMinor = v
           this._emitCurrencyCombined()
       },
       _emitCurrencyCombined(){
           let major = this.currencyMajor.trim() || "0"
           const md = this.currencyConfig.minorDigits
           let minor = (md > 0) ? this.currencyMinor.trim() : ""
           let totalStr = (md > 0 && minor) ? `${major}.${minor.padStart(md, '0')}` : major
           this.$emit('update:value', totalStr)
       },
       _genDomStyle(){
           this.$nextTick(()=>{
                if(typeof(this.domStyle) != 'undefined'){
                    this.style = this.domStyle
                    if(typeof(this.domStyle['max-width']) != 'undefined'){
                        this.style['max-width'] = this.domStyle['max-width']
                        //this.style['min-width'] = this.domStyle['max-width']
                    }
                }
           })
       },
       _convertDateFormat(format){
           // Convert your date format values to flatpickr format
           const formatMap = {
               'mm-dd-yyyy': 'm-d-Y',
               'dd-mm-yyyy': 'd-m-Y', 
               'yyyy-mm-dd': 'Y-m-d',
               'dd-mmm-yyyy': 'd M Y',
               'mmm-dd-yyyy': 'M d Y',
               'dd-month-yyyy': 'd F Y'
           }
           return formatMap[format] || 'd/m/Y'
       },
       _convertTimeFormat(format){
           // Convert your time format values to flatpickr config
           const timeConfigs = {
               '12-hour': {
                   wrap: true,
                   altFormat: 'h:i K',
                   altInput: true,
                   disableMobile: true,
                   enableTime: true,
                   noCalendar: true,
                   dateFormat: "h:i K",
                   time_24hr: false
               },
               '24-hour': {
                   wrap: true,
                   altFormat: 'H:i',
                   altInput: true,
                   disableMobile: true,
                   enableTime: true,
                   noCalendar: true,
                   dateFormat: "H:i",
                   time_24hr: true
               },
               '12-hour-seconds': {
                   wrap: true,
                   altFormat: 'h:i:s K',
                   altInput: true,
                   disableMobile: true,
                   enableTime: true,
                   noCalendar: true,
                   dateFormat: "h:i:s K",
                   time_24hr: false,
                   enableSeconds: true
               },
               '24-hour-seconds': {
                   wrap: true,
                   altFormat: 'H:i:s',
                   altInput: true,
                   disableMobile: true,
                   enableTime: true,
                   noCalendar: true,
                   dateFormat: "H:i:s",
                   time_24hr: true,
                   enableSeconds: true
               }
           }
           return timeConfigs[format] || timeConfigs['12-hour']
       },
       _convertDateTimeFormat(format){
           // Convert your datetime format values to flatpickr config
           const datetimeConfigs = {
               'dd-mmm-yyyy hh:mm': {
                   wrap: true,
                   altFormat: 'd M Y h:i K',
                   altInput: true,
                   dateFormat: 'd M Y h:i K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false
               },
               'dd-mmm-yyyy hh:mm:ss.s': {
                   wrap: true,
                   altFormat: 'd M Y h:i:s.S K',
                   altInput: true,
                   dateFormat: 'd M Y h:i:s.S K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false,
                   enableSeconds: true,
                   enableMilliseconds: true
               },
               'dd-mmm-yyyy hh:mm:ss': {
                   wrap: true,
                   altFormat: 'd M Y h:i:s K',
                   altInput: true,
                   dateFormat: 'd M Y h:i:s K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false,
                   enableSeconds: true
               },
               'yyyy-mm-dd hh:mm': {
                   wrap: true,
                   altFormat: 'Y-m-d h:i K',
                   altInput: true,
                   dateFormat: 'Y-m-d h:i K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false
               },
               'yyyy-mm-dd hh:mm:ss': {
                   wrap: true,
                   altFormat: 'Y-m-d h:i:s K',
                   altInput: true,
                   dateFormat: 'Y-m-d h:i:s K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false,
                   enableSeconds: true
               },
               'yyyy-mm-dd hh:mm:ss.s': {
                   wrap: true,
                   altFormat: 'Y-m-d h:i:s.S K',
                   altInput: true,
                   dateFormat: 'Y-m-d h:i:s.S K',
                   disableMobile: true,
                   enableTime: true,
                   time_24hr: false,
                   enableSeconds: true,
                   enableMilliseconds: true
               }
           }
           return datetimeConfigs[format] || datetimeConfigs['dd-mmm-yyyy hh:mm']
       },
      _validate(required = 1){
        
        let res = {
            status : true,
            message : null
        }

        if(!this.validate){
            res.status = true
            return res
        }
       
        let input = (this.value != null) ? this.value.trim() : null
        this.hasError = false
        
        let Project = null
        window.dispatchEvent(new CustomEvent('getSurveyInfo', {
            detail: {
                callback : (res) => {
                    // console.log(res)
                    Project = res
                }
            }
        }))


        if((required == 1) && (input == "")){
            this.hasError = true
            //throw this.validate.errorMsg
            res.status = false
            res.message = Project.setup.messages.required_warning || this.validate.errorMsg
            return res
        }
        if(input != ""){


            //console.log("Project", Project)
            

            if(this.validate.type == 1 || this.validate.type == 8 || this.validate.type == 9){
                /*if (!(input.length >= this.validate.min && input.length <= this.validate.max)) {
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    return res
                }*/
                if(this.validate.min && this.validate.min > input.length){
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input1_warning_min){
                        res.message = this._textReplacer(Project.setup.messages.input1_warning_min,{
                            "@min" : this.validate.min
                        })
                    }
                    return res                   
                }
                if(this.validate.max && this.validate.max < input.length){
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input1_warning_max){
                        res.message = this._textReplacer(Project.setup.messages.input1_warning_max,{
                            "@max" : this.validate.max
                        })
                    }
                    return res                   
                }
            }
            if(this.validate.type == 2 || this.validate.type == 3 || this.validate.type == 10 || this.validate.type == 11){
                const numericValue = parseFloat(input);
                if (this.validate.min && (numericValue < this.validate.min)) {
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input2_warning_min){
                        res.message = this._textReplacer(Project.setup.messages.input2_warning_min,{
                            "@min" : this.validate.min
                        })
                    }
                    return res  
                }
                if (this.validate.max && (numericValue > this.validate.max)) {
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input2_warning_max){
                        res.message = this._textReplacer(Project.setup.messages.input2_warning_max,{
                            "@max" : this.validate.max
                        })
                    }
                    return res  
                }
            }
    

            // if(this.validate.type == 2 || this.validate.type == 3){
            //     if (!(parseFloat(input) >= parseFloat(this.validate.min) && parseFloat(input) <= parseFloat(this.validate.max))) {
            //         this.hasError = true
            //         res.status = false
            //         res.message = this.validate.errorMsg
            //         return res                         
            //     }
            // } 
            if (this.validate.type == 4 && this.validate.filter_domain == null) {
                // Perform the email validation
                const isEmailValid = this._validateEmail(input);

                if (!isEmailValid) {
                    this.hasError = true;
                    res.status = false;
                    res.message = this.validate.errorMsg;
                    if(Project.setup.messages.input4_warning_invalidemail){
                        res.message = Project.setup.messages.input4_warning_invalidemail
                    }
                    return res;
                }


            }

            if (this.validate.type == 4 && this.validate.filter_domain != null) {
                // Perform the email validation
                const isEmailValid = this._validateEmail(input);
                if (isEmailValid || input.includes('@')) {
                    this.hasError = true;
                    res.status = false;
                    res.message = this.validate.errorMsg;
                    return res;
                }
            }

            if(this.validate.type == 5 || this.validate.type == 6 || this.validate.type == 7){
                if(!input){
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    return res                         
                }
            }
            if(this.validate.type == 8){
                const isLettersOnly = /^[a-zA-Z]+$/.test(input);
                if (!isLettersOnly) {
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input8_warning_letters){
                        res.message = Project.setup.messages.input8_warning_letters
                    }
                    return res
                }               
            }
            if(this.validate.type == 9){
                const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(input);
                if (!isAlphanumeric) {
                    this.hasError = true
                    res.status = false
                    res.message = this.validate.errorMsg
                    if(Project.setup.messages.input9_warning_alphanumeric){
                        res.message = Project.setup.messages.input9_warning_alphanumeric
                    }
                    return res
                }               
            }


        }
        return res
      },
    //_onlyNumbers(evt,obj = {}){
        //   console.log(evt.data, this._value)
        //     let decimal = false
        //     if(typeof(obj.decimal) != "undefined"){
        //         decimal = obj.decimal
        //     }
            // evt = (evt) ? evt : window.event;
            // var charCode = (evt.which) ? evt.which : evt.keyCode;

            // if(!decimal){
            //     if (charCode === 46 || charCode === 62) {
            //         evt.preventDefault();
            //     }
            // }
            // if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            //   evt.preventDefault();
            // } else {
            //   return true;
            // }
            
           
    //   },
        _numberOnly(e){ 
            

            e.target.value =  e.target.value.replace(/[^0-9]+/gi, '')
           // e.target.value = 2
            //console.log( e.target.value)
            this.$emit("update:value", e.target.value)

       },
        _decimalOnly(e){
            if(e.target.value.match(/^[0-9]+\.?([0-9]+)?$/) === null){
                e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                this.$emit("update:value", e.target.value)
            }   
       },
      _onInput(evt){
          if(this.startTime == null){
              this.startTime = new Date().getTime()
          }
          evt = (evt) ? evt : window.event;
          var charCode = (evt.which) ? evt.which : evt.keyCode;
           let ch = this.value.split(",")
           ch.forEach((c,k)=>{
              let temp = {
                  text : c,
                  rt : 0
              }
              if(typeof(this.splitCharacters[k]) == "undefined"){
                 this.splitCharacters.push(temp)
              }else{
                    let target = this.splitCharacters[k]
                    if(target.text != c){
                        this.splitCharacters[k].text = c
                        if(charCode != 8){
                            this.splitCharacters[k].rt = new Date().getTime() - this.startTime
                        }
                    }
              }
           })
           this.splitCharacters = this.splitCharacters.slice(0, ch.length)
           let RTs = ""
           this.splitCharacters.forEach((v)=>{
               RTs +=v.rt+","
           })
           RTs = RTs.substring(0, RTs.length - 1)
           this.$emit("update:RTs", RTs)
      },
      _onInputAlpha(e){
        if(e.target.value.match(/^[a-zA-Z]+\.?([a-zA-Z]+)?$/) === null){
                e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                this.$emit("update:value", e.target.value)
            } 

      },
      _onInputAlphaNum(e){
        if(e.target.value.match(/^[a-zA-Z0-9]+\.?([a-zA-Z0-9]+)?$/) === null){
                e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                this.$emit("update:value", e.target.value)
            } 

      }
   }

})
</script>
<style scoped>
.input-span-wrapper {
    display: flex;
    align-items: center;
}

.input-span-wrapper input {
    font-size: 2.5vmin; /* Converted from 1.4rem to vmin */
    padding: 1.2vmin; /* Converted from 12px to vmin */
    border-top-left-radius: 1vmin; /* Converted from 10px to vmin */
    border-bottom-left-radius: 1vmin; /* Converted from 10px to vmin */
    border-top-right-radius: 0; /* No border-radius on right side */
    border-bottom-right-radius: 0;
    border: 0.1vmin solid rgba(126, 126, 126, 0.253); /* Converted border width from 1px to vmin */
}

.input-span-wrapper span {
    font-size: 2.5vmin; /* Converted from 1.4rem to vmin */
    background-color: #D3D3D3; /* Light gray background */
    padding: 1.2vmin; /* Converted from 12px to vmin */
    border-top-right-radius: 1vmin; /* Converted from 10px to vmin */
    border-bottom-right-radius: 1vmin; /* Converted from 10px to vmin */
    border: 0.1vmin solid rgba(126, 126, 126, 0.76); /* Converted border width from 1px to vmin */
}

.customInput {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto;
    justify-content: center;
    justify-items: center;
    align-items: center;
    max-width: 450px;
    gap: 1vmin;
    margin: auto;
}

.pricing-inr__major input {
    text-align: right;
}

.pricing-inr__minor input {
    text-align: left;
}

</style>
