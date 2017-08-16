# ali-cloud-video
#### 阿里云视频点播SDK

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

const videoId = 'e51aa1941e3b46648f4812dbcf5c175d'

ali.getPlayAuth(videoId, (err, result) => {
  console.log(result)
})
```

#### 方法

- [AliCloudVideo(options)](#alicloudvideo) 构造函数
- [getPlayAuth(videoId, callback)](#getplayauth)
播放视频前获取播放地址和播放凭证
- [getPlayAddress(options, callback)](#getplayaddress)
获取视频播放地址
- [getUploadAuth(options, callback)](#getuploadauth)
上传视频前获取上传凭证和上传地址
- [uploadFile(options, callback)](#uploadfile)
上传视频文件到视频点播服务器
- [getUploadImageAuth(options, callback)](#getuploadimageauth)
上传图片前先获取上传地址和上传凭证
- [refreshUploadAuth(videoId, callback)](#refreshuploadauth)
上传凭证失效后需刷新上传凭证

### AliCloudVideo

`new AliCloudVideo(options)` 构造方法，传入配置对象。

#### options 对象属性

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| AccessKeyId | String | 是 | 阿里云颁发给用户的访问服务所用的密钥ID。|
| AccessKeySecret | String | 是 | AccessKeySecret |
| Format | String | 否 | 返回值的类型，支持JSON与XML，默认为JSON。 |
| Version | String | 否 | API版本号，为日期形式：YYYY-MM-DD，本版本对应为2017-03-21。 |
| SignatureMethod | String | 否 | 签名方式，目前支持HMAC-SHA1。 |
| SignatureVersion | String | 否 | 签名算法版本，目前版本是1.0。 |

### getPlayAuth

播放视频前获取播放地址和播放凭证

#### 传入参数

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| videoId | String | 是 | 视频ID |
| callback | Function | 是 | 回调函数 |

#### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| err | Object | 错误对象 |
| result | Object | 结果 |
 
#### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| RequestId | String | 请求ID |
| VideoMeta | Object | 视频Meta信息 |
| PlayAuth | String | 视频播放凭证 |

#### VideoMeta 对象

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| CoverURL | String | 视频封面 |
| VideoId | String | 视频ID |
| Duration | Float | 视频时长(秒) |
| Title | String | 视频标题 |
| Status | String | 视频状态，Uploading(上传中)，UploadFail(上传失败)，UploadSucc(上传完成)，Transcoding(转码中)，Checking(审核中)，TranscodeFail(转码失败)，Blocked(屏蔽)，Normal(正常) |

### getPlayAddress

获取视频播放地址。

#### 传入参数

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

#### options 对象属性

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| VideoId | String | 是 | 视频上传后的videoId |
| Formats | String | 否 | 视频流格式，多个用逗号分隔，支持格式mp4,m3u8,mp3，默认获取所有格式的流 |
| AuthTimeout | String | 否 | 播放鉴权过期时间，默认为1800秒，支持设置最小值为1800秒 |

#### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| err | Object | 错误对象 |
| result | Object | 结果 |
 
#### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| RequestId | String | 请求ID |
| VideoBase | Object | 视频基本信息 |
| PlayInfoList | String | 视频流信息列表 |

#### VideoBase 对象属性

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| CreationTime | String | 视频创建时间，为UTC时间 |
| CoverURL | String | 视频封面 |
| MediaType | String | 媒体文件类型，取值：video(视频)，audio(纯音频) |
| Status | String | 视频状态，Uploading(上传中)，UploadFail(上传失败)，UploadSucc(上传完成)，Transcoding(转码中)，Checking(审核中)，TranscodeFail(转码失败)，Blocked(屏蔽)，Normal(正常) |
| VideoId | String | 视频ID |
| Duration | String | 视频时长(秒) |
| Title | String | 视频标题 |

#### PlayInfoList 对象属性

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| PlayInfo | Array | 视频流信息列表 |

#### PlayInfo 数组内对象属性

| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| Format | String | 视频流格式，若媒体文件为视频则取值：mp4, m3u8，若是纯音频则取值：mp3 |
| Duration | String | 视频流长度，单位秒 |
| Height | Number | 视频流高度，单位px |
| Width | Number | 视频流宽度，单位px |
| Size | Number | 视频流大小，单位Byte |
| Encrypt | Number | 视频流是否加密流，取值：0(否)，1(是) |
| PlayURL | String | 视频流的播放地址 |
| Fps | String | 视频流帧率，每秒多少帧 |
| Bitrate | String | 视频流码率，单位Kbps |
| Definition | String | 视频流清晰度定义, 取值：FD(流畅)，LD(标清)，SD(高清)，HD(超清)，OD(原画)，2K(2K)，4K(4K) |

### getUploadAuth

上传视频前获取上传凭证和上传地址

#### 传入参数

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

#### options 对象

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| Title | String | 否 | 视频标题，长度不超过128个字节，UTF8编码。默认生成为new_video_[timestamp] |
| FileName | String | 否 | 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见[上传概述](https://help.aliyun.com/document_detail/55396.html?spm=5176.doc55407.2.1.xKk4gJ)的限制部分。默认为[Title].mp4 |
| FileSize | String | 否 | 视频文件大小，单位：字节。 |
| Description | String | 否 | 视频描述，长度不超过1024个字节，UTF8编码 |
| CoverUrl | String | 否 | 自定义视频封面URL地址 |
| CateId | Number | 否 | 视频分类ID，请在“点播控制台-全局设置-分类管理”里编辑或查看分类的ID |
| Tags | String | 否 | 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码 |

#### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

#### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| VideoId | String | 视频ID |
| UploadAddress | String | 上传地址 |
| UploadAuth | String | 上传凭证 |

> 请注意：
> - 该接口不会真正上传视频文件，您需要拿到上传凭证和地址后使用上传SDK进行文件上传；
> - 如果视频上传凭证失效（有效期3600秒），请调用刷新视频上传凭证接口重新获取上传凭证。

### uploadFile

上传视频文件到视频点播服务器。

#### 传入参数

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

#### options 对象

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| FilePath | String | 是 | 视频文件的路径。 |
| progress | Function | 否 | 进度事件回调函数。参数是上传进度，从0到1。 |
| Title | String | 否 | 视频标题，长度不超过128个字节，UTF8编码。默认生成为new_video_[timestamp] |
| FileName | String | 否 | 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见[上传概述](https://help.aliyun.com/document_detail/55396.html?spm=5176.doc55407.2.1.xKk4gJ)的限制部分。默认为[Title].mp4 |
| FileSize | String | 否 | 视频文件大小，单位：字节。 |
| Description | String | 否 | 视频描述，长度不超过1024个字节，UTF8编码 |
| CoverUrl | String | 否 | 自定义视频封面URL地址 |
| CateId | Number | 否 | 视频分类ID，请在“点播控制台-全局设置-分类管理”里编辑或查看分类的ID |
| Tags | String | 否 | 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码 |

#### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

### getUploadImageAuth

上传图片前先获取上传地址和上传凭证

#### 传入参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

#### options 对象

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| ImageType | String | 否 | 图片类型，可选值 cover：封面，watermark：水印。默认cover。 |
| ImageExt | String | 否 | 图片文件扩展名，可选值 png，jpg，jpeg，默认 png |

#### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

#### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| ImageURL| String | 图片地址 |
| UploadAddress | String | 上传地址 |
| UploadAuth | String | 上传凭证 |

> 请注意：
> - 该接口不会真正上传图片文件，您需要拿到上传凭证和地址后使用上传SDK进行文件上传（和视频上传相同）；
> - 如果图片上传凭证失效（有效期900秒），请重新调用此接口获取上传地址和凭证；
> - 如果发现返回的ImageURL在浏览器无法访问（403），那是因为您开启了点播域名的鉴权功能，可工单联系我们关闭或自助生成鉴权签名。

### refreshUploadAuth

上传凭证失效后需刷新上传凭证

###### 传入参数

| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| videoId | String | 是 | 视频ID |
| callback | Function | 是 | 回调函数 |

##### 返回参数

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

##### result 对象

| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| UploadAuth | String | 上传凭证 |
