<template>
  <div class="roles-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="名称搜索">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入角色名称"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
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

    <!-- 角色列表 -->
    <el-card class="roles-table-card">
      <el-table :data="filteredRolesList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="sortOrder" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button type="warning" size="small" @click="handleUpdateResources(row)"
                >更新资源</el-button
              >
              <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </div>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="500px"
      :z-index="3000"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sortOrder">
          <el-input-number v-model="roleForm.sortOrder" :min="1" :max="999" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 更新资源对话框 -->
    <el-dialog v-model="resourcesDialogVisible" title="更新角色资源" width="600px" :z-index="3000">
      <div class="resources-tree-container">
        <el-tree
          ref="resourcesTreeRef"
          :data="resourcesTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectedResourceIds"
          :default-expanded-keys="expandedKeys"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resourcesDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateResourcesSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 角色类型定义
interface Role {
  id: number
  name: string
  sortOrder: number
  status: number
  createdAt: string
  updatedAt: string
  remark: string
}

// 资源类型定义
interface Resource {
  id: number
  name: string
  children?: Resource[]
}

// 搜索表单
const searchForm = reactive({
  name: '',
  status: 0, // 默认选择"全部"
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
})

// 角色列表
const rolesList = ref<Role[]>([])
const filteredRolesList = ref<Role[]>([])
const loading = ref(false)

// 对话框相关
const roleDialogVisible = ref(false)
const resourcesDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRoleId = ref<number | null>(null)

// 角色表单
const roleFormRef = ref()
const roleForm = reactive({
  name: '',
  sortOrder: 1,
  status: 1,
  remark: '',
})

// 角色表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 10, message: '角色名称长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  sortOrder: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '备注长度不能超过 500 个字符', trigger: 'blur' }],
}

// 资源树相关
const resourcesTreeRef = ref()
const resourcesTree = ref<Resource[]>([])
const selectedResourceIds = ref<number[]>([])
const expandedKeys = ref<number[]>([])

// 树形配置
const treeProps = {
  children: 'children',
  label: 'name',
}

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    sortOrder: 1,
    status: 1,
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
    remark: '系统超级管理员，拥有所有权限',
  },
  {
    id: 2,
    name: '普通用户',
    sortOrder: 2,
    status: 1,
    createdAt: '2024-01-15 09:15:00',
    updatedAt: '2024-01-15 09:15:00',
    remark: '普通用户角色',
  },
  {
    id: 3,
    name: '访客',
    sortOrder: 3,
    status: 2,
    createdAt: '2024-01-15 08:00:00',
    updatedAt: '2024-01-15 08:00:00',
    remark: '访客角色，已禁用',
  },
]

// 模拟资源树数据
const mockResources: Resource[] = [
  {
    id: 1,
    name: '系统管理',
    children: [
      { id: 11, name: '用户管理' },
      { id: 12, name: '角色管理' },
      { id: 13, name: '资源管理' },
    ],
  },
  {
    id: 2,
    name: '内容管理',
    children: [
      { id: 21, name: '文章管理' },
      { id: 22, name: '分类管理' },
    ],
  },
  {
    id: 3,
    name: '数据统计',
    children: [
      { id: 31, name: '访问统计' },
      { id: 32, name: '用户统计' },
    ],
  },
]

// 初始化数据
onMounted(() => {
  loadRoles()
  loadResources()
})

// 加载角色列表
const loadRoles = () => {
  loading.value = true
  setTimeout(() => {
    rolesList.value = mockRoles
    applyFilters()
    loading.value = false
  }, 500)
}

// 加载资源树
const loadResources = () => {
  resourcesTree.value = mockResources
}

// 应用筛选
const applyFilters = () => {
  let filtered = [...rolesList.value]

  // 状态筛选
  if (searchForm.status !== 0) {
    filtered = filtered.filter((role) => role.status === searchForm.status)
  }

  // 名称筛选
  if (searchForm.name.trim()) {
    const keyword = searchForm.name.toLowerCase()
    filtered = filtered.filter((role) => role.name.toLowerCase().includes(keyword))
  }

  filteredRolesList.value = filtered
  pagination.total = filtered.length
  pagination.currentPage = 1
}

// 搜索
const handleSearch = () => {
  applyFilters()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = 0
  applyFilters()
}

// 新增角色
const handleAdd = () => {
  dialogType.value = 'add'
  resetRoleForm()
  roleDialogVisible.value = true
}

// 编辑角色
const handleEdit = (row: Role) => {
  dialogType.value = 'edit'
  currentRoleId.value = row.id
  Object.assign(roleForm, row)
  roleDialogVisible.value = true
}

// 删除角色
const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`是否确认删除角色"${row.name}"？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟删除
      const index = rolesList.value.findIndex((item) => item.id === row.id)
      if (index > -1) {
        rolesList.value.splice(index, 1)
        applyFilters()
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 更新资源
const handleUpdateResources = (row: Role) => {
  currentRoleId.value = row.id
  // 模拟获取角色已有资源
  selectedResourceIds.value = [11, 21, 31] // 示例：选中部分资源
  expandedKeys.value = [1, 2, 3] // 默认展开所有父节点
  resourcesDialogVisible.value = true
}

// 提交角色表单
const handleSubmit = async () => {
  if (!roleFormRef.value) return

  try {
    await roleFormRef.value.validate()

    if (dialogType.value === 'add') {
      // 新增角色
      const newRole: Role = {
        id: Date.now(),
        ...roleForm,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      }
      rolesList.value.push(newRole)
      ElMessage.success('新增成功')
    } else {
      // 编辑角色
      const index = rolesList.value.findIndex((item) => item.id === currentRoleId.value)
      if (index > -1) {
        Object.assign(rolesList.value[index], {
          ...roleForm,
          updatedAt: new Date().toLocaleString(),
        })
        ElMessage.success('更新成功')
      }
    }

    applyFilters()
    roleDialogVisible.value = false
  } catch (error) {
    console.error('角色表单验证失败:', error)
    // 验证失败
  }
}

// 提交资源更新
const handleUpdateResourcesSubmit = () => {
  const checkedKeys = resourcesTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = resourcesTreeRef.value.getHalfCheckedKeys()

  console.log('选中的资源:', checkedKeys)
  console.log('半选中的资源:', halfCheckedKeys)

  ElMessage.success('资源更新成功')
  resourcesDialogVisible.value = false
}

// 重置角色表单
const resetRoleForm = () => {
  roleForm.name = ''
  roleForm.sortOrder = 1
  roleForm.status = 1
  roleForm.remark = ''
  currentRoleId.value = null
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
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

.roles-content {
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

.roles-table-card {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

.action-buttons .el-button {
  flex-shrink: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.resources-tree-container {
  max-height: 400px;
  overflow-y: auto;
}

.tree-toolbar {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.tree-toolbar .el-button {
  margin-right: 8px;
}

.dialog-footer {
  text-align: right;
}

/* 确保对话框显示在最上层 */
:deep(.el-dialog) {
  z-index: 3000 !important;
}

:deep(.el-dialog__wrapper) {
  z-index: 3000 !important;
}

:deep(.el-overlay) {
  z-index: 2999 !important;
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

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
