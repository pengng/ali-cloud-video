var assert = require('assert')
var AliCloudVideo = require('../lib/sdk')

describe('test sdk.js', function () {
  describe('test getUploadAuth()', function () {
    
    it('test getUploadAuth()', function () {
      var client = new AliCloudVideo({
        AccessKeyId: ' ',
        AccessKeySecret: ' '
      })
      client._getUrl = function (options) {
        assert.equal(options.Action, 'CreateUploadVideo')
        assert.ok(options.Title)
        assert.ok(options.FileName)
        assert.ok(options.FileSize)
        return ''
      }
      client.getUploadAuth({
        FileSize: '1000'
      })
    })
    it('test getUploadAuth() if not params', function () {
      var client = new AliCloudVideo({
        AccessKeyId: ' ',
        AccessKeySecret: ' '
      })
      assert.throws(client.getUploadAuth, TypeError)
    })
    it('test getUploadAuth() if AccessKeyId wrong', function (done) {
      var client = new AliCloudVideo({
        AccessKeyId: 'wrong!',
        AccessKeySecret: 'wrong!'
      })
      client.getUploadAuth({}, function (err) {
        assert(err instanceof Error)
        done()
      })
    })
  })
  describe('test uploadFile()', function () {
    it('if FilePath is empty', function () {
      var client = new AliCloudVideo({
        AccessKeyId: 'wrong!',
        AccessKeySecret: 'wrong!'
      })
      assert.throws(client.uploadFile, TypeError)
    })
    it('if FilePath is wrong', function () {
      var client = new AliCloudVideo({
        AccessKeyId: 'wrong!',
        AccessKeySecret: 'wrong!'
      })
      client.uploadFile({
        FilePath: 'wrong'
      }, function (err) {
        assert(err instanceof Error)
      })
    })
  })
})