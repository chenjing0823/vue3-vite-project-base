function exec(cmd) {
  const { exec } = require('child_process')
  const childProcess = exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`error：${error}`)
      return
    }

    console.log(`标准输出：${stdout}`)
    console.error(`标准错误输出：${stderr}`)
  })

  childProcess.stdout.on('data', (data) => {
    console.log(data)
  })

  childProcess.stderr.on('data', (data) => {
    console.error(`err message：${data}`)
  })
}

const [, , command, env = 'dev'] = process.argv
const format = env === 'prod' ? 'production' : env
// 校验环境参数是否正确
if (
  ![
    'dev',
  ].includes(env)
) {
  console.error(
    `请输入正确的环境参数: dev , 当前输入参数为: ${env}`
  )
} else if (command === 'serve') {
  console.log(`启动开发服务，当前环境：${format}`)
  exec(`vite --config ./vite.config.js --mode ${format}`)
} else if (command === 'build') {
  console.log(`启动构建服务，当前环境：${format}`)
  exec(`vite build --mode ${format}`)
  // exec(`vite build --mode ${format} && node ./build/copy.js`)
}
