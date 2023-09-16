<script setup>

</script>

<template>
  <div style="width: 100vw;height: 100vh;overflow: hidden;display: flex">
    <div style="flex: 1;background-color: black">
      <el-image style="width: 100%;height: 100%" fit="cover"
          src="https://www.toopic.cn/public/uploads/small/1642749399720164274939972.jpg"/>
    </div>
    <div class="welcome-title">
      <div>欢迎进入系统</div>
    </div>
    <div class="right-card">
      <router-view v-slot="{ Component}">
        <transition name="el-fade-in-linear"  mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </div>
  </div>

</template>

<style scoped>
.right-card{
  width: 400px;
  z-index: 1;
  background-color: var(--el-bg-color);
}
.welcome-title{
  position: absolute;
  bottom: 30px;
  left: 30px;
  color: white;
  text-shadow: 0 0 10px black;
}
</style>