export default {
    watch:{
        'data.show'(t){
            if(t){
                this._checkBtnDelay()
            }
        }
    },
    methods : {   
        _playVideo(){
            //alert("Playing....")
            //this.$refs['videoPlayerModalElem']._showModal()
            this.$refs['videoPlayerModalElem']._showModal()
            
        },
        _checkBtnDelay(){
            let delay = parseInt(this.data.setup.btn_delay)
            if(delay){
                this.showFooter = false
                setTimeout(()=>{
                    this.showFooter = true
                },delay * 1000)
            }
        }
    }
}