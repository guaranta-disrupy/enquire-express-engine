<template>
    <div    class="rank-drop-item" 
            ref="itemRef" 
            :class="{
                'sorting-item': $parent.$parent?.mode == 1,
                'ranking-item': $parent.$parent?.mode == 0
            }"
            :style="{
                'height': itemFixedHeight ? `${itemFixedHeight}px` : null
            }">
        <div class="rdi-num">
            {{ (dataId + 1) }}
        </div>
        <div    class="rdi-lbl"
                :style="{
                    flex: itemFixedHeight ? 1 : null
                }">
                <div v-html="text"></div>
        </div>
        <div class="rdi-btns-wrapper" @touchstart.stop @touchend.stop @mousedown.stop @mouseup.stop @click.stop>
            <button class="rdi-btn addItem" v-show="$parent.$parent?.mode == 0" @click="_moveItemChosen()" title="Add to Chosen">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="#4CAF50" stroke-width="2" fill="#E8F5E9"/>
                    <path d="M10 5v10M5 10h10" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <button class="rdi-btn removeItem" v-show="$parent.$parent?.mode == 0" @click="_moveItemSource()" title="Remove from Chosen">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="9" stroke="#F44336" stroke-width="2" fill="#FFEBEE"/>
                    <path d="M5 10h10" stroke="#F44336" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <div class="drag-indicator" v-show="$parent.$parent?.mode == 1">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="currentColor">
                <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
            dataId: Number,
            itemData: Object,
            itemFixedHeight: Number
        },
        mounted(){
            /**
             * INJECT DATA TO THE DOM OBJECT FOR EASY DATA RETRIEVAL
             */
            this.$refs.itemRef['itemData'] = this.itemData
        },
        methods:{
            _moveItemChosen(){
               let mainParent = this.$parent.$parent
               let d1 = document.querySelector(`[tag="${mainParent.data?.TAG}"] .drop-zone[data-role="chosen"]`)
               let d2 = document.querySelector(`[tag="${mainParent.data?.TAG}"] .drop-zone[data-role="sources"]`)
               if(mainParent.limitCount > 0){
                    if(d1.childElementCount >= mainParent.limitCount){
                        return false;
                    }
                }

               let RankItem = this.$refs.itemRef;
               d1.appendChild(RankItem);
               let chosenIndex = 1;
               d1.querySelectorAll('.rank-drop-item .rdi-num').forEach((itm) => {
                console.log(itm)
                    if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                        itm.textContent = chosenIndex;
                        chosenIndex++;
                    }
               })

               if(d2){
                    let notChosenIndex = 1;
                    d2.querySelectorAll('.rank-drop-item .rdi-num').forEach((itm) => {
                        if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                            itm.textContent = notChosenIndex;
                            notChosenIndex++;
                        }
                    });
                }

            },
            _moveItemSource(){
             
               let mainParent = this.$parent.$parent
               let d1 = document.querySelector(`[tag="${mainParent.data?.TAG}"] .drop-zone[data-role="chosen"]`)
               let d2 = document.querySelector(`[tag="${mainParent.data?.TAG}"] .drop-zone[data-role="sources"]`)
               let RankItem = this.$refs.itemRef;
               d2.appendChild(RankItem);
               let chosenIndex = 1;
               d2.querySelectorAll('.rank-drop-item .rdi-num').forEach((itm) => {
                console.log(itm)
                    if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                        itm.textContent = chosenIndex;
                        chosenIndex++;
                    }
               })

               if(d1){
                    let notChosenIndex = 1;
                    d1.querySelectorAll('.rank-drop-item .rdi-num').forEach((itm) => {
                        if(itm.parentNode.className.indexOf('sortable-drag') === -1){
                            itm.textContent = notChosenIndex;
                            notChosenIndex++;
                        }
                    });
                }                
            }
        }
    }
</script>

<style scoped>
.drag-indicator {
    position: absolute;
    right: 1vmin;
    top: 50%;
    transform: translateY(-50%);
    color: #adb5bd;
    opacity: 0.6;
    transition: all 0.2s ease;
    pointer-events: none;
}

.sorting-item:hover .drag-indicator {
    opacity: 1;
    color: var(--ssrcolor3);
    transform: translateY(-50%) scale(1.1);
}

.sorting-item.sortable-drag .drag-indicator {
    opacity: 0;
}

.sorting-item {
    cursor: grab;
    user-drag: none;
}

.sorting-item:active {
    cursor: grabbing;
}
</style>
