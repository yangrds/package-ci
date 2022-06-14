export interface Parameter {
    job_id?: string;
    account: string;
    pwd: string;
    name: string;
    jobName: string;
    remark: string;
    date?: number;
    _id?: string;
    __v?: string
}

export interface MembersList {
    pageIndex: number;
    pageSize: number
}