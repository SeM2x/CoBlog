import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for trending blogs
const trendingBlogs = [
  { id: 1, title: "The Future of AI", author: "Jane Doe", excerpt: "Exploring the latest advancements in artificial intelligence..." },
  { id: 2, title: "Sustainable Living", author: "John Smith", excerpt: "Practical tips for reducing your carbon footprint..." },
  { id: 3, title: "Modern Web Development", author: "Alice Johnson", excerpt: "A deep dive into the latest web technologies..." },
]

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">Welcome to CoBlog</h1>
        <p className="text-xl mb-4">Collaborate, Create, and Share Amazing Content</p>
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Trending Blogs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{blog.excerpt}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">By {blog.author}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

