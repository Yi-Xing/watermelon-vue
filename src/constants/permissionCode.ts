// 权限代码常量定义

// 页面权限代码
export const PAGE_PERMISSIONS = {
  // 仪表板页面
  ADMIN_DASHBOARD_PAGE: 'admin.dashboard.page',

  // 用户管理页面
  ADMIN_USER_PAGE: 'admin.user.page',

  // 角色管理页面
  ADMIN_ROLE_PAGE: 'admin.role.page',

  // 资源管理页面
  ADMIN_RESOURCE_PAGE: 'admin.resource.page',

  // 资源关联管理页面
  ADMIN_RESOURCE_RELATION_PAGE: 'admin.resource.relation.page',
} as const

// 按钮权限代码
export const BUTTON_PERMISSIONS = {
  // 仪表板导航按钮
  ADMIN_DASHBOARD_BUTTON: 'admin.dashboard.button',

  // 用户导航按钮
  ADMIN_USER_BUTTON: 'admin.user.button',
  // 用户操作按钮
  ADMIN_USER_ADD_BUTTON: 'admin.user.add.button',
  ADMIN_USER_UPDATE_BUTTON: 'admin.user.update.button',
  ADMIN_USER_PASSWORD_UPDATE_BUTTON: 'admin.user.password.update.button',
  ADMIN_USER_DELETE_BUTTON: 'admin.user.delete.button',

  // 角色导航按钮
  ADMIN_ROLE_BUTTON: 'admin.role.button',
  // 角色操作按钮
  ADMIN_ROLE_ADD_BUTTON: 'admin.role.add.button',
  ADMIN_ROLE_UPDATE_BUTTON: 'admin.role.update.button',
  ADMIN_ROLE_RESOURCE_UPDATE_BUTTON: 'admin.role.resource.update.button',
  ADMIN_ROLE_DELETE_BUTTON: 'admin.role.delete.button',

  // 资源管理按钮
  ADMIN_RESOURCE_BUTTON: 'admin.resource.button',
  // 资源操作按钮
  ADMIN_RESOURCE_ADD_BUTTON: 'admin.resource.add.button',
  ADMIN_RESOURCE_UPDATE_BUTTON: 'admin.resource.update.button',
  ADMIN_RESOURCE_DELETE_BUTTON: 'admin.resource.delete.button',
  ADMIN_RESOURCE_IMPORT_BUTTON: 'admin.resource.import.button',
  ADMIN_RESOURCE_EXPORT_BUTTON: 'admin.resource.export.button',

  // 资源关联管理按钮
  ADMIN_RESOURCE_RELATION_BUTTON: 'admin.resource.relation.button',
  ADMIN_RESOURCE_RELATION_ADD_BUTTON: 'admin.resource.relation.add.button',
  ADMIN_RESOURCE_RELATION_UPDATE_BUTTON: 'admin.resource.relation.update.button',
  ADMIN_RESOURCE_RELATION_DELETE_BUTTON: 'admin.resource.relation.delete.button',
  ADMIN_RESOURCE_RELATION_IMPORT_BUTTON: 'admin.resource.relation.import.button',
  ADMIN_RESOURCE_RELATION_EXPORT_BUTTON: 'admin.resource.relation.export.button',
} as const

// 权限代码类型
export type PagePermission = typeof PAGE_PERMISSIONS[keyof typeof PAGE_PERMISSIONS]
export type ButtonPermission = typeof BUTTON_PERMISSIONS[keyof typeof BUTTON_PERMISSIONS]
