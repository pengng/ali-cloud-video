const crypto = require('crypto')
const querystring = require('querystring')
const https = require('https');
const fs = require('fs')
const OSS = require('ali-oss')

// 阿里云音视频点播API域名
const BASE_URL = 'https://vod.cn-shanghai.aliyuncs.com'

const AliCloudVideo = function (options) {
    // 定义默认配置
    this._options = {
        AccessKeyId: '', // 必填
        AccessKeySecret: '', // 必填
        Format: 'JSON',
        Version: '2017-03-21',
        SignatureMethod: 'HMAC-SHA1',
        SignatureVersion: '1.0'
    }

    // 弃用
    this.BASE_URL = BASE_URL

    // 传入的配置优先级高于默认
    Object.assign(this._options, options)

    // 检查默认为空的是否有填充
    let isPass = this.chkOpt(this._options)
    if (!isPass) {
        throw new Error('please check the params!')
    }

}

AliCloudVideo.prototype = {

    /**
     * 获取视频点播auth参数
     * @param  {string}   videoId  视频上传后得到的id
     * @param  {Function} callback 
     */
    getPlayAuth(videoId, callback) {
        if (typeof videoId !== 'string') {
            return callback(new TypeError('getPlayAuth() videoId must be a String'))
        } 

        let url = this.getUrl({Action: 'GetVideoPlayAuth', VideoId: videoId})
        this.request(url, callback)
    },

    // 获取视频播放链接
    getPlayAddress(options, callback) {
        let videoId = options.VideoId
        if (typeof videoId !== 'string') {
            return callback(new TypeError('getPlayAddress() VideoId must be a String'))
        }
        let newOptions = {
            Action: 'GetPlayInfo',
            VideoId: videoId
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['Formats', 'AuthTimeout']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    /**
     * 上传视频前先获取上传地址和上传凭证
     * @param  {object}   options  配置参数
     * @param  {Function} callback 
     */
    getUploadAuth(options, callback) {
        if (typeof options !== 'object') {
            return callback(new TypeError('getUploadAuth() first argument must be an Object'))
        }
        let title = 'new_video_' + Date.now()
        let newOptions = {
            Action: 'CreateUploadVideo',
            Title: options.Title || title,
            FileName: options.FileName || title + '.mp4'
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['FileSize', 'Description', 'CoverURL', 'CateId', 'Tags']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    /**
     * 上传视频凭证失效后需刷新凭证
     * @param  {string}   videoId  视频id
     * @param  {Function} callback 
     */
    refreshUploadAuth(videoId, callback) {
        if (typeof videoId !== 'string') {
            return callback(new TypeError('refreshUploadAuth() required a String videoId'))
        }

        let url = this.getUrl({Action: 'RefreshUploadVideo', VideoId: videoId})
        this.request(url, callback)
    },

    /**
     * 上传图片前先获取上传地址和上传凭证
     * @param  {string}   options  配置参数
     * @param  {Function} callback
     */
    getUploadImageAuth(options, callback) {
        if (typeof options !== 'object') {
            return callback(new TypeError('getUploadImageAuth first argument must be an Object'))
        }
        let newOptions = {
            Action: 'CreateUploadImage',
            ImageType: options.ImageType || 'cover'
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['ImageExt']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    uploadFile(options, callback) {
        let filePath = options.FilePath
        delete options.FilePath
        if (typeof filePath !== 'string') {
            return callback(new TypeError('uploadFile() FilePath must be a String'))
        }
        let progress = function () {}
        if (typeof options.progress === 'function') {
            progress = options.progress
            delete options.progress
        }
        fs.access(filePath, (err) => {
            if (err) {
                return callback(err)
            }
            this.getUploadAuth(options, function (err, result) {
                if (err) {
                    return callback(err)
                }
                let VideoId = result.VideoId
                let UploadAddress = result.UploadAddress
                let UploadAuth = result.UploadAuth
                let addressObj = null
                let authObj = null
                try {
                    addressObj = JSON.parse(Buffer.from(UploadAddress, 'base64'))
                    authObj = JSON.parse(Buffer.from(UploadAuth, 'base64'))
                } catch(err) {
                    return callback(err)
                }
                let config = {
                    accessKeyId: authObj.AccessKeyId,
                    accessKeySecret: authObj.AccessKeySecret,
                    endpoint: addressObj.Endpoint,
                    stsToken: authObj.SecurityToken,
                    bucket: addressObj.Bucket
                }
                let oss = new OSS.Wrapper(config)
                oss.multipartUpload(addressObj.FileName, filePath, {
                    progress: function (p) {
                        return function (done) {
                            progress(p)
                            done()
                        }
                    }
                }).then(result => {
                    callback(null, VideoId)
                }).catch(callback)
            })
        })
    },

    // 删除已上传的视频文件
    deleteFiles(idList, callback) {
        if (!(idList instanceof Array)) {
            return callback(new TypeError('deleteFile() first argument must be an Array'))
        }

        let url = this.getUrl({Action: 'DeleteVideo', VideoIds: idList.join(',')})
        this.request(url, callback)
    },

    // 获取单个视频信息
    getVideoInfo(videoId, callback) {
        if (typeof videoId !== 'string') {
            return callback(new TypeError('getVideoInfo() videoId must be a String'))
        }

        let url = this.getUrl({Action: 'GetVideoInfo', VideoId: videoId})
        this.request(url, callback)
    },

    // 获取视频信息列表
    getVideoList(options, callback) {
        let newOptions = {
            Action: 'GetVideoList'
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['Status', 'StartTime', 'EndTime', 'CateId', 'PageNo', 'PageSize', 'SortBy']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    // 更新视频信息
    updateVideoInfo(options, callback) {
        let videoId = options.VideoId
        if (typeof videoId !== 'string') {
            return callback(new TypeError('updateVideoInfo() VideoId must be a String'))
        }
        let newOptions = {
            Action: 'UpdateVideoInfo',
            VideoId: videoId
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['Title', 'Description', 'CoverURL', 'CateId', 'Tags']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    // 新增分类
    addCategory(options, callback) {
        let cateName = options.CateName
        if (typeof cateName !== 'string') {
            return callback(new TypeError('addCategory() CateName must be a String'))
        }
        let newOptions = {
            Action: 'AddCategory',
            CateName: cateName
        }
        this.copyFieldIfExists({
            target: newOptions,
            source: options,
            fields: ['ParentId']
        })
        let url = this.getUrl(newOptions)
        this.request(url, callback)
    },

    // 获取分类列表
    getCategories(opt, callback) {
        if (typeof opt !== 'object') {
            return callback(new TypeError('getCategories() first argument must be an Object'))
        }
        let newOpt = {
            Action: 'GetCategories'
        }
        this.copyFieldIfExists({
            target: newOpt,
            source: opt,
            fields: ['CateId', 'PageNo', 'PageSize']
        })
        let url = this.getUrl(newOpt)
        this.request(url, callback)
    },

    // 更新分类名称
    updateCategory(opt, callback) {
        let cateId = opt.CateId
        let cateName = opt.CateName
        if (!cateId) {
            return callback(new TypeError('updateCategory() CateId is empty'))
        }
        if (typeof cateName !== 'string') {
            return callback(new TypeError('updateCategory() CateName must be a String'))
        }
        let newOpt = {
            Action: 'UpdateCategory',
            CateId: cateId,
            CateName: cateName
        }
        let url = this.getUrl(newOpt)
        this.request(url, callback)
    },

    // 删除分类
    deleteCategory(cateId, callback) {
        if (!cateId) {
            return callback(new TypeError('deleteCategory() cateId is empty'))
        }
        let opt = {
            Action: 'DeleteCategory',
            CateId: cateId
        }
        let url = this.getUrl(opt)
        this.request(url, callback)
    },

    request(url, callback) {
        https.get(url, (res) => {
            let buf = []
            res.on('data', Array.prototype.push.bind(buf)).on('error', callback).on('end', () => {
                // http 报文主体
                let body = Buffer.concat(buf).toString()
                // 尝试解析JSON字符串
                try {
                    body = JSON.parse(body)
                } catch (err) {
                    return callback(err)
                }
                // 状态不是 200-299 则返回错误对象
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    let errMsg = typeof body === 'object' ? body.Message : body
                    return callback(new Error(errMsg))
                }
                callback(null, body)
            })
        }).on('error', callback)
    },

    copyFieldIfExists(options) {
        let fields = options.fields
        let target = options.target
        let source = options.source
        fields.forEach(function (field) {
            let value = source[field]
            if (typeof value === 'string') {
                target[field] = value
            }
        })
    },

    // 检查是否有漏填的选项
    chkOpt(opt) {
        return Object.keys(opt).every(key => opt[key])
    },

    // 弃用
    _checkOptions(options) {
        return this.chkOpt(options)
    },

    // 生成格式化时间字符串
    genTs() {
        return new Date().toISOString()
    },

    // 弃用
    _generateTimestamps() {
        return this.genTs()
    },

    // 生成随机字符串
    genNonce() {
        return Date.now() + '' + parseInt(Math.random() * 89999 + 10000)
    },

    // 弃用
    _generateNonce() {
        return this.genNonce()
    },

    /**
     * 传入配置，返回结合公共配置生成的对象
     * @param  {object} options 配置对象
     * @return {object}         新的配置对象
     */
    getOpt(opt) {
        return {
            ...this._options,
            ...opt,
            Timestamp: this.genTs(),
            SignatureNonce: this.genNonce()
        }
    },

    // 弃用
    _getOptions(options) {
        return this.getOpt(options)
    },

    /**
     * 传入配置对象，通过编码、排序、散列过程生成签名
     * @param  {object} opt 配置对象
     * @return {string}     签名字符串
     */
    genSign(opt) {

        // 返回编码和排序后的对象键值对数组
        let query = Object.keys(opt).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(opt[key])}`).sort()
        
        // 数组序列化
        let str2Sign = 'GET&%2F&' + encodeURIComponent(query.join('&'))

        // 散列算法
        let hashAlgo = 'sha1'
        // 散列密钥
        let key = this._options.AccessKeySecret + '&'
        // 带密钥散列后转成BASE64
        return crypto.createHmac(hashAlgo, key).update(str2Sign).digest('base64')
    },

    // 弃用
    _generateSignature(options) {
        return this.genSign(options)
    },

    // 生成最终访问url
    getUrl(opt) {
        let newOpt = this.getOpt(opt)
        newOpt.Signature = this.genSign(newOpt)

        return BASE_URL + '?' + querystring.stringify(newOpt)
    },

    // 弃用
    _getUrl(options) {
        return this.getUrl(options)
    }
}

module.exports = AliCloudVideo