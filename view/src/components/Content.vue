<template>
 <div class='content' v-load="counter.loading">
      <router-view></router-view>
 </div>
</template>

<script setup lang='ts'>
import { useCounterStore } from '@/stores/global'
const counter = useCounterStore()
</script>

<style scoped lang='scss'>
.content{
    width: 100%;
    height: 100%;
    padding: 0px;
    box-sizing: border-box;
    // border: 10px solid;
}
</style>