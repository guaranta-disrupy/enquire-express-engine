export default {
    id : 1,
    name : "Survey Name",
    setup : {
        random : 0,
        variable : 'q',
        duplicateIDs : 0,
        hidePrevBtn : 0,
        messages : {
            loading : 'Loading...',
            saving : 'Saving data...',
            complete : 'Preparing the next part...',
            screenout : 'Prease wait while we load the next step.',
            nextBtn : 'Next',
            prevBtn : 'Previous',
            finalBtn : 'Continue',
        },
        redirects : {

        }
    },
    questions : [
        {
            id : 10,
            question_type_id : 3,
            question : "Image Selection",
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
                    {
                        action : 2,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 1,//[CHOICE IS,CHOICE IS NOT]
                        choice  : 1,//[CHOICE ORDER]
                        question : 11,//FOR JUMP TO ONLY
                    },
                    {
                        action : 2,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 1,//[CHOICE IS,CHOICE IS NOT]
                        choice  : 5,//[CHOICE ORDER]
                        question : 12,//FOR JUMP TO ONLY
                    },
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
            id : 11,
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
        {
            id : 1,
            question_type_id : 1,//Descriptive
            question : `In this part of the survey, you will be asked to take a series of ‘speed tests’ designed to measure your reaction time – how quickly you can give a response. They are quite easy to do and you will not have to think about them too much. You may make the odd mistake or two, but don’t worry as everyone makes mistakes in this task. Just try to be as fast and accurate as you can. <br><br>
            There are quite a lot of trials in these tests so please try to stay until the end! <br><br>
            Press NEXT to continue.`,
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
            question : `Thank you for agreeing to take part in this survey, which will consist of THREE parts and in total last about 20 minutes.<br><br>
            All questions marked * must be answerd (like this one).<br><br>
            Please use the NEXT button below to navigate through this questionnaire. Using the back button on your browser will invalidate your responses.<br><br>
            Select ‘Yes’ to continue.`,
            choices : [
                {
                    name : "Yes",
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
                    name : "No",

                },
            ],
            setup : {
                selectMultiple : 0,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 1,//FOR NOT SELECT 1 ANS ONLY
                grid : 1,
                validate : {
                    required : 1, 
                    errorMsg : "This question requires an answer",               
                },
                skiplogic : [
                    {
                        action : 1,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 1,//[CHOICE IS,CHOICE IS NOT]
                        choice  : 2,//[CHOICE ORDER]
                        //question : 2,//FOR JUMP TO ONLY
                    },
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 3,
            question_type_id : 6,//OPEN ENDED
            question : "Open Ended",
            setup : {
                validate : {
                    required : 1,
                    min : 1,
                    max : 100,
                    errorMsg : "Please input a value in 1 - 100",
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
            id : 4,
            question_type_id : 11,//MATRIX
            question : `Please indicate your awareness of each of the following insurance companies.<br><br>
            Please select one answer per brand.`,
            rows : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance2.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance4.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance7.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance1.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance3.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/39e599fca14ff0107a64ssinsurance6.png'>",
                    optional : false
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance5.png'>",
                    optional : false
                   
                },
                {
                    name : "Others",
                    wc : {
                        type : 1,//[Inputbox,dropdownbox]
                        placeholder : 'Please specify',
                        validate : {
                            type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                            min : 5,//For SL, WN, DN
                            max :100,//For SL, WN, DN
                            errorMsg : 'Please input atlease 5 characters',
                        }
                    },
                    optional : true
                }
            ],
            columns : [
                {
                    name : "I know that they offer insurance"
                },
                {
                    name : "I’ve heard of them but didn’t know they offered insurance"
                },
                {
                    name : "I’ve never heard of them"
                },
            ],
            setup : {
                selectMultiple : 1,
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
                    {
                        action : 2,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 1,//[CHOICE IS / EQUAL TO,CHOICE IS NOT / NOT EQUAL TO, LESS THAN, GREATER THAN]
                        question : 1,//FOR JUMP TO ONLY
                        row : 1,  //checkbox
                        column : 3, // checkbox
                        value : 1, 
                        choice : 1, /// radio

                    }
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 5,
            question_type_id : 4,
            question : "Please indicate your age",
            setup : {
                validate : {
                    required : 1, 
                    type : 2,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                    min : 1,//For SL, WN, DN
                    max : 100,//For SL, WN, DN
                    //format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                    errorMsg : "Please input a value in 1 - 100",
                },
                skiplogic : [
                    {
                        action : 2,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 3,//[CHOICE IS / EQUAL TO,CHOICE IS NOT / NOT EQUAL TO, LESS THAN, GREATER THAN]
                        choice  : 18,//[CHOICE ORDER]
                        question : 1,//FOR JUMP TO ONLY
                    },
                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
        },
        {
            id : 6,
            question_type_id : 5,
            question : "Multiple Textbox",
            setup : {
                grid: 2,
                randomChoices : [],
                validate : {
                    required : 1,
                },
                skiplogic : [
                    {
                        action : 2,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                        condition : 3,//[CHOICE IS / EQUAL TO,CHOICE IS NOT / NOT EQUAL TO, LESS THAN, GREATER THAN]
                        choice  : 2,//[CHOICE ORDER]
                        value : 18,
                        question : 1,//FOR JUMP TO ONLY
                    },


                ],
                customSkiplogic : {
                    enter : "",
                    leave : ""
                }
            },
            items : [
                {
                    name : "Name",
                    validate : {
                        type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                        min : 1,//For SL, WN, DN
                        max : 30,//For SL, WN, DN
                        //format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                        errorMsg : "Please input 1 - 30 characters",
                    },
                },
                {
                    name : "Age",
                    validate : {
                        type : 2,
                        min : 1,
                        max : 100,
                        errorMsg : "Please input a value in 1 - 100",
                    },
                },
                {
                    name : "Email Address",
                    validate : {
                        type : 4,
                        errorMsg : "Please input a valid email",
                    },
                },


            ],
        },
        {
            id : 7,
            question_type_id : 8,//SLIDER
            question : "Slider",
            items : [
                {
                    name : 'Item 1'
                },
                {
                    name : 'Item 2'
                },
                {
                    name : 'Item 3'
                }
            ],
            values : [
                {
                    name : 'Very Disagreeable',
                    color: '#b71c1c',
                },
                {
                    name : 'Very Disagreeable',
                    color: '#e53935',
                },
                {
                    name : 'Disagreeable',
                    color: '#ef5350',
                },
                {
                    name : 'Somewhat Disagreeable',
                    color: '#ff9800',

                },
                {
                    name : 'Somewhat Agreeable',
                    color: '#cddc39',
                },
                {
                    name : 'Agreeable',
                    color: '#8bc34a',
                },
                {
                    name : 'Very Agreeable',
                    color: '#4caf50',
                }

            ],
            setup : {
                default : 4,
                randomList : [],
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
            id : 8,
            question_type_id : 10,//STAR RATING
            question : "Star Rating",
            items : [
                {
                    name : "Item 1"
                },
                {
                    name : "Item 2"
                },
                {
                    name : "Item 3"
                },
                {
                    name : "Item 4"
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
                }
            },
        },
        {
            //Q1_1_1
            id : 8,
            question_type_id : 12,//MATRIX MULTI TYPE
            question : `Please indicate your awareness of each of the following insurance companies.<br><br>
            Please select one answer per brand.`,
            items :[
                {
                    title : 'Category1',
                    column : [
                        {
                            name : 'Name',
                            type : 3,
                            validate : {
                                type : 1,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                                min : 5,//For SL, WN, DN
                                max :100,//For SL, WN, DN
                                errorMsg : 'Please input atlease 5 characters',
                            }
                        },
                        {
                            name :'Age',
                            type : 1,//[dropdown,radio,textbox]
                            placeholder : "Select age",
                            items : [
                                {
                                    name : '1 to 18 years old',
                                },
                                {
                                    name : '18 years old above',
                                }
                            ]
                        },
                       
                    ]
                },
                {
                    title : 'Gender',
                    column : [
                        {
                            name :'Boy',
                            type : 2,//[dropdown,radio,textbox]
                        },
                        {
                            name :'Girl',
                            type : 2,//[dropdown,radio,textbox]
                        },
                    ]
                },
            ],
            rows : [
                {
                     name : 'row1'
                },
                {
                     name : 'row2'
                }
            ],
            setup : {
                placeholder : "",
                randomRows : [],
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
        // { /// RANKING 9
        //     id : 9,
        //     question_type_id : 9,
        //     question : "Ranking",
        //     setup : {
        //         randomChoices : [],
        //         validate : {
        //             required : 1,
        //             min : 3,
        //             max : 3,
        //             errorMsg : "This question requires an answer",
        //         },
        //         skiplogic : [
        //         ],
        //         customSkiplogic : {
        //             enter : "",
        //             leave : ""
        //         }
        //     },
        //     items : [
        //         {
        //             name : 'item1'
        //         },
        //         {
        //             name : 'item2'
        //         },
        //         {
        //             name : 'item3'
        //         },
        //         {
        //             name : 'item4'
        //         }
        //     ],
        // },
        {
            id : 7,
            question_type_id : 8,//SLIDER
            question : "Slider",
            items : [
                {
                    name : 'Item 1'
                },
                {
                    name : 'Item 2'
                },
                {
                    name : 'Item 3'
                }
            ],
            values : [
                {
                    name : 'Very Disagreeable',
                    color: '#b71c1c',
                },
                {
                    name : 'Very Disagreeable',
                    color: '#e53935',
                },
                {
                    name : 'Disagreeable',
                    color: '#ef5350',
                },
                {
                    name : 'Somewhat Disagreeable',
                    color: '#ff9800',

                },
                {
                    name : 'Somewhat Agreeable',
                    color: '#cddc39',
                },
                {
                    name : 'Agreeable',
                    color: '#8bc34a',
                },
                {
                    name : 'Very Agreeable',
                    color: '#4caf50',
                }

            ],
            setup : {
                default : 4,
                randomList : [],
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
            id : 13,
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
            id : 14,
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



    ]

}