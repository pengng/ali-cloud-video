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

##### constructor(options)
实例化对象

###### options 对象
| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| AccessKeyId | String | 是 | 阿里云颁发给用户的访问服务所用的密钥ID。|
| AccessKeySecret | String | 是 | AccessKeySecret |

##### getPlayAuth(videoId, callback)
播放视频前获取播放地址和播放凭证

###### 传入参数
| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| videoId | String | 是 | 视频ID |
| callback | Function | 是 | 回调函数 |

###### 返回参数
| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| err | Object | 错误对象 |
| result | Object | 结果 |
 
###### result 对象
| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| RequestId | String | 请求ID |
| VideoMeta | Object | 视频Meta信息 |
| PlayAuth | String | 视频播放凭证 |

###### VideoMeta 对象
| 名称 | 类型 | 描述 |
| --- | --- | ---- |
| CoverURL | String | 视频封面 |
| VideoId | String | 视频ID |
| Duration | Float | 视频时长(秒) |
| Title | String | 视频标题 |
| Status | String | 视频状态，Uploading(上传中)，UploadFail(上传失败)，UploadSucc(上传完成)，Transcoding(转码中)，Checking(审核中)，TranscodeFail(转码失败)，Blocked(屏蔽)，Normal(正常) |


##### getUploadAuth(options, callback)
上传视频前获取上传凭证和上传地址

###### 传入参数
| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

###### options 对象
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| Title | String | 视频标题，长度不超过128个字节，UTF8编码 |
| FileName | String | 视频源文件名，必须带扩展名，且扩展名不区分大小写, 支持的扩展名参见上传概述的限制部分 |
| FileSize | String | 视频文件大小 |
| Description | String | 视频描述，长度不超过1024个字节，UTF8编码 |
| CoverUrl | String | 自定义视频封面URL地址 |
| CateId | Number | 视频分类ID |
| Tags | String | 视频标签，单个标签不超过32字节，最多不超过16个标签。多个用逗号分隔，UTF8编码 |

###### 返回参数
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

###### result 对象
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| VideoId | String | 视频ID |
| UploadAddress | String | 上传地址 |
| UploadAuth | String | 上传凭证 |

##### getUploadImageAuth(options, callback)
上传图片前先获取上传地址和上传凭证

###### 传入参数
| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| options | Object | 是 | 配置对象 |
| callback | Function | 是 | 回调函数 |

###### options 对象
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| ImageType | String | 图片类型，可选值 cover：封面，watermark：水印。默认cover。 |
| ImageExt | String | 图片文件扩展名，可选值 png，jpg，jpeg，默认 png |

###### 返回参数
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

###### result 对象
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| ImageURL| String | 图片地址 |
| UploadAddress | String | 上传地址 |
| UploadAuth | String | 上传凭证 |

##### refreshUploadAuth(videoId, callback)
上传凭证失效后需刷新上传凭证

###### 传入参数
| 名称 | 类型 | 必填项 | 描述 |
| --- | --- | ------ | --- |
| videoId | String | 是 | 视频ID |
| callback | Function | 是 | 回调函数 |

###### 返回参数
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| err | Object | 错误对象 |
| result | Object | 结果 |

###### result 对象
| 名称 | 类型 | 描述 |
| --- | --- | --- |
| RequestId | String | 请求ID |
| UploadAuth | String | 上传凭证 |
