import { useState, useEffect } from "react"
import type { Drink, Temperature, Sweetness } from "../types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

const TEMPERATURES: Temperature[] = ['常温', '热饮', '标准冰', '少冰', '去冰']
const SWEETNESS_OPTIONS: Sweetness[] = ['无糖', '少糖', '标准糖']

interface DrinkSelectionDialogProps {
  drink: Drink | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (temperature: Temperature, sweetness: Sweetness, quantity: number) => void
  initialTemperature?: Temperature
  initialSweetness?: Sweetness
  initialQuantity?: number
}

export function DrinkSelectionDialog({
  drink,
  open,
  onOpenChange,
  onConfirm,
  initialTemperature = '标准冰',
  initialSweetness = '标准糖',
  initialQuantity = 1,
}: DrinkSelectionDialogProps) {
  const [temperature, setTemperature] = useState<Temperature>(initialTemperature)
  const [sweetness, setSweetness] = useState<Sweetness>(initialSweetness)
  const [quantity, setQuantity] = useState<number>(initialQuantity)

  // 当弹窗打开或初始值变化时，重置状态
  useEffect(() => {
    if (open) {
      setTemperature(initialTemperature)
      setSweetness(initialSweetness)
      setQuantity(initialQuantity)
    }
  }, [open, initialTemperature, initialSweetness, initialQuantity])

  const handleConfirm = () => {
    onConfirm(temperature, sweetness, quantity)
    onOpenChange(false)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  if (!drink) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>选择 {drink.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 饮品信息 */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">{drink.icon}</div>
            <div className="flex-1">
              <div className="text-base font-medium text-gray-900">
                {drink.name}
              </div>
              {drink.price && (
                <div className="text-sm text-gray-500 mt-0.5">
                  ¥{drink.price}
                </div>
              )}
            </div>
          </div>

          {/* 温度选择 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">温度</div>
            <div className="grid grid-cols-5 gap-2">
              {TEMPERATURES.map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setTemperature(temp)}
                  className={cn(
                    "h-9 rounded border text-xs font-medium transition-colors",
                    temperature === temp
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* 甜度选择 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">甜度</div>
            <div className="grid grid-cols-3 gap-2">
              {SWEETNESS_OPTIONS.map((sweet) => (
                <button
                  key={sweet}
                  type="button"
                  onClick={() => setSweetness(sweet)}
                  className={cn(
                    "h-9 rounded border text-xs font-medium transition-colors",
                    sweetness === sweet
                      ? "bg-blue-50 border-blue-600 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  {sweet}
                </button>
              ))}
            </div>
          </div>

          {/* 数量选择 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">数量</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={cn(
                  "h-9 w-9 rounded border border-gray-300 flex items-center justify-center text-gray-700 transition-colors",
                  quantity <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                <svg
                  className="w-4 h-4"
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
              <div className="flex-1 text-center">
                <span className="text-lg font-medium text-gray-900">
                  {quantity}
                </span>
              </div>
              <button
                type="button"
                onClick={handleIncrease}
                className="h-9 w-9 rounded border border-gray-300 flex items-center justify-center text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4"
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
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white h-9"
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

