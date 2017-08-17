var OSS = require('ali-oss')
var crypto = require('crypto')
var querystring = require('querystring')
var request = require('request-client')
var fs = require('fs')

var AliCloudVideo = function (options) {
  
  // 定义默认配置
  this._options = {
    AccessKeyId: '', // 必填
    AccessKeySecret: '', // 必填
    Format: 'JSON',
    Version: '2017-03-21',
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0'
  }

  this.BASE_URL = 'https://vod.cn-shanghai.aliyuncs.com'

  // 传入的配置优先级高于默认
  Object.assign(this._options, options)

  // 检查默认为空的是否有填充
  var isPass = this._checkOptions(this._options)
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
  getPlayAuth: function (videoId, callback) {
    if (typeof videoId !== 'string') {
      return callback(new TypeError('getPlayAuth() first argument must be a String'))
    } 
    var url = this._getUrl({
      Action: 'GetVideoPlayAuth',
      VideoId: videoId
    })
    this.request(url, callback)
  },

  getPlayAddress: function (options, callback) {
    var videoId = options.VideoId
    if (typeof videoId !== 'string') {
      return callback(new TypeError('getPlayAddress() VideoId must be a String'))
    }
    var newOptions = {
      Action: 'GetPlayInfo',
      VideoId: videoId
    }
    this.copyFieldIfExists({
      target: newOptions,
      source: options,
      fields: ['Formats', 'AuthTimeout']
    })
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  /**
   * 上传视频前先获取上传地址和上传凭证
   * @param  {object}   options  配置参数
   * @param  {Function} callback 
   */
  getUploadAuth: function (options, callback) {
    if (typeof options !== 'object') {
      return callback(new TypeError('getUploadAuth() first argument must be an Object'))
    }
    var title = 'new_video_' + Date.now()
    var newOptions = {
      Action: 'CreateUploadVideo',
      Title: options.Title || title,
      FileName: options.FileName || title + '.mp4'
    }
    this.copyFieldIfExists({
      target: newOptions,
      source: options,
      fields: ['FileSize', 'Description', 'CoverURL', 'CateId', 'Tags']
    })
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  /**
   * 上传视频凭证失效后需刷新凭证
   * @param  {string}   videoId  视频id
   * @param  {Function} callback 
   */
  refreshUploadAuth: function (videoId, callback) {
    if (typeof videoId !== 'string') {
      return callback(new TypeError('refreshUploadAuth() required a String videoId'))
    }
    var url = this._getUrl({
      Action: 'RefreshUploadVideo',
      VideoId: videoId
    })
    this.request(url, callback)
  },

  /**
   * 上传图片前先获取上传地址和上传凭证
   * @param  {string}   options  配置参数
   * @param  {Function} callback
   */
  getUploadImageAuth: function (options, callback) {
    if (typeof options !== 'object') {
      return callback(new TypeError('getUploadImageAuth first argument must be an Object'))
    }
    var newOptions = {
      Action: 'CreateUploadImage',
      ImageType: options.ImageType || 'cover'
    }
    this.copyFieldIfExists({
      target: newOptions,
      source: options,
      fields: ['ImageExt']
    })
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  uploadFile: function (options, callback) {
    var filePath = options.FilePath
    delete options.FilePath
    if (typeof filePath !== 'string') {
      return callback(new TypeError('uploadFile() FilePath must be a String'))
    }
    var progress = function () {}
    if (typeof options.progress === 'function') {
      progress = options.progress
      delete options.progress
    }
    var that = this
    fs.access(filePath, function (err) {
      if (err) {
        return callback(err)
      }
      that.getUploadAuth(options, function (err, result) {
        if (err) {
          return callback(err)
        }
        var VideoId = result.VideoId
        var UploadAddress = result.UploadAddress
        var UploadAuth = result.UploadAuth
        var addressObj = null
        var authObj = null
        try {
          addressObj = JSON.parse(Buffer.from(UploadAddress, 'base64'))
          authObj = JSON.parse(Buffer.from(UploadAuth, 'base64'))
        } catch(err) {
          return callback(err)
        }
        var config = {
          accessKeyId: authObj.AccessKeyId,
          accessKeySecret: authObj.AccessKeySecret,
          endpoint: addressObj.Endpoint,
          stsToken: authObj.SecurityToken,
          bucket: addressObj.Bucket
        }
        var oss = new OSS.Wrapper(config)
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

  deleteFiles: function (videos, callback) {
    if (!(videos instanceof Array)) {
      return callback(new TypeError('deleteFile() first argument must be an Array'))
    }
    var newOptions = {
      Action: 'DeleteVideo',
      VideoIds: videos.join(',')
    }
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  getVideoInfo: function (videoId, callback) {
    if (typeof videoId !== 'string') {
      return callback(new TypeError('getVideoInfo() first argument must be a String'))
    }
    var newOptions = {
      Action: 'GetVideoInfo',
      VideoId: videoId
    }
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  getVideoList: function (options, callback) {
    var newOptions = {
      Action: 'GetVideoList'
    }
    this.copyFieldIfExists({
      target: newOptions,
      source: options,
      fields: ['Status', 'StartTime', 'EndTime', 'CateId', 'PageNo', 'PageSize', 'SortBy']
    })
    var url = this._getUrl(newOptions)
    this.request(url, callback)
  },

  request: function (url, callback) {
    var that = this
    request(url, function (err, response, body) {
      if (err) {
        return callback(err)
      }
      if (that._options.Format === 'XML') {
        return callback(null, body)
      }
      try {
        body = JSON.parse(body)
      } catch (err) {
        return callback(err)
      }
      if (body.Message) {
        return callback(new Error(body.Message))
      }
      callback(null, body)
    })
  },

  copyFieldIfExists: function (options) {
    var fields = options.fields
    var target = options.target
    var source = options.source
    fields.forEach(function (field) {
      var value = source[field]
      if (typeof value === 'string') {
        target[field] = value
      }
    })
  },

  // 检查是否有漏填的选项
  _checkOptions: function (options) {

    options = options || this._options
    for (let key in options) {
      if (!options[key]) {
        return false
      }
    }
    return true
  },

  /**
   * 生成格式化时间字符串
   * @return {string} 格式化时间
   */
  _generateTimestamps: function () {
    return new Date().toISOString()
  },

  /**
   * 生成随机字符串
   * @return {string} 随机字符串
   */
  _generateNonce: function () {
    return Date.now() + '' + parseInt(Math.random() * 10000)
  },

  /**
   * 传入配置，返回结合公共配置生成的对象
   * @param  {object} options 配置对象
   * @return {object}         新的配置对象
   */
  _getOptions: function (options) {
    var newOptions = Object.assign({}, this._options, options)
    newOptions.Timestamp = this._generateTimestamps()
    newOptions.SignatureNonce = this._generateNonce()
    return newOptions
  },

  /**
   * 传入配置对象，通过编码、排序、加密过程生成signature
   * @param  {object} options 配置对象
   * @return {string}         signature
   */
  _generateSignature: function (options) {

    var query = []

    for (var key in options) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
    }

    query.sort()

    var str = query.join('&')

    var stringToSign = 'GET&%2F&' + encodeURIComponent(str)

    var signature = crypto
      .createHmac('sha1', this._options.AccessKeySecret + '&')
      .update(stringToSign)
      .digest('base64')

    return signature
  },

  /**
   * 生成最终访问url
   * @param  {object} options 配置对象
   * @return {string}         最终访问url
   */
  _getUrl: function (options) {

    var newOptions = this._getOptions(options)

    newOptions.Signature = this._generateSignature(newOptions)

    return this.BASE_URL + '?' + querystring.stringify(newOptions)
  }

}

module.exports = AliCloudVideo