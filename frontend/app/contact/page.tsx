"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function ContactPage() {
  return (
    <AuthLayout>
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="How can we help?" className="mt-1 min-h-[100px]" />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
