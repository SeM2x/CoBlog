"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, CreditCard, Bell, Palette, Shield, HelpCircle } from "lucide-react"

interface SettingsSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  const sidebarItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
    {
      id: "account",
      label: "Account",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="h-4 w-4 mr-2" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4 mr-2" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="flex flex-col space-y-1">
      {sidebarItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          className={cn("justify-start", activeTab === item.id && "bg-muted font-medium")}
          onClick={() => setActiveTab(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
      <Button variant="ghost" className="justify-start mt-4">
        <HelpCircle className="h-4 w-4 mr-2" />
        Help & Support
      </Button>
    </div>
  )
}

