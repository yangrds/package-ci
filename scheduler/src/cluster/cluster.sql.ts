const mongoose = require('mongoose')

const HostSql = new mongoose.Schema(
    {
        arch: {
            type: String,
            required: true
        },
        hostname: {
            type: String,
            required: true
        },
        cpus: {
            type: Array,
            required: true
        },
        ip: {
            type: String,
            index: true,
            required: true
        },
        platform: {
            type: String,
            required: true
        },
        port: {
            type: String,
            required: true
        },
        totalmem: {
            type: String,
            required: true
        },
        date: {
            type: Number,
            default: () => {
                return Math.round(new Date() as any)
            }
        },
    }
)


export const hostModel = mongoose.model('host', HostSql);