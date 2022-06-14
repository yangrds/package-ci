declare namespace NodeJS {
  export interface ProcessEnv {
    port: number;
    dist: string;
    name: string;
    project: string;
  }
}
