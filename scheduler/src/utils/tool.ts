/**
 * @description: 
 * @param {*} len // 长度
 * @param {*} radix // 基数
 * @return {*} UUID
 */
 export function uuid(len: number, radix: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    let i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}


export function renderSize(value: any) {
    if (null == value || value == '') {
        return "0 B";
    }
    const unitArr: string[] = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let index = 0;
    const srcsize: number = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size: any = srcsize / Math.pow(1024, index);
    size = size.toFixed(2); //保留的小数位数
    return size + unitArr[index];
}

/* 
格式化毫秒
*/
export const formatDuring = (t: number) => {
    const HOUR = 1000 * 60 * 60;
    const d = Math.floor(t / (HOUR * 24));
    const h = Math.floor((t % (HOUR * 24)) / (HOUR));
    const m = Math.floor((t % (HOUR)) / (1000 * 60));
    const s = Math.floor((t % (1000 * 60)) / 1000);

    let text = '';
    d && (text += `${d}天`);
    h && (text += `${h}小时`);
    m && (text += `${m}分`);
    s && (text += `${s}秒`);


    return text || '1秒';
};
/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
 export function formatSeconds(date: number): string {
    let theTime: number = Math.round(date); // 需要转换的时间秒
    let theTime1 = 0; // 分
    let theTime2 = 0; // 小时
    let theTime3 = 0; // 天
    if (theTime > 60) {
        theTime1 = Math.round(theTime / 60);
        theTime = Math.round(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = Math.round(theTime1 / 60);
            theTime1 = Math.round(theTime1 % 60);
            if (theTime2 > 24) {
                //大于24小时
                theTime3 = Math.round(theTime2 / 24);
                theTime2 = Math.round(theTime2 % 24);
            }
        }
    }
    let result = "";
    if (theTime > 0) {
        result = "" + Math.round(theTime) + "秒";
    }
    if (theTime1 > 0) {
        result = "" + Math.round(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + Math.round(theTime2) + "小时" + result;
    }
    if (theTime3 > 0) {
        result = "" + Math.round(theTime3) + "天" + result;
    }
    return result;
}


export function dateFormat(fmt: string, date: Date | number) {
    interface dateType {
        "Y+": string, "m+": string, "d+": string, "H+": string, "M+": string, "S+": string
    }
    let ret
    date = new Date(date)
    const opt: dateType = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (const k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt)
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k as keyof dateType] : opt[k as keyof dateType].padStart(ret[1].length, "0")
            )
        }
    }
    return fmt
}



export function Percentage(num: number, total: number): number {
    if (num == 0 || total == 0) {
        return 0;
    }
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
}