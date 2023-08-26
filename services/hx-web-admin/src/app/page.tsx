import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Home() {
  return (
    <section className="flex flex-col w-full h-screen items-center justify-center bg-background">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription>
            Enter your email below to login your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="****************"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </section>
  )
}
