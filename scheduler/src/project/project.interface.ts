export interface ENV { port: string }
export interface ENVS { DEV?: ENV; TEST?: ENV; UAT?: ENV; PROD?: ENV }
export interface Project {
    name?: string;
    project_id?: string;
    envs?: ENVS;
    gitUrl?: string;
    sourceCode?: string;
    historyVersion?: string;
    compile?: string;
    user?: string;
    pwd?: string;
    branch?: string;
    qa?: string;
    devs?: string[],
    pm?: string;
    describe?: string;
    cors?: boolean,
    date?: number;
    _id?: string;
    __v?: string;
}
