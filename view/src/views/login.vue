<template>
  <div class='login-wrap'>
    <div class="login">
      <div class="login-top">
        <span>PACKAGE-CI</span>
        <span>专注于前端运维工作，全新的Workflow。</span>
      </div>
      <div class="login-info">
        <el-input v-model="user.account" placeholder="账号" />
        <el-input type="password" show-password v-model="user.password" placeholder="密码" />
        <el-checkbox v-model="user.valid" :true-label="10" :false-label="1" style="margin-top:15px" label="10天内免登录"
          size="large" />
        <el-button @click="submit" style="margin-top:15px" type="primary">登陆</el-button>
      </div>
    </div>
  </div>
</template>



<script setup lang='ts'>
import { Members_login } from '@/http/api';
import { ElMessage } from 'element-plus';
import { onBeforeUnmount, reactive } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const user = reactive({
  account: '',
  password: '',
  valid: 1
})


onBeforeUnmount(() => {
  window.removeEventListener('keyup', KeyupEnter)
})

window.addEventListener('keyup', KeyupEnter)


function KeyupEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    submit()
  }
}

async function submit() {
  if (!user.account || !user.password) {
    ElMessage.error('参数不完整');
    return
  }
  const res: { code: number; data: string } = await Members_login(user)
  if (res.code === 200) {
    window.localStorage.setItem('token', JSON.stringify(res.data))
    window.location.href = '/'
  }
}

</script>



<style lang="scss" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background-color: #efefef;
  background-image: linear-gradient(90deg, rgba(60, 10, 30, 0.04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, 0.04) 3%, transparent 0);
  background-size: 20px 20px;
  background-position: 50%;
  background-repeat: repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  >.login-img {
    width: 500px;
    height: 500px;
    margin-right: 200px;
    box-sizing: border-box;

    >img {
      width: 100%;
      height: 100%;
    }
  }

  >.login {
    width: 400px;
    height: 400px;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: 1px 1px 13px 1px rgba($color: #888, $alpha: .2);
    background-color: #fff;

    >.login-top {
      width: 100%;
      height: 100px;
      background-color: #445E85;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      >span:nth-child(1) {
        font-size: 28px;
        color: #f5f5f5;
        font-weight: 700;
      }

      >span:nth-child(2) {
        font-size: 15px;
        color: #29C8FF;
        font-weight: 700;
        margin-top: 10px;
      }
    }

    >.login-info {
      width: 100%;
      margin-top: 30px;
      padding: 0 60px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      &:deep(.el-input) {
        margin-top: 20px;
      }
    }
  }
}
</style>