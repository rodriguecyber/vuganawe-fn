import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import Head from 'next/head'

export default function LandingPage() {
  return (
  <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <GraduationCap className="h-6 w-6" />
          <span className="sr-only">E-learning platform</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to our E-learning platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Empower your learning journey with our cutting-edge online education platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <BookOpen className="h-10 w-10 mb-2" />
                  <CardTitle>Diverse Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Access a wide range of levels across various disciplines.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2" />
                  <CardTitle>Expert Instructors</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Learn from industry professionals and experienced educators.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 mb-2" />
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Earn recognized certifications upon level completion.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <GraduationCap className="h-10 w-10 mb-2" />
                  <CardTitle>Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Adaptive learning paths tailored to your pace and style.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Your Learning Journey Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of learners who are advancing their careers with Future Focus Acedemy .
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/register">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 E-learning paltofrm. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

