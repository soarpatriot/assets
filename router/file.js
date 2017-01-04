import Router from 'koa-router'
import { upload } from './../helper'

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

export default file
