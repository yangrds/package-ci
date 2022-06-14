<template>
  <div class="project-permission" v-if="!counter.permission(projectInfo, ['pm', 'dev'])">
    <img src="../assets/permission.png">
    <span>当前用户角色权限不足</span>
  </div>
  <div class='instruction' v-else>
    <el-table :data="commands" empty-text="暂无指令" style="width: 100%">
      <el-table-column prop="command" label="command" width="100">
        <template #default="scope">
          <span style="font-size: 14px;font-weight: 700;color: #333;">{{ scope.row.command }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="args" label="args">
        <template #default="scope">
          <div class="args-item">
            <span v-for="item in  scope.row.args">{{ item }}</span>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="Operations" width="180">
        <template #default="scope">
          <el-button @click="shellClick(scope.row)" size="small" type="primary">执行</el-button>
          <el-button @click="vm_command_remove(scope.row.commandId)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="instruction-add">
      <div class="shell-command">
        <el-radio v-model="shell_data.command" label="npm" size="large">npm</el-radio>
        <el-radio v-model="shell_data.command" label="yarn" size="large">yarn</el-radio>
      </div>
      <div class="shell-args">
        <el-input v-model="shell_data.args" placeholder="指令参数以逗号隔开" />
        <el-button @click="vm_command_add" style="margin-left: 10px;">添加</el-button>
      </div>

    </div>
  </div>


  <ModalBox :config="{
    width: 600,
    height: 500,
    title: '远程终端',
    icon: '/static/images/powershell.png',
  }" v-if="shellVisible" @close="closeBox">
    <template #main>
      <div class="shell-footer">
        <el-button type="danger" style="height: 24px; opacity: 0.3" size="small" @click="kill">中断</el-button>
      </div>
      <div class="shell-scroll" ref="ShellBox">
        <div class="shell-text">
          <p :style="shellStyle(item.type)" v-for="(item, index) in shellTexts" :key="index">
            {{ item.text }}
          </p>
          <img v-if="loadingShell" src="/static/images/loading.png" />
        </div>
      </div>
    </template>
  </ModalBox>

</template>



<script setup lang='ts'>
import { Project, Shell } from '@/interface';
import { uuid } from '@/utils/tool';
import { ElMessage } from 'element-plus';
import { inject, onMounted, reactive, ref } from 'vue';
import io, { Socket } from "socket.io-client";
import { command_add, command_list, command_remove } from '@/http/api';
import { useCounterStore } from '@/stores/global';
const counter = useCounterStore()
interface Props {
  project_id: string,
}

const props = withDefaults(defineProps<Props>(), {
  project_id: '',
})



// 父组件的项目详情
const projectInfo: Project = inject('projectInfo') as Project


let socket: Socket;




// 当前Shell信息
let currentShell: Shell = {};


// shell命令DOM实例
const ShellBox = ref<any>(null);

// shell模态框显示开关
const shellVisible = ref<boolean>(false);

// shell命令执行中loding状态。
const loadingShell = ref(false);


const commands = reactive<{ command: string; args: string[]; project_id: string; commandId?: string; date: number }[]>([])

const shell_data = reactive({
  project_id: props.project_id,
  command: 'npm',
  args: ''
})

// 当前shell命令内容
const shellTexts = reactive<{ type: string; text: string }[]>([]);


onMounted(() => {
  socketInit();
  vm_command_list()
})


async function vm_command_add() {
  if (!shell_data.args) {
    ElMessage.warning("指令参数不完整");
    return
  }
  const res = await command_add(shell_data)
  if (res.code === 200) {
    shell_data.args = ''
    vm_command_list()
    ElMessage.success("指令添加成功");
  }
}

async function vm_command_list() {
  const res = await command_list({ project_id: props.project_id })
  if (res.code === 200) {
    commands.splice(0, commands.length)
    commands.push(...res.data)
  }
}

async function vm_command_remove(commandId: string) {
  const res = await command_remove({ commandId: commandId })
  if (res.code === 200) {
    vm_command_list()
    ElMessage.success("指令删除成功");
  }
}

// socket实时通信初始化
function socketInit() {
  const url: string = import.meta.env.VITE_SOCKET_URL as string;
  socket = io(url, { path: "/socket" });
  socket.on("init", (msg: string) => {
    console.log(msg);
  });
  // 注册任务，shell信息实时返回
  socket.on("project", shellChang);
}

// shell动态样式
function shellStyle(type: string) {
  let style: any = {};
  switch (type) {
    case "start":
      style.color = "#eee";
      break;
    case "stderr":
      style.color = "#F5361E";
      break;
    case "stdout":
      style.color = "#409eff";
      break;
    case "close":
      style.color = "#eee";
      break;
  }
  return style;
}

// 关闭模态框
function closeBox() {
  if (shellVisible.value) {
    /* 
     在关闭模态框前，检测当前命令信息组是否包含子进程退出内容。
     如果子进程存在，出主动销毁子进程。
    */
    const isClose = shellTexts.find((item: any) => item.type === "close");
    /* 
     子进程未关闭
     kill销毁当前子进程
    */
    if (!isClose) kill();
    // 关闭当前模态框
    shellVisible.value = false;
  }
}



// 结束shell命令（子进程）
function kill() {
  socket.emit("shell-kill", { id: currentShell.commandId });
}

// 执行shell命令（子进程）
function shellClick(row: { command: string; args: string[]; project_id: string; commandId?: string; date: number }) {
  if (shellVisible.value) {
    ElMessage.warning("命令执行失败，检测到当前系统驻留旧的shell命令！");
    return;
  }
  loadingShell.value = true;
  currentShell = row;
  shellTexts.splice(0, shellTexts.length);
  shellTexts.push({
    type: "start",
    text: `程序开始执行 ${row.command} ${row.args.join(" ")}\n\n`,
  });
  shellVisible.value = true;
  const { command, args, commandId } = currentShell;
  socket.emit("shell-project", { command, args, sid: commandId, id: props.project_id });
}

// shell信息实时更新
function shellChang({ type, text }: { type: string; text: string }) {
  if (type === "close") {
    loadingShell.value = false;
  }
  shellTexts.push({ type, text });
  if (ShellBox.value) {
    ShellBox.value.scrollTop = ShellBox.value.scrollHeight;
  }
}


</script>



<style lang="scss" scoped>
.instruction {
  width: 100%;
  height: 100%;
  padding: 10px;
  padding-bottom: 100px;
  position: relative;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, .9);
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  >img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 1px 1px 3px rgba($color: #666, $alpha: .2);

    &:active {
      box-shadow: 1px 1px 3px rgba($color: #666, $alpha: .2) inset;
    }
  }

  >.item-btn {
    width: auto;
    min-width: 30px;
    height: 30px;
    margin-right: 10px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #f5f5f5;
    box-shadow: 1px 1px 3px rgba($color: #666, $alpha: .2);
    border-radius: 2px;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }

    &:active {
      box-shadow: 1px 1px 3px rgba($color: #666, $alpha: .2) inset;
    }
  }

  >.instruction-add {
    width: 100%;
    height: 80px;
    padding: 0 10px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    box-shadow: 0px -1px 3px rgba($color: #666, $alpha: .2);

    >.shell-command {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
    }

    >.shell-args {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.args-item {
  width: 100%;
  display: flex;

  >span {
    height: 26px;
    font-size: 12px;
    padding: 0 10px;
    margin-right: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #f5f5f5;
  }
}
</style>


<style lang="scss" scoped>
@keyframes loading {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.shell-footer {
  width: 100%;
  height: 30px;
  padding: 0 6px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.02);
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.shell-scroll {
  width: 100%;
  height: 100%;
  padding: 40px 10px 0;
  box-sizing: border-box;
  background-color: rgba($color: #000, $alpha: 0.8);
  overflow: auto;
  position: relative;

  .shell-text {
    width: 100%;
    margin-bottom: 100px;

    >p {
      color: #f5f5f5;
      word-wrap: break-word;
      white-space: pre-line;
      line-height: 18px;
      font-size: 14px;
      user-select: text;
    }

    >img {
      width: 14px;
      height: 14px;
      animation: loading 0.8s linear infinite;
    }
  }
}
</style>