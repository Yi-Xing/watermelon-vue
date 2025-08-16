<template>
  <div class="users-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="搜索关键字">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入名称、邮箱、手机号"
            clearable
            style="width: 250px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.state"
            placeholder="请选择状态"
            clearable
            style="width: 90px"
          >
            <el-option label="全部" :value="0" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="users-table-card">
      <el-table :data="usersList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === 1 ? 'success' : 'danger'">
              {{ row.state === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button type="warning" size="small" @click="handleResetPassword(row)">
              重置密码
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          :pager-count="7"
          @update:page-size="handleSizeChange"
          @update:current-page="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="600px"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="userForm.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="resetPasswordVisible" title="重置密码" width="400px">
      <el-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPasswordSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from '@/api/admin/user'
import type {
  UserListItem,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  PageParams,
} from '@/types/user'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  state: 0, // 默认选择"全部"，对应后端state字段
})

// 监听状态变化，自动触发搜索
watch(
  () => searchForm.state,
  () => {
    // 当选择具体状态时，自动触发搜索
    pagination.currentPage = 1
    loadUsers()
  },
)

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
})

// 用户列表
const usersList = ref<UserListItem[]>([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const userFormRef = ref()
const submitting = ref(false)

// 用户表单
const userForm = reactive({
  id: 0,
  name: '',
  email: '',
  phone: '',
  password: '',
  state: 1,
  remark: '',
  roleIds: [] as number[],
})

// 角色选项
const roleOptions = ref([
  { id: 1, name: '超级管理员' },
  { id: 2, name: '普通管理员' },
  { id: 3, name: '普通用户' },
])

// 重置密码相关
const resetPasswordVisible = ref(false)
const resetPasswordFormRef = ref()
const currentUserId = ref<number | null>(null)
const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const userFormRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 3, max: 10, message: '名称长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  email: [
    {
      pattern: /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
  phone: [{ pattern: /^$|^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
  password: [{ min: 8, message: '密码长度不能少于8位', trigger: 'blur' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }],
}

// 重置密码验证规则
const resetPasswordRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== resetPasswordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 初始化数据
onMounted(() => {
  loadUsers()
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      keyword: searchForm.keyword || undefined,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
    } as PageParams

    // 只有当状态不是"全部"(0)时才传递state参数
    if (searchForm.state !== 0) {
      params.state = searchForm.state
    }

    const response = await getUserList(params)

    usersList.value = response.data.dataList
    pagination.total = response.data.total
    pagination.currentPage = response.data.current
    pagination.pageSize = response.data.size
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadUsers()
}

// 重置搜索
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.state = 0
  pagination.currentPage = 1
  loadUsers()
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  resetUserForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = async (row: UserListItem) => {
  try {
    dialogType.value = 'edit'
    loading.value = true

    // 调用API获取用户详情
    const response = await getUserDetail(row.id)
    const userDetail = response.data

    // 填充表单数据
    Object.assign(userForm, {
      id: userDetail.id,
      name: userDetail.name,
      email: userDetail.email,
      phone: userDetail.phone,
      password: '', // 编辑时不显示密码
      state: userDetail.state,
      remark: userDetail.remark,
      roleIds: userDetail.roles || [],
    })

    dialogVisible.value = true
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = async (row: UserListItem) => {
  try {
    await ElMessageBox.confirm(`是否确认删除${row.name}？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteUser(row.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

// 重置密码
const handleResetPassword = (row: UserListItem) => {
  currentUserId.value = row.id
  resetPasswordForm.newPassword = ''
  resetPasswordForm.confirmPassword = ''
  resetPasswordVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    submitting.value = true

    if (dialogType.value === 'add') {
      // 新增用户
      const createData: CreateUserRequest = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        password: userForm.password,
        state: userForm.state,
        remark: userForm.remark,
        roleIds: userForm.roleIds,
      }
      await createUser(createData)
      ElMessage.success('新增成功')
    } else {
      // 编辑用户
      const updateData: UpdateUserRequest = {
        id: userForm.id,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        state: userForm.state,
        remark: userForm.remark,
        roleIds: userForm.roleIds,
      }
      await updateUser(updateData)
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '操作失败')
  } finally {
    submitting.value = false
  }
}

// 提交重置密码
const handleResetPasswordSubmit = async () => {
  if (!resetPasswordFormRef.value || !currentUserId.value) return

  try {
    await resetPasswordFormRef.value.validate()
    submitting.value = true

    const passwordData: ResetPasswordRequest = {
      id: currentUserId.value,
      password: resetPasswordForm.newPassword,
    }

    await resetPassword(passwordData)
    ElMessage.success('密码重置成功')
    resetPasswordVisible.value = false
  } catch (error) {
    console.error('密码重置失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '密码重置失败')
  } finally {
    submitting.value = false
  }
}

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    id: 0,
    name: '',
    email: '',
    phone: '',
    password: '',
    state: 1,
    remark: '',
    roleIds: [],
  })
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadUsers()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadUsers()
}
</script>

<style scoped>
.admin-dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
}

.main-content {
  background: #f5f7fa;
  padding: 20px;
}

.users-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.users-table-card {
  margin-bottom: 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-button {
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .search-card .el-form {
    display: flex;
    flex-direction: column;
  }

  .search-card .el-form-item {
    margin-bottom: 15px;
  }
}
</style>
