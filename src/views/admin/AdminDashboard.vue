<template>
  <div class="dashboard-content">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon users-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon active-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.activeUsers }}</div>
            <div class="stat-label">活跃用户</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon roles-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalRoles }}</div>
            <div class="stat-label">角色数量</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon resources-icon">
            <el-icon><Files /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ stats.totalResources }}</div>
            <div class="stat-label">资源数量</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>用户增长趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-icon><TrendCharts /></el-icon>
              <p>用户增长图表</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>系统访问统计</span>
            </template>
            <div class="chart-placeholder">
              <el-icon><PieChart /></el-icon>
              <p>访问统计图表</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 最近活动 -->
    <el-card class="recent-activities">
      <template #header>
        <span>最近活动</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="activity in recentActivities"
          :key="activity.id"
          :timestamp="activity.time"
          :type="activity.type"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { User, UserFilled, Files, TrendCharts, PieChart } from '@element-plus/icons-vue'

// 统计数据
const stats = reactive({
  totalUsers: 1250,
  activeUsers: 892,
  totalRoles: 8,
  totalResources: 156,
})

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    content: '新用户 张三 注册成功',
    time: '2024-01-15 10:30',
    type: 'success',
  },
  {
    id: 2,
    content: '角色权限配置已更新',
    time: '2024-01-15 09:15',
    type: 'primary',
  },
  {
    id: 3,
    content: '系统维护完成',
    time: '2024-01-15 08:00',
    type: 'info',
  },
  {
    id: 4,
    content: '用户 李四 登录系统',
    time: '2024-01-15 07:45',
    type: 'success',
  },
])

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('Admin Dashboard 已加载')
})
</script>

<style scoped>
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 图表区域样式 */
.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 最近活动样式 */
.recent-activities {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-section .el-col {
    margin-bottom: 20px;
  }
}
</style>
