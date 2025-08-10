// ref: 用于创建响应式数据，当数据变化时，使用它的组件会自动更新
// computed: 用于创建计算属性，当依赖的数据变化时，计算属性会自动重新计算
import { ref, computed } from 'vue'

// defineStore: 用于定义状态管理store，这是Pinia的核心API
import { defineStore } from 'pinia'

// 定义并导出计数器store
// useCounterStore: 这是一个组合式函数，用于在组件中使用这个store
// 'counter': store的唯一标识符，用于区分不同的store
// 第二个参数是一个函数，返回store的状态和方法
export const useCounterStore = defineStore('counter', () => {
  // 定义响应式状态：计数器值
  // count: 一个响应式引用，初始值为0
  // 当count.value变化时，使用它的组件会自动重新渲染
  const count = ref(0)

  // 定义计算属性：双倍计数
  // doubleCount: 一个计算属性，依赖于count的值
  // 当count变化时，doubleCount会自动重新计算
  // 计算属性有缓存机制，只有依赖变化时才会重新计算
  const doubleCount = computed(() => count.value * 2)

  // 定义方法：增加计数
  // increment: 一个函数，用于增加count的值
  // 当调用这个函数时，count会+1，相关组件会自动更新
  function increment() {
    count.value++
  }

  // 返回store的公共接口
  // 只有返回的属性和方法才能在组件中使用
  // count: 状态数据
  // doubleCount: 计算属性
  // increment: 操作方法
  return { count, doubleCount, increment }
})
