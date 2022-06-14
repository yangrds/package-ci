<template>
  <div class='project-admin'>
    <div class="project-list">
      <div class="project-header">
        <el-button color="#626aef" @click="projectDialogVisible = true" style="color: #fff;" :dark="true">创建新的项目
        </el-button>
        <div class="search">
          <el-input clearable v-model="id" style="width:300px" placeholder="请输入项目ID" />
          <el-button style="margin-bottom: 3px;margin-left:10px" @click="project_filter">搜索</el-button>
        </div>

      </div>
      <div class="project-child" v-show="item.show" v-for="item in projects" :key="item.project_id">
        <div class="project-child-top">
          <div class="top-header">
            <span>{{ item.name }}</span>
            <div class="operate">
              <el-button size="small" @click="details(item)" type="text">详情</el-button>
              <el-button size="small" @click="vm_Project_remove(item)" type="text">删除</el-button>
            </div>
          </div>
          <div class="info-text">
            <span>{{ item.project_id }}</span>
          </div>
          <div class="info-text">
            <span>{{ dateFormat('YY-mm-dd HH:MM:SS', item.date as number) }} 创建</span>
          </div>

          <div class="info-text">
            <el-tooltip class="box-item" effect="dark" :content="item.describe" placement="top">
              <span>{{ item.describe }}</span>
            </el-tooltip>
          </div>
        </div>
        <div class="project-child-bottom">
          <div class="project-child-user">
            <span>项目经理</span>
            <span>{{ getMember(item.pm) }}</span>
          </div>
          <div class="project-child-user">
            <span>测试成员</span>
            <span>{{ getMember(item.qa) }}</span>
          </div>
          <div class="project-child-user" style="width:100%">
            <span>开发成员</span>
            <span>{{ getdevs(item.devs) }}</span>
          </div>
          <div class="project-child-user">
            <span>DEV节点</span>
            <span style="color: #409eff;">124.70.108.212</span>
          </div>
          <div class="project-child-user" style="margin-bottom: 2px;">
            <span>PROD节点</span>
            <span style="color: #409eff;">124.70.108.212</span>
          </div>
          <div class="project-child-user" style="width:33.3%">
            <span>测试工单</span>
            <span style="color: #409eff;">{{item.testCount}}</span>
          </div>
          <div class="project-child-user" style="width:33.3%">
            <span>UAT工单</span>
            <span style="color: #409eff;">{{item.uatCount}}</span>
          </div>
          <div class="project-child-user" style="width:33.3%">
            <span>上线申请</span>
            <span style="color: #409eff;">{{item.prodCount}}</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <el-dialog v-model="projectDialogVisible" title="创建项目" width="1000px" :before-close="(none: any) => none()">
    <div v-loading="dialogLoading" class="write-dialog">
      <el-col :span="8" class="write-col">
        <div class="write-child">
          <span class="label">服务名</span>
          <el-input v-model="projectInfo.name" :maxlength="20" placeholder="服务名将作为项目文件夹名称" />
        </div>
      </el-col>


      <el-col :span="16" class="write-col">
        <div class="write-child">
          <span class="label">GIT地址</span>
          <el-input v-model="projectInfo.gitUrl" placeholder="GIT地址" />
        </div>
      </el-col>

      <el-col :span="8" class="write-col">
        <div class="write-child">
          <span class="label">指定分支</span>
          <el-input v-model="projectInfo.branch" placeholder="默认master分支" />
        </div>
      </el-col>

      <el-col :span="8" class="write-col">
        <div class="write-child">
          <span class="label">测试成员</span>
          <el-select style="width:100%" v-model="projectInfo.qa" class="m-2" placeholder="测试成员">
            <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
              <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
            </el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span="8" class="write-col">
        <div class="write-child">
          <span class="label">项目负责人</span>
          <el-select style="width:100%" v-model="projectInfo.pm" class="m-2" placeholder="项目负责人">
            <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
              <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
            </el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span="24" class="write-col">
        <div class="write-child">
          <span class="label">开发成员</span>
          <el-select multiple style="width:100%" v-model="projectInfo.devs" class="m-2" placeholder="项目开发成员">
            <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
              <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
            </el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span="24" class="write-col">
        <div class="write-child">
          <span class="label">项目描述</span>
          <el-input v-model="projectInfo.describe" :maxlength="100" placeholder="项目描述" />
        </div>
      </el-col>

      <el-col :span="8" class="write-col">
        <div class="write-child">
          <span class="label">资源目录</span>
          <el-input v-model="projectInfo.buildName" :maxlength="100" placeholder="默认dist" />
        </div>
      </el-col>

      <div class="btns">
        <el-button @click="projectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang='ts'>
import {
  Members_details,
  Members_read,
  Project_branch,
  Project_create,
  Project_read,
  Project_remove,
} from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue-demi";
import { Project, Member } from "@/interface";
import { useRouter } from "vue-router";
import { dateFormat } from '@/utils/tool'
import { useCounterStore } from "@/stores/global";
const counter = useCounterStore()
const router = useRouter();
const projectDialogVisible = ref(false);
const dialogLoading = ref(false);
const projectInfo = reactive<Project>({
  name: "",
  gitUrl: "",
  branch: "master",
  qa: "",
  devs: [],
  pm: "",
  describe: "",
  buildName: 'dist',
});
const members = reactive<Member[]>([]);
const projects = reactive<Project[]>([]);
const id = ref('')

onMounted(() => {
  vm_Members_read();
  vm_Project_read();
  counter.user_details()
});



async function details(row: Project) {
  if (!counter.permission(row, ['pm', 'dev', 'qa'])) {
    ElMessage.warning("权限不足，您不属于该项目成员！");
    return
  }
  router.push(`/main/project/details/${row.project_id}`);
}

function project_filter() {
  projects.forEach((item: any) => {
    item.show = id.value ? item.project_id === id.value : true
  })
}

async function vm_Project_read() {
  const res = await Project_read();
  if (res.code === 200) {
    const list: Project[] = res.data;
    projects.splice(0, projects.length);
    res.data.forEach((item: any) => {
      item.show = true
      projects.push(item);
    })
  }
}

async function vm_Members_read() {
  const res = await Members_read();
  if (res.code === 200) {
    const list: Member[] = res.data;
    members.splice(0, members.length);
    members.push(...list);
  }
}

function vm_Project_remove(row: Project) {
  ElMessageBox.confirm(
    "确定删除该项目数据?，一旦删除将不可恢复！",
    "删除项目",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      const res = await Project_remove({ id: row.project_id });
      if (res.code === 200) {
        vm_Project_read();
        ElMessage.success("删除成功");
      }
    })
    .catch(() => { });
}


// 格式化dev成员
function getdevs(ids: string[]) {
  if (ids.length < 1) return "";
  let names: string[] = [];
  ids.forEach((id) => {
    const member: any = members.find((item) => item.job_id === id);
    names.push(member?.name);
  });
  return names.join("、");
}

// 格式化成员
function getMember(id: string) {
  const member = members.find((item) => item.job_id === id);
  return member?.name;
}

async function save() {


  for (const key in projectInfo) {
    if (!projectInfo[key]) {
      ElMessage.warning('参数不完整');
      return
    }
  }

  dialogLoading.value = true;
  const res = await Project_create(projectInfo);
  vm_Project_read();
  if (res.code === 200) {
    ElMessage.success("创建成功");
  } else {
    ElMessage.warning(res.msg);
  }
  projectDialogVisible.value = false;
  dialogLoading.value = false;
}
</script>

<style scoped lang='scss'>
.project-admin {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #F7F7F9;

  >.project-list {
    width: 1286px;
    padding: 20px;
    padding-bottom: 0;
    padding-right: 0;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;

    >.project-header {
      width: 100%;
      height: 50px;
      padding-right: 20px;
      display: flex;
      justify-content: space-between;
    }

    >.project-child {
      width: 400px;
      height: 230px;
      border: 1px solid #e8e9eb;
      border-radius: 3px;
      margin-right: 20px;
      margin-bottom: 20px;

      >.project-child-top {
        width: 100%;
        height: 50%;
        position: relative;

        >.top-header {
          width: 100%;
          height: 40px;
          padding: 0 15px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;

          >span {
            color: #000;
            font-size: 20px;
            font-weight: 700;
          }
        }

        >.info-text {
          width: 100%;
          height: 24px;
          padding: 0 15px;
          box-sizing: border-box;
          color: #888;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        &::before {
          content: '';
          background-color: #e8e9eb;
          width: 90%;
          display: block;
          height: 1px;
          transform: scaleY(.9) translateX(-50%);
          position: absolute;
          left: 50%;
          bottom: 0;
        }
      }

      >.project-child-bottom {
        width: 100%;
        height: 50%;
        padding: 0 15px;
        padding-top: 5px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        .project-child-user {
          width: 50%;
          height: 26px;
          display: flex;
          align-items: center;
          position: relative;

          >span:nth-child(1) {
            min-width: 50px;
            color: #333;
            font-size: 12px;
          }

          >span:nth-child(2) {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #888;
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
    }
  }

}

.write-dialog {
  width: 100%;
  height: 500px;

  .write-col {
    width: 100%;
    margin-bottom: 20px;
  }

  .write-child {
    width: 100%;
    display: flex;
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