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
          node-key="uniqueId"
          default-expand-all
          @check="handleNodeCheck"
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
import { getResourceRelationTree } from '@/api/admin/resourceRelation'
import type { Role, CreateRoleRequest, UpdateRoleRequest, RolePageParams } from '@/types/role'
import type { ResourceRelationTreeNode } from '@/types/resourceRelation'

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
const resourcesTree = ref<ResourceRelationTreeNode[]>([])
const selectedResourceIds = ref<number[]>([])

// ID映射关系
const uniqueIdToIdMap = ref<Map<string, number>>(new Map())
const idToUniqueIdsMap = ref<Map<number, Set<string>>>(new Map())
// 记录所有叶子节点的uniqueId
const leafNodeUniqueIds = ref<Set<string>>(new Set())

// 树形配置
const treeProps = {
  children: 'children',
  label: 'name',
}

// 生成唯一ID的函数
const generateUniqueId = (node: ResourceRelationTreeNode, parentPath: string = ''): string => {
  const currentPath = parentPath ? `${parentPath}/${node.id}` : `/${node.id}`
  return currentPath
}

// 为资源树添加唯一ID并建立映射关系
const processResourceTree = (nodes: ResourceRelationTreeNode[], parentPath: string = '') => {
  // 清空之前的映射关系
  uniqueIdToIdMap.value.clear()
  idToUniqueIdsMap.value.clear()
  leafNodeUniqueIds.value.clear()

  const processNode = (node: ResourceRelationTreeNode, currentParentPath: string) => {
    // 生成唯一ID
    const uniqueId = generateUniqueId(node, currentParentPath)

    // 建立唯一ID到原始ID的映射
    uniqueIdToIdMap.value.set(uniqueId, node.id)

    // 建立原始ID到唯一ID集合的映射
    if (!idToUniqueIdsMap.value.has(node.id)) {
      idToUniqueIdsMap.value.set(node.id, new Set())
    }
    idToUniqueIdsMap.value.get(node.id)!.add(uniqueId)

    // 为节点添加uniqueId属性
    node.uniqueId = uniqueId

    // 递归处理子节点
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => processNode(child, uniqueId))
    } else {
      // 这是叶子节点，记录其uniqueId
      leafNodeUniqueIds.value.add(uniqueId)
    }
  }

  nodes.forEach(node => processNode(node, parentPath))
  return nodes
}

// 设置树形组件的选中状态
const setTreeCheckedKeys = () => {
  if (!resourcesTreeRef.value || !selectedResourceIds.value.length) return

  // 收集所有需要选中的唯一ID
  const allCheckedUniqueIds: string[] = []

  // 遍历选中的节点ID，找到对应的所有唯一ID
  selectedResourceIds.value.forEach(resourceId => {
    const uniqueIds = idToUniqueIdsMap.value.get(resourceId)
    if (uniqueIds) {
      uniqueIds.forEach(uniqueId => {
        allCheckedUniqueIds.push(uniqueId)
      })
    }
  })

  // 只处理叶子节点的ID，过滤掉非叶子节点
  const leafSelectedUniqueIds = allCheckedUniqueIds.filter(id => leafNodeUniqueIds.value.has(id))

  // 使用setCheckedKeys一次性设置所有选中状态（使用唯一ID）
  resourcesTreeRef.value.setCheckedKeys(leafSelectedUniqueIds)
}

// 处理节点选中事件
const handleNodeCheck = (nodeData: ResourceRelationTreeNode, checkInfo: { checkedKeys: string[], halfCheckedKeys: string[] }) => {
  // 当前被选中的所有节点唯一标识
  const { checkedKeys } = checkInfo

  // 获取当前被操作的节点的唯一ID
  const currentUniqueId = nodeData.uniqueId
  if (!currentUniqueId) return

  // 通过唯一ID获取原始ID
  const originalId = uniqueIdToIdMap.value.get(currentUniqueId)
  if (!originalId) return

  // 获取所有具有相同原始ID的唯一ID
  const sameOriginalIdUniqueIds = idToUniqueIdsMap.value.get(originalId)
  if (!sameOriginalIdUniqueIds) return

  // 检查当前节点是否被选中
  const isCurrentNodeChecked = checkedKeys.includes(currentUniqueId)

  // 同步选中/取消选中所有具有相同原始ID的节点
  let updatedCheckedKeys = [...checkedKeys]

  if (isCurrentNodeChecked) {
    // 如果当前节点被选中，则选中所有具有相同原始ID的节点
    sameOriginalIdUniqueIds.forEach(uniqueId => {
      if (!updatedCheckedKeys.includes(uniqueId)) {
        updatedCheckedKeys.push(uniqueId)
      }
    })

  } else {
    // 取消时，需要进行过滤。只操作叶子节点
    updatedCheckedKeys = updatedCheckedKeys.filter(id => leafNodeUniqueIds.value.has(id))
    // 如果当前节点被取消选中，则取消选中所有具有该节点前缀的叶子
    sameOriginalIdUniqueIds.forEach(uniqueId => {
      updatedCheckedKeys = updatedCheckedKeys.filter(id => !id.startsWith(uniqueId))
    })
  }
  // 更新树的选中状态
  resourcesTreeRef.value.setCheckedKeys(updatedCheckedKeys)
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

    const response = await getResourceRelationTree(params)
    const rawData = response.data || []

    // 处理资源树，添加唯一ID并建立映射关系
    resourcesTree.value = processResourceTree(rawData)
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
    // 清理之前的状态
    selectedResourceIds.value = []
    currentRoleId.value = null
    if (resourcesTreeRef.value) {
      resourcesTreeRef.value.setCheckedKeys([])
    }

    // 设置当前角色ID
    currentRoleId.value = row.id
    loading.value = true

    // 调用API获取角色详情，包含资源ID列表
    const response = await getRoleDetail(row.id)
    const roleDetail = response.data

    // 使用角色详情中的 resourceIds
    selectedResourceIds.value = roleDetail.resourceIds || []

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

    // 合并选中的和半选中的唯一ID
    const allUniqueIds = [...checkedKeys, ...halfCheckedKeys]

    // 将唯一ID转换为原始ID
    const originalIds: number[] = []
    allUniqueIds.forEach(uniqueId => {
      const originalId = uniqueIdToIdMap.value.get(uniqueId)
      if (originalId !== undefined) {
        originalIds.push(originalId)
      }
    })

    // 去重原始ID
    const uniqueOriginalIds = [...new Set(originalIds)]

    await updateRoleResources(currentRoleId.value, uniqueOriginalIds)
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
