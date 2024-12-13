"use client"

import { useState, useEffect } from "react"
import { Bell, UserPlus, ThumbsUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from  "@/hooks/use-toast"

// Mock function to fetch notifications
const fetchNotifications = async () => {
  // In a real app, this would be an API call
  return [
    { id: 1, type: "collaboration", message: "John Doe invited you to collaborate on 'Tech Trends 2023'" },
    { id: 2, type: "newFollower", message: "Jane Smith started following you" },
    { id: 3, type: "reaction", message: "Your blog 'AI in Healthcare' received 10 new likes" },
  ]
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Error loading notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
      }
    }

    loadNotifications()
  }, [toast])

  const getIcon = (type: string) => {
    switch (type) {
      case "collaboration":
        return <Bell className="h-5 w-5" />
      case "newFollower":
        return <UserPlus className="h-5 w-5" />
      case "reaction":
        return <ThumbsUp className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex items-center space-x-4">
                  {getIcon(notification.type)}
                  <span>{notification.message}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

