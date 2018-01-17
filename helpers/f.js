// import 'babel-polyfill'
export {matPath, mArray, struArr, flat, listDir, readdirPromisify, statPromisify, removePrefix, regenRelative } 
import path from 'path'
import fs from 'fs'
import Promise from 'bluebird'
import * as _ from 'lodash'
// Promise.promisifyAll(fs)


function readdirPromisify(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
      if (err) {
          reject(err);
      }
      resolve(list);
    });
  });
}

function statPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
}

function listDir(dir) {
	return statPromisify(dir).then(stats => {
		if (stats.isDirectory()) {
			return readdirPromisify(dir).then(list => {
				return Promise.all(list.map(item => 
						listDir(path.resolve(dir, item))
				))
			})
		} else {
			return [{name: dir, size: stats.size }]
		}
	});
}
function removePrefix(item, prefix) {
  const re = new RegExp(`${prefix}/`)
  item.name = item.name.replace(re, "")
  return item
}  

function filter(arr) {
  return arr.map((a) => {return removePrefix(a, prefix)})
}


function regenRelative(arr, prefix) {
  const ar = arr.filter((item) => { 
    return item.name.indexOf('__MACOSX') < 0 && item.name.indexOf('.DS_Store') < 0
  })
  return ar.map((item) => {return removePrefix(item, prefix)})
}

function flat(files) {
  const fa = files.reduce((a,b) => {return a.concat(b)})
  return _.flattenDeep(fa)
  // return files.reduce((a,b) => { return a.concat(b) })
}

function struArr(files, prefix) {
  let fi = flat(files)
  return regenRelative(fi,prefix)
}

function mArray(items) {
  const p = _.filter(items, function(p) { return /(.jpg|.jpeg|.png|dds)$/gi.test(p.name) }) 
  if(p.length > 0){
    return p[0]
  } else {
    return null
  }
}

function matPath(parent, mname) {
  if(mname && parent) {
    const full = `${parent}/${mname}`
    return full.slice(0, full.lastIndexOf('/'))
  } else {
    return null
  } 
} 

/**
function listDir(dir) {
	fs.stat(dir).then(stats => {
		if(stats.isDirectory()){
			fs.readdir(dir).then(list => {
				return Promise.all(list.map(item => 
						listDir(path.resolve(dir, item))
				))
			})
		} else {
			return [dir]
		}
  })
} */
