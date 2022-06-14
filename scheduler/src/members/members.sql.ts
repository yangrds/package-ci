const mongoose = require('mongoose');
// import mongoose from 'mongoose'

// 标签
const memberSql = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    job_id: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    access: {
        type: String,
        default: '0'
    },
    pwd: {
        type: String,
        required: true
    },
    jobName: {
        type: String,
        required: true
    },
    remark: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: () => {
            return Math.round(new Date() as any)
        }
    },
});


export const memberModel = mongoose.model('member', memberSql);