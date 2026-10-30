<template>
  <div v-if="headerVisible" class="layout-header">
    <div class="header-midden">
      <div class="cn">{{ dict[lang].title }}</div>
      <div class="en">{{ dict[lang].subtitle }}</div>
    </div>
    <div class="header-left">
      <i class="fa-regular fa-envelope"></i>
      <div
        class="message"
        content="【电力安全】安全用电人人有责，规范操作保驾护航。"
      ></div>
    </div>
    <div class="header-right">
      <span>{{ time }}</span>
      <span>{{ date }}</span>
      <span>{{ weekday }}</span>
      <span>13°c</span>
      <span class="header-btn" @click="toggleLang">{{ dict[lang].langBtn }}</span>
      <span class="header-btn" @click="headerVisible = false">{{ dict[lang].hideBtn }}</span>
    </div>
  </div>
  <div
    v-else
    class="header-restore-btn"
    :title="dict[lang].showBtn"
    @click="headerVisible = true"
  >
    <i class="fa-regular fa-eye"></i>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const time = ref('')
const date = ref('')
const weekday = ref('')

type Lang = 'vi' | 'en'

const lang = ref<Lang>('vi')
const headerVisible = ref(true)

const dict: Record<Lang, {
  title: string
  subtitle: string
  langBtn: string
  hideBtn: string
  showBtn: string
}> = {
  vi: {
    title: '供电站数字孪生服务平台',
    subtitle: 'Nền tảng dịch vụ song sinh số trạm điện',
    langBtn: 'EN',
    hideBtn: 'Ẩn',
    showBtn: 'Hiện header',
  },
  en: {
    title: '供电站数字孪生服务平台',
    subtitle: 'Power plant digital twin service platform',
    langBtn: 'VI',
    hideBtn: 'Hide',
    showBtn: 'Show header',
  },
}

const toggleLang = () => {
  lang.value = lang.value === 'vi' ? 'en' : 'vi'
}

const updateTime = () => {
  const now = new Date()

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  time.value = `${hours}:${minutes}:${seconds}`

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  date.value = `${year}-${month}-${day}`

  const weekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  weekday.value = weekNames[now.getDay()]
}

let timer: number | null = null

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer !== null) {
    window.clearInterval(timer)
  }
})
</script>
<style lang="scss" scoped>
@mixin font-color() {
  background: linear-gradient(0deg, #b9cfff 0%, #fff 99%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
@keyframes text-roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
@keyframes light-go {
  from {
    left: 500px;
  }
  to {
    left: 1100px;
    opacity: 0;
  }
}
.layout-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-image: url(@/assets/title_bg.png);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  &::after {
    position: absolute;
    bottom: -55px;
    left: 500px;
    width: 100%;
    width: 500px;
    height: 100px;
    content: '';
    background-image: url(@/assets/light_bg.png);
    background-repeat: no-repeat;
    background-size: contain;
    animation: light-go 3s ease-in-out infinite forwards;
  }
  .header-midden {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow-x: hidden;
    font-family: DouYu;
    color: #fff;
    .cn {
      font-size: 30px;
      @include font-color;
    }
    .en {
      position: relative;
      font-size: 10px;
      @include font-color;
    }
  }
  .header-left {
    position: absolute;
    top: 20px;
    left: 30px;
    display: flex;
    grid-gap: 6px;
    align-items: center;
    font-size: 18px;
    color: #fff;
    .message {
      display: flex;
      width: 400px;
      overflow: hidden;
      font-size: 16px;
      &::after {
        width: auto;
        text-wrap: nowrap;
        content: attr(content);
        animation: text-roll 20s linear infinite;
        @include font-color;
      }
    }
  }
  .header-right {
    position: absolute;
    top: 20px;
    right: 30px;
    display: flex;
    grid-gap: 20px;
    font-size: 16px;
    color: #fff;
    span {
      position: relative;
      display: flex;
      align-items: center;
      text-shadow: 0 3px 2px #84a8f663;
      @include font-color;
      &:not(:last-child)::after {
        position: absolute;
        right: -10px;
        width: 2px;
        height: 10px;
        content: '';
        background-color: #fff;
        opacity: 0.2;
      }
    }
    .header-btn {
      cursor: pointer;
      user-select: none;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
.header-restore-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  background-color: rgba(0, 0, 0, 50%);
  border: 1px solid #84a8f663;
  border-radius: 50%;
  &:hover {
    opacity: 0.8;
  }
}
</style>
