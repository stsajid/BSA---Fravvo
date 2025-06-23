"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Building2, Users, Target, LineChart, X } from "lucide-react"

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  // Custom class to hide scrollbar
  const scrollbarHideClass = `
    [&::-webkit-scrollbar]:hidden
    [-ms-overflow-style:none]
    [scrollbar-width:none]
  `

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-5xl p-0 bg-[#fafafa] rounded-xl shadow-lg flex flex-col h-[90vh]`}>
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-[#e5e5e5] flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[#1c1c1e]">Organization Analytics</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-[#69738d] hover:bg-[#d9d9d9]">
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        <div className={`flex-grow overflow-y-auto p-6 space-y-6 ${scrollbarHideClass}`}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-[#0072ed]" />
                <div>
                  <p className="text-sm text-[#69738d]">Total Structure</p>
                  <p className="text-3xl font-bold text-[#1c1c1e]">17</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-[#2ecc71]" />
                <div>
                  <p className="text-sm text-[#69738d]">Total Employees</p>
                  <p className="text-3xl font-bold text-[#1c1c1e]">2387</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-[#ff6b6b]" />
                <div>
                  <p className="text-sm text-[#69738d]">Avg Team Size</p>
                  <p className="text-3xl font-bold text-[#1c1c1e]">140</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                <LineChart className="h-8 w-8 text-[#2ecc71]" />
                <div>
                  <p className="text-sm text-[#69738d]">Divisions</p>
                  <p className="text-3xl font-bold text-[#1c1c1e]">10</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Structure Type Distribution */}
          <Card className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4">Structure Type Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 text-center gap-4">
              <div>
                <p className="text-4xl font-bold text-[#6c5ce7]">10</p>
                <p className="text-sm text-[#69738d]">Divisions</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#00ab2b]">03</p>
                <p className="text-sm text-[#69738d]">Offices</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#f76363]">02</p>
                <p className="text-sm text-[#69738d]">Departments</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#00a5a1]">02</p>
                <p className="text-sm text-[#69738d]">Teams</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Managers by Team Size */}
            <Card className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4">Top Managers by Team Size</h3>
              <div className="space-y-4">
                {[
                  { name: "Oliver Thompson", structures: 1, employees: 245 },
                  { name: "Sophia Martinez", structures: 1, employees: 378 },
                  { name: "Liam Johnson", structures: 1, employees: 412 },
                  { name: "Emma Williams", structures: 1, employees: 157 },
                  { name: "Noah Brown", structures: 1, employees: 389 },
                ].map((manager, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-[#69738d]">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-[#1c1c1e]">{manager.name}</p>
                        <p className="text-sm text-[#69738d]">{manager.structures} structures</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1c1c1e]">{manager.employees}</p>
                      <p className="text-sm text-[#69738d]">employees</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Local Distribution */}
            <Card className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4">Local Distribution</h3>
              <div className="space-y-4">
                {[
                  { name: "Ethan Caldwell", structures: 1, employees: 185 },
                  { name: "Ava Sinclair", structures: 1, employees: 227 },
                  { name: "Mason Brooks", structures: 1, employees: 342 },
                ].map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-[#69738d]">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-[#1c1c1e]">{location.name}</p>
                        <p className="text-sm text-[#69738d]">{location.structures} structures</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1c1c1e]">{location.employees}</p>
                      <p className="text-sm text-[#69738d]">employees</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Division Overview */}
          <Card className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4">Division Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Starlight Division", rank: 1, employees: 245, structures: 1 },
                { name: "Silverwing Division", rank: 2, employees: 378, structures: 1 },
                { name: "Crimson Tide Division", rank: 3, employees: 412, structures: 1 },
                { name: "Noah Brown", rank: 4, employees: 473, structures: 1 },
                { name: "Emerald Forest Division", rank: 5, employees: 156, structures: 1 },
                { name: "Golden Horizon Division", rank: 6, employees: 389, structures: 1 },
                { name: "Thunderstrike Division", rank: 7, employees: 482, structures: 1 },
                { name: "Obsidian Shield Division", rank: 8, employees: 321, structures: 1 },
                { name: "Mystic River Division", rank: 9, employees: 267, structures: 1 },
                { name: "Ironclad Division", rank: 10, employees: 411, structures: 1 },
                { name: "Frostfire Division", rank: 11, employees: 199, structures: 1 },
                { name: "Phoenix Wing Division", rank: 12, employees: 354, structures: 1 },
                { name: "Titanium Division", rank: 13, employees: 456, structures: 1 },
                { name: "Nebula Division", rank: 14, employees: 298, structures: 1 },
              ].map((division, index) => (
                <Card key={index} className="p-4 bg-white rounded-lg border border-[#d9d9d9]">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-[#1c1c1e] text-sm">{division.name}</p>
                    <span className="font-bold text-lg text-[#69738d]">#{division.rank}</span>
                  </div>
                  <div className="flex justify-between text-center">
                    <div>
                      <p className="font-bold text-[#1c1c1e] text-lg">{division.employees}</p>
                      <p className="text-xs text-[#69738d]">Employees</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#1c1c1e] text-lg">{division.structures}</p>
                      <p className="text-xs text-[#69738d]">Structures</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
