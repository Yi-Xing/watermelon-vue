// 环境配置
interface EnvConfig {
  API_BASE_URL: string
  IS_DEV: boolean
  IS_PROD: boolean
}

// 开发环境配置
const devConfig: EnvConfig = {
  API_BASE_URL: '/api', // 使用相对路径，通过 Vite 代理转发
  IS_DEV: true,
  IS_PROD: false,
}

// 生产环境配置
const prodConfig: EnvConfig = {
  API_BASE_URL: 'http://127.0.0.1:8080/api', // 生产环境使用完整URL
  IS_DEV: false,
  IS_PROD: true,
}

// 根据环境导出配置
// # 开发环境
// npm run dev        # import.meta.env.DEV = true
// npm run serve      # import.meta.env.DEV = true

// # 生产环境
// npm run build      # import.meta.env.DEV = false
// npm run preview    # import.meta.env.DEV = false
export const envConfig: EnvConfig = import.meta.env.DEV ? devConfig : prodConfig

// 导出常用配置
export const { API_BASE_URL, IS_DEV, IS_PROD } = envConfig
