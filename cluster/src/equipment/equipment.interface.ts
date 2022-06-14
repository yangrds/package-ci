import os, { CpuInfo } from 'os';

export interface Disk {
    filesystem: string
    blocks: string
    used: string
    available: string
    capacity: string
    mounted: string
}

export interface SystemInfo {
    ip?: string;
    port?: number;
    cpus?: CpuInfo[];
    arch?: string;
    totalmem?: number;
    hostname?: string;
    networkInterfaces?: NodeJS.Dict<os.NetworkInterfaceInfo[]>;
    platform?: string;
    disk?: Disk[]
}


export interface _File {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer
    size: number
}

export interface EnvInfo {
    dev: {
        port: string;
    };
    test: {
        port: string;
    };
    uat: {
        port: string;
    };
    prod: {
        port: string;
    };
}
