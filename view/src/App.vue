<template>
  <router-view></router-view>
</template>

<script setup lang='ts'>
import Axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from './stores/global';
const counter = useCounterStore()
const router = useRouter();

const token = localStorage.getItem("token");
if (!token) {
  router.push('login')
}

onMounted(()=>{
  counter.user_details()
})

// 设置统一拦截（REQ）
Axios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);
// 设置统一拦截（RES）
Axios.interceptors.response.use(
  (response: any) => {
    if (response.data.code === 304) {
      router.push("/login");
    }
    if (response.data.code != 200) {
      ElMessage.error(response.data.msg);
    }
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
</script>

<style lang="scss">
.el-input__inner {
  min-height: 32px;
  // display: flex;
}

@import "./assets/css/public.scss";
@import "./assets/css/ress.scss";
</style>