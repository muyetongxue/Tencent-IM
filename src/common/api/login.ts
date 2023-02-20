import {post} from "../ts/request";

//IM获取userSig
export const getUserSig = (params : object) => post(`/app/member/getUserSig`, params, false)

//音视频获取房间号
export const roomNo = (params : object) => post(`/tencentcloud/roomNo`, params, false)
