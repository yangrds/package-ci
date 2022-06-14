export interface ENV {
  port?: number;
  dist?: string;
  name?: string;
  project?: string;
  id?: string
}


export interface ServeParameter {
  name: string;
  port: number;
  dist: string;
  project: string;
  project_id: string;
  id?: string
}