import { RefreshCw, Phone, ScanLine } from 'lucide-react'
import { Button } from './ui/button'

export function PropertyHeader() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部按钮 */}
      <div className="p-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-700 rounded-sm"></div>
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
          <div className="text-4xl font-bold text-gray-900">绿城集团营销中心</div>
        </div>

        {/* 提示文字 */}
        <div className="text-sm text-gray-600 mb-6">请打开微信扫一扫进行签到</div>

        {/* 二维码 */}
        <div className="relative mb-4">
          <div className="relative w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-4 shadow-sm">
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
            {/* 中心品牌标识 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">绿城云</span>
              </div>
            </div>
            {/* 微信图标 - 位于二维码右侧 */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded flex items-center justify-center pointer-events-none">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.597-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .653-.52 1.18-1.162 1.18-.642 0-1.162-.527-1.162-1.18 0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18 0 .653-.52 1.18-1.162 1.18-.642 0-1.162-.527-1.162-1.18 0-.651.52-1.18 1.162-1.18zm5.34 2.554c-1.884-.122-4.024.345-5.728 1.675-1.704 1.342-2.698 3.628-1.895 6.087.11.335.239.662.391.978.512 1.067 1.275 2.013 2.25 2.754a9.623 9.623 0 0 1-3.072-1.892.728.728 0 0 0-.758-.13l-1.579.524c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.31-.763a.844.844 0 0 1 .61-.19c1.335.12 2.704.08 4.024-.12 4.216-.41 7.672-3.847 8.197-8.085a9.324 9.324 0 0 0-1.168-1.19zm-1.649 3.718c.52 0 .942.427.942.953 0 .527-.422.953-.942.953s-.942-.426-.942-.953c0-.526.422-.953.942-.953zm4.498 0c.52 0 .942.427.942.953 0 .527-.422.953-.942.953s-.942-.426-.942-.953c0-.526.422-.953.942-.953z"/>
              </svg>
            </div>
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

