import * as fs from 'fs-extra'
import * as  path from 'path'
import * as archiver from 'archiver';


export function dir_copy(src: string, dest: string) {
    return new Promise((resolve) => {
        fs.copy(src, dest,
            { filter: (filePath: string) => !filePath.includes('node_modules') },
            (err: Error): void => {
                resolve({ code: err ? 500 : 200, msg: err && err.message })
            }
        )
    })
}

export function dir_remove(dirPath: string) {
    const Files = fs.readdirSync(dirPath)
    Files.forEach((fileName) => {
        let item = `${dirPath}/${fileName}`
        if (fs.existsSync(item) && fileName != 'node_modules') fs.removeSync(item)
    })
}


export function emptyDir(src: string) {
    return new Promise((resolve) => {
        fs.emptyDir(src, (err: Error) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message })
        })
    })
}

export function BaleDirectory(src: string, dist: string, fileName: string) {
    return new Promise((resolve) => {

        // 创建一个文件以将归档数据流式传输到。
        const output = fs.createWriteStream(`${dist}/${fileName}`);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // 监听所有要写入的归档数据
        // 'close' 事件仅在涉及文件描述符时触发
        output.on('close', function () {
            resolve({ code: 200, msg: '指定目录压缩完毕' })
        });

        // 明确捕获此错误的好习惯
        archive.on('error', function (err: Error) {
            resolve({ code: 500, msg: err && err.message })
        });

        // 管道归档数据到文件
        archive.pipe(output);

        // 附加子目录中的文件，将其内容放在存档的根目录
        archive.directory(src, false);

        archive.finalize();
    })
}

