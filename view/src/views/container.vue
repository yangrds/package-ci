<template>
  <div class="container">
    <div class="container-aside">
      <Aside />
    </div>

    <div class="container-content">
      <Header />
      <Content />
    </div>

  </div>
</template>

<script setup lang='ts'>
import Content from "@/components/Content.vue";
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
const props = defineProps({});
</script>

<style scoped lang='scss'>
.container {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  padding-left: 80px;
  box-sizing: border-box;
  background-color: #fff;
  > .container-aside {
    width: 80px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  > .container-content {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
  }
}
</style>