<script setup>

/*函数*/
import {logout} from "@/net";
import router from "@/router";

function userLogout(){
  logout(()=>router.push('/'))
}
</script>

<template>
  <div>
    <el-button @click="userLogout">退出登录</el-button>
  </div>
</template>

<style scoped>

</style>