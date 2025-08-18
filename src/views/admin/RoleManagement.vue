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
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入角色名称"
            clearable
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

    <!-- 角色列表 -->
    <el-card class="roles-table-card">
      <el-table :data="rolesList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="orderNum" label="显示顺序" width="100" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === 1 ? 'success' : 'danger'">
              {{ row.state === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">
            <span
              class="remark-text"
              :class="{ 'remark-long': row.remark && row.remark.length > 20 }"
              :title="row.remark"
            >
              {{ row.remark || '无' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="180" />
        <el-table-column prop="updatedTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button type="success" size="small" @click="handleUpdateResources(row)">
              资源
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
          :page-sizes="[10, 20, 50, 100]"
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
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="roleForm.orderNum" :min="1" :max="999" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="roleForm.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ dialogType === 'add' ? '新增' : '更新' }}
        </el-button>
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getRoleDetail,
  updateRoleResources,
} from '@/api/admin/role'
import { getResourceTree } from '@/api/admin/resource'
import type { Role, CreateRoleRequest, UpdateRoleRequest, RolePageParams } from '@/types/role'
import type { Resource as ResourceType } from '@/types/resource'

// 搜索表单
const searchForm = reactive({
  name: '',
  state: 0, // 默认选择"全部"
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 角色列表
const rolesList = ref<Role[]>([])
const loading = ref(false)

// 对话框相关
const roleDialogVisible = ref(false)
const resourcesDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentRoleId = ref<number | null>(null)

// 角色表单
const roleFormRef = ref()
const roleForm = reactive({
  id: 0,
  name: '',
  orderNum: 1,
  state: 1,
  remark: '',
})

// 角色表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 10, message: '角色名称长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '备注长度不能超过 500 个字符', trigger: 'blur' }],
}

// 资源树相关
const resourcesTreeRef = ref()
const resourcesTree = ref<ResourceType[]>([])
const selectedResourceIds = ref<number[]>([])
const expandedKeys = ref<number[]>([])

// 树形配置
const treeProps = {
  children: 'children',
  label: 'name',
}

// 设置树形组件的选中状态
const setTreeCheckedKeys = () => {
  if (!resourcesTreeRef.value || !selectedResourceIds.value.length) return

  // 计算需要选中的节点ID（包括半选状态的父节点）
  const checkedKeys = calculateCheckedKeys(resourcesTree.value, selectedResourceIds.value)

  // 设置选中状态
  resourcesTreeRef.value.setCheckedKeys(checkedKeys)
}

// 计算需要选中的节点ID，过滤掉父节点，只保留叶子节点
const calculateCheckedKeys = (resources: ResourceType[], selectedIds: number[]): number[] => {
  // 找出所有叶子节点（没有children或children为空的节点）
  const leafNodeIds = new Set<number>()

  const findLeafNodes = (resourceList: ResourceType[]) => {
    resourceList.forEach((resource) => {
      if (!resource.children || resource.children.length === 0) {
        // 这是叶子节点
        leafNodeIds.add(Number(resource.id))
      } else {
        // 这是父节点，递归查找子节点
        findLeafNodes(resource.children)
      }
    })
  }

  findLeafNodes(resources)

  // 只返回既是叶子节点又在selectedIds中的ID
  return selectedIds.filter((id) => leafNodeIds.has(id))
}

// 监听状态变化，自动触发搜索
watch(
  () => searchForm.state,
  () => {
    // 当选择具体状态时，自动触发搜索
    pagination.currentPage = 1
    loadRoles()
  },
)

// 初始化数据
onMounted(() => {
  loadRoles()
  loadResources()
})

// 加载角色列表
const loadRoles = async () => {
  loading.value = true
  try {
    const params: RolePageParams = {
      name: searchForm.name || undefined,
      state: searchForm.state === 0 ? undefined : searchForm.state,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
    }

    const response = await getRoleList(params)
    rolesList.value = response.data.dataList
    pagination.total = response.data.total
    pagination.currentPage = response.data.current
    pagination.pageSize = response.data.size
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 加载资源树
const loadResources = async () => {
  try {
    const params = {
      name: '',
      state: 1, // 只获取启用状态的资源
      code: '',
    }

    const response = await getResourceTree(params)
    resourcesTree.value = response.data || []

    // 设置默认展开的节点（展开所有父节点）
    const extractParentIds = (resources: ResourceType[]): number[] => {
      const ids: number[] = []
      resources.forEach((resource) => {
        if (resource.children && resource.children.length > 0) {
          ids.push(Number(resource.id))
          ids.push(...extractParentIds(resource.children))
        }
      })
      return ids
    }

    expandedKeys.value = extractParentIds(resourcesTree.value)
  } catch (error) {
    console.error('获取资源树失败:', error)
    ElMessage.error('获取资源树失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadRoles()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.state = 0
  pagination.currentPage = 1
  loadRoles()
}

// 新增角色
const handleAdd = () => {
  dialogType.value = 'add'
  resetRoleForm()
  roleDialogVisible.value = true
}

// 编辑角色
const handleEdit = async (row: Role) => {
  try {
    dialogType.value = 'edit'
    currentRoleId.value = row.id
    loading.value = true

    // 调用API获取角色详情
    const response = await getRoleDetail(row.id)
    const roleDetail = response.data

    // 填充表单数据
    Object.assign(roleForm, {
      id: roleDetail.id,
      name: roleDetail.name,
      orderNum: roleDetail.orderNum,
      state: roleDetail.state,
      remark: roleDetail.remark,
    })

    roleDialogVisible.value = true
  } catch (error) {
    console.error('获取角色详情失败:', error)
    ElMessage.error('获取角色详情失败')
  } finally {
    loading.value = false
  }
}

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm(`是否确认删除角色"${row.name}"？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteRole(row.id)
    ElMessage.success('删除成功')
    loadRoles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error('删除角色失败')
    }
  }
}

// 更新资源
const handleUpdateResources = async (row: Role) => {
  try {
    currentRoleId.value = row.id
    loading.value = true

    // 调用API获取角色详情，包含资源ID列表
    const response = await getRoleDetail(row.id)
    const roleDetail = response.data

    // 使用角色详情中的 resourceIds
    selectedResourceIds.value = roleDetail.resourceIds || []

    // 确保资源树已加载
    if (resourcesTree.value.length === 0) {
      await loadResources()
    }

    resourcesDialogVisible.value = true

    // 等待DOM更新后设置选中状态
    await nextTick()
    setTreeCheckedKeys()
  } catch (error) {
    console.error('获取角色资源失败:', error)
    ElMessage.error('获取角色资源失败')
  } finally {
    loading.value = false
  }
}

// 提交角色表单
const handleSubmit = async () => {
  if (!roleFormRef.value) return

  try {
    await roleFormRef.value.validate()
    loading.value = true

    if (dialogType.value === 'add') {
      // 新增角色
      const createData: CreateRoleRequest = {
        name: roleForm.name,
        orderNum: roleForm.orderNum,
        state: roleForm.state,
        remark: roleForm.remark,
      }
      await createRole(createData)
      ElMessage.success('新增成功')
    } else {
      // 编辑角色
      const updateData: UpdateRoleRequest = {
        id: roleForm.id,
        name: roleForm.name,
        orderNum: roleForm.orderNum,
        state: roleForm.state,
        remark: roleForm.remark,
      }
      await updateRole(updateData)
      ElMessage.success('更新成功')
    }

    roleDialogVisible.value = false
    loadRoles()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '操作失败')
  } finally {
    loading.value = false
  }
}

// 提交资源更新
const handleUpdateResourcesSubmit = async () => {
  if (!currentRoleId.value) return

  try {
    const checkedKeys = resourcesTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = resourcesTreeRef.value.getHalfCheckedKeys()

    // 合并选中的和半选中的资源ID
    const allResourceIds = [...checkedKeys, ...halfCheckedKeys]

    await updateRoleResources(currentRoleId.value, allResourceIds)
    ElMessage.success('资源更新成功')
    resourcesDialogVisible.value = false

    // 刷新角色列表
    loadRoles()
  } catch (error) {
    console.error('更新角色资源失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '更新角色资源失败')
  }
}

// 重置角色表单
const resetRoleForm = () => {
  Object.assign(roleForm, {
    id: 0,
    name: '',
    orderNum: 1,
    state: 1,
    remark: '',
  })
  currentRoleId.value = null
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadRoles()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadRoles()
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
}

/* 备注字段样式 */
.remark-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remark-long {
  max-width: 120px; /* 当备注较长时，缩短显示宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

  .search-form {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
