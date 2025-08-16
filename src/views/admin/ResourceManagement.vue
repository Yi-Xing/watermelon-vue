<template>
  <div class="resources-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>资源管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增资源
        </el-button>
        <el-button @click="handleImport">
          <el-icon><Upload /></el-icon>
          导入
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="名称搜索">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入资源名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="资源Code">
          <el-input
            v-model="searchForm.code"
            placeholder="请输入资源Code"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 100px"
          >
            <el-option label="全部" :value="0" />
            <el-option label="启用" :value="ResourceStatus.ENABLED" />
            <el-option label="禁用" :value="ResourceStatus.DISABLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 资源列表 -->
    <el-card class="resources-table-card">
      <el-table
        :data="filteredResourcesList"
        v-loading="loading"
        stripe
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="id" label="ID" :width="idColumnWidth" />
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="资源Code" width="180" />
        <el-table-column prop="sort" label="显示顺序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === ResourceStatus.ENABLED ? 'success' : 'danger'">
              {{ row.status === ResourceStatus.ENABLED ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑资源对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增资源' : '编辑资源'"
      width="700px"
    >
      <el-form
        ref="resourceFormRef"
        :model="resourceForm"
        :rules="resourceFormRules"
        label-width="120px"
      >
        <el-form-item label="上级资源" prop="parentId">
          <el-input
            v-model="resourceForm.parentName"
            placeholder="请选择上级资源"
            readonly
            @click="showParentSelector = true"
          >
            <template #append>
              <el-button @click="showParentSelector = true">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-radio-group v-model="resourceForm.type">
            <el-radio :label="ResourceType.PAGE">页面</el-radio>
            <el-radio :label="ResourceType.BUTTON">按钮</el-radio>
            <el-radio :label="ResourceType.API">接口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资源Code" prop="code">
          <el-input v-model="resourceForm.code" placeholder="请输入资源Code" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="resourceForm.sort" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="resourceForm.status">
            <el-radio :label="ResourceStatus.ENABLED">启用</el-radio>
            <el-radio :label="ResourceStatus.DISABLED">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="resourceForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 上级资源选择器 -->
    <el-dialog v-model="showParentSelector" title="选择上级资源" width="600px">
      <div class="parent-selector">
        <el-tree
          :data="resourcesTree"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          highlight-current
          @node-click="handleParentSelect"
        />
      </div>
      <template #footer>
        <el-button @click="showParentSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmParentSelect">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import type { Resource, ResourceForm, ResourceSearchForm, ResourceTreeNode } from '@/types/resource'
import { ResourceType, ResourceStatus } from '@/types/resource'
import * as resourceApi from '@/api/admin/resource'

// 搜索表单
const searchForm = reactive<ResourceSearchForm>({
  name: '',
  code: '',
  status: 0, // 默认选择"全部"
})

// 资源列表
const resourcesList = ref<Resource[]>([])
const filteredResourcesList = ref<Resource[]>([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const resourceFormRef = ref()
const submitting = ref(false)

// 资源表单
const resourceForm = reactive<ResourceForm>({
  id: '',
  parentId: '',
  parentName: '',
  name: '',
  type: ResourceType.PAGE,
  code: '',
  sort: 1,
  status: ResourceStatus.ENABLED,
  remark: '',
})

// 上级资源选择器
const showParentSelector = ref(false)
const selectedParent = ref<ResourceTreeNode | null>(null)
const resourcesTree = ref<ResourceTreeNode[]>([])

// 表单验证规则
const resourceFormRules = {
  name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' },
    { min: 3, max: 10, message: '名称长度在 3 到 10 个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  code: [
    { required: true, message: '请输入资源Code', trigger: 'blur' },
    { min: 1, max: 100, message: '资源Code长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  sort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }],
}

// 模拟资源数据
const mockResources: Resource[] = [
  {
    id: 1,
    name: '系统管理',
    type: ResourceType.PAGE,
    code: 'system',
    sort: 1,
    status: ResourceStatus.ENABLED,
    remark: '系统管理模块',
    children: [
      {
        id: 2,
        name: '用户管理',
        type: ResourceType.PAGE,
        code: 'system:user',
        sort: 1,
        status: ResourceStatus.ENABLED,
        remark: '用户管理页面',
        children: [
          {
            id: 3,
            name: '新增用户',
            type: ResourceType.BUTTON,
            code: 'system:user:add',
            sort: 1,
            status: ResourceStatus.ENABLED,
            remark: '新增用户按钮',
          },
          {
            id: 4,
            name: '编辑用户',
            type: ResourceType.BUTTON,
            code: 'system:user:edit',
            sort: 2,
            status: ResourceStatus.ENABLED,
            remark: '编辑用户按钮',
          },
        ],
      },
      {
        id: 5,
        name: '角色管理',
        type: ResourceType.PAGE,
        code: 'system:role',
        sort: 2,
        status: ResourceStatus.ENABLED,
        remark: '角色管理页面',
      },
    ],
  },
  {
    id: 6,
    name: '内容管理',
    type: ResourceType.PAGE,
    code: 'content',
    sort: 2,
    status: ResourceStatus.ENABLED,
    remark: '内容管理模块',
  },
]

// 初始化数据
onMounted(() => {
  loadResources()
})

// 加载资源列表
const loadResources = async () => {
  loading.value = true
  try {
    const resources = await resourceApi.getResourceTree()
    resourcesList.value = resources
    resourcesTree.value = [{ id: 0, name: '顶级资源', children: resources }]
    applyFilters()
  } catch (error) {
    // 记录错误信息
    console.error('加载资源失败:', error)
    // 如果API调用失败，使用模拟数据
    resourcesList.value = mockResources
    resourcesTree.value = [{ id: 0, name: '顶级资源', children: mockResources }]
    applyFilters()
    ElMessage.warning('使用模拟数据，API调用失败')
  } finally {
    loading.value = false
  }
}

// 应用筛选
const applyFilters = () => {
  let filtered = [...resourcesList.value]

  // 状态筛选
  if (searchForm.status !== 0) {
    filtered = filterByStatus(filtered, searchForm.status)
  }

  // 名称筛选
  if (searchForm.name.trim()) {
    filtered = filterByName(filtered, searchForm.name)
  }

  // Code筛选
  if (searchForm.code.trim()) {
    filtered = filterByCode(filtered, searchForm.code)
  }

  filteredResourcesList.value = filtered
}

// 按状态筛选
const filterByStatus = (resources: Resource[], status: number): Resource[] => {
  return resources
    .map((resource) => {
      if (resource.children) {
        const filteredChildren = filterByStatus(resource.children, status)
        if (filteredChildren.length > 0) {
          return { ...resource, children: filteredChildren }
        }
      }
      return resource.status === status ? resource : null
    })
    .filter(Boolean) as Resource[]
}

// 按名称筛选
const filterByName = (resources: Resource[], name: string): Resource[] => {
  return resources
    .map((resource) => {
      if (resource.children) {
        const filteredChildren = filterByName(resource.children, name)
        if (filteredChildren.length > 0) {
          return { ...resource, children: filteredChildren }
        }
      }
      return resource.name.toLowerCase().includes(name.toLowerCase()) ? resource : null
    })
    .filter(Boolean) as Resource[]
}

// 按Code筛选
const filterByCode = (resources: Resource[], code: string): Resource[] => {
  return resources
    .map((resource) => {
      if (resource.children) {
        const filteredChildren = filterByCode(resource.children, code)
        if (filteredChildren.length > 0) {
          return { ...resource, children: filteredChildren }
        }
      }
      return resource.code.toLowerCase().includes(code.toLowerCase()) ? resource : null
    })
    .filter(Boolean) as Resource[]
}

// 搜索
const handleSearch = () => {
  applyFilters()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.status = 0
  applyFilters()
}

// 新增资源
const handleAdd = () => {
  dialogType.value = 'add'
  resetResourceForm()
  dialogVisible.value = true
}

// 编辑资源
const handleEdit = (row: Resource) => {
  dialogType.value = 'edit'
  Object.assign(resourceForm, {
    id: row.id,
    parentId: row.parentId || '',
    parentName: row.parentName || '',
    name: row.name,
    type: row.type,
    code: row.code,
    sort: row.sort,
    status: row.status,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 删除资源
const handleDelete = (row: Resource) => {
  const fullPath = getResourceFullPath(row)
  ElMessageBox.confirm(`是否确认删除资源："${fullPath}"？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await resourceApi.deleteResource(row.id)
      ElMessage.success('删除成功')
      loadResources()
    } catch (error) {
      console.error('删除资源失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 获取资源全路径
const getResourceFullPath = (resource: Resource) => {
  const path = [resource.name]
  let current = resource

  // 向上查找父级资源
  while (current.parentId) {
    const parent = findResourceById(resourcesList.value, current.parentId)
    if (parent) {
      path.unshift(parent.name)
      current = parent
    } else {
      break
    }
  }

  return path.join(' / ')
}

// 获取树节点全路径（用于上级资源选择器）
const getTreeNodeFullPath = (node: ResourceTreeNode): string => {
  if (node.id === 0) {
    return '顶级资源'
  }
  // 从资源列表中查找对应的完整资源信息
  const resource = findResourceById(resourcesList.value, node.id)
  // 如果 resource 存在/为真，执行这里的代码
  if (resource) {
    return getResourceFullPath(resource)
  }

  // 如果找不到，返回节点名称
  return node.name
}

// 根据ID查找资源
const findResourceById = (resources: Resource[], id: string | number): Resource | null => {
  for (const resource of resources) {
    if (resource.id === id) {
      return resource
    }
    if (resource.children) {
      const found = findResourceById(resource.children, id)
      if (found) return found
    }
  }
  return null
}

// 导入
const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        await resourceApi.importResources(file)
        ElMessage.success('导入成功')
        loadResources()
      } catch (error) {
        console.error('导入资源失败:', error)
        ElMessage.error('导入失败')
      }
    }
  }
  input.click()
}

// 导出
const handleExport = async () => {
  try {
    const blob = await resourceApi.exportResources(searchForm)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resources_${new Date().getTime()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出资源失败:', error)
    ElMessage.error('导出失败')
  }
}

// 选择上级资源
const handleParentSelect = (data: ResourceTreeNode) => {
  selectedParent.value = data
}

// 确认选择上级资源
const confirmParentSelect = () => {
  if (selectedParent.value) {
    resourceForm.parentId = selectedParent.value.id
    // 获取选中资源的全路径
    const fullPath = getTreeNodeFullPath(selectedParent.value)
    resourceForm.parentName = fullPath
    showParentSelector.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!resourceFormRef.value) return

  try {
    await resourceFormRef.value.validate()
    submitting.value = true

    if (dialogType.value === 'add') {
      await resourceApi.createResource(resourceForm)
      ElMessage.success('新增成功')
    } else {
      await resourceApi.updateResource(resourceForm)
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
    submitting.value = false
    loadResources()
  } catch (error) {
    console.error(dialogType.value === 'add' ? '新增资源失败:' : '编辑资源失败:', error)
    ElMessage.error(dialogType.value === 'add' ? '新增失败' : '编辑失败')
    submitting.value = false
  }
}

// 重置资源表单
const resetResourceForm = () => {
  Object.assign(resourceForm, {
    id: '',
    parentId: '',
    parentName: '',
    code: '',
    name: '',
    type: ResourceType.PAGE,
    sort: 1,
    status: ResourceStatus.ENABLED,
    remark: '',
  })
}

// 获取类型标签类型
const getTypeTagType = (type: ResourceType) => {
  switch (type) {
    case ResourceType.PAGE:
      return 'primary'
    case ResourceType.BUTTON:
      return 'success'
    case ResourceType.API:
      return 'warning'
    default:
      return 'info'
  }
}

// 获取类型标签文本
const getTypeLabel = (type: ResourceType) => {
  switch (type) {
    case ResourceType.PAGE:
      return '页面'
    case ResourceType.BUTTON:
      return '按钮'
    case ResourceType.API:
      return '接口'
    default:
      return '未知'
  }
}

// 计算ID列宽度 - 根据最大层级自适应
const idColumnWidth = computed(() => {
  const baseWidth = 80 // 基础宽度
  const levelWidth = 20 // 每层缩进宽度
  const maxLevel = getMaxLevel(resourcesList.value)
  return baseWidth + maxLevel * levelWidth
})

// 获取资源树的最大层级
const getMaxLevel = (resources: Resource[], currentLevel = 0): number => {
  if (!resources || resources.length === 0) return currentLevel

  let maxLevel = currentLevel
  for (const resource of resources) {
    if (resource.children && resource.children.length > 0) {
      const childLevel = getMaxLevel(resource.children, currentLevel + 1)
      maxLevel = Math.max(maxLevel, childLevel)
    }
  }
  return maxLevel
}
</script>

<style scoped>
.resources-content {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.search-card {
  margin-bottom: 20px;
}

.resources-table-card {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 8px;
}

.parent-selector {
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
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
