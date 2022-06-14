<template>
 <div class="project-permission" v-if="!counter.permission(projectInfo,['pm','dev'])">
        <img src="../assets/permission.png">
        <span>当前用户角色权限不足</span>
    </div>
  <div class="config-dialog" v-else>
    <el-col :span="24" class="config-col">
      <div class="config-child">
        <span class="label">远程分支</span>
        <el-select style="width:100%" v-model="originBranch" class="m-2" placeholder="请选择需要检出的分支">
          <el-option :disabled="isDisabled(branch)" v-for="branch in originBranchs" :key="branch" :label="branch"
            :value="branch">
            <span style="font-size: 16px;">{{ branch }}</span>
          </el-option>
        </el-select>
        <el-button :loading="checkout_loading" @click="vm_checkout_origin" type="primary" :disabled="!originBranch" style="margin-left:10px">检出
        </el-button>
      </div>
    </el-col>

    <el-col :span="24" class="config-col">
      <div class="config-child">
        <span class="label">本地分支</span>
        <el-select style="width:100%" v-model="localBranch" class="m-2" placeholder="请选择需要删除的分支">
          <el-option v-for="branch in localBranchs" :key="branch.commit" :label="branch.name" :value="branch.name"
            :disabled="branch.current">
            <span style="font-size: 16px;">
              {{ branch.name }}
              <span style="font-size:16px;font-weight: 900;margin-top: 5px;margin-left: 3px;">{{ branch.current ? '*' :
                  ''
              }}</span>
            </span>
          </el-option>
        </el-select>
        <el-button :loading="delete_loading" @click="vm_delete_branch" type="danger" :disabled="!localBranch" style="margin-left:10px">删除
        </el-button>
      </div>
    </el-col>

    <div class="btns">
      <el-button @click.stop="emit('close')">关闭</el-button>
    </div>
  </div>
</template>



<script setup lang='ts'>
import { inject, onMounted, reactive, ref } from "vue";
import { Project, ENVS, Host } from "@/interface";
import { origin_branch, local_branch, checkout_origin, delete_branch } from "@/http/api";
import { renderSize } from "@/utils/tool";
import { ElMessage } from "element-plus";
import { useCounterStore } from '@/stores/global';
const counter = useCounterStore()
interface Branch { commit: string; current: boolean; label: string; name: string }
/* 事件订阅 */
const emit = defineEmits(["close", "read"]);

interface Props {
  projectInfo: Project;
}
const props = withDefaults(defineProps<Props>(), {
  projectInfo() {
    return {
      envs: {},
      dev_ip: '',
      branch: "master",
      cors: true,
      date: 0,
      describe: "",
      devs: [],
      gitUrl: "",
      localPath: "",
      name: "",
      pm: "",
      pwd: "",
      qa: "",
      user: "",
      _id: "",
    };
  },
});


const originBranchs = reactive<string[]>([])
const originBranch = ref<string>('')


const checkout_loading = ref(false)
const delete_loading = ref(false)

const localBranchs = reactive<Branch[]>([])
const localBranch = ref<string>('')

function isDisabled(name: string): boolean {
  name = name.replace('origin/', '')
  return !!localBranchs.find((item: Branch) => item.name === name)
}





async function vm_delete_branch() {
  delete_loading.value = true
  const res = await delete_branch({ id: props.projectInfo.project_id, branch: localBranch.value })
  delete_loading.value = false
  vm_local_branch()
  emit('read')
  if (res.code === 200) {
    localBranch.value = ''
    ElMessage.success(`本地【${res.data.branch}】分支删除成功，如有需要可以重新从远程分支检出至本地`);
  } else {
    ElMessage.warning(res.msg);
  }
}

async function vm_checkout_origin() {
  checkout_loading.value = true
  const res = await checkout_origin({ id: props.projectInfo.project_id, branch: originBranch.value })
  checkout_loading.value = false
  vm_local_branch()
  emit('read')
  if (res.code === 200) {
    originBranch.value = ''
    ElMessage.success(res.data);
  } else {
    ElMessage.warning(res.msg);
  }
}


async function vm_local_branch() {
  const res = await local_branch({ id: props.projectInfo.project_id })
  if (res.code === 200) {
    localBranchs.splice(0, originBranchs.length)
    for (const key in res.data.branches) {
      localBranchs.push(res.data.branches[key])
    }
  }
}

async function vm_origin_branch() {
  console.log(props.projectInfo.project_id ,'props.projectInfo.project_id ');
  
  const res = await origin_branch({ id: props.projectInfo.project_id })
  if (res.code === 200) {
    originBranchs.splice(0, originBranchs.length)
    originBranchs.push(...res.data.all)
  }
}


// 环境

onMounted(async () => {
  await vm_local_branch()
  vm_origin_branch()
});
</script>



<style lang="scss" scoped>
.config-dialog {
  width: 100%;
  height: 100%;
  padding: 20px 20px 0;
  box-sizing: border-box;
  background-color: rgba($color: #f5f5f5, $alpha: 0.9);

  .config-col {
    width: 100%;
    margin-bottom: 20px;
  }

  .config-child {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 80px;
    padding-right: 30px;
    box-sizing: border-box;
    position: relative;

    >.label {
      width: 80px;
      height: 32px;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 14px;
    }

    >.text {
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;

      >span {
        width: 100%;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 5px;
        background-color: #f5f5f5;
        color: #666;
      }
    }
  }

  >.btns {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  }
}
</style>