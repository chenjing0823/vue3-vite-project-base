import axios from 'axios'
import sha256 from 'sha256'
import storage from '@/utils/storage'
// import tip from '@/utils/cloudCodeAPI'
const { VITE_APP_MODE, VITE_GATEWAY_URL } = import.meta.env

// 多个相同报错提示
let errorMsg

// 登录过期code
const EXPIRE_LOGIN = 100012
// 创建axios实例的构造类

class HttpRequest {
  request(options) {
    let baseURL = VITE_GATEWAY_URL || ''
    if (['development'].includes(VITE_APP_MODE)) {
      // 不影响线上代码 判断dev
      baseURL = ''
    }

    // https://pt2webf.xbongbong.com.cn
    // 创建axios实例
    const http = axios.create({
      // baseURL: VITE_GATEWAY_URL || '', 该写法导致接口 不是通过本地 代理到目标，而是直接访问目标接口。从而导致 mock 不生效。 接口 dev 前缀不生效
      baseURL,
      method: 'post', // 默认是 post
      timeout: 16000, // 请求超时时间
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    this.interceptors(http, options.aliCallCenter)
    return http(options)
  }

  // 请求与响应拦截
  interceptors(http, aliCallCenter = false) {
    // 添加请求拦截,
    http.interceptors.request.use(
      (config) => {
        const defaultParams = {
          corpid: storage.LS.get('corpid') || '1',
          userId: storage.LS.get('userId') || '1',
          xbbAccessToken: storage.LS.get('xbbAccessToken') || '',
          platform: 'web'
        }
        config.data = Object.assign({}, defaultParams, config.data)

        // 文件上传时
        if (config.headers['Content-Type'] === 'multipart/form-data') {
          const formData = new FormData()
          for (const item in config.data) {
            formData.append(item, config.data[item])
          }
          config.data = formData
        } else {
          // 普通请求
          config.data = this.formatParams(config.data)
        }
        // 过滤null和undefined
        config.data = this.deepClone(config.data)
        config.headers.sign = this.createSign(config.data)

        return config
      },
      (err) => {
        // 请求错误处理
        console.log('请求拦截错误', err)
        // tip.messageBox({
        //   type: 'error',
        //   message: err
        // })
        return Promise.reject(err)
      }
    )
    // 阿里sdk请求不使用响应拦截
    if (aliCallCenter) return
    // 添加响应拦截
    http.interceptors.response.use(
      (response) => {
        if (response) {
          const { data, config } = response
          const noErrorMessage = config.params && config.params.noErrorMessage
          // 只将response 中的 data 输出
          if (!data.success) {
            if (data.code === EXPIRE_LOGIN) {
              localStorage.removeItem('USER_TOKEN')
              // tip.messageBox({
              //   type: 'error',
              //   message: data.msg
              // })
              // setTimeout(() => {
              //   window.location = '/'
              // }, 1500)
              return Promise.reject(data)
            }
            const extraCode = [1630012, 1630010, 1630005, 1630006, 1630019]
            if (errorMsg !== data.msg && !extraCode.includes(data.code)) {
              errorMsg = data.msg
              // noErrorMessage ||
              //   tip.messageBox({
              //     type: 'error',
              //     message: data.msg
              //   })
              setTimeout(() => {
                errorMsg = undefined
              }, 800)
            }
            return Promise.reject(data)
          } else {
            return data.result
          }
        } else {
          return {}
        }
      },
      (err) => {
        // 响应错误处理
        console.log('返回接口拦截时拦截到错误', err)
        // tip.messageBox({
        //   type: 'error',
        //   message: '服务器链接异常，请稍候重试...'
        // })
        return Promise.reject(err)
      }
    )
  }

  // 深拷贝过滤空值
  deepClone(source) {
    if (!source || typeof source !== 'object') {
      return source
    }
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
      if (!Object.prototype.hasOwnProperty.call(source, 'keys')) continue
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = this.deepClone(source[keys])
      } else if (source[keys] !== undefined && source[keys] !== null) {
        targetObj[keys] = source[keys]
      }
    }
    return targetObj
  }

  // 生成签名
  createSign(bodyString) {
    return sha256(bodyString.trim() + (storage.LS.get('xbbAccessToken') || '1'))
  }

  // 过滤特殊字符
  CharacterFilter(str) {
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
      const us = str.charCodeAt(i)
      if (!(us < 0x20 || us === 0x7f || us === 0x2028 || us === 0x2029)) {
        newStr += str.charAt(i)
      }
    }
    return newStr
  }

  // 格式化请求参数
  formatParams(data) {
    let bodyString = JSON.stringify(Object.assign(data))
    // 过滤特殊字符
    if (bodyString.length > 100) {
      bodyString = this.CharacterFilter(bodyString)
    }
    return bodyString
  }
}

export default function (config, mock = false) {
  // 控制api版本前缀
  const API_PREFIX = '/pro/v1'
  // 如果是阿里云呼的接口，url后面不需要拼接语言标识
  if (!config.aliCallCenter) {
    const localLang = storage.LS.get('VUE_LANG') || 'zh_CN'
    config.url = API_PREFIX + config.url + `?lang=${localLang}`
  } else {
    config.url = API_PREFIX + config.url
  }

  let newConfig = config
  // 只对开发环境进行处理
  if (VITE_APP_MODE === 'development') {
    // 开启mock
    if (mock) {
      newConfig = {
        ...config,
        url: '/mock' + config.url
      }
    } else {
      newConfig = {
        ...config,
        url: '/dev' + config.url
      }
    }
  }
  return new HttpRequest().request(newConfig)
}
