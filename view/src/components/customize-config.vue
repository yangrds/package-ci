<template>
    <div class="project-permission" v-if="!counter.permission(projectInfo,['pm','dev'])">
        <img src="../assets/permission.png">
        <span>当前用户角色权限不足</span>
    </div>
    <div class="config-dialog" v-else>
        <div class="dialog-body">
            <el-col :span="8" class="config-col">
                <div class="config-child">
                    <span class="label">DEV端口</span>
                    <el-input v-if="envs.DEV" v-model="envs.DEV.port" :maxlength="5" placeholder="1024~65535" />
                </div>
            </el-col>

            <el-col :span="8" class="config-col">
                <div class="config-child">
                    <span class="label">TEST端口</span>
                    <el-input v-if="envs.TEST" v-model="envs.TEST.port" :maxlength="5" placeholder="1024~65535" />
                </div>
            </el-col>

            <el-col :span="8" class="config-col">
                <div class="config-child" style="padding-right: 0;">
                    <span class="label">UAT端口</span>
                    <el-input v-if="envs.UAT" v-model="envs.UAT.port" :maxlength="5" placeholder="1024~65535" />
                </div>
            </el-col>

            <el-col :span="8" class="config-col">
                <div class="config-child">
                    <span class="label">PROD端口</span>
                    <el-input v-if="envs.PROD" v-model="envs.PROD.port" :maxlength="5" placeholder="1024~65535" />
                </div>
            </el-col>

            <el-col :span="16" class="config-col">
                <div class="config-child" style="padding-right: 0;">
                    <span class="label">开发节点</span>
                    <el-select style="width:100%" class="m-2" placeholder="DEV、TEST、UAT环境将会部署至该节点"
                        v-model="IPState.dev_ip" size="small">
                        <el-option v-for="item in cluster" :key="item.ip" :label="item.ip" :value="item.ip">
                            <span>{{ item.ip }}（{{ item.platform }}-{{ item.cpus?.length }}核-{{
                                    renderSize(item.totalmem)
                            }}）</span>
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :span="24" class="config-col">
                <div class="config-child" style="padding-right: 0;">
                    <span class="label">生产节点</span>
                    <el-select style="width:100%" class="m-2" v-model="IPState.prod_ip"
                        placeholder="所选节点将会组成集群，PROD环境发布时将会以分布式的方式部署至该集群">
                        <el-option v-for="item in cluster" :key="item.ip" :label="item.ip" :value="item.ip">
                            <span>{{ item.ip }}（{{ item.platform }}-{{ item.cpus?.length }}核-{{
                                    renderSize(item.totalmem)
                            }}）</span>
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </div>

        <div class="res-code" style="user-select:text">
            <p v-if="feedbackCodes.length === 1" style="color: red;font-size: 16px;font-weight: 700;">【Error】{{
                    feedbackCodes[0]
            }}</p>

            <div class="code-item" v-else v-for="item in feedbackCodes" :key="item.ip">
                <span :style="{ color: envItem.code === 200 ? '#5468ff' : 'red' }" v-for="envItem in item.list"
                    :key="envItem.name">节点【{{ item.ip }}】项目【{{ projectInfo.name }}】环境【{{ envItem.name }}】配置{{
                            envItem.code === 200 ? '成功' : '失败'
                    }}</span>
            </div>
        </div>
        <div class="btns">
            <el-button @click.stop="emit('close')">关闭</el-button>
            <el-button @click.stop="Save">更新配置</el-button>
        </div>
    </div>
</template>



<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { Project, ENVS, Host } from '@/interface'
import { cluster_list, Project_ServerUpdate } from '@/http/api';
import { renderSize } from '@/utils/tool'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/global'
const counter = useCounterStore()

/* 事件订阅 */
const emit = defineEmits(['close', 'read'])

interface Props {
    configVisible: boolean,
    projectInfo: Project
}
const props = withDefaults(defineProps<Props>(), {
    configVisible: false,
    projectInfo() {
        return {
            envs: {},
            dev_ip: '',
            branch: "master",
            date: 0,
            describe: "",
            devs: [],
            gitUrl: "",
            localPath: "",
            name: "",
            pm: "",
            qa: "",
            _id: ''
        }
    }
})

// 环境
const envs = reactive<ENVS>({})


// 临时IP容器
const IPState = reactive<{ dev_ip: string; prod_ip: string }>({
    dev_ip: '',
    prod_ip: '',
})

// 集群（节点列表）
const cluster = reactive<Host[]>([])

const feedbackCodes = reactive<any>([])


// 初始化配置
function init() {
    // 临时项目数据初始化
    const _project: Project = JSON.parse(JSON.stringify(props.projectInfo))
    IPState.dev_ip = _project.dev_ip as string
    IPState.prod_ip = _project.prod_ip as string
    for (const key in _project.envs) {
        envs[key] = _project.envs[key]
    }
}

// 获取节点列表
async function vm_cluster_list() {
    const res = await cluster_list()
    if (res.code === 200) {
        cluster.splice(0, cluster.length)
        cluster.push(...res.data)
    }
}

// 保存/更新数据
async function Save() {
     if (!counter.permission(props.projectInfo, ['pm'])) {
        ElMessage.warning('用户角色权限不足')
        return
    }
    counter.setLoad(true)
    feedbackCodes.splice(0, feedbackCodes.length)
    // 更新项目配置
    const res = await Project_ServerUpdate({
        dev_ip: IPState.dev_ip,
        prod_ip: IPState.prod_ip,
        envs,
        _id: props.projectInfo.project_id,
        name: props.projectInfo.name
    })
    let Time = setTimeout(() => {
        clearTimeout(Time);
        counter.setLoad(false)
        if (res.code === 200) {
            feedbackCodes.splice(0, feedbackCodes.length)
            feedbackCodes.push(...res.ips)
        } else {
            feedbackCodes.push(res.msg)
        }


    }, 500);
    // 成功更新
    if (res.code === 200 && res.modifiedCount > 0) {
        emit('read')
    }
}

onMounted(() => {
    // 节点列表
    vm_cluster_list()
    // 配置初始化
    init()
})

</script>



<style lang="scss" scoped>
.config-dialog {
    width: 100%;
    height: 100%;
    padding: 180px 20px 70px;
    box-sizing: border-box;
    background-color: rgba($color: #f5f5f5, $alpha: 0.9);
    position: relative;

    .dialog-body {
        width: 100%;
        height: 160px;
        padding: 20px;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
    }

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
        padding-right: 10px;
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

    .res-code {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-shadow: 0px 0px 5px 0px rgba($color: #888, $alpha: 0.3) inset;
        box-sizing: border-box;
        overflow-y: auto;

        >.code-item {
            width: 100%;

            >span {
                color: #5468ff;
                display: block;
                font-size: 13px;
                line-height: 22px;
            }
        }
    }

    >.btns {
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
    }
}

</style>