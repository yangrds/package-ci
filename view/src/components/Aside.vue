<template>
  <div class="Aside">
    <div class="menu">
      <div class="menu-child" :style="{ backgroundColor: item.activ ? 'rgba(84, 104, 255, 0.1)' : '#fff' }"
        v-for="item in menus" :key="item.title" @click="link(item)">
        <img :src="item.icon">
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
function link(row: any) {
  menus.forEach((item: any) => item.activ = false)
  row.activ = true
  if (row.path) {
    router.push(row.path);
  }
}
const menus = reactive([
  {
    title: "项目管理",
    icon: "/static/images/project.png",
    path: "/main/",
    activ: false
  },
  {
    title: "节点池",
    icon: "/static/images/host.png",
    path: '/main/host',
    activ: false
  },
  {
    title: "上线申请",
    icon: "/static/images/prod.png",
    path: "/main/prod-task",
    activ: false
  },
  {
    title: "提测申请",
    icon: "/static/images/test.png",
    path: "/main/test-task",
    activ: false
  },
  {
    title: "UAT交付",
    icon: "/static/images/uat.png",
    path: "/main/uat-task",
    activ: false
  },
  {
    title: "项目成员",
    icon: "/static/images/user.png",
    path: "/main/project-members",
    activ: false
  },
]);
</script>

<style scoped lang='scss'>
.Aside {
  width: 80px;
  height: 100%;
  padding-top: 8px;
  padding-bottom: 160px;
  box-sizing: border-box;
  background-color: #fff;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  user-select: none;
  box-shadow: 1px 1px 4px 3px rgba($color: #888, $alpha: 0.2);

  .menu {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .menu-child {
      width: 70px;
      height: 70px;
      box-sizing: border-box;
      border-radius: 5px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 5px;

      >img {
        width: 30px;
        height: 30px;
      }

      &:hover {
        background-color: rgba($color: #5468ff, $alpha: 0.1) !important;
      }

      >span {
        font-size: 12px;
        color: #333;
        margin-top: 5px;
        font-weight: 700;
      }
    }
  }
}
</style>