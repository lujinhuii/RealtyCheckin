import { useState, useEffect } from 'react';
import type { Customer, CheckInStatus, Gender } from '../types';

// 中文姓名列表
const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英'];

// 职业列表
const occupations = ['工程师', '教师', '医生', '律师', '设计师', '销售', '经理', '会计', '公务员', '自由职业', '企业主', '学生'];

// 家庭结构选项
const familyStructures = ['单身', '两口之家', '三口之家', '四口及以上'];

// 签到状态列表
const checkInStatuses: CheckInStatus[] = [
  '案场核销礼券',
  'iPad扫码签到',
  '报名活动签到',
  '手机号签到',
  '扫描带看码'
];

// 推荐人身份列表
const recommenderIdentities = ['中介', '朋友', '同事', '业主'];

// 顾问列表
const consultants = [
  { id: '1', name: '孔忆' },
  { id: '2', name: '王文' },
  { id: '3', name: '李明' },
  { id: '4', name: '张华' },
];

// 生成随机手机号
function generatePhone(): string {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(10000000 + Math.random() * 90000000).toString();
  return prefix + suffix;
}

// 生成随机时间戳
function generateCheckInTime(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 最近7天内
  const hoursAgo = Math.floor(Math.random() * 24);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
  
  // 如果是今天，显示时间 HH:mm
  if (daysAgo === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  // 否则显示日期 YYYY-MM-DD
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// 生成推荐时间
function generateRecommendTime(): string {
  const date = new Date(2020, 5, 1 + Math.floor(Math.random() * 10)); // 2020-06-01 到 2020-06-10
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 生成随机客户数据
function generateCustomer(): Customer {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = firstName + lastName;
  const phone = generatePhone();
  const id = Math.random().toString(36).substring(2, 15);
  
  // 使用 UI Avatars API 生成头像
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
  
  // 随机生成状态
  const status = checkInStatuses[Math.floor(Math.random() * checkInStatuses.length)];
  const checkInTime = generateCheckInTime();
  
  // 随机性别
  const gender: Gender = Math.random() > 0.5 ? 'male' : 'female';
  
  // 是否已处理（约20%已处理）
  const isProcessed = Math.random() < 0.2;
  
  // 随机分配顾问（约80%有顾问）
  const consultant = Math.random() < 0.8 
    ? consultants[Math.floor(Math.random() * consultants.length)]
    : undefined;
  
  // 随机生成推荐人信息（约30%有推荐人）
  const hasRecommender = Math.random() < 0.3;
  const recommender = hasRecommender ? {
    name: firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)],
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstNames[Math.floor(Math.random() * firstNames.length)] + lastNames[Math.floor(Math.random() * lastNames.length)])}&background=random&size=128`,
    identity: recommenderIdentities[Math.floor(Math.random() * recommenderIdentities.length)],
    recommendTime: generateRecommendTime(),
    isValid: Math.random() > 0.2, // 80%有效
  } : undefined;
  
  return {
    id,
    name,
    phone,
    avatar,
    status,
    checkInTime,
    gender,
    isProcessed,
    consultant,
    recommender,
  };
}

export function useMockData(count: number = 15): Customer[] {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const generatedCustomers = Array.from({ length: count }, () => generateCustomer());
    setCustomers(generatedCustomers);
  }, [count]);

  return customers;
}

export { familyStructures, occupations };

