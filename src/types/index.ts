export interface Recommender {
  name: string;
  avatar?: string;
  identity: string; // 推荐人身份，如 "中介"
  recommendTime: string; // 推荐时间
  isValid: boolean; // 推荐有效性
}

export interface Consultant {
  id: string;
  name: string;
  avatar?: string;
}

export type CheckInStatus = 
  | '案场核销礼券'
  | 'iPad扫码签到'
  | '报名活动签到'
  | '手机号签到'
  | '扫描带看码';

export type Gender = 'male' | 'female' | '';

export type Temperature = '常温' | '热饮' | '标准冰' | '少冰' | '去冰';

export type Sweetness = '无糖' | '少糖' | '标准糖';

export interface Drink {
  id: string;
  name: string;
  icon?: string; // 图标或 emoji
  price?: number; // 价格（可选）
}

export interface DrinkOrderItem {
  id: string; // 唯一标识（用于编辑/删除）
  drink: Drink; // 饮品信息
  temperature: Temperature; // 温度
  sweetness: Sweetness; // 甜度
  quantity: number; // 数量
}

export interface Seat {
  id: string;
  name: string; // 座位名称，如 "1号桌" 或 "A区-01"
  area?: string; // 区域名称，如 "A区"
  isOccupied: boolean; // 是否已占用
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  age?: number;
  occupation?: string;
  familyStructure?: string;
  budget?: number;
  status?: CheckInStatus; // 签到状态/类型
  checkInTime?: string; // 签到时间
  recommender?: Recommender; // 推荐人信息
  consultant?: Consultant; // 顾问信息
  gender?: Gender; // 性别
  isProcessed?: boolean; // 是否已处理
  selectedDrink?: Drink; // 选择的饮品
  selectedSeat?: Seat; // 选择的座位
}

export interface CustomerFormData {
  name: string;
  gender: Gender;
  age: string; // 年龄范围，如 "25-30岁"
  occupation: string;
  consultantId?: string; // 义务接待顾问ID
}

