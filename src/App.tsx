import { useState } from 'react'
import { PropertyHeader } from './components/PropertyHeader'
import { CustomerList } from './components/CustomerList'
import { CustomerDetail } from './components/CustomerDetail'
import { useMockData } from './hooks/useMockData'
import type { Customer } from './types'
import './App.css'

function App() {
  const customers = useMockData(15)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <div className="grid grid-cols-3 h-full">
        {/* 第一栏：楼盘名称和二维码 */}
        <div className="h-full border-r border-gray-200">
          <PropertyHeader />
        </div>

        {/* 第二栏：客户列表 */}
        <div className="h-full border-r border-gray-200 bg-[#EDEFF0]">
          <CustomerList
            customers={customers}
            selectedCustomerId={selectedCustomer?.id || null}
            onSelectCustomer={handleSelectCustomer}
          />
        </div>

        {/* 第三栏：客户详情 */}
        <div className="h-full">
          <CustomerDetail customer={selectedCustomer} />
        </div>
      </div>
    </div>
  )
}

export default App
