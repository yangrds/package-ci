<template>
    <div class='server-details'>
        <div class="server-system">
            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">主机IP</span>
                    <div class="text">
                        <span>{{ systemInfo.ip }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">主机端口</span>
                    <div class="text">
                        <span>{{ systemInfo.port }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">CPU核心数</span>
                    <div class="text">
                        <span>{{ systemInfo.cpus?.length }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">内存</span>
                    <div class="text">
                        <span>{{ renderSize(systemInfo.totalmem) }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="16" class="server-col">
                <div class="server-child">
                    <span class="label">主机名称</span>
                    <div class="text">
                        <span>{{ systemInfo.hostname }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">系统</span>
                    <div class="text">
                        <span>{{ systemInfo.platform }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="8" class="server-col">
                <div class="server-child">
                    <span class="label">CPU架构</span>
                    <div class="text">
                        <span>{{ systemInfo.arch }}</span>
                    </div>
                </div>
            </el-col>

            <el-col :span="12" class="server-col" v-for="(cpu, index) in  systemInfo.cpus" :key="index">
                <div class="server-child">
                    <span class="label">CPU核心{{ index + 1 }}</span>
                    <div class="text">
                        <span>{{ cpu.model }}</span>
                        <!-- <span>{{ cpu.model }}&nbsp;&nbsp;&nbsp;@{{ (cpu.speed * 0.1).toFixed(2) }}GHz</span> -->
                    </div>
                </div>
            </el-col>
        </div>


        <div class="process-list">
            <div class="write-dialog">
                <div class="write-header">
                    <div class="write-title">
                        <span>服务进程列表</span>
                    </div>
                    <div class="write-operate">
                        <el-button size="small" :loading="init_loading" @click="vm_process_init">刷新进程池</el-button>
                        <el-button size="small" :loading="killAll_loading" @click="vm_process_killAll">冻结进程池</el-button>
                    </div>
                </div>



                <el-col :span="24" class="write-col">
                    <el-table :data="dataList" style="width: 100%">
                        <el-table-column label="进程ID" width="180">
                            <template #default="scope">
                                <span style="color:#555;font-size:12px">{{ scope.row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="项目" width="180">
                            <template #default="scope">
                                <span style="color:#555;font-size:14px">{{ scope.row.project.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="环境" width="120">
                            <template #default="scope">
                                <span style="color:#555;font-size:12px">{{ scope.row.env.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="120">
                            <template #default="scope">
                                <el-tag size="small" :type="scope.row.status ? 'success' : 'danger'" class="mx-1"
                                    effect="dark" round>
                                    {{ scope.row.status ? '正常' : '宕机' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" width="120">
                            <template #default="scope">
                                <span style="color:#555;font-size:12px">{{ scope.row.env.port }}</span>
                            </template>
                        </el-table-column>


                        <el-table-column label="服务访问地址" width="180" show-overflow-tooltip>
                            <template #default="scope">
                                <a class="process-http" target="_blank"
                                    :href="`http://${systemInfo.ip}:${scope.row.env.port}`">
                                    {{ `${systemInfo.ip}:${scope.row.env.port}` }}
                                </a>
                            </template>
                        </el-table-column>

                        <el-table-column label="项目描述" show-overflow-tooltip>
                            <template #default="scope">
                                <span style="color:#555;font-size:12px">{{ scope.row.project.describe }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="160">
                            <template #default="scope">
                                <el-button :disabled="scope.row.status" size="small" :loading="scope.row.start_loading"
                                    @click="vm_process_start(scope.row)">启动
                                </el-button>
                                <el-button :disabled="!scope.row.status" size="small" :loading="scope.row.kill_loading"
                                    @click="vm_process_kill(scope.row)">停止
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>

            </div>
        </div>
    </div>
</template>



<script setup lang='ts'>
import { process_kill, process_list, process_start, process_killAll, process_init } from '@/http/api';
import { Host } from '@/interface';
import { renderSize } from '@/utils/tool';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const dataList: any = reactive([])
const systemInfo = reactive<Host>({
    cpus: [],
    totalmem: 0,
    arch: '',
    platform: '',
    disk: []
})

const killAll_loading = ref(false)
const init_loading = ref(false)


onMounted(() => {
    vm_process_details()
})



async function vm_process_kill(row: any) {
    row.kill_loading = true
    const res = await process_kill({ ip: systemInfo.ip, id: row.id })
    row.kill_loading = false
    if (res.code === 200) {
        ElMessage.success(res.msg);
        vm_process_details()
    }
}

async function vm_process_killAll() {
    killAll_loading.value = true
    const res = await process_killAll({ ip: systemInfo.ip })
    if (res.code === 200) {
        ElMessage.success(res.msg);
        let Time = setTimeout(() => {
            killAll_loading.value = false
            clearTimeout(Time);
            vm_process_details()
        }, 1000);
    }
}

async function vm_process_init() {
    init_loading.value = true
    const res = await process_init({ ip: systemInfo.ip })
    if (res.code === 200) {
        /* 
        进程池全部启动后，会存在一个时间差，启动完毕之后调度器不能根据心跳接口有效捕获进程存活状态。
        延迟1000毫秒已经足够进程池内所有进程启动了，如果后期随着节点数量增大，出现了进程启动时间差增大，请至github提交issues
        */
        let Time = setTimeout(() => {
            clearTimeout(Time);
            init_loading.value = false
            ElMessage.success(res.msg);
            vm_process_details()
        }, 1000);
    }
}



async function vm_process_start(row: any) {
    row.start_loading = true
    const res = await process_start({ ip: systemInfo.ip, id: row.id })
    row.start_loading = false
    if (res.code === 200) {
        ElMessage.success(res.msg);
        vm_process_details()
    }
}








async function vm_process_details() {
    const res: any = await process_list({ ip: route.params.ip })
    if (res.code === 200) {
        dataList.splice(0, dataList.length)
        res.process_list.forEach((item: any) => {
            item.start_loading = false
            item.kill_loading = false
            dataList.push(item)
        })
        for (const key in res.systemInfo) {
            systemInfo[key] = res.systemInfo[key]
        }
    }
}



</script>



<style lang="scss" scoped>
.server-details {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.server-system {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px 0 0 20px;
    box-sizing: border-box;
    background-color: rgba($color: #f5f5f5, $alpha: 0.9);
    user-select: none;

    .server-col {
        width: 100%;
        margin-bottom: 20px;
    }

    .server-child {
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

<style lang="scss" scoped>
.process-http {
    color: #409eff;
    font-size: 13px;

    &:hover {
        text-decoration: underline;
    }
}

.process-list {
    width: 100%;
    display: flex;
    margin-top: 50px;

    .write-dialog {
        width: 100%;
        min-width: 800px;
        border: 1px solid rgba($color: #888, $alpha: 0.2);
        box-sizing: border-box;
        padding-right: 0;
        padding-bottom: 0;
        position: relative;

        .write-col {
            width: 100%;
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
}
</style>