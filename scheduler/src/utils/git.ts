import git from 'simple-git'


export function Clone({ repoPath, branch, localPath }) {
    return new Promise((resolve) => {
        // 转义字符替换
        // if (user.includes('@')) {
        //     user = user.replace(/@/g, '%40')
        // }
        // if (repoPath.includes('https://')) {
        //     repoPath = repoPath.replace('https://', `https://${user}:${pwd}@`)
        // } else if (repoPath.includes('http://')) {
        //     repoPath = repoPath.replace('http://', `http://${user}:${pwd}@`)
        // } else {
        //     resolve({ code: 500, msg: 'git地址不合法', data: null })
        // }

        git().clone(repoPath, localPath, ['-b', branch], (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}

// 查询本地分支
export function localBranch(localPath: string) {
    return new Promise((resolve) => {
        git(localPath).branchLocal((err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}
// 查询远程分支
export function originBranch(localPath: string) {
    return new Promise((resolve) => {
        git(localPath).branch(['-r'], (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}



// 当前分支版本列表
export function localVersion(localPath) {
    return new Promise((resolve) => {
        git(localPath).log([], (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}

// 当前分支版本列表
export async function pull(localPath: string) {
    return new Promise((resolve) => {
        git(localPath).pull((err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}




export function checkout(localPath, branch) {
    return new Promise((resolve) => {
        git(localPath).checkout(branch, (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}

// 检出远程分支
export function checkoutOrigin(localPath: string, branch: string) {
    let local = branch.replace('origin/', '')
    return new Promise((resolve) => {
        git(localPath).checkout(['-b', local, branch], (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}

// 删除本地分支
export function deleteBranch(localPath: string, branch: string) {
    return new Promise((resolve) => {
        git(localPath).branch(['-D', branch], (err, data) => {
            resolve({ code: err ? 500 : 200, msg: err && err.message, data })
        })
    })
}
