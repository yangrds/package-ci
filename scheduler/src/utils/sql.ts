
export interface ModelResult { code: number; data: any; msg: string }

// 保存数据
export function _save(sql) {
    return new Promise((resolve) => {
        sql.save((err: any) => {
            if (!err) {
                resolve({
                    code: 200
                })
            } else {
                resolve({
                    code: 500,
                    err,
                    msg: err.message
                })
            }
        })
    })
}

// 查询数据
export function _find({ sql, params = {}, sort = {}, limit = 0, skip = 0 }): Promise<ModelResult> {
    if (skip > 0) {
        skip = (skip - 1) * limit
    }
    return new Promise((resolve) => {
        sql.find(params, (err, data) => {
            if (!err) {
                resolve({ code: 200, data, msg: '' })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        }).sort(sort).limit(limit).skip(skip)
    })
}

// 查询数据（首条）
export function _findOne(sql, params): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.findOne(params, (err, data) => {
            if (!err) {
                resolve({ code: 200, data, msg: '' })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })

}

// 删除数据
export function _remove(sql, params): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.deleteOne(params, (err, data) => {
            if (!err) {
                resolve({ code: 200, data, msg: '' })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })
}

// 修改数据（批量）
export function _deleteMany(sql, params): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.deleteMany(params, (err, data) => {
            if (!err) {
                resolve({ code: 200, data, msg: '' })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })
}



// 修改数据（批量）
export function _updateMany(sql, params, Primarykey): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.updateMany(Primarykey, params, (err, data) => {
            if (!err) {
                resolve({
                    code: 200,
                    data,
                    msg: (data.modifiedCount ? '修改成功' : '修改失败') + ` 更新记录${data.modifiedCount}条`,
                })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })
}


// 更新数据
export function _updateOne(sql, params, Primarykey): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.updateOne(Primarykey, params, (err, data) => {
            if (!err) {
                resolve({
                    code: 200,
                    data,
                    msg: (data.modifiedCount ? '修改成功' : '修改失败') + ` 更新记录${data.modifiedCount}条`,
                })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })
}


/**
 * @description: 查询记录数
 * @param {*} sql 数据模型
 * @param {*} params 查询条件
 * @return {*} 数据记录数量
 */
export function _findCount(sql, params = {}): Promise<ModelResult> {
    return new Promise((resolve) => {
        sql.countDocuments(params, (err, data) => {
            if (!err) {
                resolve({ code: 200, data, msg: '' })
            } else {
                resolve({ code: 500, data: null, msg: err.message })
            }
        })
    })
}

