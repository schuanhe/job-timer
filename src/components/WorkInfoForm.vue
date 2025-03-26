<script setup lang="ts">
import { ref, onMounted } from 'vue';
import workInfoData from '../data/workInfo.json';

interface WorkInfo {
  workHours: {
    start: string;
    end: string;
  };
  salary: number;
  workDays: number[];
}

const workInfo = ref<WorkInfo>({
  workHours: {
    start: '09:00',
    end: '18:00'
  },
  salary: 10000,
  workDays: [1, 2, 3, 4, 5] // 1-5 代表周一到周五，0代表周日，6代表周六
});

// 加载已保存的工作信息
onMounted(() => {
  try {
    // 优先从localStorage加载数据
    const savedWorkInfo = localStorage.getItem('workInfo');
    if (savedWorkInfo) {
      workInfo.value = JSON.parse(savedWorkInfo);
    } else {
      // 如果localStorage中没有数据，则使用默认配置
      workInfo.value = workInfoData as WorkInfo;
    }
  } catch (error) {
    console.error('加载工作信息失败:', error);
    workInfo.value = workInfoData as WorkInfo;
  }
});

// 保存工作信息
const saveWorkInfo = async () => {
  try {
    // 在实际应用中，这里应该发送请求到后端保存数据
    // 但在这个简化版本中，我们只是更新前端状态
    localStorage.setItem('workInfo', JSON.stringify(workInfo.value));
    alert('保存成功！');
    // 跳转到计时页面
    window.location.href = '/timer';
  } catch (error) {
    console.error('保存工作信息失败:', error);
    alert('保存失败，请重试！');
  }
};

// 工作日选择
const toggleWorkDay = (day: number) => {
  const index = workInfo.value.workDays.indexOf(day);
  if (index > -1) {
    workInfo.value.workDays.splice(index, 1);
  } else {
    workInfo.value.workDays.push(day);
    workInfo.value.workDays.sort();
  }
};

// 检查某天是否被选中
const isDaySelected = (day: number) => {
  return workInfo.value.workDays.includes(day);
};
</script>

<template>
  <div class="work-info-form">
    <h1>工作信息设置</h1>
    
    <div class="form-group">
      <label>工作时间</label>
      <div class="time-inputs">
        <input 
          type="time" 
          v-model="workInfo.workHours.start" 
          class="time-input"
        >
        <span>至</span>
        <input 
          type="time" 
          v-model="workInfo.workHours.end" 
          class="time-input"
        >
      </div>
    </div>
    
    <div class="form-group">
      <label>月薪 (元)</label>
      <input 
        type="number" 
        v-model.number="workInfo.salary" 
        class="salary-input"
        min="0"
      >
    </div>
    
    <div class="form-group">
      <label>工作日</label>
      <div class="weekday-selector">
        <button 
          v-for="day in 7" 
          :key="day-1"
          @click="toggleWorkDay(day-1)"
          :class="{ selected: isDaySelected(day-1) }"
          type="button"
        >
          {{ ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day-1] }}
        </button>
      </div>
    </div>
    
    <div class="form-actions">
      <button @click="saveWorkInfo" class="save-button">保存并进入计时</button>
    </div>
  </div>
</template>

<style scoped>
.work-info-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 2rem;
  color: #fff;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-input {
  flex: 1;
}

.time-inputs span {
  color: #fff;
}

.weekday-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.weekday-selector button {
  flex: 1;
  min-width: 60px;
  padding: 0.5rem;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.weekday-selector button.selected {
  background-color: #646cff;
  border-color: #535bf2;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #646cff;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #535bf2;
}
</style>