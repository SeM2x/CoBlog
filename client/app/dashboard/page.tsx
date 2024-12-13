import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for user's blogs and activity feed
const userBlogs = [
  { id: 1, title: "My First Blog", status: "published" },
  { id: 2, title: "Work in Progress", status: "draft" },
]

const activityFeed = [
  { id: 1, user: "Alice", action: "commented on your blog" },
  { id: 2, user: "Bob", action: "started following you" },
]

const suggestedUsers = [
  { id: 1, name: "Charlie", bio: "Tech enthusiast" },
  { id: 2, name: "Diana", bio: "Travel blogger" },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Blogs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {userBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {blog.status}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/blog/${blog.id}`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Button className="mt-4" asChild>
          <Link href="/blog/new">Create New Blog</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
        <Card>
          <CardContent className="divide-y">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="py-2">
                <p>{activity.user} {activity.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Suggested Users to Follow</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suggestedUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{user.bio}</p>
              </CardContent>
              <CardFooter>
                <Button>Follow</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

