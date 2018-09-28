# ali-cloud-video
阿里云视频点播SDK

### Usage
```bash
npm i ali-cloud-video -S
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

### new AliCloudVideo(opt)

- `opt` \<Object\>
  - `AccessKeyId` \<string\> 必填，阿里云颁发给用户的访问服务所用的密钥ID。
  - `AccessKeySecret` \<string\> 必填，AccessKeySecret

构造方法，传入配置对象。

```javascript
const AliCloudVideo = require('ali-cloud-video')

const ali = new AliCloudVideo({
  AccessKeyId: 'xxx',
  AccessKeySecret: 'xxx'
})
```

#### 实例方法

- 凭证
  - [getPlayAuth](#getplayauthvideoid-callback)	播放视频前获取播放地址和播放凭证
  - [getPlayAddress](#getplayaddressopt-callback)	获取视频播放地址
  - [getUploadAuth](#getuploadauthopt-callback)	上传视频前获取上传凭证和上传地址
  - [getUploadImageAuth](#getuploadimageauthopt-callback)	上传图片前先获取上传地址和上传凭证
  - [refreshUploadAuth](#refreshuploadauthvideoid-callback)	上传凭证失效后需刷新上传凭证
- 视频
  - [uploadFile](#uploadfileopt-callback)	上传视频文件到视频点播服务器
  - [deleteFiles](#deletefilesidlist-callback)	删除上传的视频文件
  - [getVideoInfo](#getvideoinfovideoid-callback)	获取视频信息
  - [getVideoList](#getvideolistopt-callback)	获取视频信息列表，最多支持获取前5000条
  - [updateVideoInfo](#updatevideoinfoopt-callback)	更新视频信息。
- 分类
  - [addCategory](#addcategoryopt-callback)	创建视频分类。
  - [getCategories](#getcategoriesopt-callback)	获取视频分类及其子分类。
  - [updateCategory](#updatecategoryopt-callback)	更新分类
  - [deleteCategory](#deletecategorycateid-callback)	删除分类

### getPlayAuth(videoId, callback)

- `videoId` \<string\> 视频ID

播放视频前获取播放地址和播放凭证

```javascript
// 上传视频后得到的视频ID
const videoId = 'e51aa1941e3b46648f4812dbcf5c175d'
// 获取视频的播放授权信息
ali.getPlayAuth(videoId, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### getPlayAddress(opt, callback)

- `opt` \<Object\> 
  - `VideoId` \<string\> 上传视频后得到的视频ID
  - `Formats` \<string\> 可选，视频流格式，多个用逗号分隔，支持格式`mp4,m3u8,mp3`，默认获取所有格式的流
  - `AuthTimeout` \<string\> 可选，播放鉴权过期时间，默认为**1800**秒，支持设置最小值为**1800**秒

获取视频的播放链接

```javascript
// 上传视频后得到的视频ID
const opt = { VideoId: 'e51aa1941e3b46648f4812dbcf5c175d' }
// 获取视频的播放链接
ali.getPlayAddress(opt, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### getUploadAuth(opt, callback)

- `opt` \<Object\>
  - `Title` \<string\> 视频标题，长度不超过128个字节，UTF8编码。默认生成为new_video_[timestamp]
  - `FileName` \<string\> 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见[上传概述](https://help.aliyun.com/document_detail/55396.html?spm=5176.doc55407.2.1.xKk4gJ)的限制部分。默认为[Title].mp4
  - `FileSize` \<number\> 视频文件大小，单位：字节。
  - `Description` \<string\> 视频描述，长度不超过1024个字节，UTF8编码
  - `CoverUrl` \<string\> 自定义视频封面URL地址
  - `CateId` \<number\> 视频分类ID，请在“点播控制台-全局设置-分类管理”里编辑或查看分类的ID
  - `Tags` \<string\> 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码

上传视频前获取上传凭证和上传地址

> 该接口不会真正上传视频文件，您需要拿到上传凭证和地址后使用上传SDK进行文件上传；
>
> 如果视频上传凭证失效（有效期3600秒），请调用刷新视频上传凭证接口重新获取上传凭证。

```javascript
const opt = {}
// 获取视频的上传凭证和上传地址
ali.getUploadAuth(opt, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### uploadFile(opt, callback)

- `opt` \<Object\>
  - `FilePath` \<string\> 视频文件的路径。
  - `progress` \<Function\> 进度事件回调函数。参数是上传进度，从0到1。
  - `Title` \<string\> 视频标题，长度不超过128个字节，UTF8编码。默认生成为new_video_[timestamp]
  - `FileName` \<string\> 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见[上传概述](https://help.aliyun.com/document_detail/55396.html?spm=5176.doc55407.2.1.xKk4gJ)的限制部分。默认为[Title].mp4
  - `FileSize` \<string\> 视频文件大小，单位：字节。
  - `Description` \<string\> 视频描述，长度不超过1024个字节，UTF8编码
  - `CoverUrl` \<string\> 自定义视频封面URL地址
  - `CateId` \<number\> 视频分类ID，请在“点播控制台-全局设置-分类管理”里编辑或查看分类的ID
  - `Tags` \<string\> 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码

上传本地视频文件到视频点播服务器。返回视频ID

```javascript
const opt = {
    FilePath: '/path/to/file.mp4',
    progress: (p) => { console.log(`uploaded ${p * 100}%`) }
}

ali.uploadFile(opt, (err, videoId) => {
    if (err) return console.error(err)
  console.log(`videoId is ${videoId}`)
})
```

### deleteFiles(idList, callback)

- `idList` \<Array\> 视频ID数组

删除上传的视频文件。

```javascript
const idList = ['e51aa1941e3b46648f4812dbcf5c175d']

ali.deleteFiles(idList, (err) => {
    if (err) return console.error(err)
  console.log('delete successful')
})
```

### getVideoInfo(videoId, callback)

- `videoId` \<string\> 视频ID

获取视频信息。

```javascript
// 上传视频后得到的视频ID
const videoId = 'e51aa1941e3b46648f4812dbcf5c175d'
// 获取视频的播放授权信息
ali.getVideoInfo(videoId, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### getVideoList(opt, callback)

- `opt` \<Object\>
  - `Status` \<string\> 视频状态，默认获取所有视频，多个可以用逗号分隔，如：Uploading,Normal，取值包括：Uploading(上传中)，UploadFail(上传失败)，UploadSucc(上传完成)，Transcoding(转码中)，TranscodeFail(转码失败)，Blocked(屏蔽)，Normal(正常)
  - `StartTime` \<string\> CreationTime（创建时间）的开始时间，为开区间(大于开始时间)。日期格式按照ISO8601标准表示，并需要使用UTC时间。格式为：YYYY-MM-DDThh:mm:ssZ 例如，2017-01-11T12:00:00Z（为北京时间2017年1月11日20点0分0秒）
  - `EndTime` \<string\> CreationTime的结束时间，为闭区间(小于等于结束时间)。日期格式按照ISO8601标准表示，并需要使用UTC时间。格式为：YYYY-MM-DDThh:mm:ssZ 例如，2017-01-11T12:00:00Z（为北京时间2017年1月11日20点0分0秒）
  - `CateId` \<string\> 视频分类ID
  - `PageNo` \<number\> 页号，默认1
  - `PageSize` \<number\> 可选，默认10，最大不超过100
  - `SortBy` \<string\> 结果排序，范围：CreationTime:Desc、CreationTime:Asc，默认为CreationTime:Desc（即按创建时间倒序）

获取视频信息列表。

```javascript
const opt = {}

ali.getVideoList(opt, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### updateVideoInfo(opt, callback)

- `opt` \<Object\>
  - `VideoId` \<string\> 视频ID
  - `Title` \<string\> 视频标题，长度不超过128个字节，UTF8编码
  - `Description` \<string\> 视频描述，长度不超过1024个字节，UTF8编码
  - `CoverURL` \<string\> 视频封面URL地址
  - `CateId` \<string\> 视频分类ID
  - `Tags` \<string\> 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码

更新视频信息。传入参数则更新相应字段，否则该字段不会被覆盖或更新。

```javascript
const opt = {
    VideoId: 'e51aa1941e3b46648f4812dbcf5c175d',
    Title: 'test_name'
}

ali.updateVideoInfo(opt, (err) => {
    if (err) return console.error(err)
  console.log('updated successful')
})
```

### addCategory(opt, callback)

- `opt` \<Object\>
  - `CateName` \<string\> 分类名称
  - `ParentId` \<string\> 可选，父分类ID，若不填，则默认生成一级分类，根节点分类ID为-1

创建视频分类。最大支持三级分类，每个分类最多支持创建100个子分类。

```javascript
const opt = { CateName: '新分类' }

ali.addCategory(opt, (err) => {
    if (err) return console.error(err)
  console.log('created successful')
})
```

### getCategories(opt, callback)

- `opt` \<Object\>
  - `CateId` \<string\> 分类ID，默认为根节点分类ID即-1
  - `PageNo` \<number\> 子分类列表页号，默认1
  - `PageSize` \<number\> 子分类列表页长，默认10，最大不超过100

获取视频分类及其子分类。

```javascript
const opt = { PageSize: 20 }

ali.getCategories(opt, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### updateCategory(opt, callback)

- `opt` \<Object\>
  - `CateId` \<string\> 分类ID
  - `CateName` \<string\> 分类名称，不能超过64个字节，UTF8编码

更新分类

```javascript
const opt = { CateId: 'xxxx', CateName: '测试分类名' }

ali.updateCategory(opt, (err) => {
    if (err) return console.error(err)
  console.log('updated successful')
})
```

### deleteCategory(cateId, callback)

- `cateId` \<string\> 分类ID

删除分类。

```javascript
const cateId = 'xxx'

ali.deleteCategory(cateId, (err) => {
    if (err) return console.error(err)
  console.log('deleted successful')
})
```

### getUploadImageAuth(opt, callback)

- `opt` \<Object\>
  - `ImageType` \<string\> 图片类型，可选值 cover：封面，watermark：水印。默认cover。
  - `ImageExt` \<string\> 图片文件扩展名，可选值 png，jpg，jpeg，默认 png

上传图片前先获取上传地址和上传凭证

该接口不会真正上传图片文件，您需要拿到上传凭证和地址后使用上传SDK进行文件上传（和视频上传相同）；

如果图片上传凭证失效（有效期900秒），请重新调用此接口获取上传地址和凭证；

如果发现返回的ImageURL在浏览器无法访问（403），那是因为您开启了点播域名的鉴权功能，可工单联系我们关闭或自助生成鉴权签名。

```javascript
const opt = {}

ali.getUploadImageAuth(opt, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```

### refreshUploadAuth(videoId, callback)

- `videoId` \<string\> 视频ID

上传凭证失效后需刷新上传凭证

```javascript
const videoId = 'e51aa1941e3b46648f4812dbcf5c175d'

ali.refreshUploadAuth(videoId, (err, result) => {
    if (err) return console.error(err)
  console.log(result)
})
```