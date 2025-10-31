import { useState } from "react"
import type { Customer, Drink, Seat } from "../types"
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
  onComplete: (drinks: Drink[], seat: Seat | null) => void
}

export function CheckInDrawer({
  customer,
  open,
  onOpenChange,
  onComplete,
}: CheckInDrawerProps) {
  const { seats, occupySeat } = useSeatStatus()
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)

  const handleComplete = () => {
    if (selectedSeat) {
      occupySeat(selectedSeat.id)
    }
    onComplete(selectedDrinks, selectedSeat)
    // 重置选择
    setSelectedDrinks([])
    setSelectedSeat(null)
  }

  const handleCancel = () => {
    setSelectedDrinks([])
    setSelectedSeat(null)
    onOpenChange(false)
  }

  const toggleDrink = (drink: Drink) => {
    setSelectedDrinks((prev) => {
      const isSelected = prev.some((d) => d.id === drink.id)
      if (isSelected) {
        return prev.filter((d) => d.id !== drink.id)
      } else {
        return [...prev, drink]
      }
    })
  }

  const isDrinkSelected = (drinkId: string) => {
    return selectedDrinks.some((d) => d.id === drinkId)
  }

  return (
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
              {DRINKS.map((drink) => {
                const isSelected = isDrinkSelected(drink.id)
                return (
                  <Card
                    key={drink.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => toggleDrink(drink)}
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
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {selectedDrinks.length > 0 && (
              <div className="text-sm text-gray-600">
                已选择：<span className="font-medium text-gray-900">
                  {selectedDrinks.map((d) => d.name).join("、")}
                </span>
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
  )
}

