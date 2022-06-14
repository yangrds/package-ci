export interface ENV { port: string, ip: string }
export interface ENVS { DEV?: ENV; TEST?: ENV; UAT?: ENV; PROD?: { port: string, ips: string[] } }

export interface Project {
    project_id?: string;
    show?:boolean;
    name: string;
    envs?: ENVS;
    prod_ip?: string;
    dev_ip?: string;
    gitUrl: string;
    localPath?: string;
    sourceCode?: string;
    branch: string;
    qa: string;
    devs: string[];
    pm: string;
    describe: string;
    buildName?: string;
    notice?: string;
    date?: number;
    testCount?:number;
    uatCount?:number;
    prodCount?:number;
    _id?: string;
    __v?: string;
}


export interface Member {
    account: string;
    access: string;
    beforePwd?: string;
    pwd?: string;
    name: string;
    jobName: string;
    remark: string;
    job_id: string;
    date?: number;
    _id?: string;
}
export interface Version {
    author_email?: string;
    author_name?: string;
    body?: string;
    date?: string;
    hash?: string;
    message?: string;
    refs?: string;
}

export interface Shell {
    command?: string;
    args?: string[];
    project_id?: string;
    commandId?: string;
    date?: number
}

export interface Disk {
    filesystem: string;
    blocks: string;
    used: string;
    available: string;
    capacity: string;
    mounted: string;
    schedule: number;
    color: string;
}

export interface Host {
    _id?: string;
    arch?: string;
    cpus?: { model: string; speed: number }[];
    disk?: Disk[];
    hostname?: string;
    ip?: string;
    platform?: string;
    port?: number;
    totalmem?: number;
}




// 版本构建记录列表数据类型
export interface ReleaseENV { status: null | number, date: null | number, user: null | string }
export interface Release {
    DEV: ReleaseENV,
    PROD: ReleaseENV,
    TEST: ReleaseENV,
    UAT: ReleaseENV,
    commit_id: string,
    date: number,
    projectId: string,
    size: number,
    uid: string,
    pack_id?: string,
    _id: string,
}

