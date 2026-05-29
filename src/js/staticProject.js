export default {
    id : 1,
    name : "Survey Name",
    setup : {
        random : 0,
        variable : 'q',
    },
    questions : [
        {
            id : 1,
            type : 1,//Descriptive
            question : 'Descriptive',
            customSkiplogic : {
                in : "",
                out : ""
            }
        },
        {
            id : 2,
            type : 2,//Multiple Choice
            question : 'Multiple Choice (Single Answer)',
            choices : [
                {
                    name : "Yes",
                    // wc : {
                    //     type : 1,//[Inputbox,dropdownbox]
                    //     placeholder : 'Enter email address',
                    //     validate : {
                    //         type : 4,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
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
                required : 1, 
                requiredErrorMsg : "This question requires an answer",
                selectMultiple : 0,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 0,//FOR SINGLE ANS ONLY
                grid : 1,//Grid display
            },
            skiplogic : [
                {
                    action : 1,//[DISQUALIFY, JUMP TO, FINISH SURVEY, QUALITY CONTROL]
                    condition : 1,//[CHOICE IS,CHOICE IS NOT]
                    choice  : 2,//[CHOICE ORDER]
                    //question : 2,//FOR JUMP TO ONLY
                }
            ],
            customSkiplogic : {
                enter : "",//Execute when entering question
                leave : ""//Exectute when leaving question
            }
        },
        {
            id : 3,
            type : 2,//Multiple Choice
            question : 'Multiple Choice (Multiple Answer)',
            choices : [
                {
                    name : "Banking / Insurance",
                },
                {
                    name : "Advertising / Market Research / Marketing",
                },
                {
                    name : "Journalism/ Publishing / Public Relations",
                },
                {
                    name : "Production / Sale of Pharmaceuticals / Health care Sector",
                },
                {
                    name : "Public Administration / Education",
                },
                {
                    name : "Industry / Transportation and Service",
                },
                {
                    name : "Water / Electricity / Gas / Steam Supply",
                },
                {
                    name : "Another industry",                    
                },
            ],
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answer",
                selectMultiple : 1,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 0,//FOR NOT SELECT MULTIPLE ONLY
                grid : 1,
            },
            validate : {
                minSelection : 1,//FOR MULTI ANS ONLY
                maxSelection : 3,//FOR MULTI ANS ONLY
                errorMsg : "Please choose 1 to 3 items only",
            },
            skiplogic : [
            ],
            customSkiplogic : {
                enter : "",
                leave : ""
            }
            
        },
        {
            id : 4,
            type : 2,//Multiple Choice
            question : 'Multiple Choice (Dropdown)',
            choices : [
                {
                    name : "Yes",
                },
                {
                    name : "No",
                },
            ],
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answer",
                selectMultiple : 0,
                randomChoices : [],//CHOICE ORDER
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                isDropdown : 1,//FOR NOT SELECT MULTIPLE ONLY
                grid : 1,//Grid display
            },
            skiplogic : [

            ],
            customSkiplogic : {
                enter : "",//Execute when entering question
                leave : ""//Exectute when leaving question
            }
        },
        {
            id : 5,
            type : 3,
            question : "Open Ended",
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answer",
            },
            validate : {
                min : 1,
                max : 100,
                errorMsg : "Please input from 1 - 100 character only",
            },
            skiplogic : [
            ],
            customSkiplogic : {
                enter : "",
                leave : ""
            }
        },
        {
            id : 6,
            type : 4,//MATRIX
            question : 'MATRIX (SINGLE ANSWER)',
            rows : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance2.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance4.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance7.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance1.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance3.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/39e599fca14ff0107a64ssinsurance6.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance5.png'>",
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
                required : 1,
                requiredErrorMsg : "This question requires an answer",
                selectMultiple : 0,
                randomRows : [],
                unSelectAll : [],//COLUMN ORDER
                selectAll : [],//COLUMN ORDER
            },
            skiplogic : [
            ],
            customSkiplogic : {
                enter : "",
                leave : ""
            }
        },
        {
            id : 7,
            type : 4,//MATRIX
            question : 'MATRIX (MULTIPLE ANSWER)',
            rows : [
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance2.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance4.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance7.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance1.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance3.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/39e599fca14ff0107a64ssinsurance6.png'>",
                },
                {
                    name : "<img src='https://explicit.splitsecondsurveys.co.uk/ide2/storage/images/5fba320712512c37d4dcssinsurance5.png'>",
                }

            ],
            columns : [
                {
                    name : "Home insurance"
                },
                {
                    name : "Car insurance"
                },
                {
                    name : "Health insurance"
                },
                {
                    name : "Life insurance"
                },
                {
                    name : "Travel insurance"
                },
                {
                    name : "Other type of insurance"
                },
                {
                    name : "I do not use this company for insurance"
                }
            ],
            setup : {
                required : 1,
                requiredErrorMsg : "This question requires an answer",
                selectMultiple : 1,
                randomRows : [],
                unSelectAll : [7],//COLUMN ORDER
                selectAll : [],//COLUMN ORDER
            },
            skiplogic : [
            ],
            customSkiplogic : {
                enter : "",
                leave : ""
            }
        },
        {
            id : 8,
            type : 5,
            question : "Single Textbox (Whole Number)",
            input : "",
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answer",
            },
            validate : {
                type : 2,//[Specific Length, Whole Number, Decimal Number, Email Address, Date, Time, Date Time]
                min : 1,//For SL, WN, DN
                max : 100,//For SL, WN, DN
                format : "DD MMM YYYY",//DATE ["DD MMM YYYY","MMM DD YYYY"], TIME [], DATETIME []
                errorMsg : "Please input a value in 1 - 100",
            },
            skiplogic : [
            ],
            customSkiplogic : {
                enter : "",
                leave : ""
            }
        },
    ]
}