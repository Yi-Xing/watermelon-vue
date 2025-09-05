// 导入图片资源
import watermelonLogo from '@/assets/logo.webp'
import bananaLogo from '@/assets/banana_logo.webp'

// 系统配置常量
export interface SystemConfig {
  id: string
  name: string
  logo: string
  title: string
  subtitle: string
  features: string[]
  githubUrl: string
}

export const SYSTEM_CONFIGS: Record<string, SystemConfig> = {
  watermelon: {
    id: 'watermelon',
    name: 'Watermelon',
    logo: watermelonLogo,
    title: '欢迎来到 Watermelon',
    subtitle: '用户权限管理系统',
    features: [
      '基于 RBAC 的权限管理系统',
      '前端采用 Vue 3 + Element Plus 开发',
      '后端采用 Spring Boot 3.2 开发',
      '支持用户、角色、资源管理',
      '支持细粒度的权限控制'
    ],
    githubUrl: 'https://github.com/Yi-Xing/watermelon'
  },
  banana: {
    id: 'banana',
    name: 'Banana',
    logo: bananaLogo,
    title: '欢迎来到 Banana',
    subtitle: '对象存储系统',
    features: [
      '基于 OSS 的对象存储系统',
      '前端采用 Vue 3 + Element Plus 开发',
      '后端采用 Spring Boot 3.2 开发',
      '支持图片、文件管理',
      '支持图片编辑、分享等功能'
    ],
    githubUrl: 'https://github.com/Yi-Xing/watermelon'
  }
}

// 默认配置
export const DEFAULT_SYSTEM_CONFIG = SYSTEM_CONFIGS.watermelon
