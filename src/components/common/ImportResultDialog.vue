<template>
  <el-dialog
    v-model="visible"
    title="导入结果"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="import-result">
      <h3>导入完成！</h3>
      <div class="result-stats" v-if="importData.success">
        <div class="stat-item">
          <span class="stat-label">总行数</span>
          <span class="stat-value">{{ importData.totalCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">新增行数</span>
          <span class="stat-value success">{{ importData.insertCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">更新行数</span>
          <span class="stat-value warning">{{ importData.updateCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">删除行数</span>
          <span class="stat-value danger">{{ importData.deleteCount }}</span>
        </div>
      </div>
      <div v-if="!importData.success" class="error-section">
        <h4>错误信息</h4>
        <div class="error-list">
          <div v-for="(error, index) in importData.errors" :key="index" class="error-item">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleClose">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImportResult } from '@/types/common'

interface Props {
  modelValue: boolean
  importData: ImportResult
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
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
