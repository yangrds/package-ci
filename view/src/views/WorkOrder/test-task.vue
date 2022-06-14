<template>
    <div class="apply-test">
        <div class="test-operate">
            <div class="write-dialog">
                <el-col :span="6" class="write-col">
                    <div class="write-child">
                        <span class="label">任务号</span>
                        <div class="text">
                            <el-input clearable @clear="vm_test_list" v-model="query.task_id" placeholder="任务工单ID" />
                        </div>
                    </div>
                </el-col>



                <el-col :span="6" class="write-col">
                    <div class="write-child">
                        <span class="label">部署状态</span>
                        <div class="text">
                            <el-select clearable @clear="vm_test_list" style="margin-right: 10px;width: 100%;" v-model="query.releaseStatus" class="m-2"
                                size="small">
                                <el-option label="全部" value="99"></el-option>
                                <el-option label="未部署" value="0"></el-option>
                                <el-option label="已部署" value="1"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>

                <el-col :span="6" class="write-col">
                    <div class="write-child">
                        <span class="label">工单状态</span>
                        <div class="text">
                            <el-select clearable @clear="vm_test_list" style="margin-right: 10px;width: 100%;" v-model="query.status" class="m-2"
                                size="small">
                                <el-option label="全部" value="99"></el-option>
                                <el-option label="测试中" value="0"></el-option>
                                <el-option label="测试通过" value="1"></el-option>
                                <el-option label="测试退回" value="-1"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" class="write-col">
                    <el-button type="primary" @click="vm_test_list">查询</el-button>
                    <el-button type="success" @click="emptyClick">清空</el-button>
                </el-col>
            </div>
        </div>
        <div class="test-list">
            <el-table :data="dataList" style="width: 100%">
                <el-table-column prop="name" label="项目" min-width="200">
                    <template #default="scope">
                        <span style="font-size: 14px;font-weight: 700;color:#888">{{ scope.row.project.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="task_id" label="任务号" min-width="120">
                    <template #default="scope">
                        <span>{{ scope.row.task_id }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="commit_id" label="commit_id" min-width="120">
                    <template #default="scope">
                        <span>{{ scope.row.commit_id }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="工单状态" min-width="120">
                    <template #default="scope">
                        <el-tag class="mx-1" :type="statusText(scope.row.status).type">{{
                                statusText(scope.row.status).text
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="部署状态" min-width="120">
                    <template #default="scope">
                        <el-tag class="mx-1" :type="statusText(scope.row.releaseStatus).type">{{ scope.row.releaseStatus
                                === '1' ? '已部署' : '未部署'
                        }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="创建者" min-width="120">
                    <template #default="scope">
                        <span style="color:#888;font-size:14px">{{ getMember(scope.row.createUserId) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="创建时间" min-width="150">
                    <template #default="scope">
                        <span>{{ dateFormat('YY-mm-dd HH:MM:SS', scope.row.date) }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="project.describe" label="项目描述" min-width="180" />

                <el-table-column label="操作" width="80" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="router.push(`/main/test/${scope.row.task_id}`)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background style="margin-right: -10px;" layout="total ,prev, pager, next" :total="total"
                :page-size="query.pageSize" @current-change="currentChange" />
        </div>
    </div>
</template>



<script setup lang='ts'>
import { Members_read, test_list } from '@/http/api';
import { Member } from '@/interface';
import { dateFormat } from '@/utils/tool';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/stores/global'
const counter = useCounterStore()
const router = useRouter();
const query = reactive({
    task_id: '',
    releaseStatus: '99',
    status: '99',
    pageIndex: 1,
    pageSize: 10
})
const total = ref(0)


// 团队成员列表（总）
const members = reactive<Member[]>([]);

onMounted(() => {
    vm_Members_read()
    vm_test_list()
})

const dataList = reactive<any>([])

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
        console.log(members);

    }
}


function emptyClick() {
    let obj = {
        task_id: '',
        releaseStatus: '99',
        status: '99',
        pageIndex: 1,
        pageSize: 10
    }
    for (const key in obj) {
        query[key] = obj[key]
    }
    vm_test_list()
}


function currentChange(pageIndex: number) {
    query.pageIndex = pageIndex
    vm_test_list()
}

async function vm_test_list() {
    if (!query.releaseStatus) (query.releaseStatus = '99')
    if (!query.status) (query.status = '99')
    counter.setLoad(true)
    const res: any = await test_list(query)
    counter.setLoad(false)
    if (res.code === 200) {
        dataList.splice(0, dataList.length)
        dataList.push(...res.data)
        total.value = res.total
    }
}

</script>



<style lang="scss" scoped>
.apply-test {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 20px;
    box-sizing: border-box;

    >.test-operate {
        width: 100%;
        display: flex;
        align-items: center;
    }

    >.test-list {
        margin-top: 0px;
        border-top: 1px solid rgba($color: #888, $alpha: 0.1);
    }

    >.pagination {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>


<style lang="scss" scoped>
.write-dialog {
    width: 100%;
    min-width: 800px;
    box-sizing: border-box;
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
            }
        }

        >.text {
            width: 100%;
            height: 32px;
            display: flex;
            // align-items: center;

            >span {
                width: 100%;
                height: 32px;
                line-height: 32px;
                padding: 0 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // border-radius: 5px;
                background-color: #f5f5f5;
                color: #000;
                font-size: 14px;
            }
        }
    }
}
</style>