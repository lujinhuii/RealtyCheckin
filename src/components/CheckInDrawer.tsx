import { useState, useEffect } from "react"
import type { Customer, Drink, Seat, DrinkOrderItem, Temperature, Sweetness, CheckInMode, ExternalOrder } from "../types"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  DrawerFooter,
} from "./ui/drawer"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { useSeatStatus } from "../hooks/useSeatStatus"
import { cn } from "../lib/utils"
import { DrinkSelectionDialog } from "./DrinkSelectionDialog"
import { ShoppingBag, Plus, Minus, Trash2, Armchair, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog"
import { Badge } from "./ui/badge"

// 固定饮品列表
const DRINKS: Drink[] = [
  {
    id: "1",
    name: "美式咖啡",
    icon: "☕",
    price: 25,
    category: "咖啡系列",
    tags: ["咖啡", "美式"],
    description: "专业的美式咖啡服务, 按杯计费",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "拿铁",
    icon: "☕",
    price: 30,
    category: "咖啡系列",
    tags: ["咖啡", "拿铁"],
    description: "专业的拿铁服务, 按杯计费",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "卡布奇诺",
    icon: "☕",
    price: 32,
    category: "咖啡系列",
    tags: ["咖啡", "卡布奇诺"],
    description: "专业的卡布奇诺服务, 按杯计费",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "龙井茶",
    icon: "🍵",
    price: 28,
    category: "茶系列",
    tags: ["绿茶", "龙井"],
    description: "专业的龙井茶服务, 按杯计费",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    name: "铁观音",
    icon: "🍵",
    price: 30,
    category: "茶系列",
    tags: ["乌龙茶", "铁观音"],
    description: "专业的铁观音服务, 按杯计费",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop",
  },
  {
    id: "6",
    name: "鲜榨橙汁",
    icon: "🍹",
    price: 25,
    category: "果汁系列",
    tags: ["果汁", "橙汁"],
    description: "新鲜现榨的橙汁, 按杯计费",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop",
  },
  {
    id: "7",
    name: "鲜榨西瓜汁",
    icon: "🍹",
    price: 22,
    category: "果汁系列",
    tags: ["果汁", "西瓜"],
    description: "新鲜现榨的西瓜汁, 按杯计费",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop",
  },
  {
    id: "8",
    name: "柠檬蜂蜜水",
    icon: "🍋",
    price: 20,
    category: "其他",
    tags: ["饮品", "柠檬"],
    description: "清爽的柠檬蜂蜜水, 按杯计费",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop",
  },
  {
    id: "9",
    name: "矿泉水",
    icon: "💧",
    price: 5,
    category: "其他",
    tags: ["水", "矿泉水"],
    description: "优质矿泉水, 按杯计费",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200&h=200&fit=crop",
  },
]

// 饮品分类列表
const DRINK_CATEGORIES = ["咖啡系列", "茶系列", "果汁系列", "其他"]

interface CheckInDrawerProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (orders: DrinkOrderItem[], seat: Seat | null) => void
}

export function CheckInDrawer({
  customer,
  open,
  onOpenChange,
  onComplete,
}: CheckInDrawerProps) {
  const { seats, occupySeat } = useSeatStatus()
  const [selectedOrders, setSelectedOrders] = useState<DrinkOrderItem[]>([]) // 用于 orderAndSeat 模式
  const [externalOrders, setExternalOrders] = useState<ExternalOrder[]>([]) // 用于外部订单模式
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [selectedDrinkForDialog, setSelectedDrinkForDialog] = useState<Drink | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [cartDialogOpen, setCartDialogOpen] = useState(false) // 购物袋弹窗状态
  const [selectedCategory, setSelectedCategory] = useState<string>(DRINK_CATEGORIES[0]) // 当前选中的分类
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false) // 确认删除对话框状态
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null) // 待删除的订单ID
  const [inlineOrderPanelOpen, setInlineOrderPanelOpen] = useState(false) // 内联点单面板状态
  const [initialExternalOrderIds, setInitialExternalOrderIds] = useState<Set<string>>(new Set()) // 初始外部订单ID集合

  // 计算签到模式
  const mode: CheckInMode = customer?.checkInMode ?? 'orderAndSeat'
  
  // 根据模式计算控制标志
  const allowOrderSelection = mode === 'orderAndSeat' || mode === 'orderOnly'
  const allowSeatSelection = mode === 'seatOnly' || mode === 'orderAndSeat' || mode === 'externalOrdersSeat' || mode === 'externalOrdersSeatAndOrder'
  // 座位选择改为非必填，不选择座位也可以完成签到（保留说明注释，去掉未使用变量）
  const isExternalOrderMode = mode === 'externalOrdersNoSeat' || mode === 'externalOrdersSeat' || mode === 'externalOrdersSeatAndOrder'

  // 打开抽屉时初始化订单和座位
  useEffect(() => {
    if (!open) {
      // 关闭抽屉时也关闭内联点单面板
      setInlineOrderPanelOpen(false)
      return
    }
    setSelectedSeat(null)
    setSelectedCategory(DRINK_CATEGORIES[0]) // 重置为第一个分类
    if (isExternalOrderMode) {
      // 外部订单模式：使用客户的外部订单
      const initialIds = new Set((customer?.externalOrders ?? []).map(o => o.id))
      setInitialExternalOrderIds(initialIds)
      setExternalOrders(customer?.externalOrders ? [...customer.externalOrders] : [])
      setSelectedOrders([])
    } else {
      // 其他模式：清空订单
      setInitialExternalOrderIds(new Set())
      setSelectedOrders([])
      setExternalOrders([])
    }
  }, [open, mode, customer, isExternalOrderMode])

  const handleComplete = () => {
    if (selectedSeat) {
      occupySeat(selectedSeat.id)
    }
    // 如果是外部订单模式，合并外部订单和新添加的订单
    const ordersToComplete = isExternalOrderMode
      ? [
          ...externalOrders.flatMap(order => order.items),
          ...selectedOrders,
        ]
      : selectedOrders
    onComplete(ordersToComplete, selectedSeat)
    // 重置选择
    setSelectedOrders([])
    setExternalOrders([])
    setSelectedSeat(null)
    setInlineOrderPanelOpen(false)
  }

  const handleCancel = () => {
    setSelectedOrders([])
    setExternalOrders([])
    setSelectedSeat(null)
    onOpenChange(false)
  }

  const handleDrinkClick = (drink: Drink) => {
    setSelectedDrinkForDialog(drink)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      // 对话框关闭时清理状态
      setSelectedDrinkForDialog(null)
    }
  }

  const handleDialogConfirm = (temperature: Temperature, sweetness: Sweetness, quantity: number) => {
    if (!selectedDrinkForDialog) return

    // 仅支持新增订单，不支持编辑
    const newOrder: DrinkOrderItem = {
      id: `${Date.now()}-${Math.random()}`,
      drink: selectedDrinkForDialog,
      temperature,
      sweetness,
      quantity,
    }
    setSelectedOrders((prev) => [...prev, newOrder])
    // 确认后关闭对话框并清理状态，允许继续添加其他饮品
    setDialogOpen(false)
    setSelectedDrinkForDialog(null)
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrderIdToDelete(orderId)
    setConfirmDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!orderIdToDelete) return
    
    if (isExternalOrderMode) {
      // 外部订单模式：删除整个订单
      setExternalOrders((prev) => prev.filter((order) => order.id !== orderIdToDelete))
    } else {
      // 普通模式：删除单个饮品项
      setSelectedOrders((prev) => prev.filter((order) => order.id !== orderIdToDelete))
    }
    
    // 重置状态
    setOrderIdToDelete(null)
    setConfirmDeleteDialogOpen(false)
  }

  const handleSaveInlineOrder = () => {
    if (selectedOrders.length === 0) return
    // 仅支持新增订单，不支持编辑
    const newExternalOrder: ExternalOrder = {
      id: `${Date.now()}-${Math.random()}`,
      items: selectedOrders.map(i => ({ ...i })),
      orderTime: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    setExternalOrders((prev) => [...prev, newExternalOrder])
    setSelectedOrders([])
    setInlineOrderPanelOpen(false)
  }

  const handleCartConfirm = () => {
    // 关闭购物袋弹窗
    setCartDialogOpen(false)
  }

  // 计算当前分类下的饮品列表
  const drinksInCategory = DRINKS.filter(drink => drink.category === selectedCategory)

  // 获取饮品的完整信息（包括图片），如果外部订单中的饮品缺少图片，从DRINKS中查找
  const getDrinkWithImage = (drink: Drink): Drink => {
    if (drink.image) return drink
    const fullDrink = DRINKS.find(d => d.id === drink.id)
    return fullDrink || drink
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="w-full sm:w-[840px] md:w-[960px] h-full flex flex-col bg-gray-50/50">
          <DrawerCloseButton />
          <DrawerHeader className="bg-white border-b border-gray-100 px-6 py-4">
            <DrawerTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Badge variant="outline" className="rounded-md bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5">
                签到
              </Badge>
              {customer ? `为 ${customer.name} 确认签到` : "确认签到"}
            </DrawerTitle>
          </DrawerHeader>

          <div className={cn(
            "flex-1 min-h-0 grid",
            allowSeatSelection && mode !== 'seatOnly' 
              ? "grid-cols-1 lg:grid-cols-[1fr_340px]" 
              : "grid-cols-1"
          )}>
            {/* 左列：点饮品（seatOnly 模式不显示） */}
            {mode !== 'seatOnly' && (
            <div className="flex min-h-0 overflow-hidden bg-white lg:border-r border-gray-200 relative">
              {allowOrderSelection ? (
                // 点单模式：左侧分类导航 + 右侧饮品列表
                <>
                  {/* 左侧分类导航栏 */}
                  <div className="w-32 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 p-3 overflow-y-auto">
                    <div className="space-y-1">
                      {DRINK_CATEGORIES.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCategory(category)
                          }}
                          className={cn(
                            "w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left relative group",
                            selectedCategory === category
                              ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                              : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 右侧饮品列表 */}
                  <div className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6 bg-white">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{selectedCategory}</h3>
                      <p className="text-sm text-gray-500 mt-1">请选择客户需要的饮品</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {drinksInCategory.map((drink) => (
                        <div
                          key={drink.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDrinkClick(drink)
                          }}
                          className="group cursor-pointer relative bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-100"
                        >
                          <div className="flex gap-4">
                            {/* 饮品图片 */}
                            <div className="flex-shrink-0">
                              {drink.image ? (
                                <img
                                  src={drink.image}
                                  alt={drink.name}
                                  className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                                />
                              ) : (
                                <div className="w-24 h-24 flex items-center justify-center bg-blue-50 rounded-lg text-3xl text-blue-500">
                                  {drink.icon || "☕"}
                                </div>
                              )}
                            </div>
                            
                            {/* 饮品信息 */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-base font-bold text-gray-900 line-clamp-1" title={drink.name}>
                                    {drink.name}
                                  </h4>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-base font-bold text-blue-600">
                                  ¥{drink.price}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gray-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <Plus className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // 外部订单模式：显示外部订单列表
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900">
                      订单
                    </div>
                    {mode === 'externalOrdersSeatAndOrder' && (
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedOrders([])
                          setInlineOrderPanelOpen(true)
                        }}
                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                      >
                        点单
                      </Button>
                    )}
                  </div>
                  
                  {/* 外部订单列表 */}
                  {externalOrders.length > 0 ? (
                    <div className="space-y-4">
                      {externalOrders
                        .slice()
                        .sort((a, b) => {
                          const aIsInitial = initialExternalOrderIds.has(a.id)
                          const bIsInitial = initialExternalOrderIds.has(b.id)
                          // 新增订单（非初始）排在前面，初始订单排在后面
                          if (aIsInitial && !bIsInitial) return 1
                          if (!aIsInitial && bIsInitial) return -1
                          return 0
                        })
                        .map((order) => {
                        const orderTotalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
                        // 通过 initialExternalOrderIds 排序后，这里不再需要单独标记 isInitial
                        return (
                          <Card
                            key={order.id}
                            className="border-gray-200 shadow-sm overflow-hidden"
                          >
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-gray-500">订单 #{order.id.slice(-6)}</span>
                                {order.orderTime && (
                                  <span className="text-xs text-gray-400">{order.orderTime}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-xs text-red-600 hover:text-red-700 hover:underline"
                                >
                                  作废订单
                                </button>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                {order.items.map((item) => {
                                  const drinkWithImage = getDrinkWithImage(item.drink)
                                  return (
                                  <div key={item.id} className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      {drinkWithImage.image ? (
                                        <img
                                          src={drinkWithImage.image}
                                          alt={drinkWithImage.name}
                                          className="w-12 h-12 object-cover rounded-md bg-gray-100"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-xl">
                                          {drinkWithImage.icon}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-bold text-gray-900">
                                          {drinkWithImage.name}
                                        </span>
                                        <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                          × {item.quantity}
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {item.temperature} · {item.sweetness}
                                      </div>
                                    </div>
                                  </div>
                                  )
                                })}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                <span className="text-xs text-gray-500">
                                  共 <span className="font-medium text-gray-900">{orderTotalQuantity}</span> 杯
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                       <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                       <p>暂无订单</p>
                     </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* 右列：选择座位（仅在允许时显示） */}
            {allowSeatSelection && (
            <div className={cn(
              "flex flex-col min-h-0 bg-white",
              mode !== 'seatOnly' ? "lg:border-l border-gray-200" : "flex-1"
            )}>
              <div className="p-4 lg:p-6 flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">选择座位</h3>
                    <p className="text-sm text-gray-500 mt-1">请为客户分配座位</p>
                  </div>
                  {selectedSeat && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      已选: {selectedSeat.name.replace(/区-0*/, '')}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                  <div className={cn(
                    "grid gap-2 sm:gap-3",
                    mode === 'seatOnly' 
                      ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10" 
                      : "grid-cols-4"
                  )}>
                    {seats.map((seat) => {
                      const displayName = seat.name.replace(/区-0*/, '')
                      const isSelected = selectedSeat?.id === seat.id
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.isOccupied}
                          onClick={() => {
                            if (!seat.isOccupied) {
                              setSelectedSeat(seat)
                            }
                          }}
                          className={cn(
                            "aspect-square rounded-xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden",
                            seat.isOccupied
                              ? "bg-gray-100 border-transparent text-gray-300 cursor-not-allowed"
                              : isSelected
                              ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 hover:shadow-sm"
                          )}
                        >
                          <Armchair className={cn(
                            "w-5 h-5 mb-1",
                            seat.isOccupied ? "opacity-20" : isSelected ? "opacity-100" : "opacity-60"
                          )} />
                          <span className="text-sm font-bold">{displayName}</span>
                          {isSelected && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-bl-lg" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm border border-gray-200 bg-white" />
                      <span>可用</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-gray-100" />
                      <span>已占</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm border border-blue-500 bg-blue-50" />
                      <span>已选</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          <DrawerFooter className="bg-white border-t border-gray-100 px-6 py-4 flex-shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between w-full max-w-full">
              {/* 左侧：购物袋按钮 */}
              <div>
                {allowOrderSelection && (
                  <button
                    type="button"
                    onClick={() => selectedOrders.length > 0 && setCartDialogOpen(true)}
                    disabled={selectedOrders.length === 0}
                    className={cn(
                      "relative flex items-center gap-2.5 px-4 h-10 rounded-full transition-all",
                      selectedOrders.length > 0
                        ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-medium">购物袋</span>
                    {selectedOrders.length > 0 && (
                      <span className="bg-white text-gray-900 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold px-1">
                        {selectedOrders.reduce((sum, order) => sum + order.quantity, 0)}
                      </span>
                    )}
                  </button>
                )}
              </div>
              
              {/* 右侧：取消和确认签到按钮 */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-10 px-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  取消
                </Button>
                <Button
                  onClick={handleComplete}
                  className="h-10 px-8 font-medium shadow-md transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                >
                  确认签到
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 饮品选择弹窗 */}
      <DrinkSelectionDialog
        drink={selectedDrinkForDialog}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onConfirm={handleDialogConfirm}
        initialTemperature="标准冰"
        initialSweetness="标准糖"
        initialQuantity={1}
      />

      {/* 购物袋弹窗 */}
      <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col overflow-hidden p-0 gap-0 rounded-2xl">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white z-10">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              已选饮品
              <Badge variant="secondary" className="ml-2">
                {selectedOrders.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            {selectedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                <p>购物袋是空的</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 group hover:border-blue-200 transition-colors">
                    {/* 饮品图片 */}
                    <div className="flex-shrink-0">
                      {order.drink.image ? (
                        <img
                          src={order.drink.image}
                          alt={order.drink.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-lg text-2xl">
                          {order.drink.icon || "☕"}
                        </div>
                      )}
                    </div>
                    
                    {/* 饮品信息 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{order.drink.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.temperature} · {order.sweetness}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          ¥{(order.drink.price || 0) * order.quantity}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                                if (order.quantity > 1) {
                                    handleUpdateQuantity(order.id, -1)
                                }
                            }}
                            disabled={order.quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-gray-900">
                            {order.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(order.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedOrders.length > 0 && (
            <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  共 <span className="text-gray-900 font-medium">{selectedOrders.reduce((sum, order) => sum + order.quantity, 0)}</span> 杯饮品
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-600">总计</span>
                  <span className="text-xl font-bold text-blue-600">
                    ¥{selectedOrders.reduce((sum, order) => 
                      sum + (order.drink.price || 0) * order.quantity, 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" onClick={handleCartConfirm}>
                确认
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 确认删除订单对话框 */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>确认作废订单</DialogTitle>
            <DialogDescription className="pt-2">
              确定要作废此订单吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteDialogOpen(false)
                setOrderIdToDelete(null)
              }}
              className="h-10"
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white h-10"
            >
              确认作废
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 内联点单面板 - 仅在 externalOrdersSeatAndOrder 模式显示 */}
      {mode === 'externalOrdersSeatAndOrder' && inlineOrderPanelOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* 遮罩层 */}
            <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"
            onClick={() => {
              setInlineOrderPanelOpen(false)
            }}
          />
          
          {/* 右侧点单面板 */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[560px] md:w-[720px] lg:w-[860px] bg-white shadow-2xl flex flex-col h-full pointer-events-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 面板头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">选择饮品</h3>
              <button
                type="button"
                onClick={() => {
                  setInlineOrderPanelOpen(false)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 面板内容 */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0 overflow-hidden flex">
                {/* 左侧分类导航栏 */}
                <div className="w-32 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 p-3 overflow-y-auto">
                  <div className="space-y-1">
                    {DRINK_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCategory(category)
                        }}
                        className={cn(
                          "w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left relative group",
                          selectedCategory === category
                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                            : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右侧饮品列表 */}
                <div className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6 bg-white">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedCategory}</h3>
                    <p className="text-sm text-gray-500 mt-1">请选择客户需要的饮品</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drinksInCategory.map((drink) => (
                      <div
                        key={drink.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDrinkClick(drink)
                        }}
                        className="group cursor-pointer relative bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-100"
                      >
                        <div className="flex gap-4">
                          {/* 饮品图片 */}
                          <div className="flex-shrink-0">
                            {drink.image ? (
                              <img
                                src={drink.image}
                                alt={drink.name}
                                className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                              />
                            ) : (
                              <div className="w-24 h-24 flex items-center justify-center bg-blue-50 rounded-lg text-3xl text-blue-500">
                                {drink.icon || "☕"}
                              </div>
                            )}
                          </div>
                          
                          {/* 饮品信息 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-base font-bold text-gray-900 line-clamp-1" title={drink.name}>
                                  {drink.name}
                                </h4>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-base font-bold text-blue-600">
                                ¥{drink.price}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-gray-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Plus className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 底部操作栏 */}
              <div className="mt-auto border-t border-gray-100 bg-white p-4 flex items-center justify-between flex-shrink-0">
                {/* 左侧：购物袋按钮（与 DrawerFooter 中的样式一致） */}
                <div>
                  <button
                    type="button"
                    onClick={() => selectedOrders.length > 0 && setCartDialogOpen(true)}
                    disabled={selectedOrders.length === 0}
                    className={cn(
                      "relative flex items-center gap-2.5 px-4 h-10 rounded-full transition-all",
                      selectedOrders.length > 0
                        ? "bg-gray-900 text-white shadow-md hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-medium">购物袋</span>
                    {selectedOrders.length > 0 && (
                      <span className="bg-white text-gray-900 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs font-bold px-1">
                        {selectedOrders.reduce((sum, order) => sum + order.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>
                {/* 右侧：保存为订单按钮 */}
                <div className="flex items-center gap-2">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={selectedOrders.length === 0} 
                    onClick={handleSaveInlineOrder}
                  >
                    保存为订单
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  // 辅助函数，用于更新数量（之前在组件内部定义的，这里补上）
  function handleUpdateQuantity(orderId: string, delta: number) {
    setSelectedOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newQuantity = Math.max(1, order.quantity + delta)
          return { ...order, quantity: newQuantity }
        }
        return order
      })
    )
  }
}
