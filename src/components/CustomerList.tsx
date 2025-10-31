import { useState, useMemo } from "react"
import type { Customer } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search, Grid3x3, Pencil, RefreshCw } from "lucide-react"
import { cn } from "../lib/utils"

interface CustomerListProps {
  customers: Customer[]
  selectedCustomerId: string | null
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerList({ customers, selectedCustomerId, onSelectCustomer }: CustomerListProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending')
  const [searchQuery, setSearchQuery] = useState('')

  // 根据标签页和搜索查询过滤客户
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      if (activeTab === 'pending') {
        return !customer.isProcessed
      } else {
        return customer.isProcessed
      }
    })

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) || 
        customer.phone.includes(query)
      )
    }

    return filtered
  }, [customers, activeTab, searchQuery])

  const pendingCount = customers.filter(c => !c.isProcessed).length
  const processedCount = customers.filter(c => c.isProcessed).length
  const newCustomersCount = 2 // 模拟新客户数量

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* 固定顶部区域 */}
      <div className="flex-shrink-0">
        {/* 标签页 */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors relative",
                activeTab === 'pending'
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              )}
            >
              待处理({pendingCount})
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('processed')}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors relative",
                activeTab === 'processed'
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              )}
            >
              已处理({processedCount})
              {activeTab === 'processed' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* 新客户通知 */}
        {activeTab === 'pending' && newCustomersCount > 0 && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100">
            <button className="flex items-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>有{newCustomersCount}位新客户签到,点击刷新</span>
            </button>
          </div>
        )}

        {/* 搜索和操作栏 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="输入姓名或手机号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 可滚动的客户列表 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-4 py-2">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors relative",
                selectedCustomerId === customer.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              )}
            >
              {/* 选中指示器 */}
              {selectedCustomerId === customer.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"></div>
              )}
              
              {/* 头像 */}
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* 客户信息 */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-base text-gray-900 truncate">
                  {customer.name}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {customer.phone}
                </div>
              </div>

              {/* 右侧信息 */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {/* 状态标签 */}
                {customer.status && (
                  <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full whitespace-nowrap">
                    {customer.status}
                  </span>
                )}
                {/* 时间戳 */}
                {customer.checkInTime && (
                  <span className="text-xs text-gray-500">
                    {customer.checkInTime}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

