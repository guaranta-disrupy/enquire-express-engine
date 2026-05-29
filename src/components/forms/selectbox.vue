<template>
  <div class="dSelect2" :class="{ hasError }" @click="toggleOpen">
    <div class="dSelect-trigger">
      <div v-html="selectedLabel || placeholderHtml"></div>
      <div class="arrow " :class="{'rotate':(!isOpen)}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      </div>
    </div>

    <transition name="drapdownAnimate">
      <div class="dSelect-menu" v-show="isOpen">
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          :data-value="option.value"
          class="dSelect-option"
          :class="{'active':(option.value == selectedValue)}"
          @click.stop="selectOption(option)"
          v-html="option.name"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    selected: [String, Number],
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '<i>Select an option</i>'
    }
  },
  data() {
    return {
      isOpen: false,
      selectedValue: this.selected,
      hasError: false,
      searchChar: '',
      searchTimeout: null
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter(opt => opt.show)
    },
    selectedLabel() {
      const match = this.filteredOptions.find(opt => opt.value === this.selectedValue)
      return match ? match.name : ''
    },
    placeholderHtml() {
      return this.placeholder
    }
  },
  watch: {
    selected(newVal) {
      this.selectedValue = newVal
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKey)
     document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKey)
     document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
       this.searchChar = ''
    },
    selectOption(option) {
      this.selectedValue = option.value
      this.$emit('update:selected', option.value)
      this.isOpen = false
    },
    handleClickOutside(e) {
      const dropdown = this.$el
      if (this.isOpen && !dropdown.contains(e.target)) {
        this.isOpen = false
      }
    },
    handleKey(e) {
      if (!this.isOpen || !e.key.match(/^[a-z0-9]$/i)) return

      this.searchChar += e.key.toLowerCase()

      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchChar = ''
      }, 1000) // reset after 1s

      const matched = this.filteredOptions.find(opt =>
        opt.name.replace(/<[^>]*>/g, '').trim().toLowerCase().startsWith(this.searchChar)
      )

      if (matched) {
        this.selectedValue = matched.value
        this.$emit('update:selected', matched.value)

        this.$nextTick(() => {
          const el = this.$el.querySelector(`.dSelect-option[data-value="${matched.value}"]`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })

      }
    }

  }
}
</script>

<style scoped>
.dSelect2 {
  position: relative;
  width: 100%;

  cursor: pointer;
}

.dSelect-trigger {
  padding:1.5vmin 1.5vmin;
  padding-right:4vmin;
  background: #fff;
  border: .1vmin solid var(--sb-border-color);
  border-radius:1vmin;
  font-size:var(--font);
  position:relative;
}

.dSelect2.hasError .dSelect-trigger {
    background: var(--tb-error-color);
    color:var(--tb-error-txt-color);
}

.dSelect-trigger > .arrow{
  position:absolute; 
  width: 2vmin;
  height:100%;
  top:0vmin;
  right:1.5vmin;
  display:flex;
  justify-content: center;
  align-items: center;
  /* color:var(--sb-border-color); */
}
.dSelect-trigger > .arrow svg{
   transition: all;
   transition-duration: 300ms;
}
.dSelect-trigger > .arrow.rotate svg{
    transform:rotate(180deg);


}

.dSelect-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  border: .1vmin solid var(--sb-border-color);
  border-radius:1vmin;
  z-index: 10;
  overflow-x:hidden;
  overflow-y: auto;
  max-height: 40vh;
  margin-top:1vmin;
}
.dSelect-option {
  padding:1.5vmin 1.5vmin;
  cursor: pointer;
  font-size:var(--font);
  transition: all;
  transition-duration: 300ms;
  
}
.dSelect-option:not(:last-child) {
border-bottom: .1vmin solid var(--sb-border-color);
}
.dSelect-option:hover {
  background-color: #eee;
  padding-left:2vmin;
}

.dSelect-option.active{
  background:var(--sb-selected-color);
   color:var(--sb-selected-txt-color);
}


.drapdownAnimate-enter-active {
  animation: drapdownAnimate-in 0.3s;
}
.drapdownAnimate-leave-active {
  animation: drapdownAnimate-in 0.3s reverse;
}
@keyframes drapdownAnimate-in {
  0% {
    /* opacity:0; */
    transform: translateY(2vmin);
  }
  100% {
    /* opacity:1; */
    transform: translateY(0vmin);
  }
}
</style>
