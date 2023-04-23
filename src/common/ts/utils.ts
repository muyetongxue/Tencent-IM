/**
 * @author: caisheng.
 * @date: 2022/2/21
 * @description:公用方法
 */

import CONFIG from "../../initializeConfiguration.json";

declare interface UtilsInterface {
	name : string // 项目或主体机构名称
	weixinAppid : string //微信小程序appid
	baseURL : string //请求URL前缀
	getLocationParam : (url : string, name : string) => string  //获取url参数
	toast : (value : string) => void  //轻提示
	isPhone : (value : string) => boolean  //手机号校验
	isEmail : (value : string) => boolean  //Email校验
	isMoney : (value : string) => boolean //金额校验
	replaceIdCard : (value : string) => string  //身份证脱敏
	replaceNumber : (value : string) => string  //手机号脱敏
	toThousands : (num : string) => string  //每三位加逗号
	openMap : (name : string, address : string, longitude : number, latitude : number) => void  //地图定位配置
	getDistance : (latitude1 : number, longitude1 : number, latitude2 : number, longitude2 : number) => number //根据经纬度或者两点间距离
	queryParams : (data : object | any, isPrefix : boolean) => string  //对象转url参数格式
	debounce : (fn : () => Function, delay : number) => any //防抖函数 (一般用于input input事件 查询/校验,组件一次性调用等)
	throttle : (fn : () => Function, threshhold : number) => any //节流函数 (一般用于防止重复表单提交 接口请求等)
}

class Utils implements UtilsInterface {
	public name = CONFIG.NAME
	public weixinAppid = CONFIG.APPID['MP-WEIXIN']
	public baseURL = CONFIG.BASEURL
	public baseColor = CONFIG.BASECOLOR
	public getLocationParam = (url : string, name : string) : string => {
		const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i')
		const search = url.substring(url.indexOf('?'), url.length)
		const result = search.substring(1).match(reg)
		if (result !== null) return result[2]
		return ''
	}
	public toast = (value : string = '', duration : number = 1500) : void => {
		uni.showToast({
			title : value,
			icon : 'none',
			mask : true,
			duration : duration,
		}).then()
	}
	public isPhone = (value : string) : boolean => {
		return /^1[3-9]\d{9}$/.test(value)
	}
	public isEmail = (value : string) => {
		return /^\w+@[a-z\d]+\.[a-z]{2,4}$/.test(value)
	}
	public isMoney = (value : string) : boolean => {
		return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)
	}
	public replaceIdCard = (value : string) : string => {
		let str : string
		if (value && value.length === 15) {
			str = value.replace(value.slice(4, 11), '*******')
		} else if (value && value.length === 18) {
			str = value.replace(value.slice(4, 14), '**********')
		} else {
			str = value.replace(value.slice(1, value.length - 1), '*')
		}
		return str
	}
	public replaceNumber = (value : string) : string => {
		if (value) return value.replace(value.slice(3, 8), '****')
		return ''
	}
	public toThousands = (num : string) : string => {
		let result = '', counter = 0
		num = num || '0'
		for (let i = num.length - 1; i >= 0; i--) {
			counter++
			result = num.charAt(i) + result
			if (!(counter % 3) && i !== 0) result = ',' + result
		}
		return result
	}
	public openMap = (name : string, address : string, longitude : number, latitude : number) : void => {
		uni.openLocation({
			name : name,
			address : address,
			longitude : longitude,
			latitude : latitude,
			scale : 17,
			success : () => {
			},
			fail : err => {
				console.log(err)
			},
		})
	}
	public getDistance = (latitude1 : number, longitude1 : number, latitude2 : number, longitude2 : number) => {
		let radLat1 = latitude1 * Math.PI / 180.0
		let radLat2 = latitude2 * Math.PI / 180.0
		let a = radLat1 - radLat2
		let b = longitude1 * Math.PI / 180.0 - longitude2 * Math.PI / 180.0
		let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
		s = s * 6378.137
		s = Math.round(s * 100) / 100
		return s
	}
	public queryParams = (data : object | any, isPrefix : boolean = false) : string => {
		let prefix = isPrefix ? '?' : '', result = []
		for (let key in data) {
			let value = data[key]
			if (['', undefined, null].includes(value)) continue
			if (value.constructor === Array) {
				value.forEach(item => {
					result.push(key + '[]=' + item)
				})
			} else {
				result.push(key + '=' + value)
			}
		}
		return result.length ? prefix + result.join('&') : ''
	}
	public debounce = (fn : Function, delay : number = 500) : any => {
		let timer : any = null
		return function () {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				fn.apply(fn, arguments)
			}, delay)
		}
	}
	public throttle = (fn : Function, threshhold : number = 500) : any => {
		let timer : any = null
		return function () {
			if (timer) return
			timer = setTimeout(() => {
				fn.apply(fn, arguments)
				timer = null
			}, threshhold)
		}
	}
}

export default new Utils()
