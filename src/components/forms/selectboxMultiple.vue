<template>
  <div ref="domSelection" class="dSelect" :class="{ hasError }">
    <div class="dMultipleSelectedItems">
      <transition-group name="checkedItems">
        <div
          class="item"
          v-for="item in _checked"
          :key="item.value"
          @click="_unselect(item)"
        >
          <div class="name" v-html="item.name" :class="{ removed: !item.checked }"></div>
          <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
          </div>
        </div>
      </transition-group>
    </div>

    <div
      class="dropdown-wrapper"
      tabindex="0"
      @keydown="_handleKeydown"
      ref="dropdownWrapper"
    >
      <div class="dropdown-trigger" @click.stop="toggleDropdown">
        <span v-html="placeholder"></span>
        <div class="arrow " :class="{'rotate':(!isDropdownOpen)}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
        </div>
      </div>

      <transition name="drapdownAnimate">
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <div
          class="dropdown-item"
          v-for="option in filteredOptions"
          :key="option.value"
          :class="{ selected: option.checked }"
          @click.stop="_onClick(option)"
          :data-option-id="option.value"
        >
          <input type="checkbox" :checked="option.checked" @change.prevent />
          <span v-html="option.name"></span>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: ["name", "selected", "options", "placeholder", "setup"],
  data() {
    return {
      hasError: false,
      isDropdownOpen: false,
      searchKey: "",
      localOptions: this.options.map(o => ({ ...o })),
      searchTimeout: null
    };
  },
  emits: ["update:selected"],
  computed: {
    _options() {
      return _.filter(this.localOptions, { show: true });
    },
    _checked() {
      const obj = _.filter(this.localOptions, { checked: true });
      obj.sort((b, a) => new Date(a.selectedTime) - new Date(b.selectedTime));
      return obj;
    },
    filteredOptions() {
      return this.options.filter(opt => opt.show)
    },
  },
  mounted() {
     document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
     document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    handleClickOutside(e) {
      const dropdown = this.$el
      if (this.isDropdownOpen && !dropdown.contains(e.target)) {
        this.isDropdownOpen = false
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
      if (this.isDropdownOpen) {
        this.$nextTick(() => {
          this.$refs.dropdownWrapper?.focus();
        });
      }
    },
    _onClick(choice) {
        const idx = this.localOptions.findIndex(opt => opt.value === choice.value);
        if (idx !== -1) {
          const isChecked = !this.localOptions[idx].checked;
          this.localOptions[idx] = {
            ...this.localOptions[idx],
            checked: isChecked,
            checkedValue: isChecked ? 1 : 0,
            selectedTime: isChecked ? new Date() : null
          };

          if (isChecked) {
            this._unSelectAll(this.localOptions[idx]);
            this._selectAll(this.localOptions[idx]);
          } else {
            this._unSelectAll(this.localOptions[idx]);
            this._selectAll(this.localOptions[idx]);
          }

          this.$emit("update:selected", this.localOptions);
          this._blur();
        }
    },
    _unselect(item) {
      item.checked = false;
      item.checkedValue = 0;
      item.selectedTime = null;
      this._unSelectAll(item);
      this._selectAll(item);
      this.$emit("update:selected", this.localOptions);
      this._blur();
    },
    _unSelectAll(choice) {
      if (!choice.checked) return;
      const targetLoc = _.indexOf(this.setup.unSelectAll, choice.order);
      if (targetLoc >= 0) {
        this.localOptions.forEach(c => {
          if (c.order !== choice.order) c.checked = false;
        });
      } else {
        this.setup.unSelectAll.forEach(order => {
          const idx = _.findIndex(this.localOptions, { order });
          if (idx >= 0) this.localOptions[idx].checked = false;
        });
      }
    },
    _selectAll(choice) {
      const targetLoc = _.indexOf(this.setup.selectAll, choice.order);
      if (targetLoc >= 0) {
        this.localOptions.forEach(c => {
          if (c.order !== choice.order) c.checked = true;
        });
      } else {
        this.setup.selectAll.forEach(order => {
          const idx = _.findIndex(this.localOptions, { order });
          if (idx >= 0) this.localOptions[idx].checked = false;
        });
      }
    },
    _blur() {
      this.$nextTick(() => {
        const selectedCount = _.filter(this.localOptions, { checked: true }).length;
        const txt = this.setup?.selectedPlaceholder || "selected";
        const wrapper = this.$refs.domSelection.querySelector(".dropdown-wrapper");
        if (wrapper) {
          wrapper.setAttribute("data-selected-length", selectedCount);
          wrapper.setAttribute("placeholder", `${selectedCount} ${txt}`);
        }
      });
    },
    _handleKeydown(e) {

            if (!this.isDropdownOpen || !e.key.match(/^[a-z0-9]$/i)) return

            this.searchKey += e.key.toLowerCase()

            clearTimeout(this.searchTimeout)
            this.searchTimeout = setTimeout(() => {
                this.searchKey = ''
            }, 1000) // reset after 1s

            const matched = this.filteredOptions.find(opt =>
                opt.name.replace(/<[^>]*>/g, '').trim().toLowerCase().startsWith(this.searchKey)
            )

            if (matched) {
               this.$nextTick(() => {
                const el = this.$el.querySelector(`[data-option-id="${matched.value}"]`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                });

            }

    }

  }
};
</script>

<style scoped>
.icon{
    width:1.5vmin;
}

.dSelect {
  width:100%;
  position: relative;
}

.dMultipleSelectedItems {
  display: flex;
  flex-wrap: wrap;
  gap: .5vmin;
  margin-bottom: 1vmin;
}



.item {
  display: flex;
  align-items: center;
  background: #e0f7fa;
  border: .1vmin solid var(--sb-border-color);
  border-radius: 1vmin;
  padding:1.5vmin 1.5vmin;
  cursor: pointer;
   font-size:var(--font);
}

.dropdown-wrapper {
 border: .1vmin solid var(--sb-border-color);
  border-radius: 1vmin;
  background: white;
  position: relative;
  user-select: none;
}

.dropdown-trigger {
  padding:1.5vmin 1.5vmin;
  cursor: pointer;
   font-size:var(--font);
  display: flex;
  justify-content: space-between;
  align-items: center;

}


.dropdown-trigger > .arrow{
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
.dropdown-trigger > .arrow svg{
   transition: all;
   transition-duration: 300ms;
}
.dropdown-trigger > .arrow.rotate svg{
    transform:rotate(180deg);

}


.hasError .dropdown-trigger {
  border-color: #e74c3c;
  background-color: #ffe5e5;
}

.dropdown-trigger:hover {
  /* background: #f0f0f0; */
}
.arrow {
  font-size: 0.8em;
  color: #333;
}
.dropdown-menu {
  position: absolute;
  width: 100%;
 background-color: #f5f5f5;
 border: .1vmin solid var(--sb-border-color);
   border-radius:1vmin;
  max-height: 35vh;
  overflow-y: auto;
  z-index: 10;
    margin-top:1vmin;
    
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: .5vmin;
   padding:1.5vmin 1.5vmin;
  transition: all;
  transition-duration: 300ms;
   font-size:var(--font);


}
.dropdown-item input{
    display:none;
}

.dropdown-item:not(:last-child) {
border-bottom: .1vmin solid var(--sb-border-color);
}

.dropdown-item:hover {
  background-color: #eee;
  padding-left:2vmin;

}
.dropdown-item.selected {
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
