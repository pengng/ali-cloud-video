const path = require('path')
const assert = require('assert')
const conf = require('./config')
const AliCloudVideo = require('../index')
const ali = new AliCloudVideo(conf)

describe('test sdk.js', function () {
    let videoId = ''
    let videoId2 = ''
    let uploadAuth = ''
    let uploadAddress = ''
    let opt = {
        Title: 'title',
        FileName: 'test.mp4',
        FileSize: 1024,
        Description: 'description',
        CoverUrl: 'https://domain.com/cover.png',
        Tags: 'cate1'
    }

    it('上传视频文件', function (done) {
        let opt = {
            FilePath: path.resolve(__dirname, 'test.mp4'),
            progress: p => {
                assert(typeof p === 'number' && p >= 0 && p <= 1, '进度值有误')
            }
        }
        ali.uploadFile(opt, (err, videoId) => {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof videoId === 'string', 'videoId 应当为字符串')
            videoId2 = videoId
            done()
        })
    })

    it('获取上传凭证', function (done) {
        ali.getUploadAuth(opt, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(typeof result.VideoId === 'string', 'VideoId 应该为字符串')
            assert(typeof result.UploadAuth === 'string', 'UploadAuth 应该为字符串')
            assert(typeof result.UploadAddress === 'string', 'UploadAuth 应该为字符串')
            videoId = result.VideoId
            uploadAuth = result.UploadAuth
            uploadAddress = result.UploadAddress
            done()
        })
    })

    it('刷新上传凭证', function (done) {
        ali.refreshUploadAuth(videoId, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(result.VideoId === videoId, '刷新后 videoId 应当不变')
            assert(typeof result.UploadAuth === 'string', 'uploadAuth 应该为字符串')
            assert(typeof result.UploadAddress === 'string', 'uploadAddress 应该为字符串')
            videoId = result.VideoId
            done()
        })
    })

    it('获取视频信息', function (done) {
        ali.getVideoInfo(videoId, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(typeof result.Video === 'object', 'Video 属性应该为对象')
            let { VideoId, Description, Title, Size, Tags } = result.Video
            assert(VideoId === videoId, '返回的 VideoId 不正确')
            assert(Description === opt.Description, '返回的 Description 不正确')
            assert(Title === opt.Title, '返回的 Title 不正确')
            assert(Size === opt.Size, '返回的 Size 不正确')
            assert(Tags === opt.Tags, '返回的 Tags 不正确')
            done()
        })
    })

    it('更新视频信息', function (done) {
        opt = {
            VideoId: videoId,
            Title: 'updated title',
            Description: 'updated description',
            CoverURL: 'updated coverURL',
            Tags: 'updated tags'
        }
        ali.updateVideoInfo(opt, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            done()
        })
    })

    it('更新视频信息是否成功', function (done) {
        ali.getVideoInfo(videoId, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(typeof result.Video === 'object', 'Video 属性应该为对象')
            let { VideoId, Description, Title, Size, Tags } = result.Video
            assert(VideoId === videoId, '返回的 VideoId 不正确')
            assert(Description === opt.Description, 'Description 更新不生效')
            assert(Title === opt.Title, 'Title 更新不生效')
            assert(Tags === opt.Tags, 'Tags 更新不生效')
            done()
        })
    })

    it('获取视频列表', function (done) {
        let opt = {}
        ali.getVideoList(opt, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(typeof result.VideoList === 'object', 'VideoList 应该为对象')
            assert(Array.isArray(result.VideoList.Video), 'Video 应该为数组')
            assert(result.Total > 0, 'Total 值应当大于零')
            done()
        })
    })

    it('获取视频播放凭证', function (done) {
        setTimeout(function () {
            ali.getPlayAuth(videoId2, function (err, result) {
                assert.ifError(err, '错误对象应为 null')
                assert(typeof result === 'object', 'result 应该为对象')
                assert(typeof result.VideoMeta === 'object', 'VideoMeta 应该为对象')
                let { Status, VideoId, Title, Duration } = result.VideoMeta
                assert(VideoId === videoId2, 'VideoId 不正确')
                assert(typeof Status === 'string', 'Status 应当为字符串')
                assert(typeof Title === 'string', 'Title 应当为字符串')
                assert(typeof Duration === 'number', 'Duration 应当为数字')
                assert(typeof result.PlayAuth === 'string', 'PlayAuth 应当为字符串')
                done()            
            })
        }, 2000)
    })

    it('获取视频播放链接', function (done) {
        let opt = {
            VideoId: videoId2,
        }
        ali.getPlayAddress(opt, function (err, result) {
            assert.ifError(err, '错误对象应为 null')
            assert(typeof result === 'object', 'result 应该为对象')
            assert(typeof result.PlayInfoList === 'object', 'PlayInfoList 应该为对象')
            assert(Array.isArray(result.PlayInfoList.PlayInfo), 'PlayInfo 应该为数组')
            done()            
        })
    })

    it('删除视频文件', function (done) {
        let idList = [videoId, videoId2]
        ali.deleteFiles(idList, function (err) {
            assert.ifError(err, '错误对象应为 null')
            done()
        })
    })
})