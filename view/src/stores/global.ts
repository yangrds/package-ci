import { Members_details } from '@/http/api'
import { Project } from '@/interface'
import { isArray } from '@vue/shared'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => {
        return {
            loading: false, personal: {
                account: '',
                access: '0',
                beforePwd: '',
                pwd: '',
                name: '',
                jobName: '',
                remark: '',
                job_id: ''
            }
        }
    },
    actions: {
        setLoad(load: boolean) {
            this.loading = load
        },
        async user_details() {
            const res = await Members_details()
            if (res.code === 200) {
                for (const key in res.data) {
                    this.personal[key] = res.data[key]
                }
                console.log(this.personal);
                
            }
        },
        permission(project: Project, identity: string[]): boolean {
            let job_id = this.personal.job_id
            if (identity.indexOf('qa') != -1 && job_id === project.qa) return true
            if (identity.indexOf('pm') != -1 && job_id === project.pm) return true
            if (identity.indexOf('dev') != -1 && project.devs.indexOf(job_id) != -1) return true
            return false
        }
    },
})