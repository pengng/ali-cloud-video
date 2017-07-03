# ali-cloud-video
### 阿里云视频点播SDK

### 使用方法
```bash
npm install ali-cloud-video -S
```
```javascript
const AliCloudVideo = require('ali-cloud-video')
const ali = new AliCloudVideo({
  AccessKeyId: '',
  AccessKeySecret: ''
})

ali.getPlayAuth(videoId, console.log)
/**
{
  "RequestId":"935723BB-3764-4052-9490-1E324EB21362",
  "VideoMeta":{
    "CoverURL":"http://video.host.com/snapshot/e51aa1941e3b46648f4812dbcf5c375d00001.jpg?auth_key=",
    "Status":"Normal",
    "VideoId":"e51aa1941e3b46648f4812dbcf5c175d",
    "Duration":1206.3199462890625,
    "Title":"introduce"
  },
  "PlayAuth":"lkIjoxNDYyMjc5NzgyOTU3NzQ5fQ="
}
*/
```

- `getPlayAuth(videoid,callback)`
播放视频前获取播放地址和播放凭证
- `videoid` **string** 视频上传后得到的videoId
- `callback`
  - `err` 
  - `result`
    - `RequestId`
    - `VideoMeta`
        - `CoverURL` **string** 视频封面URL
        - `Status`
        - `VideoId` 
        - `Duration` **number** 时长
        - `Title` **string** 标题
    - `PlayAuth` **string** 播放凭证

- `getUploadAuth(options, callback)`
上传视频前获取上传凭证和上传地址
- `options`
  - `Title` **string** 视频标题，长度不超过128个字节，UTF8编码
  - `FileName` **string** 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见上传概述的限制部分
  - `FileSize` **string** 视频文件大小
  - `Description` **string** 视频描述，长度不超过1024个字节，UTF8编码
  - `CoverURL` **string** 自定义视频封面URL地址
  - `CateId` **number** 视频分类ID
  - `Tags` **string** 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码
- `callback`
  - `err`
  - `result`
    - `RequestId` **string** 请求ID
    - `VideoId` **string**
    - `UploadAddress` **string** 上传地址
    - `UploadAuth` **string** 上传凭证

- `refreshUploadAuth(videoid, callback)`
上传凭证失效后需刷新上传凭证
- `videoid`
- `callback`
  - `err`
  - `result`
    - `RequestId` **string** 请求ID
    - `UploadAuth` **string** 上传凭证
