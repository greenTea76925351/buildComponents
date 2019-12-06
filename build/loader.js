const fs = require('fs')
const path = require('path')
const { src } = require('./config')

function readFileList(dir, filesList = []) {
  const url = path.resolve(src, dir)
  const files = fs.readdirSync(url);
  files.forEach(file => {
    let fullPath = path.join(url, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) { //如果是目录，继续递归遍历
      readFileList(fullPath, filesList)
    } else {
      if (fullPath.indexOf('.vue') !== -1) {
        //将文件路径和文件名中间拼一个空格，然后放入数组
        filesList.push(fullPath + ' ' + file.split('.')[0])
      }
    }
  })
  return filesList;
}

function buildComponents(dir, stat) {
  let filesList = [], components = [];
  readFileList(dir).forEach(file => {
    //按空格切割得到文件路径和文件名
    let [filePath, conponent] = file.split(' ');
    //获取文件的相对路径，并将反斜杠全部替换为正斜杠
    let str = filePath.split(dir)[1].replace(/\\/g, "/");
    filesList.push(`import ${conponent} from \".${str}\"`);
    components.push(conponent)
  })

  let fileData = stat + filesList.join('; \n') + `;\n\nconst components = [\n  ${components.join(', \n  ')} \n]` +
    " \n\n" + "components.forEach(component => Vue.component(component.name, component));";

  fs.writeFile(path.resolve('./src', dir) + '/index.js', fileData, function (error) {
    if (error) {
      throw error
    } else {
      console.log('写入成功了')
    }
  })

}

module.exports = { buildComponents }
