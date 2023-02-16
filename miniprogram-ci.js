const ci = require('miniprogram-ci');
const path = require('process');
const manifest = require("./src/manifest.json");

const project = new ci.Project({
	appid: manifest['mp-weixin'].appid,
	type: 'miniProgram',
	projectPath: `${path.cwd()}/dist/build/mp-weixin`,
	privateKeyPath: `${path.cwd()}/private.wx.key`,
	ignores: ['node_modules/**/*'],
})

ci.upload({
	project,
	version: manifest.versionName,
	desc: manifest.description,
	setting: manifest['mp-weixin'].setting,
	onProgressUpdate: console.log,
}).then(() => {
	console.log(`发布完成`)
}).catch(() => {
	console.log('发布失败')
})
