<template>
    <Teleport to="body">
    <div class="videoPlayerModal" v-if="setup.show" :style = "{ '--videoWidth' : data?.setup.layout_video.width, '--videoHeight': data?.setup.layout_video.height}">
            <div class="content">
                <div class="spinner" v-if="isLoading"></div>
                <div class="error-message" v-if="hasError">
                    <div class="error-icon">⚠️</div>
                    <div class="error-text">{{ errorMessage }}</div>
                    <button class="retry-btn" @click="_retryVideo()">Try Again</button>
                </div>
                <video ref="videoElem" 
                       preload="metadata"
                       playsinline webkit-playsinline
                       @canplay="_onCanPlay()" @playing="_onCanPlay()" 
                       @stalled="()=>{isLoading = true}" @waiting="()=>{isLoading = true}"
                       @loadeddata="_onLoadedData()" 
                       @error="_onVideoError()" 
                       @loadstart="_onLoadStart()">
                    <source v-for="source in videoSources" :key="source.src" :src="source.src" :type="source.type">
                    Your browser does not support the video tag.
                </video>
            </div>
    </div>
    </Teleport>
</template>
<script>
export default {
    data(){
        return {
            setup : {
                show : false,
            },
            isLoading:false,
            loadingTimeout:null,
            hasError: false,
            errorMessage: '',
            supportedFormats: ['mp4', 'webm', 'ogg']
        };
    },
    emits: ['video:ended'],
    props : {
        data : {
            required :true,
            default : null
        }
    },
    computed: {
        videoSources() {
            if (!this.data?.setup?.layout_video?.src) return [];
            
            const originalSrc = this.data.setup.layout_video.src;
            const sources = [];
            
            // Add the original source first
            sources.push({
                src: originalSrc,
                type: this._getVideoMimeType(originalSrc)
            });
            
            // Add fallback formats if the original is not MP4
            if (!originalSrc.toLowerCase().includes('.mp4')) {
                const baseUrl = originalSrc.replace(/\.[^/.]+$/, '');
                const fallbackFormats = [
                    { ext: '.mp4', type: 'video/mp4' },
                    { ext: '.webm', type: 'video/webm' },
                    { ext: '.ogg', type: 'video/ogg' }
                ];
                
                fallbackFormats.forEach(format => {
                    sources.push({
                        src: baseUrl + format.ext,
                        type: format.type
                    });
                });
            }
            
            return sources;
        }
    },
    methods : {
         _showModal(){
            let loop = this.data.setup.layout_video.loop
            
            this.setup.show = true
             this.$nextTick(()=>{
                    this.$refs['videoElem'].play()
                    this.isLoading =false
                        this.loadingTimeout= setTimeout(() =>{
                            this.isLoading = true
                    },100);
                        
                        this.$refs['videoElem'].onended = ()=>{
                        loop -= 1
                        if (loop >= 0){
                            this.$refs['videoElem'].currentTime = 0
                            this.$refs['videoElem'].play()
                            
                        }else{
                            this.setup.show = false
                            this.$emit("video:ended")
                        }

                    }

             })

                        
            
        },
        _hideModal(){
            this.setup.show = false
            clearTimeout(this.loadingTimeout)
        },
        _onCanPlay(){
            clearTimeout(this.loadingTimeout)
            this.isLoading = false
        },
        _onLoadedData(){
            console.log("mo load siya")
        },
        _onVideoError(event){
            console.error('Video error:', event);
            this.isLoading = false;
            this.hasError = true;
            
            const video = this.$refs.videoElem;
            if (video.error) {
                switch(video.error.code) {
                    case video.error.MEDIA_ERR_ABORTED:
                        this.errorMessage = 'Video playback was aborted';
                        break;
                    case video.error.MEDIA_ERR_NETWORK:
                        this.errorMessage = 'Network error occurred while loading video';
                        break;
                    case video.error.MEDIA_ERR_DECODE:
                        this.errorMessage = 'Video format not supported on this device';
                        break;
                    case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        this.errorMessage = 'Video format not supported. Please try a different format (MP4 recommended)';
                        break;
                    default:
                        this.errorMessage = 'Video could not be played on this device';
                }
            } else {
                this.errorMessage = 'Video format not supported on this device';
            }
        },
        _onLoadStart(){
            this.hasError = false;
            this.errorMessage = '';
        },
        _checkVideoSupport(){
            const video = this.$refs.videoElem;
            if (!video.canPlayType) {
                return false;
            }
            
            // Check for common video formats
            const formats = [
                { type: 'video/mp4', codec: 'avc1.42E01E' },
                { type: 'video/webm', codec: 'vp8' },
                { type: 'video/ogg', codec: 'theora' }
            ];
            
            return formats.some(format => {
                return video.canPlayType(`${format.type}; codecs="${format.codec}"`) !== '';
            });
        },
        _retryVideo(){
            this.hasError = false;
            this.errorMessage = '';
            this.isLoading = true;
            
            // Reload the video
            const video = this.$refs.videoElem;
            video.load();
            
            // Try to play after a short delay
            setTimeout(() => {
                video.play().catch(error => {
                    console.error('Retry failed:', error);
                    this._onVideoError(error);
                });
            }, 100);
        },
        _getVideoMimeType(src) {
            const extension = src.split('.').pop().toLowerCase();
            const mimeTypes = {
                'mp4': 'video/mp4',
                'webm': 'video/webm',
                'ogg': 'video/ogg',
                'ogv': 'video/ogg',
                'avi': 'video/avi',
                'mov': 'video/quicktime'
            };
            return mimeTypes[extension] || 'video/mp4';
        }
    },
    mounted : ()=>{
        
    }
}


</script>
<style scoped>
.videoPlayerModal{
    height: 100%;
    width: 100%;
    background:rgba(0,0,0,.9);
    position: fixed;
    z-index: 900;
    top:0px;
    left:0px;
    display:flex;
    align-items: center;
    justify-content: center;
    /*pointer-events: none;
    touch-action: none;*/
}
.videoPlayerModal .content{
    position: relative;
    width: 70vw;
    height: auto;
    max-width:100%;
    max-height: 90vh; 
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;

}
.videoPlayerModal .content video{
    object-fit: contain;
    width: var(--videoWidth,95vw); 
    height: var(--videoHeight,95vh); 
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain; 
    border: none;
    display: block;
    justify-content: center;
}
.videoPlayerModal .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top: 5px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
.videoPlayerModal .error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 80%;
    z-index: 10;
}
.videoPlayerModal .error-icon {
    font-size: 24px;
    margin-bottom: 10px;
}
.videoPlayerModal .error-text {
    margin-bottom: 15px;
    line-height: 1.4;
}
.videoPlayerModal .retry-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}
.videoPlayerModal .retry-btn:hover {
    background: #0056b3;
}
</style>