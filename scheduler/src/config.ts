import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as NodeRSA from 'node-rsa'
import { uuid } from './utils/tool';
import { memberModel } from './members/members.sql';
import { _findOne, _save } from './utils/sql';
const key = new NodeRSA({ b: 1024 });
const package_ci = path.join(os.userInfo().homedir, 'package-ci-lib')
const pubkey_path = path.join(package_ci, 'rsa_public_key_1024.txt')
const prikey_path = path.join(package_ci, 'rsa_private_key_1024.txt')
const static_path = path.join(package_ci, 'static')
const token = 'package-ci'
const client = {
    // host
    host: 'IP地址',
    // 端口号
    port: '27017',
    // 用户名
    user: '账号',
    // 密码
    password: '密码!',
    // 数据库名
    database: 'construct',
}

async function adminInit() {
    let user = {
        name: '超级用户',
        pwd: 'admin',
        access: '1',
        account: 'admin',
        jobName: "系统初始化管理员",
        remark: "这是系统初始化管理员，记得修改密码哦。",
        job_id: uuid(16, 32)
    }
    const isRepeatRes: any = await _findOne(memberModel, { account: user.account })
    if (isRepeatRes.code != 200 || !isRepeatRes.data) {
        const sql = new memberModel(user)
        await _save(sql)
    }
}

function sign() {
    // 读取公钥
    const publicKey = fs.readFileSync(pubkey_path, 'utf-8');
    // 公钥加密
    const nodersa = new NodeRSA(publicKey);
    return nodersa.encrypt(token, 'base64');
}

function staticInit() {
    // 判断配置目录是否存在，不存在则创建
    fs.ensureDirSync(package_ci)
    // 判断静态资源目录是否存在，不存在则创建
    fs.ensureDirSync(static_path)
}

function keyInit() {
    // 判断配置目录是否存在，不存在则创建
    fs.ensureDirSync(package_ci)

    /* 公钥文件是否存在 */
    const isPubkey = fs.existsSync(pubkey_path)

    /* 公钥文件是否存在 */
    const isPrikey = fs.existsSync(prikey_path)

    // 秘钥缺失，重新创建秘钥
    if (!isPubkey || !isPrikey) {
        // 创建公钥
        var pubkey = key.exportKey('pkcs8-public');
        // 创建私钥
        var prikey = key.exportKey('pkcs8-private');
        // 写入公钥
        fs.outputFileSync(pubkey_path, pubkey)
        // 写入私钥
        fs.outputFileSync(prikey_path, prikey)
    }
}


export default {
    keyInit,
    staticInit,
    adminInit,
    sign,
    package_ci,
    pubkey_path,
    prikey_path,
    static_path,
    process_port: 9001,
    client
}