<template>
    <div class='Header'>
        <div class="header-info">
            <div class="login-title">
                <img src="../assets/devops_select.png">
                <span>PACKAGE-CI</span>
            </div>
            <div class="header-options">

                <a href="https://js-vue.com/archives/package-ci" target="_blank" class="options-child">
                    <img src="../assets/blog.png">
                    <span>博客文档</span>
                </a>

                <a href="https://github.com/yangrds" target="_blank" class="options-child">
                    <img src="../assets/github.png">
                    <span>开源社区</span>
                </a>

                <div class="personal" @click.stop="optionsVisible = true">
                    <img src="../assets/avatar.svg">
                    <div class="user-info">
                        <span>{{ personal.name }}</span>
                        <span>{{ personal.jobName }}</span>
                    </div>
                </div>
            </div>
            <div class="options" v-show="optionsVisible">
                <div class="options-item" @click="userConfigClick">
                    <img src="../assets/gy.svg">
                    <span>个人设置</span>
                </div>
                <div class="options-item" @click="fullScreen">
                    <img src="../assets/qp.svg">
                    <span>{{ fullscreen ? '全屏' : '退出全屏' }}</span>
                </div>
                <div class="options-item" @click="aboutClick">
                    <img src="../assets/gy.svg">
                    <span>关于</span>
                </div>
                <div class="options-item" @click="outLogin">
                    <img src="../assets/out.svg">
                    <span>退出登录</span>
                </div>
            </div>
        </div>
        <el-dialog v-model="personalDialogVisible" width="500px" :before-close="(none: any) => none()">
            <div class="evn-dialog">
                <ModalView title="个人信息配置">
                    <template #modal-body>
                        <div class="modal-body">
                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">*个人昵称</span>
                                    <el-input v-model="personal.name" />
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">&nbsp;用户名</span>
                                    <div class="text">
                                        <span>{{ personal.account }}</span>
                                    </div>
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">&nbsp;权限</span>
                                    <div class="text">
                                        <span>{{ personal.access === '0' ? '普通成员' : '超级用户' }}</span>
                                    </div>
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">&nbsp;成员ID</span>
                                    <div class="text">
                                        <span>{{ personal.job_id }}</span>
                                    </div>
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">*团队职位</span>
                                    <el-input v-model="personal.jobName" />
                                </div>
                            </el-col>



                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">&nbsp;修改密码</span>
                                    <el-input type="password" v-model="personal.pwd" placeholder="新密码"
                                        style="margin-right: 10px;" />
                                    <el-input type="password" v-model="personal.beforePwd" placeholder="确认密码" />
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <el-alert show-icon :closable="true" title="如果更新密码，将会重新登录" type="warning" />
                                </div>
                            </el-col>

                            <el-col :span="24" class="modal-col">
                                <div class="modal-child">
                                    <span class="label">*备注信息</span>
                                    <el-input v-model="personal.remark" />
                                </div>
                            </el-col>
                        </div>
                    </template>
                </ModalView>
                <div class="dialog-bottom">
                    <el-button @click="personalDialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="submit">保存</el-button>
                </div>
            </div>
        </el-dialog>

        <ModalBox @close="aboutClick"
            :config="{ width: 425, height: 460, title: 'PACKAGE-CI', icon: '/devops_select.png' }" v-if="aboutVisible">
            <template #main>
                <div class="about">
                    <div class="title">
                        <span>PACKAGE-CI</span>
                        <span>前端DevOps</span>
                    </div>
                    <p>{{ PACKAGE_TEXT }}</p>
                    <div class="author">
                        <span>PACKAGE-CI开源作者</span>
                        <span>梦客</span>

                    </div>
                </div>
            </template>
        </ModalBox>
    </div>
</template>



<script setup lang='ts'>
import { Members_details, Members_update } from '@/http/api';
import { Member } from '@/interface';
import router from '@/router';
import { useCounterStore } from '@/stores/global';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
const counter = useCounterStore()
const optionsVisible = ref(false)
const aboutVisible = ref(false)
window.addEventListener('click', (e: any) => {
    optionsVisible.value = false
})

const personal: Member = reactive({
    access: '',
    account: '',
    beforePwd: '',
    pwd: '',
    name: '',
    jobName: '',
    remark: '',
    job_id: ''
})



const PACKAGE_TEXT = ref(`
    PACKAGE-CI是一款专注于前端领域的专业运维工具，传统的运维部署工具是使用docker容器来部署前端项目，通常前端需要部署的只是一个打包后的静态资源（仅仅一个web服务就可以激活静态资源），PACKAGE-CI抛弃传统的docker容器，将静态资源注入process由process激活静态资源启动web服务，process之间也可以组建大型集群节点，实现分布式部署，只需要组建好的集群将节点配置到nginx即可完成负载均衡。
    PACKAGE-CI整体架构为Vue3+NodeJs（框架NestJs）+MongoDB，当前整体功能均已全部完成，正在修复细节部分（暂时不建议用于生产环境）。
`)

onMounted(() => {
    vm_Members_details()
})

let fullscreen = ref<boolean>(true)



function launchFullscreen(element: any) {
    if (element.requestFullscreen) {
        element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen()
    }
}


function exitFullscreen(doc: any) {
    if (doc.exitFullscreen) {
        doc.exitFullscreen()
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen()
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
    }
}

function aboutClick() {
    aboutVisible.value = aboutVisible.value ? false : true
}

function outLogin() {
    window.localStorage.removeItem('token')
    router.push('/login')
}

async function fullScreen() {
    if (document.fullscreenElement) {
        exitFullscreen(document)
    } else {
        launchFullscreen(document.documentElement)
    }
    fullscreen.value = !!document.fullscreenElement
}

async function submit() {
    if (!personal.name || !personal.jobName || !personal.remark) {
        ElMessage.warning("参数不完整");
        return
    }
    if (personal.beforePwd || personal.pwd) {
        if (personal.beforePwd != personal.pwd) {
            ElMessage.warning("您试图修改密码，但是两次密码不一致。");
            return
        }
    } else {
        delete personal.pwd
    }

    const res = await Members_update(personal)
    if (res.code === 200) {
        ElMessage.success("保存成功");
        vm_Members_details()
        counter.user_details()
        personalDialogVisible.value = false
    }
}

async function vm_Members_details() {
    const res = await Members_details()
    if (res.code === 200) {
        for (const key in res.data) {
            personal[key] = res.data[key]
        }
    }
}

function userConfigClick() {
    personalDialogVisible.value = true
}
let personalDialogVisible = ref(false)

</script>



<style lang="scss" scoped>
.Header {
    width: 100%;
    height: 50px;
    padding: 0 10px;
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    user-select: none;

    >.header-info {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba($color: #888, $alpha: .1);

        >.login-title {
            width: 126px;
            height: 36px;
            padding-left: 10px;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 800;
            box-shadow: 0px 0px 3px rgba($color: #333, $alpha: .3) inset;
            user-select: none;

            >img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }

            span {
                color: #888;
            }
        }

        >.header-options {
            width: 800px;
            height: 50px;
            position: absolute;
            top: 0;
            right: 6px;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            >.options-child {
                width: 60px;
                height: 40px;
                margin-right: 10px;
                margin-top: 1px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: rgba($color: #5468ff, $alpha: 0.1);
                }

                span {
                    font-size: 12px;
                    color: #888;
                    transform: scale(.9);

                }

                img {
                    width: 20px;
                    height: 20px;
                }
            }

            >.personal {
                min-width: 130px;
                max-width: 230px;
                padding: 0 10px;
                margin-left: 5px;
                cursor: pointer;
                height: 50px;
                box-sizing: border-box;
                display: flex;
                align-items: center;

                &:hover {
                    background-color: rgba($color: #5468ff, $alpha: 0.1);
                }

                >span {
                    font-size: 14px;
                    color: #555;
                }

                >img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }

                >.user-info {
                    width: auto;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    /* 隐藏超出部分 */
                    overflow: hidden;

                    >span:nth-child(1) {
                        font-size: 15px;
                        color: #333;
                    }

                    >span:nth-child(2) {
                        font-size: 12px;
                        color: #888;
                    }

                    >span {
                        /* 不换行 */
                        white-space: nowrap;
                        /* 隐藏超出部分 */
                        overflow: hidden;
                        /* 显示省略号 */
                        text-overflow: ellipsis;
                    }
                }

            }

            >img {
                width: 36px;
                height: 36px;
                padding: 6px;
                box-sizing: border-box;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: rgba($color: #5468ff, $alpha: 0.1);
                }
            }
        }



        >.options {
            width: 160px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 1px 1px 10px rgba($color: #888, $alpha: .3);
            position: absolute;
            right: 10px;
            top: 60px;
            z-index: 99999;
            box-sizing: border-box;

            .options-item {
                width: 100%;
                height: 40px;
                padding-left: 10px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                cursor: pointer;



                &:hover {
                    background-color: rgba($color: #5468ff, $alpha: 0.1);
                }

                >img {
                    width: 16px;
                    height: 16px;
                    margin-right: 6px;
                }

                >span {
                    font-size: 14px;
                    color: #555;
                }
            }
        }
    }
}


.about {
    width: 100%;
    height: 100%;
    background-color: #fff;

    >.title {
        width: 100%;
        height: 130px;
        background: #6699cc url('../../public/static/images/6.webp');
        background-position: -100px -10px;
        background-size: 145%;
        display: flex;
        align-items: center;
        justify-content: center;

        &>span:nth-child(1) {
            font-size: 30px;
            font-weight: 700;
            color: #28C8FF;
        }

        &>span:nth-child(2) {
            font-size: 20px;
            font-weight: 900;
            margin-top: 8px;
            margin-left: 10px;
            color: #858185;
        }


    }

    >p {
        width: 100%;
        padding: 0 15px;
        text-indent: 2em;
        line-height: 22px;
        color: #333;
        font-size: 13px;
        margin-top: 10px;
        box-sizing: border-box;
    }

    >.author {
        width: 100%;
        height: 50px;
        padding-right: 20px;
        margin-top: 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;

        &>span:nth-child(1) {
            font-size: 15px;
            color: #333;
        }

        &>span:nth-child(2) {
            font-size: 15px;
            font-weight: 700;
            color: #000;
            margin-left: 2px;
        }
    }
}


.evn-dialog {
    width: 100%;
    height: 530px;

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
</style>