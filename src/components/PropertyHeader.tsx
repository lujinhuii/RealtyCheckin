import { RefreshCw, Phone, ScanLine, Settings } from 'lucide-react'
import { Button } from './ui/button'

export function PropertyHeader() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部按钮 */}
      <div className="p-4 flex items-center gap-2">
        <Settings className="w-6 h-6 text-gray-700" />
        <Button 
          variant="outline" 
          className="h-8 px-4 rounded-full text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          今日接待顺序
        </Button>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* 标题 */}
        <div className="text-center mb-6">
          <div className="text-2xl font-medium text-gray-800 mb-2">欢迎来访</div>
          <div className="text-4xl font-bold text-gray-900">思为科技营销中心</div>
        </div>

        {/* 提示文字 */}
        <div className="text-sm text-gray-600 mb-6">请打开微信扫一扫进行签到</div>

        {/* 二维码 */}
        <div className="relative mb-4">
          <div className="relative w-64 h-64 bg-white  rounded-lg flex items-center justify-center p-4 shadow-sm">
            <img 
              src="/qrcode.png" 
              alt="签到二维码" 
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-gray-400 text-sm">二维码图片<br/>(qrcode.png)</div>';
                }
              }}
            />
          </div>
        </div>

        {/* 自动刷新提示 */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-8">
          <RefreshCw className="w-3 h-3" />
          <span>2分钟自动刷新</span>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button className="flex items-center justify-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors">
            <Phone className="w-4 h-4" />
            <span>手机号签到</span>
          </button>
          <button className="flex items-center justify-center gap-2 text-blue-600 text-sm hover:text-blue-700 transition-colors">
            <ScanLine className="w-4 h-4" />
            <span>扫描带看码</span>
          </button>
        </div>
      </div>
    </div>
  )
}

