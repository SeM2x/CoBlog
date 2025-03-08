"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const [urls, setUrls] = useState<{ id: string; value: string }[]>([
    { id: "1", value: "https://example.com" },
    { id: "2", value: "https://twitter.com/username" },
  ])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "johndoe",
      email: "john@example.com",
      bio: "Full-stack developer | Open source enthusiast | Blogger",
      urls: urls.map((url) => ({ value: url.value })),
    },
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
    console.log(data)
  }

  const addUrl = () => {
    const newUrl = { id: `${urls.length + 1}`, value: "" }
    setUrls([...urls, newUrl])
  }

  const removeUrl = (id: string) => {
    setUrls(urls.filter((url) => url.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-6 md:space-y-0">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change avatar
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name. It can be your real name or a pseudonym. You can only change
                        this once every 30 days.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="john@example.com">john@example.com</SelectItem>
                          <SelectItem value="johndoe@gmail.com">johndoe@gmail.com</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>You can manage verified email addresses in your email settings.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>You can @mention other users and organizations to link to them.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <Label>URLs</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website, blog, or social media profiles.
              </p>
              <div className="space-y-3">
                {urls.map((url, index) => (
                  <div key={url.id} className="flex items-center space-x-2">
                    <Input
                      placeholder="https://example.com"
                      value={url.value}
                      onChange={(e) => {
                        const newUrls = [...urls]
                        newUrls[index].value = e.target.value
                        setUrls(newUrls)
                      }}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(url.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addUrl}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </div>
            </div>

            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

