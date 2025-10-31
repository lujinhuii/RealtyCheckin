import { useState, useEffect, useCallback } from "react"
import type { Seat } from "../types"

// 生成座位列表
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const areas = ['A区', 'B区', 'C区']
  
  areas.forEach((area, areaIndex) => {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        id: `${area}-${String(i).padStart(2, '0')}`,
        name: `${area}-${String(i).padStart(2, '0')}`,
        area: area,
        isOccupied: false,
      })
    }
  })
  
  return seats
}

// 随机设置一些座位为已占用状态（模拟实时占用）
const getInitialOccupiedSeats = (seats: Seat[]): Set<string> => {
  const occupiedSet = new Set<string>()
  const occupiedCount = Math.floor(seats.length * 0.2) // 约20%的座位被占用
  
  while (occupiedSet.size < occupiedCount) {
    const randomIndex = Math.floor(Math.random() * seats.length)
    occupiedSet.add(seats[randomIndex].id)
  }
  
  return occupiedSet
}

export function useSeatStatus() {
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats())
  const [occupiedSeatIds, setOccupiedSeatIds] = useState<Set<string>>(() => {
    const initialSeats = generateSeats()
    return getInitialOccupiedSeats(initialSeats)
  })

  // 初始化座位占用状态
  useEffect(() => {
    setSeats(prevSeats =>
      prevSeats.map(seat => ({
        ...seat,
        isOccupied: occupiedSeatIds.has(seat.id),
      }))
    )
  }, [])

  // 模拟实时更新座位占用状态（每隔一段时间随机更新）
  useEffect(() => {
    const interval = setInterval(() => {
      setOccupiedSeatIds(prev => {
        const newSet = new Set(prev)
        const availableSeats = seats.filter(s => !newSet.has(s.id))
        
        // 随机释放一个座位
        if (prev.size > 0 && Math.random() > 0.5) {
          const seatsToRelease = Array.from(prev)
          const randomSeatId = seatsToRelease[Math.floor(Math.random() * seatsToRelease.length)]
          newSet.delete(randomSeatId)
        }
        
        // 随机占用一个座位
        if (availableSeats.length > 0 && Math.random() > 0.5) {
          const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)]
          newSet.add(randomSeat.id)
        }
        
        return newSet
      })
    }, 5000) // 每5秒更新一次

    return () => clearInterval(interval)
  }, [seats])

  // 更新座位占用状态
  useEffect(() => {
    setSeats(prevSeats =>
      prevSeats.map(seat => ({
        ...seat,
        isOccupied: occupiedSeatIds.has(seat.id),
      }))
    )
  }, [occupiedSeatIds])

  // 占用一个座位（当用户选择时）
  const occupySeat = useCallback((seatId: string) => {
    setOccupiedSeatIds(prev => new Set(prev).add(seatId))
  }, [])

  // 释放一个座位
  const releaseSeat = useCallback((seatId: string) => {
    setOccupiedSeatIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(seatId)
      return newSet
    })
  }, [])

  return {
    seats,
    occupySeat,
    releaseSeat,
  }
}

