export default {
    methods : {      
        _selectItem(choice){
            choice.checked = !choice.checked
            if(choice.checked){
                choice.checkedValue = 1
            }else{
                choice.checkedValue = 0
            }
        }
    }
}