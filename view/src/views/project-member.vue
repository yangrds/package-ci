<template>
  <div class='project-members'>
    <div class="toolbar">
      <el-button type="primary" @click="showDialog('create')">成员注册</el-button>
    </div>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="name" label="姓名" min-width="140">
        <template #default="scope">
          <span style="font-size:14px;color:#000">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="用户名" min-width="140">
        <template #default="scope">
          <span style="font-size:14px;color:#888">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="jobName" label="职位" min-width="140">
        <template #default="scope">
          <span style="font-size:14px;color:#888">{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="jobName" label="权限" min-width="140">
        <template #default="scope">
          <el-tag class="ml-2" :type="scope.row.access === '0' ? '' : 'success'">{{ scope.row.access === '0' ? '普通成员' :
              '超级用户'
          }}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column prop="date" label="注册时间" min-width="140">
        <template #default="scope">
          <span style="font-size:14px;color:#888">{{ dateFormat('YY-mm-dd HH:MM:SS', scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200">
        <template #default="scope">
          <el-tooltip class="box-item" effect="dark" :content="scope.row.remark" placement="top-start">
            <div style="width:100%" class="ellipsis">
              <span style="font-size:14px;color:#888">{{ scope.row.remark }}</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="counter.personal.access === '1'" label="操作" fixed="right" width="100">
        <template #default="scope">
          <el-button type="text" @click="vm_Members_remove(scope.row)">删除</el-button>
          <el-button type="text" @click="showDialog('update', scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination el-pagination background layout="prev, pager, next" :current-page="pageIndex"
        @current-change="currentChange" :page-size="20" :total="total"></el-pagination>
    </div>

  </div>

  <el-dialog v-model="membersDialogVisible" :title="status==='create'?'成员注册':'成员信息编辑'" width="800px" :before-close="(none: any) => none()">
    <div class="write-dialog">
      <el-col :span="12" class="write-col">
        <div class="write-child">
          <span class="label">姓名</span>
          <el-input v-model="memberInfo.name" />
        </div>
      </el-col>

      <el-col :span="12" class="write-col">
        <div class="write-child">
          <span class="label">用户名</span>
          <el-input v-model="memberInfo.account"/>
        </div>
      </el-col>

      <el-col :span="12" class="write-col">
        <div class="write-child">
          <span class="label">密码</span>
          <el-input v-model="memberInfo.pwd" type="password"/>
        </div>
      </el-col>

      <el-col :span="12" class="write-col">
        <div class="write-child">
          <span class="label">职位</span>
          <el-input v-model="memberInfo.jobName"/>
        </div>
      </el-col>


      <el-col :span="12" class="write-col">
        <div class="write-child">
          <span class="label">权限</span>
          <div class="text">
            <el-radio-group :disabled="counter.personal.access === '0'" v-model="memberInfo.access" class="ml-4">
              <el-radio style="margin-right:15px" label="0" size="large">普通成员</el-radio>
              <el-radio v-if="counter.personal.access === '1'" label="1" size="large">超级用户</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-col>



      <el-col :span="24" class="write-col">
        <div class="write-child">
          <el-alert show-icon :closable="false" title="超级用户是系统层面的权限，可以编辑服务器节点，以及团队成员增删改。其余和普通成员无异！" type="warning" />
        </div>
      </el-col>

      <el-col :span="24" class="write-col">
        <div class="write-child">
          <span class="label">备注</span>
          <el-input v-model="memberInfo.remark"/>
        </div>
      </el-col>

      <div class="btns">
        <el-button @click="membersDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>



<script setup lang='ts'>
import {
  Members_create,
  Members_read,
  Members_delete,
  Members_update,
} from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue-demi";
import { dateFormat } from "@/utils/tool";
import { useCounterStore } from '@/stores/global'
const counter = useCounterStore()

interface Member {
  account: string;
  access: string;
  pwd: string;
  name: string;
  jobName: string;
  remark: string;
  date?: number;
  _id?: string;
}

// 成员注册 access
const membersDialogVisible = ref(false);

const pageIndex = ref<number>(1);

const total = ref<number>(0);

const status = ref<string>("create");

function currentChange(index: number) {
  pageIndex.value = index;
  vm_Members_List()
}

// 成员信息
let memberInfo = reactive<Member>({
  access: '0',
  account: "",
  pwd: "",
  name: "",
  jobName: "",
  remark: "",
});

// 成员列表
const dataList = reactive<Member[]>([]);

onMounted(() => {
  vm_Members_List();
});

function showDialog(str: string, row?: Member) {
  if (str === "update") {
    for (const key in row) {
      memberInfo[key] = row[key];
    }
  }
  if (str === "create") {
    memberInfo.account = "";
    memberInfo.pwd = "";
    memberInfo.name = "";
    memberInfo.jobName = "";
    memberInfo.remark = "";
  }
  membersDialogVisible.value = true;
  status.value = str;
}

// 获取成员列表
async function vm_Members_List() {
  counter.setLoad(true)
  const res: any = await Members_read({
    pageIndex: pageIndex.value,
    pageSize: 20,
  });
  counter.setLoad(false)
  const list: Member[] = res.data;
  if (res.code === 200) {
    dataList.splice(0, dataList.length);
    dataList.push(...list);
    total.value = res.total;
  }
}


function vm_Members_remove(row: Member) {
  if (counter.personal.access != '1') {
    ElMessage.success("没有权限");
    return
  }
  ElMessageBox.confirm(
    "确定删除该成员数据?，一旦删除将不可恢复！",
    "删除团队成员",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      const res = await Members_delete({ id: row._id });
      if (res.code === 200 && res.data.deletedCount > 0) {
        vm_Members_List();
        ElMessage.success("删除成功");
      }
    })
    .catch(() => { });
}

// 保存成员列表
async function save() {
  let res: any;
  if (status.value === "create") {
    res = await Members_create(memberInfo);
  } else {
    res = await Members_update(memberInfo);
  }
  if (res.code === 200) {
    membersDialogVisible.value = false;
    vm_Members_List();
    ElMessage.success("保存成功");
  }
}
</script>



<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.write-dialog {
  width: 100%;
  height: 400px;

  .write-col {
    width: 100%;
    margin-bottom: 20px;
  }

  .write-child {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 60px;
    padding-right: 30px;
    box-sizing: border-box;
    position: relative;

    >.label {
      width: 60px;
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


<style lang="scss" scoped>
.project-members {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  >.pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  >.toolbar {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
  }
}
</style>

