/**
 * @author: caisheng.
 * @date: 2022/2/21
 * @description:身份证号完整校验
 */

declare interface ValidateIdCardInterface {
    validateIdCard : (idcard : string) => boolean  //身份证校验
    getAnalysisIdCard : (idcard : string, type : string) => string | any  //获取身份证信息 '1':出生日期 '2':性别 '3':年龄
}

class ValidateIdCard implements ValidateIdCardInterface {
    public validateIdCard = (idcard : string) => {
        if (!idcard) return false
        if (this.isCardNo(idcard) === false) return false
        if (this.checkProvince(idcard) === false) return false
        if (this.checkBirthday(idcard) === false) return false
        if (this.checkParity(idcard) === false) return false
        return true
    }

    public getAnalysisIdCard = (idcard : string, type : string) => {
        let cardid = idcard
        if (idcard.length === 15) cardid = this.changeFivteenToEighteen(idcard)
        if (type === '1') {
            return `${cardid.substring(6, 10)}-${cardid.substring(10, 12)}-${cardid.substring(12, 14)}`
        }
        if (type === '2') {
            if (parseInt(cardid.substr(16, 1)) % 2 === 1) return '男'
            return '女'
        }
        if (type === '3') {
            let myDate = new Date()
            let month = myDate.getMonth() + 1
            let day = myDate.getDate()
            let age = myDate.getFullYear() - parseInt(cardid.substring(6, 10)) - 1
            if (parseInt(cardid.substring(10, 12)) < month || parseInt(cardid.substring(10, 12)) === month && parseInt(cardid.substring(12, 14)) <= day) age++
            return age
        }
    }

    private isCardNo = (idcard : string) => {
        let reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
        if (reg.test(idcard) === false) return false
        return true
    }

    private checkProvince = (idcard : string) => {
        const province = parseInt(String(idcard).substr(0, 2))
        const vcity : { [k : number] : string } = {
            11 : "北京", 12 : "天津", 13 : "河北", 14 : "山西", 15 : "内蒙古",
            21 : "辽宁", 22 : "吉林", 23 : "黑龙江", 31 : "上海", 32 : "江苏",
            33 : "浙江", 34 : "安徽", 35 : "福建", 36 : "江西", 37 : "山东", 41 : "河南",
            42 : "湖北", 43 : "湖南", 44 : "广东", 45 : "广西", 46 : "海南", 50 : "重庆",
            51 : "四川", 52 : "贵州", 53 : "云南", 54 : "西藏", 61 : "陕西", 62 : "甘肃",
            63 : "青海", 64 : "宁夏", 65 : "新疆", 71 : "台湾", 81 : "香港", 82 : "澳门", 91 : "国外"
        }
        if (vcity[province] === undefined) return false
        return true
    }

    private checkBirthday = (idcard : string) => {
        const length = idcard.length
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if (length === 15) {
            const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
            const arr_data = idcard.match(re_fifteen)!
            const year = arr_data[2]
            const month = arr_data[3]
            const day = arr_data[4]
            const birthday = '19' + year + '/' + month + '/' + day
            return this.verifyBirthday('19' + year, month, day, birthday)
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if (length === 18) {
            const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
            const arr_data = idcard.match(re_eighteen)!
            const year = arr_data[2]
            const month = arr_data[3]
            const day = arr_data[4]
            const birthday = year + '/' + month + '/' + day
            return this.verifyBirthday(year, month, day, birthday)
        }
        return false
    }

    private verifyBirthday = (year : string, month : string, day : string, birthday : string) => {
        const birth_day = new Date(birthday)
        const now_year = new Date().getFullYear()
        //年月日是否合理
        if (birth_day.getFullYear() === parseInt(year) && (birth_day.getMonth() + 1) === parseInt(month) && birth_day.getDate() === parseInt(day)) {
            //判断年份的范围（0岁到100岁之间)
            let time = now_year - parseInt(year)
            if (time >= 0 && time <= 100) return true
            return false
        }
        return false
    }

    private checkParity = (idcard : string) => {
        idcard = this.changeFivteenToEighteen(idcard)
        const len = idcard.length
        if (len === 18) {
            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
            let cardTemp = 0, i, valnum
            for (i = 0; i < 17; i++) {
                cardTemp += parseInt(idcard.substr(i, 1)) * arrInt[i]
            }
            valnum = arrCh[cardTemp % 11]
            if (valnum === idcard.substr(17, 1).toLocaleUpperCase()) return true
            return false
        }
        return false
    }

    private changeFivteenToEighteen = (idcard : string) => {
        if (idcard.length === 15) {
            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
            let cardTemp = 0, i
            idcard = idcard.substr(0, 6) + '19' + idcard.substr(6, idcard.length - 6)
            for (i = 0; i < 17; i++) {
                cardTemp += parseInt(idcard.substr(i, 1)) * arrInt[i]
            }
            idcard += arrCh[cardTemp % 11]
            return idcard
        }
        return idcard
    }
}

export default new ValidateIdCard()
