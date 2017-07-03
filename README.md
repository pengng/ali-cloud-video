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
- 获取播放Auth
- `getPlayAuth(video,callback)`
- `err` 
- `result`
  - `RequestId`
  - `VideoMeta`
    - `CoverURL`
    - `Status`
    - `VideoId`
    - `Duration`
    - `Title`
  - `PlayAuth`
