import axios, { Method } from "axios";
import { post,get } from './index'

const address = import.meta.env.VITE_API_URL




/* 团队成员注册 */
export const Members_create = (body?: any): any => post({ url: `${address}members/create`, body })

/* 团队成员列表 */
export const Members_read = (body?: any): any => post({ url: `${address}members/read`, body })

/* 团队成员删除 */
export const Members_delete = (body?: any): any => post({ url: `${address}members/delete`, body })

/* 团队成员修改 */
export const Members_update = (body?: any): any => post({ url: `${address}members/update`, body })

/* 团队成员信息 */
export const Members_details = (body?: any): any => post({ url: `${address}members/user-info`, body })

/* 团队成员登录 */
export const Members_login = (params?: any): any => get({ url: `${address}members/login`, params })

/* 指令添加 */
export const command_add = (body?: any): any => post({ url: `${address}command/add`, body })

/* 指令添加 */
export const command_list = (body?: any): any => post({ url: `${address}command/list`, body })

/* 指令删除 */
export const command_remove = (body?: any): any => post({ url: `${address}command/remove`, body })

/* 加载GIT分支 */
export const Project_branch = (body?: any): any => post({ url: `${address}project/branch`, body })

/* 创建项目 */
export const Project_create = (body?: any): any => post({ url: `${address}project/create`, body })

/* 项目列表 */
export const Project_read = (body?: any): any => post({ url: `${address}project/read`, body })

/* 项目删除 */
export const Project_remove = (body?: any): any => post({ url: `${address}project/remove`, body })

/* 项目详情 */
export const Project_details = (body?: any): any => post({ url: `${address}project/details`, body })

/* 节点更新 */
export const Project_ServerUpdate = (body?: any): any => post({ url: `${address}project/server-update`, body })

/* 项目信息更新 */
export const Project_Update = (body?: any): any => post({ url: `${address}project/update`, body })

/* 项目切换分支 */
export const local_checkout = (body?: any): any => post({ url: `${address}project/local-checkout`, body })

/* 项目版本列表 */
export const local_version = (body?: any): any => post({ url: `${address}project/local-version`, body })

/* 项目远程分支 */
export const origin_branch = (body?: any): any => post({ url: `${address}project/origin-branch`, body })

/* 拉取远程分支 */
export const origin_pull = (body?: any): any => post({ url: `${address}project/origin-pull`, body })

/* 项目本地分支 */
export const local_branch = (body?: any): any => post({ url: `${address}project/local-branch`, body })

/* 项目本地分支 */
export const checkout_origin = (body?: any): any => post({ url: `${address}project/checkout-origin`, body })

/* 项目本地分支 */
export const delete_branch = (body?: any): any => post({ url: `${address}project/delete-branch`, body })

/* 构建版本 */
export const build_version = (body?: any): any => post({ url: `${address}project/build-version`, body })

/* 版本列表 */
export const read_version = (body?: any): any => post({ url: `${address}project/read-version`, body })

/* dev发布 */
export const dev_release = (body?: any): any => post({ url: `${address}release/dev-release`, body })

/* test发布 */
export const test_release = (body?: any): any => post({ url: `${address}release/test-release`, body })

/* uat发布 */
export const uat_release = (body?: any): any => post({ url: `${address}release/uat-release`, body })

/* prod发布 */
export const prod_release = (body?: any): any => post({ url: `${address}release/prod-release`, body })

/* prod创建工单 */
export const prod_create = (body?: any): any => post({ url: `${address}process/prod-create`, body })

/* test创建工单 */
export const test_create = (body?: any): any => post({ url: `${address}process/test-create`, body })

/* uat创建工单 */
export const uat_create = (body?: any): any => post({ url: `${address}process/uat-create`, body })

/* test工单列表 */
export const test_list = (body?: any): any => post({ url: `${address}process/test-list`, body })

/* uat工单列表 */
export const uat_list = (body?: any): any => post({ url: `${address}process/uat-list`, body })

/* prod工单列表 */
export const prod_list = (body?: any): any => post({ url: `${address}process/prod-list`, body })

/* test工单详情 */
export const test_task = (body?: any): any => post({ url: `${address}process/test-task`, body })

/* uat工单详情 */
export const uat_task = (body?: any): any => post({ url: `${address}process/uat-task`, body })

/* prod工单详情 */
export const prod_task = (body?: any): any => post({ url: `${address}process/prod-task`, body })

/* test工单数据修改 */
export const task_update = (body?: any): any => post({ url: `${address}process/task-update`, body })

/* 部署纪录 */
export const release_list = (body?: any): any => post({ url: `${address}release/release-list`, body })

/* 加载服务器配置 */
export const cluster_loadConfig = (body?: any): any => post({ url: `${address}cluster/load-config`, body })

/* 添加集群节点 */
export const cluster_create = (body?: any): any => post({ url: `${address}cluster/cluster-create`, body })

/* 集群节点列表 */
export const cluster_list = (body?: any): any => post({ url: `${address}cluster/cluster-list`, body })

/* 删除节点 */
export const cluster_remove = (body?: any): any => post({ url: `${address}cluster/cluster-remove`, body })

/* 进程列表 */
export const process_list = (body?: any): any => post({ url: `${address}cluster/process-list`, body })

/* 进程关闭 */
export const process_kill = (body?: any): any => post({ url: `${address}cluster/process-kill`, body })

/* 节点删除 */
export const process_delete = (body?: any): any => post({ url: `${address}cluster/process-delete`, body })

/* 进程关闭（全部） */
export const process_killAll = (body?: any): any => post({ url: `${address}cluster/process-kill-all`, body })


/* 进程启动（全部） */
export const process_init = (body?: any): any => post({ url: `${address}cluster/process-init`, body })


/* 进程启动 */
export const process_start = (body?: any): any => post({ url: `${address}cluster/process-start`, body })


