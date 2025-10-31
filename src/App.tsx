import { useEffect, useMemo, useState } from 'react'
import { PropertyHeader } from './components/PropertyHeader'
import { CustomerList } from './components/CustomerList'
import { CustomerDetail } from './components/CustomerDetail'
import { useMockData } from './hooks/useMockData'
import type { Customer } from './types'
import './App.css'

function App() {
  const customers = useMockData(15)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [widths, setWidths] = useState<{ left: number; mid: number; right: number }>(() => {
    try {
      const saved = localStorage.getItem('layoutWidths')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          typeof parsed?.left === 'number' &&
          typeof parsed?.mid === 'number' &&
          typeof parsed?.right === 'number' &&
          Math.abs(parsed.left + parsed.mid + parsed.right - 100) < 0.01
        ) {
          return parsed
        }
      }
    } catch {}
    return { left: 40, mid: 30, right: 30 }
  })
  const [isDragging, setIsDragging] = useState<false | 'left-mid' | 'mid-right'>(false)
  

  // simple media query hook (desktop >= 1024px)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const handler = () => setIsDesktop(mql.matches)
    handler()
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // persist widths when changed (only on desktop)
  useEffect(() => {
    if (!isDesktop) return
    try {
      localStorage.setItem('layoutWidths', JSON.stringify(widths))
    } catch {}
  }, [widths, isDesktop])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  // 默认选中第一个客户（优先未处理）
  useEffect(() => {
    if (!selectedCustomer && customers.length > 0) {
      const firstPending = customers.find(c => !c.isProcessed)
      setSelectedCustomer(firstPending || customers[0])
    }
  }, [customers, selectedCustomer])

  // dragging
  useEffect(() => {
    if (!isDragging) return
    const container = document.getElementById('three-column-container')
    if (!container) return
    const rect = container.getBoundingClientRect()
    

    const minLeft = 240 // px
    const minMid = 320 // px
    const minRight = 360 // px

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left
      // current px widths based on current percentages
      const leftPx = (widths.left / 100) * rect.width
      const midPx = (widths.mid / 100) * rect.width
      

      if (isDragging === 'left-mid') {
        const newLeftPx = Math.max(minLeft, Math.min(x, rect.width - (minMid + minRight)))
        let newMidPx = leftPx + midPx - newLeftPx
        // enforce min mid and min right
        const maxMidPx = rect.width - newLeftPx - minRight
        newMidPx = Math.max(minMid, Math.min(newMidPx, maxMidPx))
        const newRightPx = rect.width - newLeftPx - newMidPx
        const total = rect.width
        setWidths({
          left: (newLeftPx / total) * 100,
          mid: (newMidPx / total) * 100,
          right: (newRightPx / total) * 100,
        })
      } else if (isDragging === 'mid-right') {
        const boundaryLeft = (widths.left / 100) * rect.width
        const relativeMidRightX = Math.max(boundaryLeft + minMid, Math.min(x, rect.width - minRight))
        const newMidPx = relativeMidRightX - boundaryLeft
        const newRightPx = rect.width - relativeMidRightX
        const total = rect.width
        setWidths({
          left: (boundaryLeft / total) * 100,
          mid: (newMidPx / total) * 100,
          right: (newRightPx / total) * 100,
        })
      }
    }
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, widths])

  const leftStyle = useMemo(() => ({ width: isDesktop ? `${widths.left}%` : '100%', minWidth: isDesktop ? 240 : undefined }), [widths.left, isDesktop])
  const midStyle = useMemo(() => ({ width: isDesktop ? `${widths.mid}%` : '100%', minWidth: isDesktop ? 320 : undefined }), [widths.mid, isDesktop])
  const rightStyle = useMemo(() => ({ width: isDesktop ? `${widths.right}%` : '100%', minWidth: isDesktop ? 360 : undefined }), [widths.right, isDesktop])

  return (
    <div className={"h-screen w-screen overflow-hidden bg-gray-50"}>
      <div
        id="three-column-container"
        className={"h-full flex " + (isDesktop ? 'flex-row' : 'flex-col') + (isDragging ? ' cursor-col-resize select-none' : '')}
      >
        {/* 第一栏：楼盘名称和二维码 */}
        <div style={leftStyle} className="h-full border-r border-gray-200">
          <PropertyHeader />
        </div>

        {/* 左中分隔条（桌面显示） */}
        {isDesktop && (
          <div
            className={"resizer-x"}
            onMouseDown={() => setIsDragging('left-mid')}
            role="separator"
            aria-orientation="vertical"
            aria-label="调整左中列宽度"
          />
        )}

        {/* 第二栏：客户列表 */}
        <div style={midStyle} className="h-full border-r border-gray-200 bg-[#EDEFF0]">
          <CustomerList
            customers={customers}
            selectedCustomerId={selectedCustomer?.id || null}
            onSelectCustomer={handleSelectCustomer}
          />
        </div>

        {/* 中右分隔条（桌面显示） */}
        {isDesktop && (
          <div
            className={"resizer-x"}
            onMouseDown={() => setIsDragging('mid-right')}
            role="separator"
            aria-orientation="vertical"
            aria-label="调整中右列宽度"
          />
        )}

        {/* 第三栏：客户详情 */}
        <div style={rightStyle} className="h-full">
          <CustomerDetail customer={selectedCustomer} />
        </div>
      </div>
    </div>
  )
}

export default App
