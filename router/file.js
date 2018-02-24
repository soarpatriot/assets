import Router from 'koa-router'
import * as image from './../image'
import { upload } from './../helper'
import { snapshot } from './../snapshot'
import { absolute, fileDir } from './../zip'
import * as convert from './../convert'
import * as f from './../helpers/f'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import unzip from 'unzip'
import shell from 'shelljs'
import logger from '../helpers/log'
const file = new Router({
})

file
  .get('/json', ctx => {
    ctx.body = {
      test: 'json'
    }
  })
  .post('/post', ctx => {
    ctx.body = ctx.request.body
  })
  .post('/files/snapshot', snapshot.single('avatar'), async ctx => {
    const file = ctx.req.file
    const postId = ctx.req.body.post_id
    // console.log(`upload: ${JSON.stringify(file)}`)
    // const uploadedPath = absolute(file.path, '.png')
    const { name, ext } = path.parse(file.originalname)
    const newName = `${file.destination}/${postId}${ext}`
    // console.log(`upload: ${newName}`)
    await image.resize(file.path, newName)
    ctx.body = ctx.req.file
  })

  /**
  .post('/file/snapshot',  async ctx => {
    const postId = ctx.request.body.post_id
    const filePrefix = new Date().getTime()
    const imgData = ctx.request.body.snap.replace(/^data:image\/png;base64,/, "")
    const dir = path.resolve(__dirname, '../static/upload', `${postId}`)
    console.log(`${dir}`)
    // const exists = await fse.exists(dir)
    // console.log(`exist: ${exists}`)
    // if (!exists) {
    //  await fse.ensureDir(dir)
    //  console.log(`make`)
    // }
 
    // console.log(ctx.request.body.snap)
    try {
      await  fse.outputFile(`${dir}/${filePrefix}.png`, imgData, 'base64')
      ctx.body = {code: 0}
    } catch (err) {
      ctx.body = {code: 1}
    }
  })
  **/ 
  /**
  .post('/files/mutiple', upload.any(), async ctx => {
    const files = ctx.req.files
    files.map(function(file){
      const { name, ext } = path.parse(file.filename)
      if(ext == '.zip'){
        const unzipPath = absolute(file.path, '.zip')
        fs.createReadStream(file.path).pipe(unzip.Extract({ path: unzipPath}))  
      }
    })
    ctx.body = ctx.req.files
  })
  **/
  .post('/files', upload.single('model'), async ctx => {
    // console.log(JSON.stringify(ctx))
    
    logger.info('start upload file...')
    const file = ctx.req.file
    const fileDirPath = fileDir(file.path)
    const { name, ext } = path.parse(file.filename)
    const unzipPath = absolute(file.path, '.zip')
    const fullPath = absolute(file.full, '.zip')
    console.log(`unzipPath: ${unzipPath}`)
    if(ext == '.zip'){
      console.log(`unzpi ${unzipPath}    fll: ${fullPath}  filename: ${file.filename}`)  
      const command = `unzip -o -d ${unzipPath} ${unzipPath}.zip` 
      if (shell.exec(command).code !== 0  ){
        console.log('unzpi fail')  
      } else {
        console.log('unzip success')  
        // 转换模型
        // const filesArr = fs.readdirSync(unzipPath)
       
        /**        
         *        
        const filesArr = await f.listDir(unzipPath)
        const flatedArr = f.flat(filesArr)
        const objPath = convert.findObj(flatedArr)
 
        if (objPath) {
          const dirname = path.dirname(objPath) 
          const { name, ext } = path.parse(objPath)
          const srcFilePath  = `${dirname}/${name}${ext}`
          const destBinFilePath = `${dirname}/${name}_bin.js`
          convert.obj(srcFilePath, destBinFilePath)
        }

        const fbxPath = convert.findFbx(flatedArr)
        if (fbxPath) {
          const { name, ext } = path.parse(fbxPath)
          const srcFilePath  = `${unzipPath}/${fbxPath}`
          const destBinFilePath = `${unzipPath}/${name}_bin.js`
          convert.fbx(srcFilePath, destBinFilePath)
        } **/
      }
    }
    const assets = await f.listDir(unzipPath)
    logger.info('await...')
    const fa = f.flat(assets)
    const ff = f.regenRelative(fa, unzipPath)
    logger.info('regen...')
    const item = f.mArray(ff)
    const matDir = f.matPath(fullPath, item.name)
    logger.info('matn...')
    file.list = ff
    file.murl = matDir
    file.parent = fullPath
    ctx.body = ctx.req.file
  })
 
  .delete('/files/:name', ctx => {
    let name = ctx.params.name
    let query = ctx.request.query
    // let relative = ctx.params.relative
    // console.log(`relative: ${query.relative}`)
    const fileRelative = '../static/upload' + query.relative
    let filePath = path.resolve(__dirname, fileRelative)

    // console.log(`filePath: ${filePath}`)
    fs.unlink(filePath)
    // console.log(`file: ${filePath}`)
    const result = {
      code: 0,
      message: 'success'
    }
    ctx.body = result
  })
  .get('/files/info/:name', async ctx => {
    let name = ctx.params.name
    let query = ctx.request.query
    // let relative = ctx.params.relative
    // console.log(`relative: ${query.relative}`)
    const fileRelative = '../static/upload' + query.relative
    let filePath = path.resolve(__dirname, fileRelative, name)
    // console.log(filePath)
    let stat = await f.statPromisify(filePath)
    const result = {
      size: stat.size,
      name: name
    }
    ctx.body = result
  })


export default file
