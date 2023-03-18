/**
 * @author: caisheng.
 * @date: 2022/12/14
 * @description:请求封装
 */

import ajax from "uni-ajax";
import utils from "./utils";

let requestNum = 0
// @ts-ignore
ajax.defaults.retry = 5

declare interface Instance {
    instance : object | any
    post? : (url : string, data : object, header : boolean) => object
}

class Interceptors implements Instance {
    public readonly instance : object | any

    constructor() {
        this.instance = ajax.create()

        this.instance.interceptors.request.use(
            (config : any) => {
                requestNum++
                uni.showLoading({
                    title : '努力加载中',
                    mask : true,
                })
                return config
            },
            (error : any) => {
                return Promise.reject(error)
            }
        )

        this.instance.interceptors.response.use(
            (response : any) => {
                requestNum--
                if (requestNum <= 0) {
                    uni.hideLoading()
                } else {
                    uni.showLoading({
                        title : '努力加载中',
                        mask : true,
                    })
                }
                return response.data
            },
            (error : { config : any, statusCode : number, data : { msg : string } }) => {
                requestNum = 0
                uni.hideLoading()

                //token失效重新启动小程序
                if (error.statusCode === 401 || error.statusCode === 424) {
                    utils.toast('登录超时,请重新登录')
                    uni.clearStorageSync()
                    // @ts-ignore
                    uni.$TUIKit.logout(() => {
                    })
                    setTimeout(() => {
                        uni.reLaunch({
                            url : `/login/index`
                        })
                    }, 1500)
                    //请求失败尝试重连
                } else if (error.statusCode >= 500) {
                    //utils.toast(error.data.msg)
                    let config = error.config
                    if (!config || !config.retry) return Promise.reject(error)
                    config.__retryCount = config.__retryCount || 0
                    if (config.__retryCount >= config.retry) {
                        return Promise.reject(error)
                    }
                    config.__retryCount += 1
                    let backoff = new Promise((resolve : any) => {
                        setTimeout(() => {
                            resolve()
                        }, 500)
                    })
                    return backoff.then(() => {
                        return this.instance(config)
                    })
                }
            }
        )
    }
}

class Request extends Interceptors implements Instance {
    public post = (url : string, data : object, header : boolean = true) : any => {
        return new Promise((resolve, reject) => {
            this.instance({
                method : 'POST',
                timeout : 10000,
                baseURL : utils.baseURL,
                url : url,
                data : data,
                header : header ? {"Authorization" : `Bearer ${uni.getStorageSync("access_token")}`} : {"Content-Type" : "application/json"}
            }).then((response : any) => {
                resolve(response)
            }, (error : any) => {
                reject(error)
            }).catch((error : any) => {
                reject(error)
            })
        })
    }
}

const post : any = new Request().post

export {post}
