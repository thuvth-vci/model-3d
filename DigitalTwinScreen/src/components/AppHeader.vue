<!--
 描述: 顶部语言切换栏（简易实现，不依赖任何 i18n 库）
-->

<template>
  <div>
    <div class="app-header" v-if="visible">
      <span class="app-header__title">{{ text.title }}</span>
      <div class="app-header__actions">
        <button class="app-header__btn" @click="toggleLang">{{ text.langBtn }}</button>
        <button class="app-header__btn app-header__btn--close" @click="visible = false">×</button>
      </div>
    </div>
    <div class="app-header__reopen" v-else @click="visible = true">▼</div>
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
        vi: { title: 'Màn hình số', langBtn: 'EN' },
        en: { title: 'Digital Screen', langBtn: 'VI' }
      }
    }
  },
  computed: {
    text() {
      return this.dict[this.lang]
    }
  },
  methods: {
    toggleLang() {
      this.lang = this.lang === 'vi' ? 'en' : 'vi'
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
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  background: rgba(4, 21, 46, 0.85);
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
    margin-left: 10px;
    min-width: 32px;
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    background: transparent;
    color: #fff;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &--close {
      min-width: 28px;
      padding: 0;
      font-size: 16px;
    }
  }

  &__reopen {
    position: fixed;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    background: rgba(4, 21, 46, 0.85);
    color: #fff;
    cursor: pointer;
    z-index: 9999;
    font-size: 12px;

    &:hover {
      background: rgba(4, 21, 46, 1);
    }
  }
}
</style>
