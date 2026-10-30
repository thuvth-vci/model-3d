<!--
 * @Description: Lightweight fixed header with a simple VI/EN language toggle
 *                (plain reactive state, no i18n library) and a show/hide control.
-->
<script setup lang="ts">
import { ref } from 'vue'

type Lang = 'vi' | 'en'

const lang = ref<Lang>('vi')
const headerVisible = ref(true)

const dict = {
  vi: {
    title: 'Dịch vụ thành phần động 3D',
    langBtn: 'EN',
  },
  en: {
    title: 'Dynamic 3D Component Service',
    langBtn: 'VI',
  },
}

function toggleLang() {
  lang.value = lang.value === 'vi' ? 'en' : 'vi'
}

function hideHeader() {
  headerVisible.value = false
}

function showHeader() {
  headerVisible.value = true
}
</script>

<template>
  <header v-if="headerVisible" class="app-header">
    <span class="app-header__title">{{ dict[lang].title }}</span>
    <div class="app-header__actions">
      <button class="app-header__btn" type="button" @click="toggleLang">
        {{ dict[lang].langBtn }}
      </button>
      <button class="app-header__btn" type="button" @click="hideHeader">
        &times;
      </button>
    </div>
  </header>
  <button
    v-else
    class="app-header__restore"
    type="button"
    title="Show header"
    @click="showHeader"
  >
    &#9776;
  </button>
</template>

<style scoped>
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
  background: rgba(20, 20, 20, 0.85);
  color: #fff;
  font-family: sans-serif;
  backdrop-filter: blur(4px);
}

.app-header__title {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__btn {
  min-width: 32px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: transparent;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

.app-header__btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.app-header__restore {
  position: fixed;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(20, 20, 20, 0.85);
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  z-index: 1000;
}

.app-header__restore:hover {
  background: rgba(40, 40, 40, 0.9);
}
</style>
