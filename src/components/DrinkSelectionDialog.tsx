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
import { Minus, Plus } from "lucide-react"

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
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl gap-0">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">选择规格</DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* 饮品信息 */}
          <div className="flex items-center gap-4">
            {/* 饮品图片 */}
            <div className="flex-shrink-0">
              {drink.image ? (
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
                  {drink.icon || "☕"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {drink.name}
              </h3>
              {drink.price && (
                <div className="text-base font-semibold text-blue-600 mt-1">
                  ¥{drink.price}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {drink.tags?.join(" · ")}
              </p>
            </div>
          </div>

          {/* 温度选择 */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-900">温度</div>
            <div className="grid grid-cols-5 gap-2">
              {TEMPERATURES.map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setTemperature(temp)}
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium transition-all border",
                    temperature === temp
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50"
                  )}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* 甜度选择 */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-900">甜度</div>
            <div className="grid grid-cols-3 gap-3">
              {SWEETNESS_OPTIONS.map((sweet) => (
                <button
                  key={sweet}
                  type="button"
                  onClick={() => setSweetness(sweet)}
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium transition-all border",
                    sweetness === sweet
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50"
                  )}
                >
                  {sweet}
                </button>
              ))}
            </div>
          </div>

          {/* 数量选择 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">购买数量</div>
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-lg border-gray-200 hover:bg-white hover:text-gray-900"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-lg px-8 shadow-sm hover:shadow transition-all"
          >
            确认添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
