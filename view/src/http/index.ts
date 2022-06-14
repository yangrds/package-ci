/**
 * @description 网络请求框架封装
 */
import Axios from 'axios'
import QS from 'qs'

Axios.defaults.baseURL = '/'

// TODO 设置超时时间
Axios.defaults.timeout = 100000

Axios.defaults.headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
} as any

// TODO http code 校验
Axios.defaults.validateStatus = function (status: number) {
    return !!status
}

// TODO GET 请求 params 序列化
Axios.defaults.paramsSerializer = function (params: any) {
    return QS.stringify(params)
}


// TODO 设置POST等请求 body 序列化
Axios.defaults.transformRequest = [function (body: any) {
    const data = body || {}
    if (body instanceof window.FormData) {
        return body
    }

    return JSON.stringify(data)
}]

/**
 * @description 统一 GET 请求
 * @param url
 * @param params --> GET 请求参数（***?name=walid&age=25）
 */
export function get({ url, params = {}, option }: any) {
    if (option) {
        for (const property in option) {
            Axios.defaults[property] = option[property]
        }
    }
    return new Promise((resolve, reject) => {
        Axios.get(url, { params: params })
            .then((response: any) => {
                resolve(response.data)
            })
            .catch((error: any) => {
                reject(error)
            })
    })
}

interface POST {
    url: string; body?: any; params?: any; option?: any; onUploadProgress?: any;
}

/**
 * @description 统一 POST 请求
 * @param url
 * @param body --> POST 请求 data
 */
export function post({ url, body = {}, params = {}, option, onUploadProgress }: POST) {
    if (option) {
        for (const property in option) {
            Axios.defaults[property] = option[property]
        }
    }
    return new Promise((resolve, reject) => {
        Axios.post(url, body, {
            params,
            onUploadProgress: onUploadProgress,
            timeout: 35000000
        })
            .then((response: any) => {
                resolve(response.data)
            })
            .catch((error: any) => {
                reject(error)
            })
    })
}

