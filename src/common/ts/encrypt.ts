/**
 * @author: caisheng.
 * @date: 2022/2/21
 * @description:加密封装
 */

import moment from "moment"
import cryptoJS from 'crypto-js'

declare interface EncryptInterface {
    base64 : (data : string) => string  //base64加密
    decryptByAES : (text : any) => string  //AES解密
    encryptByDES : () => string //DES加密
}

class Encrypt implements EncryptInterface {
    private readonly aesIv : string | any
    private readonly desIv : string | any

    constructor(aesIvStr : string, desIvStr : string) {
        this.aesIv = cryptoJS.enc.Utf8.parse(aesIvStr)
        this.desIv = cryptoJS.enc.Utf8.parse(desIvStr)
    }

    public base64 = (data : string) : string => {
        let wordArray = cryptoJS.enc.Utf8.parse(data)
        return cryptoJS.enc.Base64.stringify(wordArray)
    }
    public decryptByAES = (text : string) : string => {
        const ciphertext = cryptoJS.enc.Base64.parse(text.replace(/\s|\r|\n/g, '')).toString()
        const decrypted = cryptoJS.AES.decrypt(ciphertext as string, this.aesIv, {
            iv : this.aesIv,
            mode : cryptoJS.mode.CBC,
        })
        return decrypted.toString(cryptoJS.enc.Utf8)
    }
    public encryptByDES = () : string => {
        const encrypted = cryptoJS.DES.encrypt(moment().format('YYYY-MM-DD hh:mm:ss'), this.desIv, {
            iv : this.desIv,
            mode : cryptoJS.mode.CTR,
            //padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    }
}

export default new Encrypt('hnwxhnwxhnwxhnwx', 'bluestar')
