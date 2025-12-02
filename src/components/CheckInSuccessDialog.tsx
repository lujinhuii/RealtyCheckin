import {
  Dialog,
  DialogContent,
} from "./ui/dialog"
import { Button } from "./ui/button"

interface CheckInSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seatName?: string
}

export function CheckInSuccessDialog({
  open,
  onOpenChange,
  seatName,
}: CheckInSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 border-0 shadow-2xl [&>button]:hidden">
        <div className="flex flex-col items-center justify-center p-10 bg-white">
          <div className="text-[17px] text-gray-900 font-medium mb-8 text-center leading-relaxed">
            {seatName ? "签到成功，请引导客户至指定座位" : "签到成功"}
          </div>
          
          {seatName && (
            <div className="text-[64px] leading-none font-medium text-black mb-10 tracking-tight font-sans">
              {seatName}
            </div>
          )}
          
          <Button 
            onClick={() => onOpenChange(false)} 
            className="min-w-[100px] h-9 px-6 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm font-normal text-[14px]"
          >
            好的
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

