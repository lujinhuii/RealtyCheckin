import { useState, useEffect } from 'react';
import type { Customer, CheckInStatus, Gender, CheckInMode, Drink, Temperature, Sweetness, ExternalOrder } from '../types';

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

// 随机头像图片（风景、猫狗、人物背影等）
const avatarImages: string[] = [
  // 风景
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=256&q=80&auto=format&fit=crop',
  // 猫狗
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558944351-c37f3c5b4a2d?w=256&q=80&auto=format&fit=crop',
  // 人物背影/抽象
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=256&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80&auto=format&fit=crop'
];

function pickRandomAvatar(): string {
  return avatarImages[Math.floor(Math.random() * avatarImages.length)];
}

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
  
  // 使用真实图片作为头像（风景/猫狗/人物背影）
  const avatar = pickRandomAvatar();
  
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
    avatar: pickRandomAvatar(),
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

// 格式化时间为 "MM月DD日 HH:mm" 格式
function formatOrderTime(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

// 创建示例外部订单（用于演示）
// 注意：这里使用简化的饮品数据，实际显示时会从 CheckInDrawer 的 DRINKS 数组中获取完整信息（包括图片）
function createSampleExternalOrders(): ExternalOrder[] {
  // 使用饮品的ID，实际显示时会通过ID匹配获取完整信息
  const sampleDrinkIds = ["1", "2", "6", "3", "4"]; // 美式咖啡、拿铁、鲜榨橙汁、卡布奇诺、龙井茶
  
  const timestamp = Date.now();
  const orderTime1 = formatOrderTime(timestamp - 3600000); // 1小时前
  const orderTime2 = formatOrderTime(timestamp - 7200000); // 2小时前
  
  return [
    {
      id: `order-${timestamp}-1`,
      orderTime: orderTime1,
      items: [
        {
          id: `item-${timestamp}-1-1`,
          drink: { id: sampleDrinkIds[0], name: "美式咖啡", icon: "☕", price: 25 } as Drink,
          temperature: '热饮' as Temperature,
          sweetness: '标准糖' as Sweetness,
          quantity: 2,
        },
        {
          id: `item-${timestamp}-1-2`,
          drink: { id: sampleDrinkIds[1], name: "拿铁", icon: "☕", price: 30 } as Drink,
          temperature: '标准冰' as Temperature,
          sweetness: '少糖' as Sweetness,
          quantity: 1,
        },
      ],
    },
    {
      id: `order-${timestamp}-2`,
      orderTime: orderTime2,
      items: [
        {
          id: `item-${timestamp}-2-1`,
          drink: { id: sampleDrinkIds[2], name: "鲜榨橙汁", icon: "🍹", price: 25 } as Drink,
          temperature: '常温' as Temperature,
          sweetness: '无糖' as Sweetness,
          quantity: 1,
        },
        {
          id: `item-${timestamp}-2-2`,
          drink: { id: sampleDrinkIds[3], name: "卡布奇诺", icon: "☕", price: 32 } as Drink,
          temperature: '热饮' as Temperature,
          sweetness: '标准糖' as Sweetness,
          quantity: 2,
        },
        {
          id: `item-${timestamp}-2-3`,
          drink: { id: sampleDrinkIds[4], name: "龙井茶", icon: "🍵", price: 28 } as Drink,
          temperature: '标准冰' as Temperature,
          sweetness: '少糖' as Sweetness,
          quantity: 1,
        },
      ],
    },
  ];
}

export function useMockData(count: number = 15): Customer[] {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const generatedCustomers = Array.from({ length: count }, () => generateCustomer());
    
    // 为前4个客户设置演示模式
    if (generatedCustomers.length >= 4) {
      // 第1个客户：仅分配座位
      generatedCustomers[0].checkInMode = 'seatOnly' as CheckInMode;
      generatedCustomers[0].name = '仅分配座位';
      
      // 第2个客户：点单 + 分配座位（默认，无需设置）
      generatedCustomers[1].checkInMode = 'orderAndSeat' as CheckInMode;
      generatedCustomers[1].name = '点单+座位';
      
      // 第3个客户：外部点单，仅可删除，不可修改，不支持分配座位
      generatedCustomers[2].checkInMode = 'externalOrdersNoSeat' as CheckInMode;
      generatedCustomers[2].externalOrders = createSampleExternalOrders();
      generatedCustomers[2].name = '外部订单无座位';
      
      // 第4个客户：外部点单，仅可删除，不可修改，支持分配座位
      generatedCustomers[3].checkInMode = 'externalOrdersSeat' as CheckInMode;
      generatedCustomers[3].externalOrders = createSampleExternalOrders();
      generatedCustomers[3].name = '外部订单+座位';
    }
    
    setCustomers(generatedCustomers);
  }, [count]);

  return customers;
}

export { familyStructures, occupations };

