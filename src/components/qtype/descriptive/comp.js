export default {
    watch:{
        'data.show'(t){
            if(t){
                this._checkBtnDelay()
                this._checkBtnautoNext()
            }
        }
    },
    methods : {      
        _checkBtnDelay(){

            let delay = parseInt(this.data.setup.btn_delay)
           
            if(delay){
                this.showFooter = false
                
                // Start timer display for delay
                this._startTimer(delay, () => {
                    this.showFooter = true
                })
            }
        },
        _checkBtnautoNext(){
            let autoNext = parseInt(this.data.setup.btn_autoNext)
            
            if(autoNext && autoNext > 0){
                // Wait for footer to be shown (if there's a delay)
                const waitForFooter = () => {
                    this.$nextTick(() => {
                        // Try to access the footer component directly first
                        let nextBtn = null;
                        
                        if (this.$refs.footer && this.$refs.footer.$refs.next) {
                            nextBtn = this.$refs.footer.$refs.next;
                        } else {
                            // Fallback to DOM query selectors
                            nextBtn = document.querySelector(`.dBox[tag="${this.data.TAG}"] .dBtn.next`);
                            
                            // If not found, try looking in the footer component
                            if (!nextBtn) {
                                nextBtn = document.querySelector(`.dBox[tag="${this.data.TAG}"] .footer .dBtn.next`);
                            }
                            
                            // If still not found, try looking for any next button in the current question
                            if (!nextBtn) {
                                nextBtn = document.querySelector(`.dBox[tag="${this.data.TAG}"] button.dBtn.next`);
                            }
                        }
                        if (nextBtn) {
                            // Hide the next button when auto-next is activated
                            nextBtn.style.display = "none";
                        
                            // Start timer for auto-next
                            this._startTimer(autoNext, () => {
                                setTimeout(() => {
                                    this._clearTimer();
                                    nextBtn.click();
                                }, 300);
                            });
                        } else {
                            // Retry if button not found
                            setTimeout(() => {
                                waitForFooter();
                            }, 100);
                        }
                    });
                };
                
                // Start waiting for footer
                waitForFooter();
            }
        },
        
        _startTimer(duration, onComplete){
            // Clear any existing timer
            this._clearTimer();
            
            // Show timer display
            this.timerDisplay.show = true;
            this.timerDisplay.countdown = duration;
            this.timerDisplay.totalDuration = duration;
            
            // Start countdown interval
            this.timerDisplay.intervalId = setInterval(() => {
                this.timerDisplay.countdown--;
                if (this.timerDisplay.countdown < 0) {
                    this._clearTimer();
                    if (onComplete) {
                        onComplete();
                    }
                }
            }, 1000);
        },
        
        _clearTimer(){
            if (this.timerDisplay.intervalId) {
                clearInterval(this.timerDisplay.intervalId);
                this.timerDisplay.intervalId = null;
            }
            this.timerDisplay.show = false;
            this.timerDisplay.countdown = 0;
            this.timerDisplay.totalDuration = 0;
        }
    }
}