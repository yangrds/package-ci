<template>
    <div class="project-permission" v-if="!counter.permission(projectInfo, ['pm', 'dev'])">
        <img src="../assets/permission.png">
        <span>当前用户角色权限不足</span>
    </div>
    <div class="config-dialog" v-load="loading" v-else>
        <div class="dialog-body">


            <el-col :span="12" class="config-col">
                <div class="config-child">
                    <span class="label">项目负责人</span>
                    <el-select style="width:100%" v-model="parameter.pm" class="m-2" placeholder="Select">
                        <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
                            <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :span="12" class="config-col">
                <div class="config-child">
                    <span class="label">测试人员</span>
                    <el-select style="width:100%" v-model="parameter.qa" class="m-2" placeholder="Select">
                        <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
                            <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :span="24" class="config-col">
                <div class="config-child">
                    <span class="label">开发成员</span>
                    <el-select multiple style="width:100%" v-model="parameter.devs" class="m-2" placeholder="Select">
                        <el-option v-for="item in members" :key="item.job_id" :label="item.name" :value="item.job_id">
                            <span style="float: left">{{ item.name }}（{{ item.jobName }}）</span>
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :span="8" class="config-col">
                <div class="config-child">
                    <span class="label">资源目录</span>
                    <el-input v-model="parameter.buildName" />
                </div>
            </el-col>

            <el-col :span="16" class="config-col">
                <div class="config-child">
                    <span class="label">项目描述</span>
                    <el-input v-model="parameter.describe" />
                </div>
            </el-col>


            <el-col :span="24" class="config-col">
                <div class="config-child" style="align-items:normal">
                    <span class="label">项目通告</span>
                    <el-input :rows="5" type="textarea" resize="none" v-model="parameter.notice" />
                </div>
            </el-col>






        </div>


        <div class="btns">
            <el-button @click.stop="emit('close')">关闭</el-button>
            <el-button @click="Update">更新配置</el-button>
        </div>
    </div>
</template>



<script setup lang='ts'>
import { inject, onMounted, reactive, ref } from 'vue';
import { Project, ENVS, Host, Member } from '@/interface'
import { cluster_list, Members_read, Project_ServerUpdate, Project_Update } from '@/http/api';
import { renderSize } from '@/utils/tool'
import { ElMessage } from 'element-plus';
import { useCounterStore } from '@/stores/global'
import { nextTick } from 'process';
const counter = useCounterStore()

/* 事件订阅 */
const emit = defineEmits(['close', 'read'])

// 父组件的项目详情
const projectInfo: Project = inject('projectInfo') as Project


// 团队成员列表（总）
const members = reactive<Member[]>([]);


const loading = ref(false)

const parameter = reactive({
    project_id: projectInfo.project_id,
    devs: projectInfo.devs,
    pm: projectInfo.pm,
    qa: projectInfo.qa,
    buildName: projectInfo.buildName,
    describe: projectInfo.describe,
    notice: projectInfo.notice
})


onMounted(() => {
    vm_Members_read()
})


async function Update() {
    if (!counter.permission(projectInfo, ['pm'])) {
        ElMessage.warning('用户角色权限不足')
        return
    }
    loading.value = true
    const res = await Project_Update(parameter)
    loading.value = false
    if (res.code === 200) {
        ElMessage.success("更新成功");
        emit('read')
    }
}


// 获取团队成员
async function vm_Members_read() {
    const res = await Members_read();
    if (res.code === 200) {
        const list: Member[] = res.data;
        members.splice(0, members.length);
        members.push(...list);
        parameter.devs = projectInfo.devs
        parameter.pm = projectInfo.pm
        parameter.qa = projectInfo.qa
        parameter.buildName = projectInfo.buildName
        parameter.describe = projectInfo.describe
    }
}








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