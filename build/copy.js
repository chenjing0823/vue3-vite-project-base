const fs = require('fs')
const path = require('path')

// 公众号校验文件
const sourceFilePath = path.join(__dirname, '../src/package/portal/verify-test/5435726845.txt')
const targetFilrPath = path.join(__dirname, '../dist/5435726845.txt')

// 拷贝文件
fs.copyFile(sourceFilePath, targetFilrPath, (err) => {
  if (err) {
    console.error('拷贝文件失败:', err)
  } else {
    console.log('文件拷贝成功')
  }
})
