import * as fs from 'fs-extra';

export function dir_remove(dirPath: string, exclude: string = 'node_modules') {
    const Files = fs.readdirSync(dirPath)
    Files.forEach((fileName) => {
        let item = `${dirPath}/${fileName}`
        if (fs.existsSync(item) && fileName != exclude) fs.removeSync(item)
    })
}

export function emptyDir(src: string) {
    return new Promise((resolve) => {
        fs.emptyDir(src, (err: Error) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message })
        })
    })
}