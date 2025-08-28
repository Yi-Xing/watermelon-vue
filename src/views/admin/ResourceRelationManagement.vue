<template>
  <div class="resource-relations-content">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>资源关联管理</h2>
      <div class="header-actions">
        <el-button
          v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_ADD_BUTTON"
          type="primary"
          @click="handleAdd"
        >
          <el-icon><Plus /></el-icon>
          新增关联
        </el-button>
        <el-button
          v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_EXCEL_IMPORT_BUTTON"
          @click="handleImport"
        >
          <el-icon><Upload /></el-icon>
          导入
        </el-button>
        <el-button
          v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_EXCEL_EXPORT_BUTTON"
          @click="handleExport"
          :loading="exporting"
        >
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

    <!-- 资源关联树表 -->
    <el-card class="resource-relations-table-card">
      <el-table
        :data="resourceRelationsList"
        v-loading="loading"
        stripe
        row-key="resourcePath"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="name" label="资源名称" :width="nameColumnWidth" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ row.typeDesc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="资源Code" width="350" />
        <el-table-column prop="orderNum" label="显示顺序" width="90" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === 1 ? 'success' : 'danger'">
              {{ row.stateDesc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_UPDATE_BUTTON"
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="BUTTON_PERMISSIONS.ADMIN_RESOURCE_RELATION_DELETE_BUTTON"
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑资源关联对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增资源关联' : '编辑资源关联'"
      width="700px"
    >
      <el-form
        ref="relationFormRef"
        :model="relationForm"
        :rules="relationFormRules"
        label-width="120px"
      >
        <el-form-item label="父级资源" prop="parentId">
          <el-input
            v-model="relationForm.parentName"
            placeholder="请选择父级资源"
            readonly
            @click="showParentSelector = true"
          >
            <template #append>
              <el-button @click="showParentSelector = true">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="子级资源" prop="childId">
          <el-input
            v-model="relationForm.childName"
            placeholder="请选择子级资源"
            readonly
            @click="showChildSelector = true"
          >
            <template #append>
              <el-button @click="showChildSelector = true">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="relationForm.orderNum" :min="1" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 父级资源选择器 -->
    <el-dialog v-model="showParentSelector" title="选择父级资源" width="600px">
      <div class="resource-selector">
        <el-tree
          :data="parentSelectorTree"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          highlight-current
          @node-click="handleParentSelect"
          default-expand-all
        />
      </div>
      <template #footer>
        <el-button @click="showParentSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmParentSelect">确定</el-button>
      </template>
    </el-dialog>

    <!-- 子级资源选择器 -->
    <el-dialog v-model="showChildSelector" title="选择子级资源" width="800px">
      <div class="child-resource-selector">
        <!-- 搜索框 -->
        <div class="selector-search">
          <el-form :model="{ name: childSearchName, code: childSearchCode }" inline>
            <el-form-item label="资源名称">
              <el-input
                v-model="childSearchName"
                placeholder="请输入资源名称"
                clearable
                style="width: 200px"
                @keyup.enter="handleChildSearch"
                @clear="handleChildSearch"
              />
            </el-form-item>
            <el-form-item label="资源Code">
              <el-input
                v-model="childSearchCode"
                placeholder="请输入资源Code"
                clearable
                style="width: 200px"
                @keyup.enter="handleChildSearch"
                @clear="handleChildSearch"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChildSearch">搜索</el-button>
              <el-button @click="handleChildReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 资源表格 -->
        <el-table
          :data="childSelectorData"
          @row-click="handleChildSelect"
          highlight-current-row
          style="margin-top: 15px"
          max-height="400px"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" width="150" />
          <el-table-column prop="typeDesc" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)">
                {{ row.typeDesc }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="资源Code" min-width="200" show-overflow-tooltip />
          <el-table-column prop="stateDesc" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.state === 1 ? 'success' : 'danger'">
                {{ row.stateDesc }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="selector-pagination">
          <el-pagination
            v-model:current-page="childResourcesCurrentPage"
            v-model:page-size="childResourcesPageSize"
            :page-sizes="[10, 20, 50]"
            :total="childResourcesTotal"
            layout="total, sizes, prev, pager, next"
            @current-change="handleChildPageChange"
            @size-change="handleChildSizeChange"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showChildSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmChildSelect">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入结果弹窗 -->
    <ImportResultDialog v-model="importResultVisible" :import-data="importResult" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download } from '@element-plus/icons-vue'
import { BUTTON_PERMISSIONS } from '@/constants/permissionCode'
import type {
  ResourceRelationTreeNode,
  ResourceRelationForm,
  ResourceRelationSearchForm,
  CreateResourceRelationRequest,
  UpdateResourceRelationRequest,
  ImportResult,
} from '@/types/resourceRelation'

import ImportResultDialog from '@/components/common/ImportResultDialog.vue'
import type { Resource } from '@/types/resource'
import * as resourceRelationApi from '@/api/admin/resourceRelation'

// 搜索表单
const searchForm = reactive<ResourceRelationSearchForm>({
  name: '',
  code: '',
  state: 0, // 默认选择"全部"
})

// 资源关联列表
const resourceRelationsList = ref<ResourceRelationTreeNode[]>([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const relationFormRef = ref()
const submitting = ref(false)

// 导出状态控制
const exporting = ref(false)

// 资源关联表单
const relationForm = reactive<ResourceRelationForm>({
  id: undefined,
  parentId: 0,
  parentName: '',
  childId: 0,
  childName: '',
  orderNum: 1,
})

// 资源选择器
const showParentSelector = ref(false)
const showChildSelector = ref(false)
const selectedParent = ref<ResourceRelationTreeNode | null>(null)
const selectedChild = ref<Resource | null>(null)
const parentResourcesTree = ref<ResourceRelationTreeNode[]>([])
const childResourcesList = ref<Resource[]>([])
const childResourcesTotal = ref(0)
const childResourcesCurrentPage = ref(1)
const childResourcesPageSize = ref(20)
const childSearchName = ref('')
const childSearchCode = ref('')

// 导入结果弹窗
const importResultVisible = ref(false)
const importResult = ref<ImportResult>({
  totalCount: 0,
  insertCount: 0,
  updateCount: 0,
  deleteCount: 0,
  errors: null,
  success: false,
})

// 表单验证规则
const relationFormRules = {
  childId: [{ required: true, message: '请选择子级资源', trigger: 'change' }],
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
}

// 初始化数据
onMounted(() => {
  loadResourceRelations()
  // 加载新增和编辑时，需要的父级资源树
  loadParentResources()
})

// 加载资源关联列表
const loadResourceRelations = async () => {
  loading.value = true
  try {
    const response = await resourceRelationApi.getResourceRelationTree({
      name: searchForm.name,
      code: searchForm.code,
      state: searchForm.state,
    })
    if (response.success && response.data) {
      resourceRelationsList.value = response.data
      console.log('resourceRelationsList', resourceRelationsList.value)
    } else {
      throw new Error(response.message || '获取资源关联列表失败')
    }
  } catch (error) {
    console.error('加载资源关联失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取资源关联列表失败')
  } finally {
    loading.value = false
  }
}

// 加载父级资源树
const loadParentResources = async () => {
  try {
    const response = await resourceRelationApi.getResourceRelationTree({
      name: '',
      code: '',
      state: 1, // 只获取启用状态的资源
    })
    if (response.success && response.data) {
      parentResourcesTree.value = response.data
    }
  } catch (error) {
    console.error('加载父级资源树失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '加载父级资源树失败')
  }
}

// 加载子级资源列表
const loadChildResources = async (pageNum = 1, searchName = '', searchCode = '') => {
  try {
    const response = await resourceRelationApi.getResourceList({
      name: searchName,
      code: searchCode,
      pageNum: pageNum,
      pageSize: childResourcesPageSize.value,
    })
    if (response.success && response.data) {
      childResourcesList.value = response.data.dataList
      childResourcesTotal.value = response.data.total
      childResourcesCurrentPage.value = response.data.current
    }
  } catch (error) {
    console.error('加载子级资源列表失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '加载子级资源列表失败')
  }
}

// 子级资源搜索
const handleChildSearch = () => {
  childResourcesCurrentPage.value = 1
  loadChildResources(1, childSearchName.value, childSearchCode.value)
}

// 子级资源重置
const handleChildReset = () => {
  childSearchName.value = ''
  childSearchCode.value = ''
  childResourcesCurrentPage.value = 1
  loadChildResources(1, '', '')
}

// 子级资源分页变化
const handleChildPageChange = (page: number) => {
  loadChildResources(page, childSearchName.value, childSearchCode.value)
}

// 子级资源每页数量变化
const handleChildSizeChange = (size: number) => {
  childResourcesPageSize.value = size
  childResourcesCurrentPage.value = 1
  loadChildResources(1, childSearchName.value, childSearchCode.value)
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
  loadResourceRelations()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.state = 0
  loadResourceRelations()
}

// 新增资源关联
const handleAdd = () => {
  dialogType.value = 'add'
  resetRelationForm()
  // 加载子级资源列表
  loadChildResources()
  dialogVisible.value = true
}

// 编辑资源关联
const handleEdit = async (row: ResourceRelationTreeNode) => {
  try {
    dialogType.value = 'edit'
    loading.value = true

    // 调用API获取资源关联详情
    const response = await resourceRelationApi.getResourceRelationDetail(row.id)
    if (response.success && response.data) {
      const relationDetail = response.data

      // 填充表单数据
      Object.assign(relationForm, {
        id: relationDetail.id,
        parentId: relationDetail.parentId,
        parentName: relationDetail.parentId === 0 ? '顶级资源' : relationDetail.parentName,
        childId: relationDetail.childId,
        childName: relationDetail.childName,
        orderNum: relationDetail.orderNum,
      })

      // 加载子级资源列表
      loadChildResources()
      dialogVisible.value = true
    } else {
      throw new Error(response.message || '获取资源关联详情失败')
    }
  } catch (error) {
    console.error('获取资源关联详情失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '获取资源关联详情失败')
  } finally {
    loading.value = false
  }
}

// 删除资源关联
const handleDelete = async (row: ResourceRelationTreeNode) => {
  try {
    await ElMessageBox.confirm(`是否确认删除资源关联："${row.name}"？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    loading.value = true
    await resourceRelationApi.deleteResourceRelation(row.id)
    ElMessage.success(`资源关联"${row.name}"删除成功`)
    loadResourceRelations()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除资源关联失败:', error)
      ElMessage.error(error instanceof Error ? error.message : '删除资源关联失败')
    }
  } finally {
    loading.value = false
  }
}

// 显示导入结果
const showImportResult = (data: ImportResult) => {
  importResult.value = { ...data }
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
        ElMessage.info('正在导入资源关联数据...')

        const result = await resourceRelationApi.importResourceRelations(file)

        if (result.success) {
          showImportResult(result.data)
          ElMessage.success('导入成功')
          loadResourceRelations()
        } else {
          ElMessage.error(result.message || '导入失败')
        }
      } catch (error) {
        console.error('导入资源关联失败:', error)
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
  if (exporting.value) {
    return
  }

  try {
    exporting.value = true
    ElMessage.info('正在导出资源关联数据...')

    const blob = await resourceRelationApi.exportResourceRelations({
      name: searchForm.name,
      code: searchForm.code,
      state: searchForm.state,
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resource_relations_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出资源关联失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '导出失败')
  } finally {
    exporting.value = false
  }
}

// 选择父级资源
const handleParentSelect = (data: ResourceRelationTreeNode) => {
  selectedParent.value = data
}

// 确认选择父级资源
const confirmParentSelect = () => {
  if (selectedParent.value) {
    relationForm.parentId = selectedParent.value.resourceId
    relationForm.parentName =
      selectedParent.value.resourceId === 0 ? '顶级资源' : selectedParent.value.name
    showParentSelector.value = false
  }
}

// 选择子级资源
const handleChildSelect = (data: Resource) => {
  selectedChild.value = data
}

// 确认选择子级资源
const confirmChildSelect = () => {
  if (selectedChild.value) {
    relationForm.childId = selectedChild.value.id
    relationForm.childName = selectedChild.value.name
    showChildSelector.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!relationFormRef.value) return

  try {
    await relationFormRef.value.validate()
    submitting.value = true

    if (dialogType.value === 'add') {
      const createData: CreateResourceRelationRequest = {
        parentId: relationForm.parentId,
        childId: relationForm.childId,
        orderNum: relationForm.orderNum,
      }
      await resourceRelationApi.createResourceRelation(createData)
      ElMessage.success('新增成功')
    } else {
      const updateData: UpdateResourceRelationRequest = {
        id: relationForm.id!,
        parentId: relationForm.parentId,
        childId: relationForm.childId,
        orderNum: relationForm.orderNum,
      }
      await resourceRelationApi.updateResourceRelation(updateData)
      ElMessage.success('更新成功')
    }

    dialogVisible.value = false
    submitting.value = false
    loadResourceRelations()
  } catch (error) {
    console.error(dialogType.value === 'add' ? '新增资源关联失败:' : '编辑资源关联失败:', error)
    const action = dialogType.value === 'add' ? '新增' : '编辑'
    ElMessage.error(error instanceof Error ? error.message : `${action}资源关联失败`)
    submitting.value = false
  }
}

// 重置资源关联表单
const resetRelationForm = () => {
  Object.assign(relationForm, {
    id: undefined,
    parentId: 0,
    parentName: '顶级资源',
    childId: 0,
    childName: '',
    orderNum: 1,
  })
}

// 获取类型标签类型
const getTypeTagType = (type: number) => {
  switch (type) {
    case 1:
      return 'primary'
    case 2:
      return 'success'
    case 3:
      return 'warning'
    default:
      return 'info'
  }
}

// 获取资源树的最大层级
const getMaxLevel = (resources: ResourceRelationTreeNode[], currentLevel = 0): number => {
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
  const baseWidth = 150
  const levelWidth = 24
  const maxLevel = getMaxLevel(resourceRelationsList.value)
  return baseWidth + maxLevel * levelWidth
})

// 父级资源选择器树形数据
const parentSelectorTree = computed(() => {
  return [
    {
      id: 0,
      resourceRelationId: 0,
      name: '顶级资源',
      type: 0,
      typeDesc: '',
      code: '',
      orderNum: 0,
      state: 1,
      stateDesc: '',
      remark: '',
      createdTime: '',
      updatedTime: '',
      children: parentResourcesTree.value,
    },
  ]
})

// 子级资源选择器数据
const childSelectorData = computed(() => {
  return childResourcesList.value
})
</script>

<style scoped>
.resource-relations-content {
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

.resource-relations-table-card {
  margin-bottom: 20px;
}

.el-button {
  margin-right: 8px;
}

.resource-selector {
  max-height: 400px;
  overflow-y: auto;
}

.child-resource-selector {
  min-height: 500px;
}

.selector-search {
  margin-bottom: 15px;
}

.selector-pagination {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

/* 确保对话框显示在最上层 */
.el-dialog {
  z-index: 2999 !important;
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
