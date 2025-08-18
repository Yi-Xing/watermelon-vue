import md5 from 'md5'

/**
 * 密码加密相关的组合式函数
 */
export function usePassword() {
  /**
   * 使用 md5 加密密码
   * @param password 原始密码
   * @returns 加密后的密码
   */
  const hashPassword = (password: string): string => {
    return md5(password)
  }

  /**
   * 验证密码是否匹配
   * @param password 原始密码
   * @param hashedPassword 加密后的密码
   * @returns 是否匹配
   */
  const verifyPassword = (password: string, hashedPassword: string): boolean => {
    return md5(password) === hashedPassword
  }

  return {
    hashPassword,
    verifyPassword,
  }
}
