<template>
  <LayoutPanel title="视频监控">
    <div class="video-images">
      <video
        v-show="!loadError"
        :src="videoSrc"
        controls
        muted
        playsinline
        loop
        preload="auto"
        @error="onVideoError"
      />
      <div v-if="loadError" class="video-placeholder">
        <i class="fa-solid fa-video-slash"></i>
        <span>视频加载失败或暂无资源</span>
      </div>
    </div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LayoutPanel from './LayoutPanel.vue'

const videoSrc = ref('/images/camera.mp4')
const loadError = ref(false)

function onVideoError() {
  loadError.value = true
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.video-images {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  font-size: 40px;
  color: #fff;
  background-color: rgba(93, 101, 122, 20%);
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .video-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: rgba(255, 255, 255, 60%);
  }
}
</style>
