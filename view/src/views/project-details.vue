<template>
  <div class="project-permission" v-if="!counter.permission(projectInfo, ['qa', 'pm', 'dev'])">
    <img src="../assets/permission.png">
    <span>权限不足，您不属于该项目成员！</span>
  </div>
  <div class="project-details" v-else>
    <div class="basic-info">
      <div class="write-dialog">
        <div class="write-header">
          <div class="write-title">
            <span>项目配置信息</span>
          </div>
          <div class="write-operate">
            <el-button size="small" :disabled="!counter.permission(projectInfo,['pm'])" @click="configVisible = true">节点配置</el-button>
            <el-button size="small" :disabled="!counter.permission(projectInfo,['pm'])" @click="ProjectUpdateVisible = true">项目信息配置</el-button>
            <el-button size="small" :disabled="!counter.permission(projectInfo,['pm','dev'])" @click="instructionVisible = true">指令集合</el-button>
            <el-button size="small" :disabled="!counter.permission(projectInfo,['pm','dev'])" @click="vm_build_version('')" :loading="build_version_loading">新版本构建</el-button>
            <el-button size="small" :disabled="!counter.permission(projectInfo,['pm','dev'])" @click="branchConfigVisible = true">分支管理</el-button>
            <el-button size="small" @click="commitVisible = true">Commit 记录</el-button>
            <el-button :loading="pull_loading" :disabled="!counter.permission(projectInfo,['pm','dev'])" size="small" @click="vm_origin_pull(null)">PULL</el-button>
          </div>
        </div>

        <el-col :span="24" class="write-col">
          <div style="padding-right: 30px; margin-top: 0px; box-sizing: border-box">
            <el-alert style="margin-top:20px" show-icon :closable="true" :title="projectInfo.notice" type="warning" />
          </div>
        </el-col>
        

         

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">服务名</span>
            <div class="text">
              <span>{{ projectInfo.name }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">历史版本</span>
            <el-select :disabled="!counter.permission(projectInfo,['pm','dev'])" style="width: 100%" v-model="distVersion" class="m-2" placeholder="Select">
              <el-option v-for="(item, index) in builds" :key="index" :label="item.name" :value="item.name">
                <span style="font-size: 16px">
                  {{ item.name }} {{ dateFormat("YY-mm-dd HH:MM:SS", item.atimeMs) }}
                </span>
              </el-option>
            </el-select>
            <el-button :disabled="!counter.permission(projectInfo,['pm','dev'])" :loading="pack_loading" @click="vm_build_version(distVersion)"
              style="margin-left: 10px">构建</el-button>
          </div>
        </el-col>

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">源码更新时间</span>
            <div class="text">
              <span>{{ dateFormat('YY-mm-dd HH:MM:SS', latest.date as any) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="16" class="write-col">
          <div class="write-child">
            <span class="label">GIT地址</span>
            <div class="text">
              <span>{{ projectInfo.gitUrl }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">本地分支</span>
            <el-select :disabled="!counter.permission(projectInfo,['pm','dev'])" style="width: 100%" v-model="localBranch" class="m-2" placeholder="Select">
              <el-option v-for="branch in localBranchs" :key="branch.commit" :label="branch.name" :value="branch.name">
                <span style="font-size: 16px">
                  {{ branch.name }}
                  <span style="font-size: 16px; font-weight: 900; margin-left: 3px">{{
                      branch.current ? "*" : ""
                  }}</span>
                </span>
              </el-option>
            </el-select>
            <el-button :disabled="!counter.permission(projectInfo,['pm','dev'])" :loading="checkout_loading" @click="vm_Project_checkout"
              style="margin-left: 10px">
              切换</el-button>
          </div>
        </el-col>

        <el-col :span="16" class="write-col">
          <div class="write-child">
            <span class="label">源码目录</span>
            <div class="text">
              <span>{{ projectInfo.sourceCode }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">测试</span>
            <div class="text">
              <span>{{ getMember(projectInfo.qa) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="8" class="write-col">
          <div class="write-child">
            <span class="label">项目负责人</span>
            <div class="text">
              <span>{{ getMember(projectInfo.pm) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="16" class="write-col">
          <div class="write-child">
            <span class="label">开发成员</span>
            <div class="text" :title="getdevs(projectInfo.devs)">
              <span>{{ getdevs(projectInfo.devs) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="12" class="write-col">
          <div class="write-child">
            <span class="label">项目描述</span>
            <div class="text" :title="projectInfo.describe">
              <span>{{ projectInfo.describe }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="6" class="write-col">
          <div class="write-child">
            <span class="label">开发节点</span>
            <div class="text">
              <span>{{ projectInfo.dev_ip || "未指定" }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="6" class="write-col">
          <div class="write-child">
            <span class="label">生产节点</span>
            <div class="text">
              <span>{{ projectInfo.prod_ip || "未指定" }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="6" class="write-col" v-for="(env, key) in projectInfo.envs" :key="key">
          <div class="write-child">
            <span class="label">{{ key }}端口</span>
            <div class="text">
              <span>{{ env?.port || "未指定端口" }}</span>
            </div>
          </div>
        </el-col>
      </div>
    </div>

    <ReleaseList ref="ReleaseRef" />

    <!-- 分支提交记录 -->
    <ModalBox :config="{
      width: 880,
      height: 500,
      title: 'Commit 提交记录',
      icon: '/static/images/record.png',
    }" @close="commitVisible = false" v-if="commitVisible">
      <template #main>
        <ProjectVersions :versions="localVersions" :loading="loading" v-if="commitVisible" />
      </template>
    </ModalBox>

    <ModalBox :config="{
      width: 880,
      height: 500,
      title: '节点配置',
      icon: '/static/images/config.png',
    }" @close="configVisible = false" v-if="configVisible">
      <template #main>
        <CustomizeConfig v-if="configVisible" :configVisible="configVisible" :projectInfo="projectInfo"
          @close="configVisible = false" @read="update" />
      </template>
    </ModalBox>

    <ModalBox :config="{
      width: 400,
      height: 500,
      title: '分支管理',
      icon: '/static/images/config.png',
    }" @close="branchConfigVisible = false" v-if="branchConfigVisible">
      <template #main>
        <BranchConfig v-if="branchConfigVisible"  :projectInfo="projectInfo"
          @close="branchConfigVisible = false" @read="update" />
      </template>
    </ModalBox>

    <ModalBox :config="{
      width: 600,
      height: 500,
      title: '自定义指令集合',
      icon: '/static/images/code.png',
    }" v-if="instructionVisible" @close="instructionVisible = false">
      <template #main>
        <Instruction :project_id="projectInfo.project_id" />
      </template>
    </ModalBox>


    <ModalBox :config="{
      width: 800,
      height: 400,
      title: '项目信息配置',
      icon: '/static/images/config.png',
    }" v-if="ProjectUpdateVisible" @close="ProjectUpdateVisible = false">
      <template #main>
        <ProjectUpdate :projectInfo="projectInfo" @read="update" @close="ProjectUpdateVisible = false" />
      </template>
    </ModalBox>




  </div>
</template>

<script setup lang="ts">
import {
  Members_read,
  Project_details,
  local_checkout,
  cluster_list,
  local_version,
  local_branch,
  build_version,
  read_version,
  dev_release,
  test_release,
  uat_release,
  origin_pull,
} from "@/http/api";
import { Project, Member, Version, Shell, Host } from "@/interface";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, nextTick, Ref, provide } from "vue-demi";
import { useRoute, useRouter } from "vue-router";
import { dateFormat, uuid } from "@/utils/tool";
import ProjectVersions from "@/components/versions.vue";
import ModalBox from "@/components/ModalBox.vue";
import CustomizeConfig from "@/components/customize-config.vue";
import BranchConfig from "@/components/branch-config.vue";
import io, { Socket } from "socket.io-client";
import ReleaseList from "@/components/release_list.vue";
import Instruction from '@/components/instruction.vue'
import ProjectUpdate from "@/components/project-update.vue";
import { readonly } from "vue";
import { useCounterStore } from "@/stores/global";
const counter = useCounterStore()
const router = useRouter();
const route = useRoute();
interface Branch {
  commit: string;
  current: boolean;
  label: string;
  name: string;
}

// 项目详情loading
const loading = ref(false);

// 节点配置
const configVisible = ref(false);

// 项目信息配置
const ProjectUpdateVisible = ref(false);

// 指令集合
const instructionVisible = ref(false);

// 当前分支最新版本
const latest = reactive<Version>({});
// 团队成员列表（总）
const members = reactive<Member[]>([]);
// 分支管理控制
const branchConfigVisible = ref<boolean>(false);
// 本地分支列表
const localBranchs = reactive<Branch[]>([]);
// 当前本地分支
const localBranch = ref<string>("");
// 构建版本列表
const builds = reactive<any[]>([]);

const build_version_loading = ref(false);

const commitVisible = ref(false);
const pull_loading = ref(false);
const checkout_loading = ref(false);
const pack_loading = ref(false);

const distVersion = ref("");

const ReleaseRef: any = ref(null);

// 版本列表
const localVersions = reactive<Version[]>([]);
// 项目详情
const projectInfo = reactive<Project>({
  branch: "master",
  dev_ip: "",
  envs: {},
  date: 0,
  describe: "",
  devs: [],
  gitUrl: "",
  localPath: "",
  name: "",
  pm: "",
  qa: "",
  notice: ""
});


provide("projectInfo", readonly(projectInfo));
provide("origin_pull", vm_origin_pull);

onMounted(() => {
  vm_Members_read();
  update();
});


// 版本构建
async function vm_build_version(pack: string = "") {
  if (!counter.permission(projectInfo,['pm','dev'])) {
    ElMessage.warning("当前用户角色权限不足");
    return
  }
  if (pack) {
    pack_loading.value = true;
  } else {
    build_version_loading.value = true;
  }
  const res = await build_version({ id: route.params.id, pack });
  build_version_loading.value = false;
  pack_loading.value = false;
  if (res.code === 200) {
    update();
    ElMessage.success("版本构建成功");
    ReleaseRef.value.vm_release_list();
  } else {
    ElMessage.error(res.msg);
  }
}

// 更新代码
async function vm_origin_pull(
  callback: null | ((res: { status: boolean; msg: string }) => void)
) {

  if (!counter.permission(projectInfo,['pm','dev'])) {
    ElMessage.warning("当前用户角色权限不足");
    return
  }

  if (!callback) {
    pull_loading.value = true;
  }
  const res = await origin_pull({ id: route.params.id });
  pull_loading.value = false;
  if (callback) {
    callback({ status: res.code === 200, msg: res.msg });
    return;
  }
  ElMessage({
    showClose: true,
    message: res.code === 200 ? "更新成功" : "更新失败",
    type: res.code === 200 ? "success" : "warning",
  });
}

// 静态资源版本列表
async function vm_read_version() {
  const res = await read_version({ id: route.params.id });
  if (res.code === 200) {
    builds.splice(0, builds.length);
    builds.push(...res.data);
    if (!distVersion.value) {
      distVersion.value = builds[0]?.name || "";
    }
  } else {
    ElMessage.error(res.msg);
  }
}

function update() {
  vm_read_version();
  vm_local_version();
  vm_local_branch();
  vm_Project_details();
}





// 切换分支
async function vm_Project_checkout() {
  if (!counter.permission(projectInfo,['pm','dev'])) {
    ElMessage.warning("当前用户角色权限不足");
    return
  }
  loading.value = true;
  checkout_loading.value = true;
  const res = await local_checkout({
    branch: localBranch.value,
    id: route.params.id,
  });
  loading.value = false;
  checkout_loading.value = false;
  if (res.code === 200) {
    update();
    ElMessage.success("分支切换成功");
  } else {
    ElMessage.error(res.msg);
  }
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

// 获取团队成员
async function vm_Members_read() {
  const res = await Members_read();
  if (res.code === 200) {
    const list: Member[] = res.data;
    members.splice(0, members.length);
    members.push(...list);
  }
}

// 本地分支获取
async function vm_local_branch() {
  const res = await local_branch({ id: route.params.id });
  if (res.code === 200) {
    localBranch.value = res.data.current;
    localBranchs.splice(0, localBranchs.length);
    for (const key in res.data.branches) {
      localBranchs.push(res.data.branches[key]);
    }
  }
}

// 项目版本列表
async function vm_local_version() {
  const res = await local_version({ id: route.params.id });
  if (res.code === 200) {
    localVersions.splice(0, localVersions.length);
    localVersions.push(...res.data.all);
    for (const key in res.data.latest) {
      latest[key] = res.data.latest[key];
    }
  }
}

// 获取项目详情
async function vm_Project_details() {
  loading.value = true;
  const res = await Project_details({ id: route.params.id });
  loading.value = false;
  if (res.code === 200) {
    for (const key in res.data) {
      projectInfo[key] = res.data[key];
    }
  }
}
</script>

<style lang="scss" scoped>


.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba($color: #eee, $alpha: 0.9);
}

.basic-info {
  width: 100%;
  display: flex;
  margin-top: 30px;
}
</style>

<style lang="scss" scoped>
.write-dialog {
  width: 100%;
  min-width: 800px;
  border: 1px solid rgba($color: #888, $alpha: 0.2);
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 0;
  padding-bottom: 0;
  position: relative;

  .write-col {
    width: 100%;
    margin-bottom: 20px;
  }

  .write-header {
    display: flex;
    align-items: center;
    height: 34px;
    position: absolute;
    left: -1px;
    top: -36px;
    background-color: #fff;

    .write-title {
      width: auto;
      height: 100%;
      display: flex;
      padding: 0 20px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;

      >span {
        color: #888;
        font-weight: 900;
        font-size: 14px;
      }
    }

    >.write-operate {
      width: auto;
      height: 100%;
      margin-left: 10px;
      display: flex;
      align-items: center;
      // background-color: #f5f5f5;
    }
  }

  .write-child {
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 100px;
    padding-right: 30px;
    box-sizing: border-box;
    position: relative;

    >.label {
      width: 100px;
      height: 32px;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 14px;
      font-weight: 900;
    }

    >.textarea {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: #f5f5f5;
      box-sizing: border-box;
      padding: 10px;
      padding-top: 8px;

      >textarea {
        width: 100%;
        height: 100%;
        border: none;
        box-sizing: border-box;
        outline: none;
        background-color: transparent;
        font-size: 14px;
        resize: none;
        line-height: 22px;
        color: #000;
      }
    }

    >.text {
      width: 100%;
      height: 32px;
      display: flex;

      >span {
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #f5f5f5;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.project-details {
  width: 100%;
  height: 100%;
  padding: 20px 20px 0;
  position: relative;
  box-sizing: border-box;
  user-select: none;
  overflow-y: auto;
}
</style>
