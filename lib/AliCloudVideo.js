var crypto = require('crypto')
var querystring = require('querystring')
var request = require('request-client')

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

    if (videoId === undefined) {
      return
    } 

    var url = this._getUrl({
      Action: 'GetVideoPlayAuth',
      VideoId: videoId
    })

    request(url, function (err, response, body) {

      if (err) {
        callback && callback(err)
        return
      }

      callback && callback(null, JSON.parse(body))
    })
    
  },

  /**
   * 上传视频前先获取上传地址和上传凭证
   * @param  {object}   options  配置参数
   * @param  {Function} callback 
   */
  getUploadAuth: function (options, callback) {

    var filename = 'new_video_' + Date.now()

    var defaultOptions = {
      Title: filename,
      FileName: filename + '.mp4',
      FileSize: '',
      Action: 'CreateUploadVideo'
    }

    var newOptions = Object.assign(defaultOptions, options)

    var url = this._getUrl(newOptions)

    request(url, function (err, response, body) {
      
      if (err) {
        callback && callback(err)
        return
      }

      try {
        body = JSON.parse(body)
      } catch (err) {

      }

      callback && callback(null, body)
    })

  },

  /**
   * 上传视频凭证失效后需刷新凭证
   * @param  {string}   videoId  视频id
   * @param  {Function} callback 
   */
  refreshUploadAuth: function (videoId, callback) {
    
    if (videoId === undefined) {
      return
    }

    var url = this._getUrl({
      Action: 'RefreshUploadVideo',
      VideoId: videoId
    })

    request(url, function (err, response, body) {

      if (err) {
        callback && callback(err)
        return
      }

      try {
        body = JSON.parse(body)
      } catch (err) {

      }

      callback && callback(null, body)
    })

  },

  /**
   * 上传图片前先获取上传地址和上传凭证
   * @param  {string}   options  配置参数
   * @param  {Function} callback
   */
  getUploadImageAuth: function (options, callback) {
    
    var defaultOptions = {
      Action: 'CreateUploadImage',
      ImageType: 'cover'
    }

    var newOptions = Object.assign(defaultOptions, options)

    var url = this._getUrl(newOptions)

    request(url, function (err, response, body) {
      
      if (err) {
        callback && callback(err)
        return
      }

      try {
        body = JSON.parse(body)
      } catch (err) {

      }

      callback && callback(null, body)
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