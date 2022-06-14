import PackageConfig from '@/config'
const mongoose = require('mongoose')

const db = mongoose.connection;

export async function link() {
    let { user, password, host, port, database } = PackageConfig.client
    mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${database}`, function () {
        console.log('数据库链接成功');
    });
    db.on('error', console.error.bind(console, 'connection error:'));
}


