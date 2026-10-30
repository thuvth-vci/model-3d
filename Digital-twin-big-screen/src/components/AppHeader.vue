<template>
  <div>
    <div class="app-header" v-show="visible">
      <span class="app-header__title">{{ dict[lang].title }}</span>
      <div class="app-header__actions">
        <button class="app-header__btn" @click="toggleLang">{{ dict[lang].langBtn }}</button>
        <button class="app-header__btn app-header__btn--close" @click="hideHeader">×</button>
      </div>
    </div>
    <div class="app-header__reopen" v-show="!visible" @click="showHeader">▼</div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      lang: 'vi',
      visible: true,
      dict: {
        vi: {
          title: 'Bảng điều khiển',
          langBtn: 'EN'
        },
        en: {
          title: 'Dashboard',
          langBtn: 'VI'
        }
      }
    }
  },
  methods: {
    toggleLang() {
      this.lang = this.lang === 'vi' ? 'en' : 'vi'
    },
    hideHeader() {
      this.visible = false
    },
    showHeader() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  background-color: rgba(4, 20, 41, 0.9);
  color: #fff;
  font-size: 16px;

  &__title {
    font-weight: bold;
    letter-spacing: 1px;
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__btn {
    margin-left: 8px;
    padding: 4px 12px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    background-color: transparent;
    color: #fff;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    &--close {
      padding: 4px 10px;
    }
  }
}

.app-header__reopen {
  position: fixed;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  z-index: 1000;
  border-radius: 50%;
  background-color: rgba(4, 20, 41, 0.9);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: rgba(4, 20, 41, 1);
  }
}
</style>
