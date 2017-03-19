import Router from 'koa-router'
import { upload } from './../helper'
import path from 'path'
import fs from 'fs'
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
  .post('/file', upload.single('avatar'), async ctx => {
    ctx.body = ctx.req.file
  })
  .post('/files', upload.any(), async ctx => {
    ctx.body = ctx.req.files
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
