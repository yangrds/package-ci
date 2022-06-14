<template>
    <div class="test-details">
        <div class="test-task-scroll">
            <div class="task-info">
                <div class="write-dialog">
                    <div class="write-title">
                        <span>任务基础信息</span>
                    </div>
                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">项目名</span>
                            <div class="text">
                                <span>{{ details.project?.name }}</span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="18" class="write-col">
                        <div class="write-child">
                            <span class="label">项目描述</span>
                            <div class="text">
                                <span>{{ details.project?.describe }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">版本号</span>
                            <div class="text">
                                <span>{{ details.uid }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">任务ID</span>
                            <div class="text">
                                <span>{{ details.task_id }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">任务时间</span>
                            <div class="text">
                                <span>{{ dateFormat('YY-mm-dd HH:MM:SS', details.date) }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">构建时间</span>
                            <div class="text">
                                <span>{{ dateFormat('YY-mm-dd HH:MM:SS', details.build_date) }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">commit_id</span>
                            <div class="text">
                                <span>{{ details.commit_id }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">资源大小</span>
                            <div class="text">
                                <span>{{ renderSize(details.size) }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">测试人员</span>
                            <div class="text">
                                <span>{{ getMember(details.project?.qa) }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child">
                            <span class="label">项目负责人</span>
                            <div class="text">
                                <span>{{ getMember(details.project?.pm) }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="24" class="write-col">
                        <div class="write-child">
                            <span class="label">开发人员</span>
                            <div class="text">
                                <span>{{ details.devs ? getdevs(details.project?.devs) : '--' }}</span>
                            </div>
                        </div>
                    </el-col>
                </div>
            </div>

            <div class="task-info">
                <div class="write-dialog">
                    <div class="write-title">
                        <span>项目部署</span>
                    </div>

                    <el-col :span="6" class="write-col">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">部署状态</span>
                            <div class="text">
                                <span>{{ details.releaseStatus === '1' ? '已部署' : '未部署' }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">部署时间</span>
                            <div class="text">
                                <span>{{ details.releaseTime ? dateFormat('YY-mm-dd HH:MM:SS', details.releaseTime) :
                                        '--'
                                }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">任务状态</span>
                            <div class="text">
                                <span>{{ statusText(details.status).text }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="6" class="write-col">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">审批时间</span>
                            <div class="text">
                                <span>{{ details.taskEndTime ? dateFormat('YY-mm-dd HH:MM:SS', details.taskEndTime) :
                                        '--'
                                }}</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="24" class="write-col">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">测试记录</span>
                            <div class="textarea">
                                <textarea :disabled="details.status != '0'" v-model="details.reason"
                                    placeholder="请填写测试记录/退回原因"></textarea>
                            </div>
                        </div>
                    </el-col>

                    <el-col :span="24" class="write-col" v-if="details.status === '0'">
                        <div class="write-child" style="padding-left: 80px;">
                            <span class="label" style="width: 80px;">环境操作</span>
                            <div class="text">
                                <el-button :disabled="!counter.permission(details.project, ['dev'])"
                                    v-if="details.releaseStatus === '0'" type="warning" @click="vm_test_create">
                                    部署版本</el-button>
                                <el-button :disabled="!counter.permission(details.project, ['qa'])"
                                    v-if="details.status === '0'" @click="vm_test_audit('1')">测试通过</el-button>
                                <el-button :disabled="!counter.permission(details.project, ['qa'])"
                                    v-if="details.status === '0'" @click="vm_test_audit('-1')">测试退回</el-button>
                            </div>
                        </div>
                    </el-col>
                </div>
            </div>
        </div>
    </div>
</template>



<script setup lang='ts'>
import { onMounted, reactive, ref, nextTick, onBeforeUnmount } from 'vue';
import { test_task, Members_read, test_create, test_release, task_update } from '@/http/api'
import { useRoute, useRouter } from 'vue-router';
import { dateFormat, renderSize } from '@/utils/tool'
import { Member } from '@/interface';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCounterStore } from "@/stores/global";
const counter = useCounterStore()
const router = useRouter();
const route = useRoute();
const loading = ref(false)

const taskShow = ref(true)

onMounted(async () => {
    await vm_test_task()
    vm_Members_read()


})

const details = reactive<any>({})
// 团队成员列表（总）
const members = reactive<Member[]>([]);


async function vm_test_audit(status: string) {
    if (!counter.permission(details.project, ['qa'])) {
        ElMessage.warning('用户角色权限不足')
        return
    }
    if (details.reason.length < 5) {
        ElMessage.warning('测试记录为空或低于5个字符，请填写测试记录!')
        return
    }
    ElMessageBox.confirm(
        '你当前的操作将会直接结束当前工单的任务状态，确认操作？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            loading.value = true
            const updateRes = await task_update({
                task_id: details.task_id,
                params: { reason: details.reason, status, taskEndTime: Math.round(new Date() as any) },
                env: 'TEST'
            })
            let Time = setTimeout(() => {
                clearTimeout(Time);
                loading.value = false
            }, 500);
            if (updateRes.code === 200) {
                ElMessage.success('数据提交成功')
            } else {
                ElMessage.error('数据提交失败')
            }
            vm_test_task()
        })
        .catch(() => { })
}


async function vm_test_create() {
    if (!counter.permission(details.project, ['qa'])) {
        ElMessage.warning('用户角色权限不足')
        return
    }
    ElMessageBox.confirm(
        `当前项目【${details.project.name}】资源【${details.commit_id}】，确认部署？`,
        '项目部署【TEST】',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            loading.value = true
            const releaseRes = await test_release({
                id: details.project_id,
                uid: details.uid,
                release_id: details.release_id
            });
            if (releaseRes.code === 200) {
                const updateRes = await task_update({
                    task_id: details.task_id,
                    params: { releaseStatus: '1', releaseTime: Math.round(new Date() as any) },
                    env: 'TEST'
                })
                if (updateRes.code === 200) {
                    ElMessage.success('部署成功')
                } else {
                    ElMessage.error('部署失败')
                }
            } else {
                ElMessage.error('部署失败')
            }

            loading.value = false
            vm_test_task()
        })
        .catch(() => { })

}

async function vm_test_task() {
    const res = await test_task({ task_id: route.params.id })
    if (res.code === 200) {
        let obj = res.data || {}
        for (const key in obj) {
            details[key] = obj[key]
        }
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

function statusText(status: string) {
    let info = {
        text: '测试中',
        type: ''
    }
    switch (status) {
        case '0':
            info.text = '测试中'
            info.type = 'info'
            break;
        case '1':
            info.text = '测试通过'
            info.type = 'success'
            break;
        case '-1':
            info.text = '测试退回'
            info.type = 'danger'
            break;
    }
    return info
}









</script>



<style lang="scss" scoped>
.test-details {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px;
    padding-top: 0px;
    box-sizing: border-box;
    position: relative;

    .relation {
        width: 100%;
        min-width: 800px;
        height: 300px;
        position: absolute;
        left: 0;
        top: 0;
        padding: 20px;
        box-sizing: border-box;

        >.relation-scroll {
            width: 100%;
            height: 100%;
            padding: 20px;
            box-sizing: border-box;
            position: relative;
            background-color: #f5f5f5;

            >.relation-close {
                width: 20px;
                height: 20px;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }

            >.relation-child {
                display: inline-block;
                padding: 8px 15px;
                border-radius: 5px;
                margin-right: 10px;

                >span {
                    color: #333;
                    font-weight: 700;
                }
            }

            >.relation-create {
                position: absolute;
                left: 20px;
                top: 30px;
            }

            >.relation-release {
                position: absolute;
                left: 16%;
                top: 140px;
            }

            >.relation-pass {
                position: absolute;
                left: 50%;
                top: 30px;
            }

            >.relation-return {
                position: absolute;
                left: 50%;
                bottom: 20px;
            }

            >.relation-record {
                position: absolute;
                left: 70%;
                top: 60px;
            }

            >.relation-reason {
                position: absolute;
                left: 80%;
                bottom: 30px;
            }

            >.relation-finish {
                position: absolute;
                left: 80%;
                top: 30px;
            }

            >.relation-end {
                position: absolute;
                right: 0%;
                top: 150px;
            }
        }
    }

    >.test-task-scroll {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;

        >.task-info {
            width: 100%;
            margin-top: 60px;
            display: flex;
        }
    }
}
</style>

<style lang="scss" scoped>
.write-dialog {
    width: 100%;
    min-width: 800px;
    border: 1px solid rgba($color: #888, $alpha: 0.2);
    box-sizing: border-box;
    padding: 20px 20px;
    padding-right: 0;
    padding-bottom: 0;
    position: relative;

    .write-col {
        width: 100%;
        margin-bottom: 20px;
    }

    .write-title {
        display: flex;
        align-items: center;
        height: 34px;
        position: absolute;
        left: -1px;
        top: -36px;
        padding: 0 20px;
        background-color: #f5f5f5;

        >span {
            color: #888;
            font-weight: 900;
            font-size: 14px;
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
                color: #000;
                font-size: 14px;
            }
        }
    }
}
</style>