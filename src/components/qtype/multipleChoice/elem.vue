<template>
    <transition :name="transition">
    <div class="dBox" v-show="data?.show" :tag="data?.TAG" :style="_boxStyle()">
        <template v-if="data">
        <div class="dQuestion" qtype="multiplechoice" :class="{
            required:(data?.setup.validate.required == 1),
            noAsterisk:($parent.project.setup?.display_asterisk == 0)
        }">
            <div class="body"
            :set='_initObjProperty(data.setup,"textSelection",{
                        "layout_switch" : 0,
                        "grid" : data.setup.grid,
                        "grid_tab" : 3,
                        "grid_mobile" : 2,     
                        "multiSelect_type" : 1,
                        "multiSelect_max" : data.setup.validate.max,
                        "multiSelect_min" : data.setup.validate.min,
                        "multiSelect_errorMsg_type2" : "Please select at least @min_select to @max_select item(s)",
                        "multiSelect_errorMsg_type3" : "You have to select @max_select items",
            })'
            >

                <div class="question" v-html="_textReplacer(_pipeText(data.question),{
                        '@min_select':data.setup.textSelection.multiSelect_min,
                        '@max_select':data.setup.textSelection.multiSelect_max            
                })"></div>

                <!-- <div v-if="(!$parent.language)" class="question" v-html="_textReplacer(_pipeText(data.question),{
                        '@min_select':data.setup.textSelection.multiSelect_min,
                        '@max_select':data.setup.textSelection.multiSelect_max            
                })"></div>
                <div v-else class="question" v-html="_textReplacer(_pipeText(data.setup.language[$parent.language]?.question ?? data.question),{
                        '@min_select':data.setup.textSelection.multiSelect_min,
                        '@max_select':data.setup.textSelection.multiSelect_max            
                })"></div> -->
                
                <div class="choices">

                   <div class="content" 

                    :style="{
                        '--grid':(!parseInt(data.setup.textSelection.grid)) ? 1 : data.setup.textSelection.grid,
                        '--grid_tab':(!parseInt(data.setup.textSelection.grid_tab)) ? 1 : data.setup.textSelection.grid_tab,
                        '--grid_mobile':(!parseInt(data.setup.textSelection.grid_mobile)) ? 1 : data.setup.textSelection.grid_mobile,
                    }">
                            <!-- RADIO -->
                            <template v-if="(data?.setup.selectMultiple == 0) && (data.setup.isDropdown == 0)" >
                                <template v-for="choice in displayedChoices" :key="choice.order">

                                    <!-- <formRadio 
                                    :ref="choice.TAG" 
                                    :label="_pipeText((!$parent.language) ? choice.name : choice?.language[$parent.language]?.name ?? choice.name)" 
                                    :value="choice.value" 
                                    :name="data.TAG" 
                                    :selected="data.form.selected"
                                    v-model:checked="data.form.selected" 
                                    v-show="choice.show"
                                    :option="option"
                                    > -->

                                    <formRadio 
                                    :ref="choice.TAG" 
                                    :label="_pipeText(choice.name)" 
                                    :value="choice.value" 
                                    :name="data.TAG" 
                                    :selected="data.form.selected"
                                    v-model:checked="data.form.selected" 
                                    v-show="choice.show"
                                    :option="option"
                                    >


                                        <div class="wc" v-if="choice.wc">
                                            <formTextbox 
                                            :ref="choice.wc.TAG"
                                            :name="choice.wc.TAG" 
                                            :placeholder="choice.wc.setup.placeholder" 
                                            :value="choice.wc.input" 
                                            :validate="choice.wc.setup.validate"
                                            :disabled="!(data.form.selected == choice.value)"
                                            :domStyle="{'max-width':choice.wc.setup['max-width']}"
                                            :appendText="(choice.wc.setup && choice.wc.setup.appendString) ? choice.wc.setup.appendString : (data.setup ? data.setup.appendString : '')"
                                            :prependText="(choice.wc.setup && choice.wc.setup.prependString) ? choice.wc.setup.prependString : (data.setup ? data.setup.prependString : '')"
                                            :minorUnitSymbol="(choice.wc.setup && typeof choice.wc.setup.minorUnitSymbol !== 'undefined') ? choice.wc.setup.minorUnitSymbol : (data.setup ? data.setup.minorUnitSymbol : null)"
                                            v-model:RTs="choice.wc.RTs"
                                            v-model:value="choice.wc.input"></formTextbox>
                                        </div>

                                    </formRadio>

                                </template>
                            </template>
                            <!-- DROPDOWN -->
                            <template v-if="(data?.setup.selectMultiple == 0) && (data.setup.isDropdown == 1)">

                                <formSelectbox :ref="data.TAG"
                                    v-model:selected="data.form.selected" 
                                    :name="data.TAG" 
                                    :options="data.choices " 
                                    :placeholder="data.setup.placeholder"
                                ></formSelectbox>

                            </template>      

                            <!-- DROPDOWN MULTIPLE -->
                            <template v-if="(data?.setup.selectMultiple == 1) && (data.setup.isDropdown == 1)">
                                <formSelectboxMultiple :ref="data.TAG"
                                    v-model:selected="data.choices" 
                                    :name="data.TAG" 
                                    :options="data.choices" 
                                    :placeholder="data.setup.placeholder"
                                    :setup="data.setup"
                                ></formSelectboxMultiple>
                            </template>      


                            <!-- CHECKBOX -->
                            <template v-if="(data?.setup.selectMultiple == 1) && (data.setup.isDropdown == 0)">
                                <template v-for="choice in displayedChoices" :key="choice.order">

                                    <!-- <formCheckbox 
                                    :ref="choice.TAG" 
                                    :label="_pipeText(choice.name ?? choice?.language[$parent.language]?.name ?? choice.name)"
                                    :name="choice.TAG" 
                                    :checked="choice.checked"
                                    @change="_onSelect(choice)"
                                    v-model:checked="choice.checked" 
                                    v-show="choice.show"
                                    :option="option"
                                    > -->

                                    <formCheckbox 
                                    :ref="choice.TAG" 
                                    :label="_pipeText(choice.name)"
                                    :name="choice.TAG" 
                                    :checked="choice.checked"
                                    @change="_onSelect(choice)"
                                    v-model:checked="choice.checked" 
                                    v-show="choice.show"
                                    :option="option"
                                    >

                                        <div class="wc" v-if="choice.wc">
                                            <formTextbox 
                                            :ref="choice.wc.TAG"
                                            :name="choice.wc.TAG" 
                                            :placeholder="choice.wc.setup.placeholder" 
                                            :value="choice.wc.input" 
                                            :validate="choice.wc.setup.validate"
                                            :disabled="!choice.checked"
                                            :domStyle="{'max-width':choice.wc.setup['max-width']}"
                                            :appendText="(choice.wc.setup && choice.wc.setup.appendString) ? choice.wc.setup.appendString : (data.setup ? data.setup.appendString : '')"
                                            :prependText="(choice.wc.setup && choice.wc.setup.prependString) ? choice.wc.setup.prependString : (data.setup ? data.setup.prependString : '')"
                                            :minorUnitSymbol="(choice.wc.setup && typeof choice.wc.setup.minorUnitSymbol !== 'undefined') ? choice.wc.setup.minorUnitSymbol : (data.setup ? data.setup.minorUnitSymbol : null)"
                                            v-model:RTs="choice.wc.RTs"
                                            v-model:value="choice.wc.input"></formTextbox>

                                        </div>                                    
                                    </formCheckbox>

                                </template>
                            </template>

                    </div>
                </div>
                <validateMsg ref="validateMsg"></validateMsg>
                <qfooter ref="footer"></qfooter>
            </div>
        </div>
        </template>
    </div>
    </transition>
</template>
<script>
let _ = require('lodash')
import qtypeFunctions from '@/js/qtypeFunctions'
import comp from './comp.js'
import qfooter from '@/components/qfooter'

import validateMsg from '@/components/validateMsg'
import formRadio from '@/components/forms/radio'
import formCheckbox from '@/components/forms/checkbox'
import formSelectbox from '@/components/forms/selectbox'
import formSelectboxMultiple from '@/components/forms/selectboxMultiple'
import formTextbox from '@/components/forms/textbox'
import helper from '@/js/helper'

export default {
    components: { qfooter, validateMsg, formRadio, formCheckbox, formSelectbox, formSelectboxMultiple, formTextbox},
    data(){
        return {
            data : null,
            errors : [],
            option : {
                minHeight:0
            },
            currentPage: 1,
            forceShowAllChoices: false
        }
    },
    computed:{
        displayedChoices(){
            // If data or choices not ready, fall back safely
            if(!this.data || !Array.isArray(this.data.choices)){
                return []
            }

            // If pagination not enabled, show all
            if(!this._hasPagination()){
                return this.data.choices
            }

            const perPage = parseInt(this.data.setup.itemsPerPage) || 0
            if(perPage <= 0){
                return this.data.choices
            }

            // Separate "special" (Apply Select All / Apply Unselect All) and normal choices
            const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
            const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
            const isSpecialOrder = (order) => {
                return selectAllArr.includes(order) || unSelectAllArr.includes(order)
            }

            const specialChoices = this.data.choices.filter(c => isSpecialOrder(c.order))
            const normalChoices = this.data.choices.filter(c => !isSpecialOrder(c.order))

            const start = (this.currentPage - 1) * perPage
            const end = start + perPage
            const pageNormal = normalChoices.slice(start, end)

            // Always include special choices on every page,
            // plus the normal slice for the current page.
            // Avoid duplicates by reference, and then
            // sort back by original order so items stay
            // in their intended positions.
            const combined = [...specialChoices, ...pageNormal]
            const uniqueCombined = combined.filter((c, index, arr) => arr.indexOf(c) === index)

            return uniqueCombined.sort((a,b) => {
                const ao = typeof a.order === 'number' ? a.order : 0
                const bo = typeof b.order === 'number' ? b.order : 0
                return ao - bo
            })
        },
        totalPages(){
            if(!this.data || !Array.isArray(this.data.choices)){
                return 1
            }
            const perPage = parseInt(this.data.setup.itemsPerPage) || 0
            if(perPage <= 0){
                return 1
            }
            // Only paginate over normal (non-special) choices; special ones are always shown
            const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
            const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
            const isSpecialOrder = (order) => {
                return selectAllArr.includes(order) || unSelectAllArr.includes(order)
            }
            const normalChoices = this.data.choices.filter(c => !isSpecialOrder(c.order))
            const count = normalChoices.length
            if(count === 0){
                return 1
            }
            return Math.max(1, Math.ceil(count / perPage))
        }
    },
    watch:{
        'item.show'(s){
            if(s){
                this.$nextTick(()=> {
                     window.addEventListener('resize', ()=>{this._responsive()})
                     this._responsive()
                })
            }
            else{
                 this.$nextTick(()=> {
                     window.removeEventListener('resize', this._responsive())
                })               
            }
        }
    },
    mixins : [qtypeFunctions,comp,helper],
    props : ["item"],
    mounted(){
        this._initQuestion()
        this._checkGibberish()
    },
    methods:{
        _hasAnswerOnCurrentPage(){
            // When not paginating, defer to normal validation
            if(!this._hasPagination() || !this.data){
                return true
            }
            

            const visible = this.displayedChoices || []

            // Single-select (radio)
            if(this.data.setup.selectMultiple == 0){
                if(!this.data.form || typeof this.data.form.selected === 'undefined' || this.data.form.selected === null){
                    return false
                }
                const selectedVal = this.data.form.selected
                return visible.some(c => c.value == selectedVal)
            }

            // Multi-select (checkbox)
            if(this.data.setup.selectMultiple == 1){
                return visible.some(c => !!c.checked)
            }

            return true
        },
        // Override navigation to integrate pagination with existing footer buttons
        _next(){
            // If pagination is active and there are more pages, just go to next page
            if(this._hasPagination() && this.currentPage < this.totalPages){
                // Require an answer on the current set of visible choices
                this.$refs.validateMsg._hide()
                this.errors = []

                if(!this._hasAnswerOnCurrentPage()){
                    this.errors.push({
                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                        "msg": this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg
                    })
                    this._showError()
                    return
                }

                // Record answers for this page before moving on
                this._setAns().then(()=>{
                    // For paginated questions, special "select all / unselect all"
                    // checkboxes should only act as helpers on the current page.
                    // Clear their checked state before switching to the next page
                    // so they do not appear visually active on subsequent pages.
                    this._resetSpecialChoicesState()
                    this.currentPage++
                    // Scroll up when pagination (Display choices by) changes page
                    this._scrollQuestionIntoView()
                })
                return
            }

            // Otherwise, fall back to original _next logic from qtypeFunctions
            this._setAns().then(()=>{
                this._required().then(()=>{
                    // Additional rule for required questions with "none of these" style options:
                    // If the question is required, and the respondent has only selected
                    // special choices (Apply Select All / Apply Unselect All) and no
                    // normal choice, then:
                    //  - Show all choices (disable pagination)
                    //  - Force them to pick at least one non-special choice before proceeding
                    //  - Only apply this when "Display Choices by" (pagination) is enabled
                    if(this.data?.setup?.validate?.required == 1){
                        const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
                        const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
                        const isSpecialOrder = (order) => {
                            return selectAllArr.includes(order) || unSelectAllArr.includes(order)
                        }

                        const specialChoices = this.data.choices.filter(c => isSpecialOrder(c.order))
                        if(specialChoices.length > 0){
                            const displayChoicesEnabled = parseInt(this.data.setup.displayChoices) === 1

                            if (displayChoicesEnabled) {
                                const anyNonSpecialChecked = this.data.choices.some(
                                    c => !isSpecialOrder(c.order) && c.checkedValue === 1
                                )
                                const anySpecialChecked = this.data.choices.some(
                                    c => isSpecialOrder(c.order) && c.checkedValue === 1
                                )

                                // Only special checked (or all pages "none of these") → block and show all
                                if(!anyNonSpecialChecked && anySpecialChecked){
                                    this.forceShowAllChoices = true
                                    this.currentPage = 1
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg": this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg
                                    })
                                    this._showError()
                                    return
                                }
                            }
                        }
                    }

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
                     })
                })

            })
        },
        _prev(){
            // If pagination is active and we are not on the first page, just go to previous page
            if(this._hasPagination() && this.currentPage > 1){
                // Save current page responses before going back
                this._setAns().then(()=>{
                    // Same as in _next, make sure special helper checkboxes are
                    // cleared when navigating between pages so they don't look
                    // permanently selected.
                    this._resetSpecialChoicesState()
                    this.currentPage--
                    // Scroll up when pagination (Display choices by) changes page
                    this._scrollQuestionIntoView()
                })
                return
            }

            // Otherwise, fall back to original _prev logic from qtypeFunctions
            this._hide2('slideRight').then(()=>{
                this.$parent._prev()
            })
        },
        _hasPagination(){
            if(!this.data || !this.data.setup){
                return false
            }
            const enabled = parseInt(this.data.setup.displayChoices) === 1
            const perPage = parseInt(this.data.setup.itemsPerPage) || 0
            if(!enabled || perPage <= 0 || !Array.isArray(this.data.choices) || this.forceShowAllChoices){
                return false
            }

            // Pagination only depends on normal (non-special) choices count
            const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
            const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
            const isSpecialOrder = (order) => {
                return selectAllArr.includes(order) || unSelectAllArr.includes(order)
            }
            const normalChoices = this.data.choices.filter(c => !isSpecialOrder(c.order))
            return normalChoices.length > perPage
        },
        _resetSpecialChoicesState(){
            // Only relevant when pagination is active
            if(!(typeof this._hasPagination === 'function' && this._hasPagination())){
                return
            }

            const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
            const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
            const isSpecialOrder = (order) => {
                return selectAllArr.includes(order) || unSelectAllArr.includes(order)
            }

            this.data.choices.forEach(c => {
                if(isSpecialOrder(c.order)){
                    c.checked = false
                    c.checkedValue = 0
                }
            })
        },
        _scrollQuestionIntoView(){
            // Only used when pagination (Display choices by) is active.
            // The scroll container is .dBox itself (overflow:auto in CSS), so we scroll it to top.
            this.$nextTick(() => {
                requestAnimationFrame(() => {
                    const tag = this.data?.TAG
                    if (!tag) return
                    const el = document.querySelector(`.dBox[tag='${tag}']`)
                    if (!el) return
                    if (typeof el.scrollTo === 'function') {
                        el.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                    } else {
                        el.scrollTop = 0
                        el.scrollLeft = 0
                    }
                })
            })
        },
        _nextPage(){
            if(this.currentPage < this.totalPages){
                this.currentPage++
            }
        },
        _prevPage(){
            if(this.currentPage > 1){
                this.currentPage--
            }
        },
        _initQuestion(){
            this.data = this.item
            let q = this.data

            // Reset pagination when question initializes
            this.currentPage = 1

            //SETUP COLUMNS
            if(this.data.setup.layout == 5){
                this.columns = this.data.choices.length
            }else{
                this.columns = this.data.setup.layout
            }

            this.data.choices.map((v,k)=>{
                let key = k + 1
                
                v['index'] = this._setVariableValue(v['index'],key)
                v['order'] = v['index']
                
                //RADIO AND DROPDOWN
                if(this.data.setup.selectMultiple == 0){
                    v['TAG'] = q.TAG
                    v['VAR'] = q.VAR
                }else{//CHECKBOX
                    v['TAG'] = q.TAG+"_"+v['index']
                    v['VAR'] = q.VAR+"_"+v['index']         
                }
                v['display'] = null

                v['value'] = this._setVariableValue(v.score,v['index'])
                v['checked'] = false
                v['checkedValue'] = 0
                v['show'] = true
                
                //WRITE IN CHOICE
                if(typeof(v.wc) == "object"){
                    v.wc['TAG'] = q.TAG+"_"+v['index']+"_wc"
                    v.wc['VAR'] = q.VAR+"_"+v['index']+"_wc"
                    v.wc['input'] = ""
                    v.wc['RTs'] = []
                }

            })

            // Randomize choices, but keep "special" choices (Apply Select All / Apply Unselect All)
            // in their defined positions (typically at the end).
            let selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
            let unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
            const isSpecialOrder = (order) => {
                return selectAllArr.includes(order) || unSelectAllArr.includes(order)
            }

            let specialChoices = this.data.choices.filter(c => isSpecialOrder(c.order))
            let normalChoices = this.data.choices.filter(c => !isSpecialOrder(c.order))

            normalChoices = this._randomList(normalChoices,this.data.setup.randomChoices)
            // Preserve special choices order
            specialChoices.sort((a,b) => {
                const ao = typeof a.order === 'number' ? a.order : 0
                const bo = typeof b.order === 'number' ? b.order : 0
                return ao - bo
            })

            this.data.choices = [...normalChoices, ...specialChoices]
            this.data['form'] = {
                selected : null
            }
            this.data['response'] = this._initData()
            
        },
        _initData(){
            let q = this.data
            let data = {}
             //RADIO AND DROPDOWN
            if(this.data.setup.selectMultiple == 0){
                let obj = {
                    TAG : q.TAG,
                    VAR : q.VAR,
                    desc : "",
                    text : "",
                    value : "",
                    ref : null
                }
                data[q.TAG] = obj
            }else{
            //CHECKBOX
                this.data.choices.map((v)=>{
                    let obj = {
                        TAG : v.TAG,
                        VAR : v.VAR,
                        desc : "",
                        text : "",
                        value : "",
                        ref : null
                    }
                    data[v.TAG] = obj                   
                })
            }
            return data
        },
        _setAns(){
            return new Promise((resolve,reject)=>{
                try{
                    this.data['response'] = this._initData()
                    //RADIO AND DROPDOWN
                    if(this.data.setup.selectMultiple == 0){
                        if(this.data.form.selected){
                            let choice = _.find(this.data.choices, { 'value': this.data.form.selected})
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = choice.name
                            this.data.response[choice.TAG]["value"] = this._convertStrToFloat(choice.value)
                            this.data.response[choice.TAG]["ref"] = choice
                            if(typeof(choice.wc) == "object"){
                                 this.data.response[choice.TAG]["wc"] = this._convertStrToFloat(choice.wc.input)
                                //  if(typeof(choice.wc.RTs) != "undefined"){
                                //     this.data.response[choice.TAG]["wc_RTs"] = choice.wc.RTs
                                //  }
                            }      
                            
                            //scoring...
                            if(this.data.setup.enablePoint){
                                //console.log("choicedata",choice)
                                this.data.response[choice.TAG+"s"] = {}
                                this.data.response[choice.TAG+"s"]["TAG"] = choice.TAG+"s"
                                this.data.response[choice.TAG+"s"]["VAR"] = choice.VAR+"s"
                                this.data.response[choice.TAG+"s"]["desc"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["text"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["value"] = parseFloat(choice.points ?? 0)
                                this.data.response[choice.TAG+"s"]["type"] = "scoring"
                                this.data.response[choice.TAG+"s"]["ref"] = choice
                                this.$parent.defaultVariables.gscore += parseFloat(choice.points ?? 0)
                            }

                            //console.log(this.data.response)

                        }
                    }else{// CHECKBOX
                        this.data.choices.map((choice)=>{
                            choice.checkedValue = (choice.checked) ? 1 : 0
                            this.data.response[choice.TAG]["desc"] = choice.name
                            this.data.response[choice.TAG]["text"] = (choice.checked) ? "true" : "false" 
                            this.data.response[choice.TAG]["value"] = choice.checkedValue
                            //console.log("choice",choice)

                            if(typeof(choice.checkboxScore) != "undefined"){
                                if(choice.checkedValue == 1){
                                    this.data.response[choice.TAG]["value"] = this._setVariableValue(choice.checkboxScore.active,1)
                                }else{
                                    this.data.response[choice.TAG]["value"] = this._setVariableValue(choice.checkboxScore.inactive,0)
                                }
                            }
                           
                            if(!choice.show){
                                this.data.response[choice.TAG]["text"] = "HIDDEN"
                                this.data.response[choice.TAG]["value"] = -1
                            }

                            this.data.response[choice.TAG]["ref"] = choice
                            if(typeof(choice.wc) == "object"){
                                 this.data.response[choice.TAG]["wc"] = this._convertStrToFloat(choice.wc.input)
                                //  if(typeof(choice.wc.RTs) != "undefined"){
                                //     this.data.response[choice.TAG]["wc_RTs"] = choice.wc.RTs
                                //  }
                            }
                        })

                        const selectAllArr = Array.isArray(this.data.setup.selectAll) ? this.data.setup.selectAll : []
                        const unSelectAllArr = Array.isArray(this.data.setup.unSelectAll) ? this.data.setup.unSelectAll : []
                        const isSpecialOrder = (order) => {
                            return selectAllArr.includes(order) || unSelectAllArr.includes(order)
                        }

                        const specialChoices = this.data.choices.filter(c => isSpecialOrder(c.order))
                        if(specialChoices.length > 0){
                            // When using "Display choices by" (pagination), the special
                            // Apply Select All / Apply Unselect All options should act
                            // only as UI helpers for the current page and must not
                            // contribute a stored value of 1 that carries across pages.
                            //
                            // Therefore, if pagination is active, always record all
                            // special choices as 0 regardless of their checked state.
                            if(typeof this._hasPagination === 'function' && this._hasPagination()){
                                specialChoices.forEach(c => {
                                    if(this.data.response[c.TAG]){
                                        this.data.response[c.TAG]["text"] = "false"
                                        this.data.response[c.TAG]["value"] = 0
                                    }
                                })
                            }else{
                                // Original behaviour (non-paginated):
                                // If ANY non-special choice is selected (checkedValue 1),
                                // all special choices should be recorded as 0. Only when
                                // ALL non-special choices are 0 AND at least one special
                                // choice is checked will that special choice keep value 1.
                                const anyNonSpecialChecked = this.data.choices.some(
                                    c => !isSpecialOrder(c.order) && c.checkedValue === 1
                                )
                                if(anyNonSpecialChecked){
                                    specialChoices.forEach(c => {
                                        if(this.data.response[c.TAG]){
                                            this.data.response[c.TAG]["text"] = "false"
                                            this.data.response[c.TAG]["value"] = 0
                                        }
                                    })
                                }
                            }
                        }

                        if(this.data.setup.enablePoint){
                            let allSelected = this.data.choices.filter((obj)=>{
                                return obj.checked
                            })

                            const totalScore = allSelected.reduce((total, item) => total + parseFloat(item.points ?? 0), 0);
                            this.data.response[this.data.TAG+"s"] = {}
                            this.data.response[this.data.TAG+"s"]["TAG"] = this.data.TAG+"s"
                            this.data.response[this.data.TAG+"s"]["VAR"] = this.data.VAR+"s"
                            this.data.response[this.data.TAG+"s"]["desc"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["text"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["value"] = parseFloat(totalScore ?? 0)
                            this.data.response[this.data.TAG+"s"]["type"] = "scoring"
                            this.data.response[this.data.TAG+"s"]["ref"] = allSelected           
                            this.$parent.defaultVariables.gscore += parseFloat(totalScore ?? 0)
                        }

                        
                    }
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },
        _required(){
            return new Promise((resolve,reject)=>{
                try{
                    let $ans = this.data.response
                    this.$refs.validateMsg._hide()
                    this.errors = []

                    if(this.data.setup.validate.required != 1){
                        resolve()
                        return
                    }
                    
                    //RADIO AND DROPDOWN
                    if(this.data.setup.selectMultiple == 0){
                        if(this.data.setup.isDropdown == 1){
                            this.$refs[this.data.TAG].hasError = false
                        }
                        if(!this.data.form.selected){
                            if(this.data.setup.isDropdown == 1){
                                this.$refs[this.data.TAG].hasError = true
                            }
                
                            this.errors.push({
                                "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                "msg": this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg
                            })
                            this._showError()
                            //this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                            //throw this.data.setup.validate.errorMsg
                        }

                        //WRITE IN CHOICE
                        let selected = _.find(this.data.choices, {value:this.data.form.selected})
                        if(typeof($ans[selected.TAG].wc) == "string" || typeof($ans[selected.TAG].wc) == "number"){
                            
                            let valid = this.$refs[selected.wc.TAG]._validate()
                            if(!valid.status){
                                //console.log("valid",valid)
                                //this.$refs.validateMsg._show(valid.message)
                                // this.errors.push({
                                //     "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                //     "msg":valid.messag
                                // })
                                //throw valid.message
                                // this.errors.push({
                                //     "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                //     "msg":this.$parent.project.setup.messages.required_warning || valid.message
                                // })

                                this.errors.push({
                                    "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                    "msg":valid.message || this.$parent.project.setup.messages.required_warning
                                })

                                this._showError()
                            }
                        }

                        //this._showError()


                    }else{//CHECKBOX
                        let checked = _.filter(this.data.choices, {checkedValue:1,show:true})
                        if(checked.length <= 0){
                            //this.$refs.validateMsg._show(this.data.setup.validate.errorMsg)
                            //throw this.data.setup.validate.errorMsg
                            this.errors.push({
                                "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                "msg":this.$parent.project.setup.messages.required_warning || this.data.setup.validate.errorMsg
                            })
                            this._showError()
                        }
                        if(this.data.setup.validate){
                            // if((parseFloat(this.data.setup.validate.min) != 0) && (!(checked.length >= parseFloat(this.data.setup.validate.min)))){
                            //     this.errors.push({
                            //         "elem":`.dBox[tag='`+this.data.TAG+`']`,
                            //         "msg":this.data.setup.validate.errorMsg
                            //     })
                            //     this._showError() 
                            // }
                            // if((parseFloat(this.data.setup.validate.max) != 0) && (!(checked.length <= parseFloat(this.data.setup.validate.max)))){
                            //     this.errors.push({
                            //         "elem":`.dBox[tag='`+this.data.TAG+`']`,
                            //         "msg":this.data.setup.validate.errorMsg
                            //     })
                            //     this._showError() 
                            // }

                            if(this.data.setup.textSelection.multiSelect_type == 2){
                                /* IF RANGE */
                                if (checked.length < parseFloat(this.data.setup.textSelection.multiSelect_min)
                                    || checked.length > parseFloat(this.data.setup.textSelection.multiSelect_max)
                                ){
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this._textReplacer(this.data.setup.textSelection.multiSelect_errorMsg_type2,
                                            {
                                                "@min_select":this.data.setup.textSelection.multiSelect_min,
                                                "@max_select":this.data.setup.textSelection.multiSelect_max
                                            }
                                        )
                                    })
                                    this._showError() 
                                }
                            }else if(this.data.setup.textSelection.multiSelect_type == 3){
                                /* IF FIX */
                                if((parseFloat(this.data.setup.textSelection.multiSelect_max) != 0) 
                                    && (checked.length != parseFloat(this.data.setup.textSelection.multiSelect_max))){
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this._textReplacer(this.data.setup.textSelection.multiSelect_errorMsg_type3,
                                            {
                                                "@max_select":this.data.setup.textSelection.multiSelect_max
                                            }
                                        )
                                    })
                                    this._showError() 
                                }
                            }
                        }                      

                        //WRITE IN CHOICE
                        checked.map((selected)=>{              
                            if(typeof($ans[selected.TAG].wc) == "string" || typeof($ans[selected.TAG].wc) == "number"){                
                                let valid = this.$refs[selected.wc.TAG]._validate()
                                if(!valid.status){
                                    // this.$refs.validateMsg._show(valid.message)
                                    // throw valid.message
                                    this.errors.push({
                                        "elem":`.dBox[tag='`+this.data.TAG+`']`,
                                        "msg":this.$parent.project.setup.messages.required_warning || valid.message
                                    })
                                    this._showError() 
                                }
                            }                   
                        })
                                         
                    }


                    resolve()
                }catch(e){
                    console.log(e)
                    reject()
                }
            })
        },
        _showError(){
            if(this.errors.length > 0){
                let error = this.errors[0]
                this.$refs.validateMsg._show(error.msg)
                //document.querySelector(error.elem).scrollIntoView({behavior: 'smooth'})
                throw error.msg
            }
        },
        _skiplogic(){
            return new Promise((resolve,reject)=>{
                try{
                    let skiplogics = this.data.setup.skiplogic
                    let responses = this.$parent.responses
                    skiplogics.map((skiplogic)=>{
                        //GET ORDER ID
                        let target = _.find(this.data.choices,{order:skiplogic.choice})
                        let response = responses[target.TAG]
                        if(response){
                            //RADIO AND DROPDOWN
                            if(this.data.setup.selectMultiple == 0){
                                    if(skiplogic.condition == 1){//CHOICE IS
                                        if(response.value == skiplogic.choice){
                                            this._skiplogicProcess(skiplogic)
                                            this.$parent()._abort()
                                        }
                                    }else{//CHOICE IS NOT
                                        if(response.value != skiplogic.choice){
                                            this._skiplogicProcess(skiplogic)
                                            this.$parent()._abort()
                                        }
                                    }
                            }else{
                                //CHECKBOX
                                if(skiplogic.condition == 1){//CHOICE IS
                                    if(response.value == 1){
                                        this._skiplogicProcess(skiplogic)
                                        this.$parent()._abort()
                                    }
                                }else{//CHOICE IS NOT
                                    if(response.value != 1){
                                        this._skiplogicProcess(skiplogic)
                                        this.$parent()._abort()
                                    }
                                }

                            }
                            

                        }

                    })
                    resolve()
                }catch(e){
                    reject()
                }
            })
        },    
    }
}
</script>
