import { createRouter, createWebHashHistory } from 'vue-router'
import container from '@/views/container.vue'
import projectList from '@/views/project-list.vue'
import projectMembers from '@/views/project-member.vue'
import projectDetails from '@/views/project-details.vue'
import Host from '@/views/host.vue'
import testTask from '@/views/WorkOrder/test-task.vue'
import uatTask from '@/views/WorkOrder/uat-task.vue'
import prodTask from '@/views/WorkOrder/prod-task.vue'
import testDetails from '@/views/WorkOrder/test-details.vue'
import uatDetails from '@/views/WorkOrder/uat-details.vue'
import prodDetails from '@/views/WorkOrder/prod-details.vue'
import Login from '@/views/login.vue'
import hostDetails from '@/views/host-details.vue'

const routes = [
    {
        path: '/main',
        component: container,
        children: [
            {
                path: '/main/project',
                component: projectList
            },
            {
                path: '/main/project-members',
                component: projectMembers
            },
            {
                path: '/main/project/details/:id',
                component: projectDetails
            },
            {
                path: '/main/host',
                component: Host
            },
            {
                path: '/main/test-task',
                component: testTask
            },
            {
                path: '/main/uat-task',
                component: uatTask
            },
            {
                path: '/main/prod-task',
                component: prodTask
            },
            {
                path: '/main/test/:id',
                component: testDetails
            },
            {
                path: '/main/uat/:id',
                component: uatDetails
            },
            {
                path: '/main/prod/:id',
                component: prodDetails
            },
            {
                path: '/main/host/:ip',
                component: hostDetails
            },
            {
                path: '',
                redirect: '/main/project'
            }
        ]

    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '',
        redirect: '/main'
    }

]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})


export default router