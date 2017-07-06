/**
 * 上传文件设置
 * @type {Object}
 */
import path from 'path'
import multer from 'koa-multer'
import mkdirp from 'mkdirp-then'
import fsp from 'fs-promise'
import unzip from 'unzip'
import config from './config/app.json'
const storage = multer.diskStorage({
  async destination (req, file, cb) {
    //const dir = path.resolve(__dirname, 'static/upload', `${year}${month}`, file.fieldname)
    const dir = path.resolve(__dirname, 'static/upload/snapshot')
    const exists = await fsp.exists(dir)
    file.relative = `/snapshot`
    if (!exists) {
      await mkdirp(dir)
    }
    cb(null, dir)
  },
  async filename (req, file, cb) {
    const postId = req.body.post_id
    // console.log(`post id: ${req.body.post_id}`)
    const timestamp = new Date().getTime()
    const { name, ext } = path.parse(file.originalname)
    // cb(null, `${name}${ext}`)
    const filename = `${timestamp}${ext}`
    file.relative = `${file.relative}/${postId}${ext}`
    file.full = `${config["domain"]}/upload${file.relative}`
    cb(null, filename)
    //cb(null, `${name}-${randomString(10)}-${ext}`)
  }
})

export const snapshot = multer({ storage: storage })
