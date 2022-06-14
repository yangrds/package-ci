<template>
    <div class="host">
        <el-alert show-icon :closable="false"
            title="刚创建的项目，需进入详情内点击【一键启动/重启】将静态资源注册到进程中。删除节点需要有超级管理员权限！服务器集群节点支持【mac/linux/windows】系统。" type="warning" />
        <div class="host-bar">
            <el-button type="primary" @click="details()">新建</el-button>
        </div>

        <div class="host-list">
            <div class="host-example" v-for="cluster in clusterList" :key="cluster._id">
                <div class="example-top">
                    <img :src="`${getName(cluster.platform as string)}`">
                    <span>{{ cluster.hostname }}</span>
                    <el-button type="text" size="small" @click="toFun(cluster.ip as string)">详情</el-button>

                    <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon-color="#626AEF"
                        title="确认删除该节点？" @confirm="deleteClick(cluster.ip as string)">
                        <template #reference>
                            <el-button type="text" size="small">删除
                            </el-button>
                        </template>
                    </el-popconfirm>


                </div>
                <div class="example-info">
                    <span>
                        IPV4地址
                        <span class="text" style="color:#0053CA">{{ cluster.ip }}</span>
                        端口
                        <span class="text" style="color:#0053CA">{{ cluster.port }}</span>
                    </span>
                    <span>
                        系统
                        <span class="text">{{ cluster.platform }}</span>
                        CPU架构
                        <span class="text">{{ cluster.arch }}</span>
                        CPU
                        <span class="text">{{ cluster?.cpus?.length }}核</span>
                        内存
                        <span class="text">{{ renderSize(cluster.totalmem) }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <ModalBox :config="{ width: 800, height: 550, title: '添加集群节点', icon: '/static/images/host.png' }"
        @close="createHostVisible = false" v-if="createHostVisible">
        <template #main>
            <div class="host-dialog">
                <el-col :span="24" class="host-col">
                    <div class="host-child">
                        <span class="label">IPV4地址</span>
                        <el-input v-model="ip" size="small" placeholder="前置条件：需要在目标服务器内部署集群子应用" />&nbsp;:&nbsp;
                        <el-input v-model="port" style="width: 100px;" size="small" placeholder="端口" />
                        <el-button style="margin-left: 10px;" size="small" type="primary"
                            @click="vm_Cluster_loadConfig">加载服务器配置</el-button>
                        <el-button style="margin-left: 10px;" :disabled="!systemInfo.ip" size="small" type="warning"
                            @click="Save">添加该节点</el-button>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">主机IP</span>
                        <div class="text">
                            <span>{{ systemInfo.ip }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">主机端口</span>
                        <div class="text">
                            <span>{{ systemInfo.port }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">CPU核心数</span>
                        <div class="text">
                            <span>{{ systemInfo.cpus?.length }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">内存</span>
                        <div class="text">
                            <span>{{ renderSize(systemInfo.totalmem) }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="16" class="host-col">
                    <div class="host-child">
                        <span class="label">主机名称</span>
                        <div class="text">
                            <span>{{ systemInfo.hostname }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">系统</span>
                        <div class="text">
                            <span>{{ systemInfo.platform }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8" class="host-col">
                    <div class="host-child">
                        <span class="label">CPU架构</span>
                        <div class="text">
                            <span>{{ systemInfo.arch }}</span>
                        </div>
                    </div>
                </el-col>

                <el-col :span="12" class="host-col" v-for="(cpu, index) in  systemInfo.cpus" :key="index">
                    <div class="host-child">
                        <span class="label">CPU核心{{ index + 1 }}</span>
                        <div class="text">
                            <span>{{ cpu.model }}&nbsp;&nbsp;&nbsp;@{{ (cpu.speed * 0.1).toFixed(2) }}GHz</span>
                        </div>
                    </div>
                </el-col>
            </div>
        </template>
    </ModalBox>
</template>



<script setup lang='ts'>
import { computed, onMounted, reactive, ref } from 'vue';
import ModalBox from '@/components/ModalBox.vue'
import { cluster_create, cluster_list, cluster_loadConfig, cluster_remove, process_list } from '@/http/api'
import { Percentage, renderSize } from '@/utils/tool'
import { ElMessage } from 'element-plus';
import { Host } from '@/interface'
import { useCounterStore } from '@/stores/global'
import { useRouter } from 'vue-router';
const router = useRouter();
const counter = useCounterStore()
const createHostVisible = ref(false)
const ip = ref<string>('')
const port = ref<number>(9001)

const systemInfo = reactive<Host>({
    ip: '',
    port: 0,
    cpus: [],
    totalmem: 0,
    arch: '',
    platform: '',
    disk: []
})
const clusterList = reactive<Host[]>([])


onMounted(() => {
    vm_cluster_list()
})

function toFun(ip: string) {
    router.push(`/main/host/${ip}`)
}

function reset() {
    systemInfo.ip = ''
    systemInfo.hostname = ''
    systemInfo.port = 0
    systemInfo.cpus = []
    systemInfo.totalmem = 0
    systemInfo.arch = ''
    systemInfo.platform = ''
    systemInfo.disk = []
}

async function vm_Cluster_loadConfig() {
    if (!ip.value) {
        ElMessage.warning("缺少【IP/端口】信息");
        return
    }
    reset()
    counter.setLoad(true)
    const res = await cluster_loadConfig({ ip: ip.value, port: port.value })
    counter.setLoad(false)
    if (res.code === 200) {
        systemInfo.ip = ip.value;
        systemInfo.port = port.value;
        (res.data.cpus || []).forEach((cpu: any) => {
            delete cpu.times
        });
        systemInfo.cpus = res.data.cpus
        systemInfo.hostname = res.data.hostname
        systemInfo.totalmem = res.data.totalmem
        systemInfo.arch = res.data.arch
        systemInfo.platform = res.data.platform
        const temp = res.data.disk || []
        const list: any = []
        temp.forEach((item: any) => {
            if (!isNaN(parseInt(item.blocks))) {
                if (parseInt(item.blocks) > 0) {
                    item.schedule = Percentage(parseInt(item.blocks) - parseInt(item.available), parseInt(item.blocks))
                    item.color = '#42A0D2'
                    if (item.schedule > 60) {
                        item.color = '#E2A34C'
                    }
                    if (item.schedule > 90) {
                        item.color = '#F87544'
                    }
                    list.push(item)
                }
            }
        });
        systemInfo.disk = list
    } else {
        ElMessage.warning("配置加载失败，请检查集群子节点服务器配置");
    }

}

async function details() {
    reset()
    createHostVisible.value = true
}

async function deleteClick(ip: string) {
    if (counter.personal.access != '1') {
        ElMessage.warning('权限不足，需要超级用户权限！');
        return
    }
    const res = await cluster_remove({ ip })
    vm_cluster_list()
    if (res.code === 200) {
        ElMessage.success("集群子节点删除成功");
    }
}

async function Save() {
    const data: Host = JSON.parse(JSON.stringify(systemInfo))
    delete data.disk
    if (!data.ip) return
    const res = await cluster_create(data)
    vm_cluster_list()
    if (res.code === 200) {
        createHostVisible.value = false
        ElMessage.success("集群子节点创建成功");
    } else {
        ElMessage.warning(res.msg);
    }
}

function getName(name: string): string {
    let host = '/static/images/linux.png'
    switch (name) {
        case 'Linux':
            host = '/static/images/linux.png'
            break;
        case 'MacOS':
            host = '/static/images/mac.png'
            break;
        case 'win32':
            host = '/static/images/windows.png'
            break;
    }
    return host
}

async function vm_cluster_list() {
    counter.setLoad(true)
    const res = await cluster_list()
    counter.setLoad(false)
    if (res.code === 200) {
        clusterList.splice(0, clusterList.length)
        clusterList.push(...res.data)
    }
}


</script>



<style lang="scss" scoped>
.host {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #eee;
    box-sizing: border-box;

    >.host-bar {
        width: 100%;
        margin: 20px 0 20px;
        display: flex;
        align-items: center;
    }

    >.host-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        >.host-example {
            width: 400px;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 4px;
            margin-right: 20px;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0 2px 4px 0 rgb(54, 58, 80, 0.32);

            >.example-top {
                width: 100%;
                display: flex;
                align-items: center;
                box-sizing: border-box;

                >img {
                    width: 36px;
                    height: 36px;
                    margin-top: 2px;
                }

                >span {
                    width: 100%;
                    font-size: 14px;
                    color: #888;
                    margin-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            >.example-info {
                width: 100%;
                margin-top: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;

                >span {
                    margin-bottom: 5px;
                    font-weight: 700;
                    color: #333;

                    >.text {
                        color: #888;
                        font-weight: 500;
                    }
                }
            }
        }
    }
}

.host-box {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    // background-color: rgba($color: #f5f5f5, $alpha: 0.9);
}

.host-dialog {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px 0 0 20px;
    box-sizing: border-box;
    background-color: rgba($color: #f5f5f5, $alpha: 0.9);
    user-select: none;

    .host-col {
        width: 100%;
        margin-bottom: 20px;
    }

    .host-child {
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
                background-color: #fff;
                color: #666;
            }
        }
    }

    .disk-list {
        width: 100%;
        float: left;
        margin-left: -10px;

        >.disk-wrap {
            width: 33%;
            height: 110px;
            padding: 10px;
            box-sizing: border-box;
            float: left;

            >.disk-child {
                width: 100%;
                height: 100%;
                padding: 10px;
                padding-left: 80px;
                box-sizing: border-box;
                display: flex;
                position: relative;
                box-shadow: 1px 1px 3px rgba($color: #888, $alpha: 0.9);
                border-radius: 3px;

                >img {
                    width: 60px;
                    height: 60px;
                    position: absolute;
                    left: 10px;
                    top: 10px;
                }

                >.info {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    >span {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    >.disk-name {}

                    >.schedule {
                        width: 100%;
                        height: 16px;
                        background-color: #e6e6e6;

                        >i {
                            width: 20%;
                            height: 100%;
                            display: block;
                            background-color: #36a0d6;
                        }
                    }

                    >.disk-dosage {}
                }
            }
        }
    }

    >.btns {
        width: 100%;
        height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        background-color: rgba($color: #f5f5f5, $alpha: 0.9);
    }
}
</style>