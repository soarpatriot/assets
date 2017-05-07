
export { absolute, fileDir } 

function absolute (absolute, type) {
  // console.log(`a: ${absolute}, type: ${type}`)
  const index = absolute.lastIndexOf(type)
  const zipPath = absolute.slice(0, index)
  return zipPath
}

function fileDir (absolute) {
  const index = absolute.lastIndexOf('/')
  const dirPath = absolute.slice(0, index)
  return dirPath
}


