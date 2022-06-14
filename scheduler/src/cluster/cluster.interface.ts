export interface Cluster {}


export interface Host {
    arch?: string;
    cpus?: { model: string; speed: number }[];
    hostname?: string;
    ip?: string;
    platform?: string;
    port?: number;
    totalmem?: number;
}