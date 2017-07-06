export { obj, fbx, findObj, findFbx } 

import * as _ from 'lodash'
import path from 'path'
import child_process from 'child_process'
import shell from 'shelljs'

function obj(modelFilePath, destBinFilePath){
  console.log('开始')
  const convertFilePath = path.resolve('./static/python/convert_obj_three.py');
  console.log('转换文件路径' + convertFilePath);
  const convertString = 'python ' + convertFilePath + ' -i ' + modelFilePath + ' -o ' + destBinFilePath + ' -a center -t binary'
  console.log(convertString)
  if (shell.exec(convertString).code !== 0  ){
    console.log('you don\'t offer args')
    shell.exit(1)
  } else {
    console.log('转换OBJ成功,转换后的文件位置:' + destBinFilePath);
  }
}

function fbx(modelFilePath, destBinFilePath) {
  const convertFilePath = path.resolve('./static/python/convert_to_threejs.py');
  console.log('转换文件路径' + convertFilePath);
  const convertString = 'python ' + convertFilePath + ' ' + modelFilePath + ' ' + destBinFilePath;
  console.log(convertString)
  if (shell.exec(convertString).code !== 0  ){
    console.log('you don\'t offer args')
    shell.exit(1)
  } else {
    console.log('转换FBX成功,转换后的文件位置:' + destBinFilePath);
  }
}

function findObj(files) {

  const objs = _.filter(files, function(f) { 
    // const {name, ext} path.parse(f)
    return /.obj$/gi.test(f) 
  }) 
  if (objs.length > 0){
    return objs[0]
  } else {
    return null
  }
}

function findFbx(files) {
  const fbxs = _.filter(files, function(f) { return /.fbx$/gi.test(f) }) 
  if (fbxs.length > 0){
    return fbxs[0]
  } else {
    return null
  }
}

function readDirSync(path, filesArr) {
  if (!filesArr) {
    filesArr = [];
  }
  var pa = fs.readdirSync(path);  
  pa.forEach(function(ele, index) {  
      var info = fs.statSync(path + "/" + ele);      
      if (info.isDirectory()) {  
          console.log("dir: " + ele);
          if (ele != '__MACOSX') {  // 排除mac系统的替身文件
            readDirSync(path + "/" + ele, filesArr);
          }  
      } else {  
          console.log("file: "+ path + "/" + ele); 
          filesArr.push(path + "/" + ele); 
      }     
    })
}


