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
            qOrder : 1,//Question Order
            //dOrder : Display Order
            question : "Question 1",
            customSkiplogic : {
                in : "",
                out : ""
            }


        },
        {
            id : 2,
            type : 2,//Multiple Choice
            qOrder : 2,
            question : "Question 2",
            choices : [
                {
                    id : 1,
                    name : "Choice 1",
                    cOrder : 1,//STATIC
                },
                {
                    id : 2,
                    name : "Choice 2",
                    cOrder : 2,//STATIC
                },
                {
                    id : 3,
                    name : "Choice 3",
                    cOrder : 3,//STATIC
                }
            ],
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answere",
                selectMultiple : 0,
                randomChoices : [1,2],//CHOICE ORDER
                writeInChoice : [3],
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                layout : 1,
            },
            skiplogic : [
                // {
                //     action : 1,//JUMP TO
                //     condition : 1,//CHOICE IS
                //     choice  : 1,//CHOICE ORDER
                //     question : 5//QUESTION ORDER
                // },
                // {
                //     action : 2,//FINISH SURVEY
                //     condition : 1,//CHOICE IS
                //     choice  : 2,//CHOICE ORDER
                // }
            ],
            customSkiplogic : {
                in : "",
                out : ""
            }
        },
        {
            id : 3,
            type : 2,//Multiple Choice
            qOrder : 3,
            question : "Question 3 [PIPE::Q2]",
            choices : [
                {
                    id : 1,
                    name : "Choice 1",
                    cOrder : 1,
                },
                {
                    id : 2,
                    name : "Choice 2",
                    cOrder : 2,
                },
                {
                    id : 3,
                    name : "Choice 3",
                    cOrder : 3,
                },
                {
                    id : 4,
                    name : "Choice 4",
                    cOrder : 4,
                }
            ],
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answere",
                selectMultiple : 1,
                randomChoices : [1,2],//CHOICE ORDER
                writeInChoice : [3,4],
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                layout : 2,
            },
            skiplogic : [
                {
                    action : 1,//JUMP TO
                    condition : 1,//CHOICE IS
                    choice  : 1,//CHOICE ORDER
                    question : 4//QUESTION ORDER
                }
            ],
            customSkiplogic : {
                in : "if(ans['Q2'] == 3){q.skipLogicProcess({action:1,question:6});throw('GO TO QUESTION 6');}",
                out : ""
            }
        },
        {
            id : 4,
            type : 3,
            qOrder : 4,
            question : "Question 4",
            input : "",
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answere",
                validateMin : 0,
                validateMax : 100,
                validateErrorMsg : "Invalid Text",
            },
            customSkiplogic : {
                in : "",
                out : ""
            }
        },
        {
            id : 5,
            type : 2,//Multiple Choice
            qOrder : 5,
            question : "Question 5",
            choices : [
                {
                    id : 1,
                    name : "Choice 1",
                    cOrder : 1,
                },
                {
                    id : 2,
                    name : "Choice 2",
                    cOrder : 2,
                },
                {
                    id : 3,
                    name : "Choice 3",
                    cOrder : 3,
                },
                {
                    id : 4,
                    name : "Choice 4",
                    cOrder : 4,
                }
            ],
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answere",
                selectMultiple : 0,
                randomChoices : [],//CHOICE ORDER
                writeInChoice : [],
                unSelectAll : [],//CHOICE ORDER
                selectAll : [],//CHOICE ORDER
                layout : 6,
            },
            skiplogic : [

            ],
            customSkiplogic : {
                in : "",
                out : ""
            }

        },
        {
            id : 6,
            type : 4,//MATRIX
            qOrder : 6,
            question : "Question 6",
            rows : [
                {
                    name : "Row 1",
                    cOrder : 1
                },
                {
                    name : "Row 2",
                    cOrder : 2
                },
                {
                    name : "Row 3",
                    cOrder : 3
                }
            ],
            columns : [
                {
                    name : "Col 1"
                },
                {
                    name : "Col 2"
                },
                {
                    name : "Col 3"
                },
                {
                    name : "Col 4"
                },
                {
                    name : "Col 5"
                },
                {
                    name : "Col 6"
                },
                {
                    name : "Col 7"
                }

            ],
            setup : {
                required : 1,
                requiredErrorMsg : "This question requires an answere",
                selectMultiple : 1,
                randomRows : [1,2,3],
                writeInChoice : [7],//COLUMN ORDER
                unSelectAll : [7],//COLUMN ORDER
                selectAll : [],//COLUMN ORDER
                showLabelOnSelect : 1
            },
            skiplogic : [
                {
                    action : 1,//JUMP TO
                    condition : 1,//CHOICE IS
                    row  : 1,//ROW ORDER
                    column : 2,//COLUMN ORDER
                    question : 4//QUESTION ORDER
                }
            ],
            customSkiplogic : {
                //in : "q.hideRow(3);q.hideColumn(6);q.hideColumn(5);",
                in : "",
                out : ""
            }
        },
        {
            id : 7,
            type : 5,
            qOrder : 7,
            question : "Question 7",
            input : "",
            setup : {
                required : 1, 
                requiredErrorMsg : "This question requires an answere",
                validateType : 3,//[Specific Length, Whole Number, Decimal Number, Email Address]
                validateMin : 0,//For SL, WN, DN
                validateMax : 100,//For SL, WN, DN
                validateErrorMsg : "Invalid Text",
            },
            customSkiplogic : {
                in : "",
                out : ""
            }
        },






    ]
}