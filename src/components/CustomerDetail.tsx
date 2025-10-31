import { useState, useEffect, type FormEvent } from "react"
import type { Customer, CustomerFormData, Drink, Seat } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"
import { CheckInDrawer } from "./CheckInDrawer"

interface CustomerDetailProps {
  customer: Customer | null
}

const ageRanges = [
  '20岁以下', '20-25岁', '25-30岁', '30-35岁',
  '35-40岁', '40-45岁', '45-50岁', '50-55岁',
  '55-60岁', '60-65岁', '65-70岁', '70岁以上'
]

// 默认顾问
const defaultConsultant = { id: '1', name: '孔忆', avatar: 'https://ui-avatars.com/api/?name=孔忆&background=random&size=128' }

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const { toast } = useToast()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || "",
    gender: customer?.gender || "",
    age: "",
    occupation: customer?.occupation || "",
    consultantId: customer?.consultant?.id || defaultConsultant.id,
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        gender: customer.gender || "",
        age: "",
        occupation: customer.occupation || "",
        consultantId: customer.consultant?.id || defaultConsultant.id,
      })
    }
  }, [customer])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 表单提交由"确认签到"按钮处理，这里只是阻止默认提交行为
  }

  const handleCheckInComplete = (drinks: Drink[], seat: Seat | null) => {
    // 模拟保存客户信息和选择的饮品、座位
    setTimeout(() => {
      const drinkText = drinks.length > 0 ? `，已选择饮品：${drinks.map((d) => d.name).join("、")}` : ""
      const seatText = seat ? `，已选择座位：${seat.name}` : ""
      toast({
        title: "签到成功",
        description: `客户信息已成功确认签到${drinkText}${seatText}`,
      })
      setIsDrawerOpen(false)
    }, 300)
  }

  if (!customer) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            请从左侧列表中选择一个客户
          </div>
        </div>
      </div>
    )
  }

  const currentConsultant = customer.consultant || defaultConsultant

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部顾问信息 */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">首次触达顾问</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">{currentConsultant.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">关联客户</span>
            <span className="text-sm text-gray-400">—</span>
          </div>
        </div>
      </div>

      {/* 滚动内容 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 推荐信息 */}
          {customer.recommender && (
            <div className="space-y-4">
              <div className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                推荐信息
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">推荐人</span>
                  <div className="flex items-center gap-2">
                    {customer.recommender.avatar && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={customer.recommender.avatar} alt={customer.recommender.name} />
                        <AvatarFallback className="text-xs">{customer.recommender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm text-gray-900">{customer.recommender.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">推荐人身份</span>
                  <span className="text-sm text-gray-900">{customer.recommender.identity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">推荐时间</span>
                  <span className="text-sm text-gray-900">{customer.recommender.recommendTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">推荐有效性</span>
                  <span className={cn(
                    "text-sm",
                    customer.recommender.isValid ? "text-green-600" : "text-gray-400"
                  )}>
                    {customer.recommender.isValid ? "有效" : "无效"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 描摹信息 */}
          <div className="space-y-4">
            <div className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
              描摹信息
            </div>

            {/* 姓名 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                姓名 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="请输入"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9"
              />
            </div>

            {/* 性别 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                性别 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                  className={cn(
                    "flex-1 h-9 rounded border text-sm transition-colors",
                    formData.gender === 'male'
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  男
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                  className={cn(
                    "flex-1 h-9 rounded border text-sm transition-colors",
                    formData.gender === 'female'
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  女
                </button>
              </div>
            </div>

            {/* 年龄 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                年龄 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ageRanges.map((ageRange) => (
                  <button
                    key={ageRange}
                    type="button"
                    onClick={() => setFormData({ ...formData, age: ageRange })}
                    className={cn(
                      "h-9 rounded border text-xs transition-colors",
                      formData.age === ageRange
                        ? "bg-blue-50 border-blue-600 text-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {ageRange}
                  </button>
                ))}
              </div>
            </div>

            {/* 职业 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                职业 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="请输入"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="h-9"
              />
            </div>

            {/* 义务接待顾问 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                义务接待顾问
              </label>
              <button
                type="button"
                className="w-full flex items-center justify-between h-9 px-3 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:border-gray-400 transition-colors"
              >
                <span>选择顾问</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 底部操作栏 - 常驻显示 */}
      <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentConsultant.avatar} alt={currentConsultant.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                {currentConsultant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{currentConsultant.name}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <Button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 rounded-md font-medium"
          >
            确认签到
          </Button>
        </div>
      </div>

      {/* 签到抽屉 */}
      <CheckInDrawer
        customer={customer}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onComplete={handleCheckInComplete}
      />
    </div>
  )
}

