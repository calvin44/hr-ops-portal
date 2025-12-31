'use client'

import { Card, CardBody, Skeleton } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserLeaveReport } from '@types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartSectionProps {
  selectedUserInfo: UserLeaveReport | undefined
  isLoading: boolean
}

export const ChartSection: React.FC<ChartSectionProps> = ({ selectedUserInfo, isLoading }) => {
  const showSkeleton = isLoading || !selectedUserInfo

  const emptyChartData = {
    labels: [],
    datasets: [],
  }

  const chartData = useMemo(() => {
    if (!selectedUserInfo?.chartConfig) {
      return emptyChartData
    }

    return {
      ...selectedUserInfo.chartConfig,
      // Format X-axis labels to YYYY/MM/DD
      labels: selectedUserInfo.chartConfig.labels.map((label) => label.replace(/-/g, '/')),
    }
  }, [selectedUserInfo])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: '#000000', font: { size: 13 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#000000', font: { size: 13, weight: 'bold' } },
      },
    },
  }

  return (
    <Card shadow="none" className="rounded-portal h-full overflow-hidden">
      <CardBody className="flex h-full flex-col p-6">
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h1 className="text-2xl font-bold">Leave History</h1>
          {!showSkeleton && (
            <span className="text-tiny text-default-400 bg-default-100 rounded px-2 py-1 font-mono">
              {selectedUserInfo.user.name}
            </span>
          )}
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            {showSkeleton ? (
              <motion.div
                key="chart-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <Skeleton className="rounded-portal h-full w-full">
                  <div className="bg-default-200 rounded-portal h-full w-full" />
                </Skeleton>
              </motion.div>
            ) : (
              <motion.div
                key="chart-content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <div className="h-full w-full pb-4">
                  {/* The error should now be gone */}
                  <Bar options={options} data={chartData} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardBody>
    </Card>
  )
}
