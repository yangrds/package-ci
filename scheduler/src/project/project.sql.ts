const mongoose = require('mongoose');
// import mongoose from 'mongoose'
// 项目
const projectSql = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gitUrl: {
    type: String,
    required: true,
  },
  sourceCode: {
    type: String,
    required: true,
  },
  historyVersion: {
    type: String,
    required: true,
  },
  compile: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  qa: {
    type: String,
    required: true,
  },
  devs: {
    type: Array,
    required: true,
  },
  pm: {
    type: String,
    required: true,
  },
  describe: {
    type: String,
    required: true,
  },
  notice: {
    type: String,
    default: 'DEV,TEST,UAT环境在发布时统一部署至开发节点，PROD环境在发布时将部署至生产节点，节点和端口均可在【节点配置】内编辑',
  },
  envs: {
    type: Object,
    default: () => {
      return {
        DEV: { port: null, ip: '' },
        TEST: { port: null, ip: '' },
        UAT: { port: null, ip: '' },
        PROD: { port: null, ips: [] },
      };
    },
  },
  buildName: {
    type: String,
    default: 'dist',
  },
  dev_ip: {
    type: String,
    default: '',
  },
  prod_ip: {
    type: String,
    default: '',
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});

// 部署记录
const releaseSql = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  pack_id: {
    type: String,
    required: true,
  },
  project_id: {
    type: String,
    required: true,
  },
  commit_id: {
    type: String,
    required: true,
  },
  DEV: {
    type: Object,
    default: () => {
      return { status: null, date: null, user: null };
    },
  },
  TEST: {
    type: Object,
    default: () => {
      return { status: null, date: null, user: null };
    },
  },
  UAT: {
    type: Object,
    default: () => {
      return { status: null, date: null, user: null };
    },
  },
  PROD: {
    type: Object,
    default: () => {
      return { status: null, date: null, user: null };
    },
  },
  size: {
    type: Number,
    required: true,
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});


// TEST测试申请记录
const testTaskSql = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  release_id: {
    type: String,
    required: true,
  },
  task_id: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createUserId: {
    type: String,
    required: true,
  },
  releaseStatus: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    required: true,
  },
  build_date: {
    type: Number,
    required: true,
  },
  commit_id: {
    type: String,
    required: true,
  },
  releaseTime: {
    type: Number || Boolean,
    required: true,
  },
  taskEndTime: {
    type: Number || Boolean,
    required: true,
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});
// UAT申请记录
const uatTaskSql = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  release_id: {
    type: String,
    required: true,
  },
  task_id: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createUserId: {
    type: String,
    required: true,
  },
  releaseStatus: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    required: true,
  },
  build_date: {
    type: Number,
    required: true,
  },
  commit_id: {
    type: String,
    required: true,
  },
  releaseTime: {
    type: Number || Boolean,
    required: true,
  },
  taskEndTime: {
    type: Number || Boolean,
    required: true,
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});

// PROD申请记录
const prodTaskSql = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  release_id: {
    type: String,
    required: true,
  },
  task_id: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  // QA签署状态，0审核中、1确认、2拒绝
  QASignStatus: {
    type: Number,
    default: 0
  },
  // QA签署时间
  QASignDate: {
    type: Number,
    default: 0
  },
  // QA签署原因
  QASignReason: {
    type: String,
    default: ''
  },
  // PM签署状态，0审核中、1确认、2拒绝
  PMSignStatus: {
    type: Number,
    default: 0
  },
  // PM签署原因
  PMSignReason: {
    type: String,
    default: ''
  },
  // PM签署时间
  PMSignDate: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    required: true,
  },
  createUserId: {
    type: String,
    required: true,
  },
  releaseStatus: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    required: true,
  },
  build_date: {
    type: Number,
    required: true,
  },
  commit_id: {
    type: String,
    required: true,
  },
  releaseTime: {
    type: Number || Boolean,
    required: true,
  },
  taskEndTime: {
    type: Number || Boolean,
    required: true,
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});


// 指令
const commandSql = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  commandId: {
    type: String,
    required: true,
  },
  command: {
    type: String,
    required: true,
  },
  args: {
    type: Array,
    required: true,
  },
  show: {
    type: String,
    default: '1',
  },
  date: {
    type: Number,
    default: () => {
      return Math.round(new Date() as any);
    },
  },
});

export const projectModel = mongoose.model('project', projectSql, 'project');
export const releaseModel = mongoose.model('release', releaseSql, 'release');
export const testTaskModel = mongoose.model('testTask', testTaskSql, 'test-task');
export const uatTaskModel = mongoose.model('uatTask', uatTaskSql, 'uat-Task');
export const prodTaskModel = mongoose.model('prodTask', prodTaskSql, 'prod-task');
export const commandModel = mongoose.model('command', commandSql, 'command');
