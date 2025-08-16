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
        <el-button @click="handleExport" :loading="exporting">
          <el-icon><Download /></el-icon>
          {{ exporting ? '导出中...' : '导出' }}
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="资源名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入资源名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
            @input="handleSearch"
          />
        </el-form-item>
        <el-form-item label="资源Code">
          <el-input
            v-model="searchForm.code"
            placeholder="请输入资源Code"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
            @input="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.state"
            placeholder="请选择状态"
            clearable
            style="width: 100px"
            @change="handleSearch"
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
        :data="resourcesList"
        v-loading="loading"
        stripe
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="name" label="名称" :width="nameColumnWidth" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="资源Code" width="300" />
        <el-table-column prop="orderNum" label="显示顺序" width="100" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === ResourceStatus.ENABLED ? 'success' : 'danger'">
              {{ row.state === ResourceStatus.ENABLED ? '启用' : '禁用' }}
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
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="resourceForm.orderNum" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="resourceForm.state">
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

    <!-- 导入结果弹窗 -->
    <el-dialog
      v-model="importResultVisible"
      title="导入结果"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="import-result">
        <h3>导入完成！</h3>
        <div class="result-stats" v-if="importResult.success">
          <div class="stat-item">
            <span class="stat-label">总行数</span>
            <span class="stat-value">{{ importResult.totalRows }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">新增行数</span>
            <span class="stat-value success">{{ importResult.insertedRows }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">更新行数</span>
            <span class="stat-value warning">{{ importResult.updatedRows }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">删除行数</span>
            <span class="stat-value danger">{{ importResult.deletedRows }}</span>
          </div>
        </div>
        <div v-if="!importResult.success" class="error-section">
          <h4>错误信息</h4>
          <div class="error-list">
            <div v-for="(error, index) in importResult.errors" :key="index" class="error-item">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="importResultVisible = false">确定</el-button>
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
import type { CreateResourceRequest, UpdateResourceRequest } from '@/types/resource'

// 搜索表单
const searchForm = reactive<ResourceSearchForm>({
  name: '',
  code: '',
  state: 0, // 默认选择"全部"
})

// 资源列表
const resourcesList = ref<Resource[]>([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const resourceFormRef = ref()
const submitting = ref(false)

// 导出状态控制
const exporting = ref(false)

// 资源表单
const resourceForm = reactive<ResourceForm>({
  id: '',
  parentId: '',
  parentName: '',
  name: '',
  type: ResourceType.PAGE,
  code: '',
  orderNum: 1,
  state: ResourceStatus.ENABLED,
  remark: '',
})

// 上级资源选择器
const showParentSelector = ref(false)
const selectedParent = ref<ResourceTreeNode | null>(null)
const resourcesTree = ref<ResourceTreeNode[]>([])

// 导入结果弹窗
const importResultVisible = ref(false)
const importResult = ref<{
  totalRows: number
  insertedRows: number
  updatedRows: number
  deletedRows: number
  errors: string[] | null
  success: boolean
}>({
  totalRows: 0,
  insertedRows: 0,
  updatedRows: 0,
  deletedRows: 0,
  errors: null,
  success: false,
})

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
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }],
  remark: [{ max: 500, message: '备注长度不能超过500个字符', trigger: 'blur' }],
}

// 初始化数据
onMounted(() => {
  loadResources()
})

// 加载资源列表
const loadResources = async () => {
  loading.value = true
  try {
    const response = await resourceApi.getResourceTree({
      name: searchForm.name,
      code: searchForm.code,
      state: searchForm.state,
    })
    if (response.success && response.data) {
      resourcesList.value = response.data
      resourcesTree.value = [{ id: 0, name: '顶级资源', children: response.data }]
    } else {
      throw new Error(response.message || '获取资源列表失败')
    }
  } catch (error) {
    console.error('加载资源失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取资源列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  loadResources()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.state = 0
  loadResources()
}

// 新增资源
const handleAdd = () => {
  dialogType.value = 'add'
  resetResourceForm()
  dialogVisible.value = true
}

// 编辑资源
const handleEdit = async (row: Resource) => {
  try {
    dialogType.value = 'edit'
    loading.value = true

    // 调用API获取资源详情
    const response = await resourceApi.getResourceDetail(row.id)
    if (response.success && response.data) {
      const resourceDetail = response.data

      // 填充表单数据
      Object.assign(resourceForm, {
        id: resourceDetail.id,
        parentId: resourceDetail.parentId || 0,
        parentName: resourceDetail.parentId === 0 ? '顶级资源' : resourceDetail.parentName || '',
        name: resourceDetail.name,
        type: resourceDetail.type,
        code: resourceDetail.code,
        orderNum: resourceDetail.orderNum,
        state: resourceDetail.state,
        remark: resourceDetail.remark || '',
      })

      dialogVisible.value = true
    } else {
      throw new Error(response.message || '获取资源详情失败')
    }
  } catch (error) {
    console.error('获取资源详情失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取资源详情失败')
  } finally {
    loading.value = false
  }
}

// 删除资源
const handleDelete = async (row: Resource) => {
  const fullPath = getResourceFullPath(row)

  try {
    await ElMessageBox.confirm(`是否确认删除资源："${fullPath}"？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    loading.value = true
    await resourceApi.deleteResource(row.id)
    ElMessage.success(`资源"${row.name}"删除成功`)
    loadResources()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除资源失败:', error)
      ElMessage.error(error instanceof Error ? error.message : '删除资源失败')
    }
  } finally {
    loading.value = false
  }
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

// 显示导入结果
const showImportResult = (data: {
  totalRows: number
  insertedRows: number
  updatedRows: number
  deletedRows: number
  errors: string[] | null
  success: boolean
}) => {
  // 更新导入结果数据
  importResult.value = { ...data }
  // 显示弹窗
  importResultVisible.value = true
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
        loading.value = true
        ElMessage.info('正在导入资源数据...')

        const result = await resourceApi.importResources(file)

        if (result.success) {
          // 显示导入结果
          showImportResult(result.data)
          ElMessage.success('导入成功')
          // 刷新资源列表
          loadResources()
        } else {
          ElMessage.error(result.message || '导入失败')
        }
      } catch (error) {
        console.error('导入资源失败:', error)
        ElMessage.error(error instanceof Error ? error.message : '导入失败')
      } finally {
        loading.value = false
      }
    }
  }
  input.click()
}

// 导出
const handleExport = async () => {
  // 防重点击
  if (exporting.value) {
    return
  }

  try {
    exporting.value = true
    ElMessage.info('正在导出资源数据...')

    const blob = await resourceApi.exportResources({
      name: searchForm.name,
      code: searchForm.code,
      state: searchForm.state,
    })

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resources_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出资源失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '导出失败')
  } finally {
    exporting.value = false
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
      const createData: CreateResourceRequest = {
        parentId: Number(resourceForm.parentId),
        name: resourceForm.name,
        type: resourceForm.type,
        code: resourceForm.code,
        orderNum: resourceForm.orderNum,
        state: resourceForm.state,
        remark: resourceForm.remark,
      }
      await resourceApi.createResource(createData)
      ElMessage.success('新增成功')
    } else {
      const updateData: UpdateResourceRequest = {
        id: Number(resourceForm.id),
        parentId: Number(resourceForm.parentId),
        name: resourceForm.name,
        type: resourceForm.type,
        code: resourceForm.code,
        orderNum: resourceForm.orderNum,
        state: resourceForm.state,
        remark: resourceForm.remark,
      }
      await resourceApi.updateResource(updateData)
      ElMessage.success(`资源"${updateData.name}"更新成功`)
    }

    dialogVisible.value = false
    submitting.value = false
    loadResources()
  } catch (error) {
    console.error(dialogType.value === 'add' ? '新增资源失败:' : '编辑资源失败:', error)
    const action = dialogType.value === 'add' ? '新增' : '编辑'
    ElMessage.error(error instanceof Error ? error.message : `${action}资源失败`)
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
    orderNum: 1,
    state: ResourceStatus.ENABLED,
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

// 计算名称列宽度 - 根据最大层级自适应
const nameColumnWidth = computed(() => {
  const baseWidth = 150 // 基础宽度
  const levelWidth = 24 // 每层缩进宽度
  const maxLevel = getMaxLevel(resourcesList.value)
  return baseWidth + maxLevel * levelWidth
})
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

/* 确保对话框显示在最上层 */
.el-dialog {
  z-index: 2999 !important;
}

/* 导入结果弹窗样式 */
.import-result {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.import-result h3 {
  color: #67c23a;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.import-result h3::before {
  content: '✓';
  background: #67c23a;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8eaed;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  justify-content: center;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #67c23a, #409eff);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.stat-label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-weight: 700;
  font-size: 24px;
  color: #303133;
}

.stat-value.success {
  color: #67c23a;
  text-shadow: 0 1px 2px rgba(103, 194, 58, 0.2);
}

.stat-value.warning {
  color: #e6a23c;
  text-shadow: 0 1px 2px rgba(230, 162, 60, 0.2);
}

.stat-value.danger {
  color: #f56c6c;
  text-shadow: 0 1px 2px rgba(245, 108, 108, 0.2);
}

.error-section {
  text-align: left;
  margin-top: 24px;
  padding: 20px;
  background: #fef7f7;
  border-radius: 10px;
  border: 1px solid #fde2e2;
}

.error-section h4 {
  color: #f56c6c;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-section h4::before {
  content: '⚠';
  font-size: 18px;
}

.error-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.error-list::-webkit-scrollbar {
  width: 6px;
}

.error-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.error-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.error-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.error-item {
  background: white;
  color: #f56c6c;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  border-left: 4px solid #f56c6c;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 1px 4px rgba(245, 108, 108, 0.1);
  transition: all 0.2s ease;
}

.error-item:hover {
  background: #fef0f0;
  transform: translateX(2px);
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

  /* 移动端统计卡片改为单列 */
  .result-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-item {
    padding: 20px 16px;
    min-height: 100px;
  }
}
</style>
