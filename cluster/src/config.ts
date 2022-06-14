import * as os from 'os'
import * as fs from 'fs-extra';
import * as path from 'path';
import * as NodeRSA from 'node-rsa'
const package_ci = path.join(os.userInfo().homedir, 'package-ci-static')
const prikey_path = path.join(package_ci, 'rsa_private_key_1024.txt')
const package_server = path.join(package_ci, 'server.js')
const token = 'package-ci'


function sign(text: string) {
    // 找不到私钥直接中断流程
    if (!fs.existsSync(prikey_path) || !text) return false
    // 读取私钥
    const privateKey = fs.readFileSync(prikey_path);
    // 解密
    const nodersa = new NodeRSA(privateKey);
    return token === nodersa.decrypt(text, 'utf8');
}

function init() {
    // 判断资源目录是否存在，不存在则创建
    fs.ensureDirSync(package_ci)
    /* 
    读取服务文件
    该文件源码为koa实现由ncc编译，主要功能为托管web静态资源。
    */
    let server = fs.readFileSync(path.join(__dirname, '../process/index.js'), 'utf-8')

    // 将服务文件内容写入资源目录
    fs.writeFileSync(package_server, server)
}

export default {
    package_ci,
    package_server,
    init,
    sign
}

