export default {
    id : 1,
    name : "Survey Name",
    status : 1,
    setup : {
        random : 0,
        variable : 'q',
        hidePrevBtn : 0,
        showProgressbar : 1, // not found in ide
        messages : {
            loading : 'Loading...',
            saving : 'Saving data...',
            nextBtn : 'Next',
            prevBtn : 'Previous',
            finalBtn : 'Continue', // not found in ide
        },
        saving : {
            enable : 1,
            logo : "",
        },
        footer : {
            enable : 1,
            logo : ""
        },
        customCSS : "",
        customJS : "",
        modals : { // not found in ide
            invalidProject : {
                title : "Application Error",
                content : "Invalid Project.",
            },
            surveyClosed : {
                title : "Application Error",
                content : "This survey is not yet available.",
            },
            noIdAssigned : {
                title : "Application Error",
                content : "No ID assigned.",
            },
            connectionLost : {
                title : "Application Error",
                content : "Unable to connect with server. Please check your internet connection."
            }
        },
        redirects : {// not found in ide
            complete : {
                content : "Preparing the next part...",
                url : "https://www.splitsecondresearch.com/?status=1",
                duration : 0,
                passExternalVars : 1,
                passInternalVars : 1
            },
            screenout : {
                content : "Prease wait while we load the next step.",
                url : "https://www.splitsecondresearch.com/?status=2",
                duration : 0,
                passExternalVars : 1,
                passInternalVars : 1
            },
            qualityControl : {
                content : "Prease wait while we load the next step.",
                url : "https://www.splitsecondresearch.com/?status=3",
                duration : 0,
                passExternalVars : 1,
                passInternalVars : 1
            }
        }
    },
    questions : [
        {
            id : 1,
            question_type_id : 1,//Descriptive
            question : `This survey is for market research purposes only and is not promotional in any way.<br><br>
            Press <strong>NEXT</strong> to continue.`,
            setup : {
                customSkiplogic : {
                    in : "",
                    out : ""
                }
            },
        },
        {
            id : 2,
            question_type_id : 2,//Multiple Choice
            question : `How often do you conduct survey?`,
            choices : [
                {
                    name : "Weekly",
                    // wc : {
                    //     type : 1,//[Inputbox,dropdownbox]
                    //     placeholder : 'Enter email address',
                    //     validate : {
                    //         type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                    //         min : 10,//For SL, WN, DN
                    //         max :100,//For SL, WN, DN
                    //         errorMsg : 'Invalid email',
                    //     }
                    // }
                },
                {
                    name : "Monthly",

                },
                {
                    name : "Quarterly",

                },
                {
                    name : "Annually",

                }
            ],
            setup : {
                selectMultiple : 0,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 0,//FOR NOT SELECT 1 ANS ONLY
                placeholder : "Please select",//FOR DROPDOWN
                grid : 1,
                validate : {
                    required : 1, 
                    min : 1,//FOR MULTI ANS ONLY
                    max : 0,//FOR MULTI ANS ONLY
                    errorMsg : "This question requires an answer",               
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [],
                    leave : []
                }
            },
        },
        {
            id : 3,
            question_type_id : 2,//Multiple Choice
            question : `Which credit card brand do you prefer to use?`,
            choices : [
                {
                    name : "Mastercard",
                },
                {
                    name : "Visa",

                },
                {
                    name : "Discover",

                },
                {
                    name : "American Express",
                }
            ],
            setup : {
                selectMultiple : 1,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 0,//FOR NOT SELECT 1 ANS ONLY
                grid : 1,
                validate : {
                    required : 1, 
                    min : 1,//FOR MULTI ANS ONLY
                    max : 0,//FOR MULTI ANS ONLY
                    errorMsg : "This question requires an answer",               
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_choices',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [2,3,4]
                        },
                        {
                            trigger: 'enter',
                            jump_to: 5,
                            action: 'jump_to',
                            conditions: [
                                {
                                    "val": "3",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : []
                        }


                    ],
                    leave : []
                }
            },
        },
        {
            id : 4,
            question_type_id : 6,//OPEN ENDED
            question : "Comments / Suggestions:",
            setup : {
                validate : {
                    required : 1,
                    min : 1,
                    max : 200,
                    errorMsg : "Please input a value in 1 - 200",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 5,
            question_type_id : 5,
            question : "Basic Information",
            setup : {
                grid: 2,
                randomChoices : [],
                validate : {
                    required : 1,
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_items',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [2,3]
                        },
                    ],
                    leave : []
                }

            },
            items : [
                {
                    name : "First Name",
                    validate : {
                        type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                        min : 1,//For SL, WN, DN
                        max : 25,//For SL, WN, DN
                        //format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                        errorMsg : "Please input 1 - 25 characters",
                    },
                },
                {
                    name : "Last Name",
                    validate : {
                        type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                        min : 1,//For SL, WN, DN
                        max : 25,//For SL, WN, DN
                        //format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                        errorMsg : "Please input 1 - 25 characters",
                    },
                },
                {
                    name : "Age",
                    validate : {
                        type : 2,
                        min : 1,
                        max : 3,
                        errorMsg : "Please input a value from 1 - 100",
                    },
                },
                {
                    name : "Address",
                    validate : {
                        type : 1,
                        min : 1,
                        max : 200,
                        errorMsg : "Please input a value from 1 - 200",
                    },
                },

            ],
        },
        {
            id : 6,
            question_type_id : 4,
            question : "Email Address",
            setup : {
                validate : {
                    required : 1, 
                    type : 4,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                    min : 0,//For SL, WN, DN
                    max : 0,//For SL, WN, DN
                    //format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                    errorMsg : "Please enter valid email address",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 7,
            question_type_id : 7,
            question : "Please allocate 100 points on how you spend your income: ",
            setup : {
                randomChoices : [],
                enableDecimal : 0,
                prefix : '',
                suffix : '%',
                enableChart : 1,
                enableSlider  : 1,
                chart : {
                    enable : 1,
                    noDataLabel : "Not set",
                    //noDataColor : "gray" //optional
                },
                range : {
                    min : 0,
                    max : 100,
                    origin : 0
                },
                totalLabel : {
                    enable : 1,
                    text : "Total"
                },
                fixedValue : 1,
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                validate2 : {//For not fixed value
                    minValue : 10,
                    errorMsg : "Each value must be geather than 10"
                },
                validate3 : {//For fixed value
                    total : 100,
                    errorMsg : "Total must be 100%",                     
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_items',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [2,3]
                        },
                    ],
                    leave : []
                }
            },
            items : [
                {
                    name : 'Essentials (Gas, Grocery, etc.)',
                },
                {
                    name : 'Entertainment (Movies, Clubs, etc.)',
                },
                {
                    name : 'Savings',
                },
                {
                    name : 'Transportation',
                }
            ],
        },
        {
            id :  8,
            question_type_id : 11,//MATRIX
            question : `How satisfied are you with the following : `,
            rows : [
                {
                    name : "Website",
                    optional : false
                },
                {
                    name : "Customer Service",
                    optional : false
                },
                {
                    name : "Overall",
                    optional : false
                },
            ],
            columns : [
                {
                    name : "Very Disatisfied"
                },
                {
                    name : "Not Satisfied"
                },
                {
                    name : "Neutral"
                },
                {
                    name : "Satisfied"
                },
                {
                    name : "Very Satisfied"
                }
            ],
            setup : {
                selectMultiple : 0,
                randomRows : [],
                unSelectAll : [],//COLUMN ORDER
                selectAll : [],//COLUMN ORDER
                validate : {
                    required : 1,
                    min : 1,//MINIMUM SELECTION FOR MULTI ANS ONLY
                    max : 3,//MAXIMUM SELECTION FOR MULTI ANS ONLY
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_rows',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [3]
                        },
                    ],
                    leave : []
                },
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 9,
            question_type_id : 8,//SLIDER
            question : "How satisfied are you with the following : ",
            items : [
                {
                    name : "Website",
                },
                {
                    name : "Customer Service",
                },
                {
                    name : "Overall",
                },
            ],
            values : [
                {
                    name : 'Very Disatisfied',
                    color: '#b71c1c',
                },
                {
                    name : 'Not Satisfied',
                    color: '#ef5350',
                },
                {
                    name : 'Neutral',
                    color: '#ff9800',
                },
                {
                    name : 'Satisfied',
                    color: '#8bc34a',

                },
                {
                    name : 'Very Satisfied',
                    color: '#009688',
                },
            ],
            setup : {
                default : 3,
                randomItems : [],
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_items',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [2,3]
                        },
                    ],
                    leave : []
                }


            },
        },
        {
            id : 10,
            question_type_id : 10,//STAR RATING
            question : "How satisfied are you with the following : ",
            items : [
                {
                    name : "Website",
                },
                {
                    name : "Customer Service",
                },
                {
                    name : "Overall",
                },
            ],
            setup : {
                size : 5,
                randomItems : [],
                design : {
                    selected : "",
                    notSelected : "",
                },
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [
                        {
                            trigger: 'enter',
                            jump_to: 1,
                            action: 'hide_items',
                            conditions: [
                                {
                                    "val": "2",
                                    "var": "Q2",
                                    "method": "process",
                                    "operator": "==",
                                    "conditions": [],
                                    "left_operator": "&&"
                                },
                            ],
                            value : [2]
                        },
                    ],
                    leave : []
                }
            },
        },
        {
            id : 11,
            question_type_id : 3,
            question : "Please choose the product you like :",
            setup : {
                selectMultiple : 1,
                randomChoices : [],
                grid : 4,
                itemMaxWidth : 200,
                validate : {
                    required : 1,
                    min : 0,
                    max : 0,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                },
                advanceSkiplogic : {
                    enter : [],
                    leave : []
                }
            },
            choices : [
                {
                    name : 'Product 1',
                    src : require("@/assets/img/pre/product1/prod1.svg"),
                },
                {
                    name : 'Product 2',
                    src : require("@/assets/img/pre/product1/prod2.svg"),
                },
                {
                    name : 'Product 3',
                    src : require("@/assets/img/pre/product1/prod3.svg"),

                },
                {
                    name : 'Product 4',
                    src : require("@/assets/img/pre/product1/prod4.svg"),
                }
            ],
        },
        {
            id : 12,
            question_type_id : 3,
            question : "Please answer some questions about your survey experience.<br>How enjoyable did you find the survey?",
            setup : {
                selectMultiple : 0,
                randomChoices : [],
                grid : 5,
                itemMaxWidth : 300,
                validate : {
                    required : 1,
                    min : 0,
                    max : 0,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
            choices : [
                {
                    name : 'Not at all enjoyable',
                    src : require("@/assets/img/pre/smiles/SVG/s1.svg"),
                },
                {
                    name : 'Not enjoyable',
                    src : require("@/assets/img/pre/smiles/SVG/s2.svg"),
                },
                {
                    name : 'Neither enjoyable nor unenjoyable',
                    src : require("@/assets/img/pre/smiles/SVG/s3.svg"),

                },
                {
                    name : 'Quite enjoyable',
                    src : require("@/assets/img/pre/smiles/SVG/s4.svg"),
                },
                {
                    name : 'Very enjoyable',
                    src : require("@/assets/img/pre/smiles/SVG/s5.svg"),
                }
            ],
        },
        {
            id : 13,
            question_type_id : 3,
            question : "What do you think about this survey?",
            setup : {
                selectMultiple : 0,
                randomChoices : [],
                grid : 2,
                itemMaxWidth : 300,
                validate : {
                    required : 1,
                    min : 0,
                    max : 0,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
            choices : [
                {
                    name : 'Love It',
                    // src : require("@/assets/img/pre/like/like.svg"),
                    src : require("@/assets/img/pre/smiles/smile2/happy.jpeg"),
                },
                {
                    name : 'Hate It',
                    // src : require("@/assets/img/pre/like/unlike.svg"),
                    src : require("@/assets/img/pre/smiles/smile2/sad.jpeg"),
                },
            ],
        },
        {
            id : 14,
            question_type_id : 13, //Memory Test Descriptive
            question : "Memory test descriptive",
            items : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance2.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance4.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance7.png'>",
                },
            ],
            setup : {
                interval : 2000,//1 sec = 1000ms
                random : 1,
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 15,
            question_type_id : 14, //Memory Test Comparison
            question : "Memory test Comparison",
            item1 : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance2.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance4.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance7.png'>",
                },
            ],
            item2 : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance3.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance1.png'>",
                }, 
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance5.png'>",
                },                  
            ],
            setup : {
                getReactionTime : 0,
                random : 1,
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 16,
            question_type_id : 9,
            question : "Ranking",
            setup : {
                randomChoices : [],
                /**
                 * Number of columns
                 */
                numberOfColumns: 3,
                /**
                 * mode: ranking / sorting 
                 * 0 = ranking,
                 * 1 = sorting
                 */
                mode: 0, 
                 /**
                  * position: chosen box positioning
                  * 1 = chosen box is on the right
                  * 2 = chosen box is on the left  
                  * 3 = chosen box is on the bottom  
                  * 4 = chosen box is on the top  
                  * ON MOBILE VIEW
                  * 1 == 3 = chosen box is on the bottom
                  * 2 == 4 = chosen box is on the top  
                  * */
                position: 1,
                /**
                 * limit: drag limiter
                 * limit == 0 = no limit
                 * limit > 0 = with limit
                 */
                limit: 0,
                /**
                 * item fixed height
                 * zero = means not fixed, item height will dynamically increase
                 * fixedHeight > 0 ? fixed height in PIXEL
                 */
                fixedHeight: 0,
                /**
                 * validate: for empty data checker
                 */
                validate : {
                    required : 1,
                    errorMsg : "This question requires an answer",
                },
                /**
                 * validate2: item count checker
                 * minValue == 0 = means skip validation
                 * minValue > 0 = validate chosen item count
                 */
                validate2 : {//For not fixed value
                    minValue : 3,
                    errorMsg : "Select at least {{count}} item(s)"
                },
                skiplogic : [
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
            items : [
                {
                    name : 'item1',
                },
                {
                    name : 'item2',
                },
                {
                    name : 'item3',
                },
                {
                    name : 'item4',
                },
                {
                    name : 'item5',
                },
                {
                    name : 'item6',
                },
                {
                    name : 'item7',
                },
                {
                    name : 'item7',
                },
                {
                    name : 'item7',
                },
                {
                    name : 'item7',
                },
                {
                    name : 'item7',
                }
            ],
        },





    ]

}