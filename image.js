export { resize } 
import gm from 'gm'
function resize (oldFile, dealedFile) {
  return new Promise( (resolve, reject) => {
    gm(oldFile)
    .options({imageMagick: true})
    .resize(420,420)
    .write(dealedFile,function(err){
      if(err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}


