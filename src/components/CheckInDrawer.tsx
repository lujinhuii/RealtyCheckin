import { useState } from "react"
import type { Customer, Drink, Seat, DrinkOrderItem, Temperature, Sweetness } from "../types"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useSeatStatus } from "../hooks/useSeatStatus"
import { cn } from "../lib/utils"
import { DrinkSelectionDialog } from "./DrinkSelectionDialog"
import { X } from "lucide-react"

// 固定饮品列表
const DRINKS: Drink[] = [
  { id: "1", name: "美式咖啡", icon: "☕", price: 25 },
  { id: "2", name: "拿铁", icon: "☕", price: 30 },
  { id: "3", name: "卡布奇诺", icon: "☕", price: 32 },
  { id: "4", name: "龙井茶", icon: "🍵", price: 28 },
  { id: "5", name: "铁观音", icon: "🍵", price: 30 },
  { id: "6", name: "鲜榨橙汁", icon: "🍹", price: 25 },
  { id: "7", name: "鲜榨西瓜汁", icon: "🍹", price: 22 },
  { id: "8", name: "柠檬蜂蜜水", icon: "🍋", price: 20 },
  { id: "9", name: "矿泉水", icon: "💧", price: 5 },
]

interface CheckInDrawerProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (orders: DrinkOrderItem[], seat: Seat | null) => void
}

const TEMPERATURES: Temperature[] = ['常温', '热饮', '标准冰', '少冰', '去冰']
const SWEETNESS_OPTIONS: Sweetness[] = ['无糖', '少糖', '标准糖']

export function CheckInDrawer({
  customer,
  open,
  onOpenChange,
  onComplete,
}: CheckInDrawerProps) {
  const { seats, occupySeat } = useSeatStatus()
  const [selectedOrders, setSelectedOrders] = useState<DrinkOrderItem[]>([])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [selectedDrinkForDialog, setSelectedDrinkForDialog] = useState<Drink | null>(null)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleComplete = () => {
    if (selectedSeat) {
      occupySeat(selectedSeat.id)
    }
    onComplete(selectedOrders, selectedSeat)
    // 重置选择
    setSelectedOrders([])
    setSelectedSeat(null)
  }

  const handleCancel = () => {
    setSelectedOrders([])
    setSelectedSeat(null)
    onOpenChange(false)
  }

  const handleDrinkClick = (drink: Drink) => {
    setSelectedDrinkForDialog(drink)
    setEditingOrderId(null)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      // 对话框关闭时清理状态
      setSelectedDrinkForDialog(null)
      setEditingOrderId(null)
    }
  }

  const handleDialogConfirm = (temperature: Temperature, sweetness: Sweetness, quantity: number) => {
    if (!selectedDrinkForDialog) return

    if (editingOrderId) {
      // 编辑模式：更新现有订单
      setSelectedOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrderId
            ? { ...order, temperature, sweetness, quantity }
            : order
        )
      )
    } else {
      // 新增模式：创建新订单
      const newOrder: DrinkOrderItem = {
        id: `${Date.now()}-${Math.random()}`,
        drink: selectedDrinkForDialog,
        temperature,
        sweetness,
        quantity,
      }
      setSelectedOrders((prev) => [...prev, newOrder])
    }
    setSelectedDrinkForDialog(null)
    setEditingOrderId(null)
  }

  const handleEditOrder = (order: DrinkOrderItem) => {
    setSelectedDrinkForDialog(order.drink)
    setEditingOrderId(order.id)
    setDialogOpen(true)
  }

  const handleUpdateTemperature = (orderId: string, temperature: Temperature) => {
    setSelectedOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, temperature } : order
      )
    )
  }

  const handleUpdateSweetness = (orderId: string, sweetness: Sweetness) => {
    setSelectedOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, sweetness } : order
      )
    )
  }

  const handleUpdateQuantity = (orderId: string, delta: number) => {
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

  const handleDeleteOrder = (orderId: string) => {
    setSelectedOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const totalQuantity = selectedOrders.reduce((sum, order) => sum + order.quantity, 0)

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="w-full sm:w-[840px] md:w-[960px] flex flex-col">
          <DrawerCloseButton />
          <DrawerHeader>
            <DrawerTitle>
              {customer ? `为 ${customer.name} 确认签到` : "确认签到"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 px-6 pb-6 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 lg:divide-x lg:divide-gray-200">
            {/* 左列：点饮品 */}
            <div className="space-y-4 min-h-0 overflow-auto lg:pr-6">
              <div className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
                选择饮品
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DRINKS.map((drink) => (
                  <Card
                    key={drink.id}
                    className="cursor-pointer transition-all hover:shadow-md border-gray-200 hover:border-gray-300"
                    onClick={() => handleDrinkClick(drink)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{drink.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {drink.name}
                          </div>
                          {drink.price && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              ¥{drink.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 已选饮品列表 */}
              {selectedOrders.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900">
                    已选饮品 {totalQuantity > 0 && `(${totalQuantity}杯)`}
                  </div>
                  <div className="space-y-2">
                    {selectedOrders.map((order) => (
                      <Card
                        key={order.id}
                        className="border-gray-200"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{order.drink.icon}</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {order.drink.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  × {order.quantity}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* 温度选择 */}
                                <Select
                                  value={order.temperature}
                                  onValueChange={(value) =>
                                    handleUpdateTemperature(order.id, value as Temperature)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-auto min-w-[80px] text-xs px-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TEMPERATURES.map((temp) => (
                                      <SelectItem key={temp} value={temp}>
                                        {temp}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {/* 甜度选择 */}
                                <Select
                                  value={order.sweetness}
                                  onValueChange={(value) =>
                                    handleUpdateSweetness(order.id, value as Sweetness)
                                  }
                                >
                                  <SelectTrigger className="h-7 w-auto min-w-[80px] text-xs px-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {SWEETNESS_OPTIONS.map((sweet) => (
                                      <SelectItem key={sweet} value={sweet}>
                                        {sweet}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center gap-1">
                              {/* 数量调整 */}
                              <div className="flex items-center gap-1 border border-gray-300 rounded">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(order.id, -1)}
                                  disabled={order.quantity <= 1}
                                  className={cn(
                                    "h-7 w-7 flex items-center justify-center text-gray-700 transition-colors",
                                    order.quantity <= 1
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-gray-50"
                                  )}
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>
                                <span className="text-xs text-gray-900 w-6 text-center">
                                  {order.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(order.id, 1)}
                                  className="h-7 w-7 flex items-center justify-center text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* 编辑按钮 */}
                              <button
                                type="button"
                                onClick={() => handleEditOrder(order)}
                                className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                编辑
                              </button>

                              {/* 删除按钮 */}
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

          {/* 右列：选择座位 */}
          <div className="space-y-4 min-h-0 overflow-auto lg:pl-6">
            <div className="text-base font-semibold text-gray-900 pb-2 border-b border-gray-200">
              选择座位
            </div>
            <div className="space-y-4">
              {/* 按区域分组显示座位 */}
              {["A区", "B区", "C区"].map((area) => {
                const areaSeats = seats.filter((seat) => seat.area === area)
                return (
                  <div key={area} className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">{area}</div>
                    <div className="grid grid-cols-6 gap-2">
                      {areaSeats.map((seat) => (
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
                            "h-12 rounded border text-xs font-medium transition-colors",
                            seat.isOccupied
                              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                              : selectedSeat?.id === seat.id
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          )}
                        >
                          {seat.name.split("-")[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {selectedSeat && (
              <div className="text-sm text-gray-600">
                已选择：<span className="font-medium text-gray-900">{selectedSeat.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border border-gray-300 bg-white" />
                <span>可用</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border border-gray-200 bg-gray-100" />
                <span>已占用</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border border-blue-600 bg-blue-600" />
                <span>已选择</span>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-gray-200 bg-white pt-4 pb-6 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-9"
          >
            取消
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!selectedSeat}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            确认签到
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    {/* 饮品选择弹窗 */}
    <DrinkSelectionDialog
      drink={selectedDrinkForDialog}
      open={dialogOpen}
      onOpenChange={handleDialogClose}
      onConfirm={handleDialogConfirm}
      initialTemperature={
        editingOrderId
          ? selectedOrders.find((o) => o.id === editingOrderId)?.temperature || '标准冰'
          : '标准冰'
      }
      initialSweetness={
        editingOrderId
          ? selectedOrders.find((o) => o.id === editingOrderId)?.sweetness || '标准糖'
          : '标准糖'
      }
      initialQuantity={
        editingOrderId
          ? selectedOrders.find((o) => o.id === editingOrderId)?.quantity || 1
          : 1
      }
    />
    </>
  )
}

