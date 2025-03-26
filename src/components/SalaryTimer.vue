<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import workInfoData from '../data/workInfo.json';

interface WorkInfo {
  workHours: {
    start: string;
    end: string;
  };
  salary: number;
  workDays: number[];
}

// 工作信息
const workInfo = ref<WorkInfo>({
  workHours: {
    start: '09:00',
    end: '18:00'
  },
  salary: 10000,
  workDays: [1, 2, 3, 4, 5]
});

// 当前时间
const currentTime = ref(new Date());

// 收入统计
const todayEarnings = ref(0);
const weekEarnings = ref(0);
const monthEarnings = ref(0);

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

// 倒计时
const countdown = ref<CountdownTime>({
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0
});

// 每小时收入
const hourlyEarnings = computed(() => {
  // 计算每月工作天数
  const daysInMonth = new Date(
    currentTime.value.getFullYear(),
    currentTime.value.getMonth() + 1,
    0
  ).getDate();
  
  // 计算本月工作日数量
  let workdaysInMonth = 0;
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      currentTime.value.getFullYear(),
      currentTime.value.getMonth(),
      i
    );
    const dayOfWeek = date.getDay() || 7; // 将0(周日)转换为7
    if (workInfo.value.workDays.includes(dayOfWeek)) {
      workdaysInMonth++;
    }
  }
  
  // 计算每天工作时长（小时）
  const startParts = workInfo.value.workHours.start.split(':');
  const endParts = workInfo.value.workHours.end.split(':');
  
  const startDate = new Date();
  startDate.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
  
  const endDate = new Date();
  endDate.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
  
  const workDurationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  
  // 计算每小时收入
  const hourlyRate = workInfo.value.salary / (workdaysInMonth * workDurationHours);
  
  return hourlyRate;
});

// 是否在工作时间
const isWorkingHours = computed(() => {
  const now = currentTime.value;
  const dayOfWeek = now.getDay() || 7; // 将0(周日)转换为7
  
  // 检查是否是工作日
  if (!workInfo.value.workDays.includes(dayOfWeek)) {
    return false;
  }
  
  // 检查是否在工作时间内
  const startParts = workInfo.value.workHours.start.split(':');
  const endParts = workInfo.value.workHours.end.split(':');
  
  const startTime = new Date();
  startTime.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
  
  const endTime = new Date();
  endTime.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
  
  return now >= startTime && now <= endTime;
});

// 更新倒计时
const updateCountdown = () => {
  if (!isWorkingHours.value) {
    countdown.value = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    return;
  }
  
  const now = currentTime.value;
  const endParts = workInfo.value.workHours.end.split(':');
  
  const endTime = new Date();
  endTime.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
  
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    countdown.value = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    return;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const milliseconds = diff % 1000;
  
  countdown.value = { hours, minutes, seconds, milliseconds };
};

// 每毫秒收入
const msEarnings = computed(() => hourlyEarnings.value / (60 * 60 * 1000));

// 更新收入
const updateEarnings = () => {
  if (!isWorkingHours.value) {
    return;
  }
  
  // 计算今天已经工作的时间（毫秒）
  const now = currentTime.value;
  const startParts = workInfo.value.workHours.start.split(':');
  
  const startTime = new Date();
  startTime.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
  
  const workedMs = Math.max(0, now.getTime() - startTime.getTime());
  
  // 计算今日收入
  todayEarnings.value = workedMs * msEarnings.value;
  
  // 计算本周收入
  // 获取本周的第一天（周一）
  const firstDayOfWeek = new Date(now);
const dayOfWeek = now.getDay(); // 0（周日）~ 6（周六）
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 让周一是第一天
firstDayOfWeek.setDate(now.getDate() + mondayOffset);
firstDayOfWeek.setHours(0, 0, 0, 0);

// 遍历从周一到今天的每一天
// 初始化周收入为0
let weeklyEarnings = 0;
// 创建一个新的日期对象，从本周一开始
const currentDate = new Date(firstDayOfWeek);

// 循环遍历从本周一到当前时间的每一天
while (currentDate <= now) {
  // 获取当前遍历日期的星期几（0-6），将星期天（0）转换为7
  const dayOfWeek = currentDate.getDay() || 7;
  
  // 检查当前日期是否是工作日
  if (workInfo.value.workDays.includes(dayOfWeek)) {
    // 从工作信息中获取上下班时间
    const startParts = workInfo.value.workHours.start.split(':');
    const endParts = workInfo.value.workHours.end.split(':');
    
    // 创建当天的上班时间对象
    const dayStart = new Date(currentDate);
    dayStart.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
    
    // 创建当天的下班时间对象
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);

    // 如果是今天，直接使用已计算的今日收入
    if (currentDate.toDateString() === now.toDateString()) {
      weeklyEarnings += todayEarnings.value; // 直接使用今日收入，避免重复计算
    } else {
      // 如果是之前的工作日，计算全天工作时间（毫秒）并乘以每毫秒收入
      weeklyEarnings += (dayEnd.getTime() - dayStart.getTime()) * msEarnings.value;
    }
  }
  // 日期加1，继续遍历下一天
  currentDate.setDate(currentDate.getDate() + 1);
}
weekEarnings.value = weeklyEarnings;
  
  // 计算本月收入
  // 获取本月的第一天
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  
  // 计算本月工作日的收入
  let monthlyEarnings = 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), i);
    date.setHours(0, 0, 0, 0);
    
    const dayOfWeek = date.getDay() || 7;
    
    // 如果是工作日
    if (workInfo.value.workDays.includes(dayOfWeek)) {
      // 如果是今天
      if (date.getDate() === now.getDate()) {
        monthlyEarnings += todayEarnings.value;
      }
      // 如果是过去的日子
      else if (date < now) {
        const startParts = workInfo.value.workHours.start.split(':');
        const endParts = workInfo.value.workHours.end.split(':');
        
        const startTime = new Date(date);
        startTime.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
        
        const dayWorkMs = endTime.getTime() - startTime.getTime();
        monthlyEarnings += dayWorkMs * msEarnings.value;
      }
    }
  }
  
  monthEarnings.value = monthlyEarnings;
};

// 格式化金额
const formatMoney = (amount: number) => {
  return amount.toFixed(3);
};

// 格式化时间
const formatTime = (time: CountdownTime) => {
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}.${String(time.milliseconds).padStart(3, '0')}`;
};

// 定时器
let timer: number | null = null;

onMounted(() => {
  // 加载工作信息
  try {
    const savedWorkInfo = localStorage.getItem('workInfo');
    if (savedWorkInfo) {
      workInfo.value = JSON.parse(savedWorkInfo);
    } else {
      workInfo.value = workInfoData as WorkInfo;
    }
  } catch (error) {
    console.error('加载工作信息失败:', error);
    workInfo.value = workInfoData as WorkInfo;
  }
  
  // 启动定时器，每10毫秒更新一次
  timer = window.setInterval(() => {
    currentTime.value = new Date();
    updateCountdown();
    updateEarnings();
  }, 10);
});

onBeforeUnmount(() => {
  // 清除定时器
  if (timer !== null) {
    clearInterval(timer);
  }
});

// 返回设置页面
const goToSettings = () => {
  window.location.href = '/#/';
};

// 周末倒计时
const weekendCountdown = computed(() => {
  const now = currentTime.value;
  const dayOfWeek = now.getDay() || 7;
  
  // 如果已经是周末，返回0
  if (dayOfWeek > 5) {
    return { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  }
  
  // 计算到本周五下班的时间
  const friday = new Date(now);
  const daysUntilFriday = 5 - dayOfWeek;
  friday.setDate(friday.getDate() + daysUntilFriday);
  
  const endParts = workInfo.value.workHours.end.split(':');
  friday.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
  
  // 如果当前不是工作时间，从下一个工作日的开始时间计算
  if (!isWorkingHours.value) {
    const startParts = workInfo.value.workHours.start.split(':');
    const nextWorkDay = new Date(now);
    
    if (now.getHours() >= parseInt(endParts[0])) {
      // 如果已经过了今天的下班时间，从明天开始算
      nextWorkDay.setDate(nextWorkDay.getDate() + 1);
    }
    
    nextWorkDay.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
    
    // 计算从下一个工作日到周五的工作时间
    let totalMs = 0;
    const currentDate = new Date(nextWorkDay);
    
    while (currentDate <= friday) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
        
        totalMs += dayEnd.getTime() - dayStart.getTime();
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
    const milliseconds = totalMs % 1000;
    
    return { hours, minutes, seconds, milliseconds };
  }
  
  // 计算当前时间到周五下班的工作时间
  let totalMs = 0;
  const currentDate = new Date(now);
  
  while (currentDate <= friday) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const startParts = workInfo.value.workHours.start.split(':');
      const dayStart = new Date(currentDate);
      dayStart.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
      
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);
      
      if (currentDate.toDateString() === now.toDateString()) {
        // 今天只算剩余工作时间
        totalMs += dayEnd.getTime() - now.getTime();
      } else {
        // 其他工作日算全天
        totalMs += dayEnd.getTime() - dayStart.getTime();
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
  const milliseconds = totalMs % 1000;
  
  return { hours, minutes, seconds, milliseconds };
});
</script>

<template>
  <div class="salary-timer">
    <div class="header">
      <h1>工资计时器</h1>
      <button @click="goToSettings" class="settings-button">设置</button>
    </div>
    
    <div class="status-message" :class="{ 'working': isWorkingHours }">
      {{ isWorkingHours ? '工作中' : '非工作时间' }}
    </div>
    
    <div class="countdown-container">
      <h2>下班倒计时</h2>
      <div class="countdown" :class="{ 'inactive': !isWorkingHours }">
        {{ isWorkingHours ? formatTime(countdown) : '-- : -- : --' }}
      </div>
      <h2>距离周末还需工作</h2>
      <div class="countdown weekend-countdown">
        {{ formatTime(weekendCountdown) }}
      </div>
    </div>
    
    <div class="earnings-container">
      <div class="earnings-box">
        <h3>今日收入</h3>
        <div class="amount">¥ {{ formatMoney(todayEarnings) }}</div>
      </div>
      
      <div class="earnings-box">
        <h3>本周收入</h3>
        <div class="amount">¥ {{ formatMoney(weekEarnings) }}</div>
      </div>
      
      <div class="earnings-box">
        <h3>本月收入</h3>
        <div class="amount">¥ {{ formatMoney(monthEarnings) }}</div>
      </div>
    </div>
    
    <div class="per-ms-container">
      <h3>每小时收入</h3>
      <div class="per-ms-amount">¥ {{ formatMoney(hourlyEarnings) }}</div>
    </div>
  </div>
</template>

<style scoped>
.salary-timer {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  color: #fff;
}

.settings-button {
  padding: 0.5rem 1rem;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background-color: #3c3c3c;
}

.status-message {
  text-align: center;
  padding: 0.5rem;
  margin-bottom: 2rem;
  background-color: #2c2c2c;
  border-radius: 4px;
  color: #ff4d4d;
  font-weight: bold;
}

.status-message.working {
  color: #4dff4d;
}

.countdown-container {
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
  color: #fff;
}

.countdown {
  font-size: 3rem;
  font-weight: bold;
  color: #646cff;
}

.countdown.inactive {
  color: #666;
}

.earnings-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.earnings-box {
  padding: 1.5rem;
  background-color: #2c2c2c;
  border-radius: 8px;
  text-align: center;
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1rem;
}

.amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4dff4d;
}

.per-ms-container {
  padding: 1.5rem;
  background-color: #2c2c2c;
  border-radius: 8px;
  text-align: center;
}

.per-ms-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff9d4d;
}

@media (max-width: 768px) {
  .earnings-container {
    grid-template-columns: 1fr;
  }
}
</style>