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
			return [dir]
		}
	});
}
function removePrefix(path, prefix) {
  const re = new RegExp(`${prefix}/`)
  return path.replace(re, "")
}  

function filter(arr) {
  return arr.map((a) => {return removePrefix(a, prefix)})
}


function regenRelative(arr, prefix) {
  const ar = arr.filter((a) => { 
    return a.indexOf('__MACOSX') < 0 && a.indexOf('.DS_Store') < 0
  })
  return ar.map((a) => {return removePrefix(a, prefix)})
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

function mArray(dir) {
  const p = _.filter(dir, function(p) { return /(.jpg|.jpeg|.png|dds)$/gi.test(p) }) 
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
