import Router from 'koa-router'
import { upload } from './../helper'
import { snapshot } from './../snapshot'
import { absolute, fileDir } from './../zip'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import unzip from 'unzip'
import shell from 'shelljs'
import child_process from 'child_process'

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
    const file = ctx.req.file
    const fileDirPath = fileDir(file.path)
    const { name, ext } = path.parse(file.filename)
    console.log(`files: `)
    if(ext == '.zip'){
      const unzipPath = absolute(file.path, '.zip')
      const fullPath = absolute(file.full, '.zip')
      console.log(`unzpi ${unzipPath}    fll: ${fullPath}  filename: ${file.filename}`)  
      const command = `unzip -o -d ${unzipPath} ${unzipPath}.zip` 
      if(shell.exec(command).code !== 0  ){
        console.log('unzpi fail')  
      }else {
        console.log('unzip success')  
        const assets = fs.readdirSync(unzipPath)
        file.list = assets
        file.parent = fullPath

        // 转换模型
        const convertFilePath = path.resolve('./static/convert_obj_three.py');
        console.log('转换文件路径' + convertFilePath);
        var modelFilePath;
        var destBinFilePath;
        // 查找到模型文件位置
        for (var i = 0; i < assets.length; i++) {
          const fileName = assets[i];
          const { name, ext } = path.parse(fileName)
          if (ext == '.obj') {
            modelFilePath = unzipPath + '/' + fileName;
            console.log(modelFilePath);
            destBinFilePath = unzipPath + '/' + name + '_bin.js';
            console.log(destBinFilePath);
            break;
          } else if (ext == '.fbx') {

          }
        }
        const convertString = 'python ' + convertFilePath + ' -i ' + modelFilePath + ' -o ' + destBinFilePath + ' -a center -t binary'
        console.log(convertString)
        child_process.exec(convertString, function(error, stdout, stderr) {
           if(stdout.length > 1) {
                console.log('you offer args:',stdout)
                console.log('转换模型成功,转换后的文件位置:' + destBinFilePath);
            }else {
                console.log('you don\'t offer args')
            }
            if(error) {
                console.info('stderr : '+stderr)
            }
        })
      }
      /**
      let fd = fs.createReadStream(file.path).pipe(unzip.Extract({ path: unzipPath}))  
      fd.on('close', function(){
        const assets = fs.readdirSync(unzipPath)
        file.list = assets
        file.parent = fullPath
        console.log(`finished files: `)
      })
      let end = new Promise(function(resolve, reject){
        fd.on('close', resolve)
        fd.on('error', reject) 
      })
      await end **/
    }
    // console.log(`aa: ${JSON.stringify(file)}`)
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


export default file
