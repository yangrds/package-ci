<template>
  <div class="cluster_list">
    <el-table :data="releases" style="width: 100%;">
      <el-table-column prop="uid" label="版本" min-width="110">
        <template #default="scope">
          <span style="font-size:14px">{{ scope.row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="pack_id" label="包版本" min-width="110">
        <template #default="scope">
          <span style="font-size:14px">{{ scope.row.pack_id }}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="创建时间" min-width="180">
        <template #default="scope">
          <span style="font-size:14px">{{ dateFormat('YY-mm-dd HH:MM:SS', scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commit_id" label="commit_id" min-width="100">
        <template #default="scope">
          <span style="font-size:14px">{{ scope.row.commit_id }}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="测试工单" width="110">
        <template #default="scope">
          <span class="view-text" v-if="goTask(scope.row, 'TEST')"
            :style="{ color: getTaskStatus(scope.row, 'TEST').color }"
            @click="router.push(`/main/test/${goTask(scope.row, 'TEST')}`)">{{ goTask(scope.row, 'TEST') }}</span>
          <span v-else style="display:block;font-size: 14px;">暂无</span>
          <el-tag class="mx-1" effect="dark" :type="getTaskStatus(scope.row, 'TEST').type">{{ getTaskStatus(scope.row,
              'TEST').text
          }}</el-tag>
        </template>
      </el-table-column>



      <el-table-column prop="name" label="UAT工单" width="110">
        <template #default="scope">
          <span class="view-text" v-if="goTask(scope.row, 'UAT')"
            :style="{ color: getTaskStatus(scope.row, 'UAT').color }"
            @click="router.push(`/main/uat/${goTask(scope.row, 'UAT')}`)">{{ goTask(scope.row, 'UAT') }}</span>

          <span v-else style="display:block;font-size: 14px;">暂无</span>

          <el-tag class="mx-1" effect="dark" :type="getTaskStatus(scope.row, 'UAT').type">{{ getTaskStatus(scope.row,
              'UAT').text
          }}</el-tag>
        </template>
      </el-table-column>




      <el-table-column prop="name" label="上线工单" width="200">
        <template #default="scope">
          <span class="view-text" :style="{ color: getTaskStatus(scope.row, 'PROD').color }"
            v-if="goTask(scope.row, 'PROD')" @click="router.push(`/main/prod/${goTask(scope.row, 'PROD')}`)">{{
                goTask(scope.row, 'PROD')
            }}</span>
          <span v-else style="display:block;font-size: 14px;">暂无</span>
          <div style="display:flex" v-if="prodTaskStatus(scope.row).Ing">
            <el-tag class="mx-1" style="margin-right:5px;" effect="dark" :type="prodTaskStatus(scope.row).QAType">
              {{ prodTaskStatus(scope.row).QASign
              }}</el-tag>
            <el-tag style="margin-left:5px;" class="mx-1" effect="dark" :type="prodTaskStatus(scope.row).PMType">{{
                prodTaskStatus(scope.row).PMSign
            }}</el-tag>
          </div>

          <div style="display:flex" v-else>
            <el-tag style="margin-right:5px;" class="mx-1" effect="dark" type="info">未开始</el-tag>
          </div>



        </template>
      </el-table-column>


      <el-table-column prop="name" label="环境" min-width="340">
        <template #default="scope">
          <div class="cluster-env">
            <div class="evn-link" style="width:90px; height: 40px; margin-right: 6px;">
              <span :style="{ backgroundColor: '#909399', color: '#fff' }">BUILD</span>
            </div>

            <div class="evn-link" style="width:90px;height: 40px;margin-right: 6px;">
              <span
                :style="{ backgroundColor: scope.row.DEV.status ? '#5468ff' : '#eee', color: scope.row.DEV.status ? '#fff' : '#000' }">DEV</span>
            </div>

            <div class="evn-link" style="width:90px;height: 40px;margin-right: 6px;">
              <span :style="{ backgroundColor: scope.row.TEST.status ? '#E0E729' : '#eee' }">TEST</span>
            </div>

            <div class="evn-link" style="width:90px;height: 40px;margin-right: 6px;">
              <span :style="{ backgroundColor: scope.row.UAT.status ? '#E0E729' : '#eee' }">UAT</span>
            </div>
            <div class="evn-link" style="width:90px;height: 40px;margin-right: 6px;">
              <span :style="{ backgroundColor: scope.row.PROD.status ? '#E0E729' : '#eee' }">PROD</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" fixed="right" width="100">
        <template #default="scope">
          <el-button :disabled="!counter.permission(projectInfo, ['pm', 'dev'])" style="font-size:14px" size="small"
            @click="releaseClick(scope.row)">部署</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="releaseEvnVisible" :title="`【${releaseData.uid}】版本持续部署`" width="1000px"
    :before-close="(none: any) => none()">
    <div class="evn-dialog" v-load="releaseLoading">
      <ModalView title="资源环境信息">
        <template #modal-body>
          <div class="modal-body">
            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">版本</span>
                <div class="text">
                  <span>{{ releaseData.uid }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">构建时间</span>
                <div class="text">
                  <span>{{ dateFormat('YY-mm-dd HH:MM:SS', releaseData.date) }}</span>
                </div>
              </div>
            </el-col>

            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">commit_id</span>
                <div class="text">
                  <span>{{ releaseData.commit_id }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">SIZE</span>
                <div class="text">
                  <span>{{ renderSize(releaseData.size) }}</span>
                </div>
              </div>
            </el-col>

            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">测试状态</span>
                <div class="text">
                  <span :style="{ color: getTaskStatus(releaseData, 'TEST').color, fontWeight: 700 }">{{
                      getTaskStatus(releaseData, 'TEST').text
                  }}</span>
                </div>
              </div>
            </el-col>

            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">测试工单</span>
                <div class="text">
                  <span class="view-text" style="color:#5468ff" v-if="goTask(releaseData, 'TEST')"
                    @click="router.push(`/main/test/${goTask(releaseData, 'TEST')}`)">{{ goTask(releaseData, 'TEST')
                    }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </el-col>

            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">UAT状态</span>
                <div class="text">
                  <span :style="{ color: getTaskStatus(releaseData, 'UAT').color, fontWeight: 700 }">{{
                      getTaskStatus(releaseData, 'UAT').text
                  }}</span>
                </div>
              </div>
            </el-col>

            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">UAT工单</span>
                <div class="text">
                  <span class="view-text" style="color:#5468ff" v-if="goTask(releaseData, 'UAT')"
                    @click="router.push(`/main/uat/${goTask(releaseData, 'UAT')}`)">{{ goTask(releaseData, 'UAT')
                    }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </el-col>


            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">PROD状态</span>
                <div class="text" style="background-color:#f5f5f5;padding-left:10px;box-sizing:border-box">
                  <div v-if="prodTaskStatus(releaseData).Ing" style="display:flex;align-items: center;">
                    <span
                      :style="{ color: prodTaskStatus(releaseData).QAColor, fontWeight: 700, fontSize: '14px', marginRight: '5px' }">{{
                          prodTaskStatus(releaseData).QASign
                      }}</span>

                    <span
                      :style="{ color: prodTaskStatus(releaseData).PMColor, fontWeight: 700, fontSize: '14px', marginLeft: '5px' }">{{
                          prodTaskStatus(releaseData).PMSign
                      }}</span>
                  </div>




                  <span v-else :style="{ fontWeight: 700 }">未开始</span>
                </div>
              </div>
            </el-col>


            <el-col :span="8" class="modal-col">
              <div class="modal-child">
                <span class="label">PROD工单</span>
                <div class="text">
                  <span class="view-text" style="color:#5468ff" v-if="goTask(releaseData, 'PROD')"
                    @click="router.push(`/main/prod/${goTask(releaseData, 'PROD')}`)">{{ goTask(releaseData, 'PROD')
                    }}</span>
                  <span v-else>--</span>
                </div>
              </div>
            </el-col>

          </div>
        </template>
      </ModalView>
      <div class="evn-select">
        <div class="evn-link evn-link-dev" style="margin-right:20px">
          <span :style="{ backgroundColor: '#909399', color: '#fff' }">BUILD构建</span>
        </div>
        <div class="evn-link evn-link-dev" style="margin-right:20px">
          <span
            :style="{ backgroundColor: releaseData.DEV.status ? '#5468ff' : '#eee', color: releaseData.DEV.status ? '#fff' : '#000' }">DEV环境</span>
        </div>
        <div class="evn-link evn-link-test" style="margin-right:20px">
          <span :style="{ backgroundColor: releaseData.TEST.status ? '#E0E729' : '#eee' }">TEST环境</span>
        </div>
        <div class="evn-link evn-link-uat" style="margin-right:20px">
          <span :style="{ backgroundColor: releaseData.UAT.status ? '#E0E729' : '#eee' }">UAT环境</span>
        </div>
        <div class="evn-link evn-link-prod">
          <span :style="{ backgroundColor: releaseData.PROD.status ? '#E0E729' : '#eee' }">PROD环境</span>
        </div>
      </div>
      <div class="evn-btns">
        <el-popconfirm title="确定操作？" confirmButtonText="是" cancelButtonText="否" @confirm="confirm('DEV')">
          <template #reference>
            <el-button size="small">DEV环境部署</el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm title="确定操作？" confirmButtonText="是" cancelButtonText="否" @confirm="confirm('TEST')">
          <template #reference>
            <el-button size="small"
              :disabled="(releaseData.TEST.status || getTaskStatus(releaseData, 'TEST').status != null)">提交TEST申请
            </el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm title="确定操作？" confirmButtonText="是" cancelButtonText="否" @confirm="confirm('UAT')">
          <template #reference>
            <el-button size="small"
              :disabled="(releaseData.UAT.status || getTaskStatus(releaseData, 'TEST').status != 1 || getTaskStatus(releaseData, 'UAT').status != null)">
              提交UAT申请</el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm title="确定操作？" confirmButtonText="是" cancelButtonText="否" @confirm="confirm('PROD')">
          <template #reference>
            <el-button size="small"
              :disabled="(releaseData.PROD.status || getTaskStatus(releaseData, 'TEST').status != 1 || getTaskStatus(releaseData, 'PROD').status != null)">
              提交生产上线
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="dialog-bottom">
        <el-button @click="releaseEvnVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>



<script setup lang='ts'>
import { dev_release, prod_create, prod_list, release_list, test_create, test_list, test_release, uat_create, uat_list, uat_release } from "@/http/api";
import { onMounted, reactive, ref, nextTick, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Project, Release } from '@/interface'
import { dateFormat, renderSize } from '@/utils/tool'
import { ElMessage } from "element-plus";
import { useCounterStore } from "@/stores/global";
const counter = useCounterStore()
const router = useRouter();
const route = useRoute();
const releases = reactive<any>([])
const releaseEvnVisible = ref(false)
const evns = reactive(['DEV', 'TEST', 'UAT', 'PROD'])
const releaseEvn = ref('')
const TestTask = reactive<any>([])
const UatTask = reactive<any>([])
const ProdTask = reactive<any>([])

const releaseLoading = ref(false)
const releaseData = reactive<Release>(
  {
    DEV: { status: null, date: null, user: null },
    PROD: { status: null, date: null, user: null },
    TEST: { status: null, date: null, user: null },
    UAT: { status: null, date: null, user: null },
    commit_id: "",
    date: 0,
    projectId: "",
    size: 0,
    uid: "",
    pack_id: '',
    _id: "",
  }
)


// 父组件的项目详情
const projectInfo: Project = inject('projectInfo') as Project


onMounted(() => {
  vm_release_list()
  vm_test_list()
  vm_uat_list()
  vm_prod_list()
})

defineExpose({
  vm_release_list,
  releaseLoading
})



function confirm(evn: string) {
  if (!counter.permission(projectInfo, ['dev'])) {
    ElMessage.warning('用户角色权限不足')
    return
  }
  releaseLoading.value = true
  switch (evn) {
    case 'DEV':
      vm_dev_release()
      break;
    case 'TEST':
      vm_test_create()
      break;
    case 'UAT':
      vm_uat_create()
      break;
    case 'PROD':
      vm_prod_create()
      break;
  }
}

function releaseClick(row: any) {
  if (!counter.permission(projectInfo, ['pm', 'dev'])) {
    ElMessage.warning('用户角色权限不足')
    return
  }
  for (const key in row) {
    releaseData[key] = row[key]
  }
  if (projectInfo.dev_ip && projectInfo.prod_ip) {
    releaseEvnVisible.value = true
  } else {
    ElMessage({
      showClose: true,
      message: '项目节点信息缺失，请先完成初始化配置。',
      type: 'warning',
    })
  }

}

async function vm_release_list() {
  releaseLoading.value = true
  const res = await release_list({ id: route.params.id })
  if (res.code === 200) {
    let Time = setTimeout(() => {
      clearTimeout(Time);
      releaseLoading.value = false
    }, 500);
    releases.splice(0, releases.length)
    releases.push(...res.data)
    if (releaseData.uid) {
      const data = releases.find((item: any) => item.uid === releaseData.uid) || {}
      for (const key in data) {
        releaseData[key] = data[key]
      }
    }
  }
}

async function vm_test_list() {
  const res: any = await test_list({
    project_id: route.params.id,
    releaseStatus: 99,
    status: 99,
  })
  if (res.code === 200) {
    TestTask.splice(0, TestTask.length)
    TestTask.push(...res.data)
  }
}

async function vm_uat_list() {
  const res: any = await uat_list({
    project_id: route.params.id,
    releaseStatus: 99,
    status: 99,
  })
  if (res.code === 200) {
    UatTask.splice(0, UatTask.length)
    UatTask.push(...res.data)
  }
}

async function vm_prod_list() {
  const res: any = await prod_list({
    project_id: route.params.id,
    releaseStatus: 99,
    status: 99,
  })
  if (res.code === 200) {
    ProdTask.splice(0, ProdTask.length)
    ProdTask.push(...res.data)
  }
}


function prodTaskStatus(row: any) {
  let task: any = {}
  task = ProdTask.find((item: any) => item.uid === row.uid)
  let info = {
    Ing: false,
    QASign: '',
    PMSign: '',
    QAType: '',
    PMType: '',
    QAColor: '#888',
    PMColor: '#888',
  }


  if (task) {
    info = {
      Ing: true,
      QASign: task.QASignStatus === 0 ? 'QA确认中' : task.QASignStatus === 1 ? 'QA已确认' : 'QA已拒绝',
      PMSign: task.PMSignStatus === 0 ? 'PM确认中' : task.PMSignStatus === 1 ? 'PM已确认' : 'PM已拒绝',
      QAType: task.QASignStatus === 0 ? '' : task.QASignStatus === 1 ? 'success' : 'danger',
      PMType: task.PMSignStatus === 0 ? '' : task.PMSignStatus === 1 ? 'success' : 'danger',
      QAColor: task.QASignStatus === 0 ? '#5468ff' : task.QASignStatus === 1 ? '#32CD32' : 'red',
      PMColor: task.PMSignStatus === 0 ? '#5468ff' : task.PMSignStatus === 1 ? '#32CD32' : 'red',
    }
  }

  return info
}


function getTaskStatus(row: any, env: string) {
  let task: any = {}
  let STATUS = {
    TASKING: '测试中',
    TASKPASS: '测试通过',
    TASKRETURN: '测试退回',
  }
  switch (env) {
    case 'TEST':
      task = TestTask.find((item: any) => item.uid === row.uid)
      break;
    case 'UAT':
      STATUS.TASKING = 'UAT验收中'
      STATUS.TASKPASS = 'UAT通过'
      STATUS.TASKRETURN = 'UAT退回'
      task = UatTask.find((item: any) => item.uid === row.uid)
      break;
    case 'PROD':
      STATUS.TASKING = '上线审核中'
      STATUS.TASKPASS = '上线通过'
      STATUS.TASKRETURN = '上线退回'
      task = ProdTask.find((item: any) => item.uid === row.uid)
      break;
  }
  if (task) {
    let info = {
      text: STATUS.TASKING,
      type: '',
      color: '',
      status: task.status
    }
    switch (task.status) {
      case '0':
        info.text = STATUS.TASKING
        info.type = ''
        info.color = '#5468ff'
        break;
      case '1':
        info.text = STATUS.TASKPASS
        info.type = 'success'
        info.color = '#32CD32'
        break;
      case '-1':
        info.text = STATUS.TASKRETURN
        info.type = 'danger'
        info.color = 'red'
        break;
    }
    return info
  } else {
    return {
      text: '未开始',
      type: 'info',
      color: '#888',
      status: null
    }
  }
}


function goTask(row: any, env: string) {
  let task: any = {}
  switch (env) {
    case 'TEST':
      task = TestTask.find((item: any) => item.uid === row.uid)
      break;
    case 'UAT':
      task = UatTask.find((item: any) => item.uid === row.uid)
      break;
    case 'PROD':
      task = ProdTask.find((item: any) => item.uid === row.uid)
      break;
  }
  if (task) {
    return task.task_id
  } else {
    return null
  }
}


async function vm_dev_release() {
  const res = await dev_release({
    id: route.params.id,
    uid: releaseData.uid,
    release_id: releaseData._id
  });
  vm_release_list()
}
async function vm_test_create() {
  const res = await test_create({
    id: route.params.id,
    uid: releaseData.uid,
    userId: '622c6f088d60c24d97fed6d0'
  });
  await vm_test_list()
  vm_release_list()
}

async function vm_uat_create() {
  await uat_create({
    id: route.params.id,
    uid: releaseData.uid,
    userId: '622c6f088d60c24d97fed6d0'
  });
  await vm_uat_list()
  vm_release_list()
}


async function vm_prod_create() {
  await prod_create({
    id: route.params.id,
    uid: releaseData.uid,
    userId: '622c6f088d60c24d97fed6d0'
  });
  await vm_prod_list()
  vm_release_list()
}





async function vm_test_release() {
  const res = await test_release({
    id: route.params.id,
    uid: releaseData.uid,
  });
  vm_release_list()
}

async function vm_uat_release() {
  const res = await uat_release({
    id: route.params.id,
    uid: releaseData.uid,
  });
  vm_release_list()
}

</script>



<style lang="scss" scoped>
.cluster_list {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid rgba($color: #888, $alpha: 0.1);
  user-select: text;

  &:deep(.el-table th.el-table__cell > .cell) {
    font-size: 15px;
    font-weight: 700;
    color: #000;
  }
}

// 部署窗口
.evn-dialog {
  width: 100%;
  height: 500px;

  .evn-btns {
    width: 100%;
    height: 40px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  }

  .evn-select {
    width: 100%;
    height: 60px;
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid rgba($color: #888, $alpha: 0.1);
  }

  >.dialog-bottom {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    position: absolute;
    right: 20px;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
  }
}

// 环境状态
.evn-link {
  width: 100px;
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  border-radius: 3px;

  >span {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-radius: 3px;
    color: #000;
    font-weight: 700;
    box-shadow: 0px 0px 5px 0px rgba($color: #888, $alpha: 0.3);
  }
}

.view-text {
  font-size: 14px;
  color: #5468ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.cluster-env {
  width: 100%;
  display: flex;

  .env-child {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: 20px;
    color: #333;
    margin-right: 10px;
    border-radius: 10px;
    font-size: 14px;
  }
}
</style>
