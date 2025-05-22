'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Globe, Users, Video } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <section className="relative bg-gradient-to-b from-orange-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Learn English with <span className="text-orange-500">VUGANAWE</span>
              </h1>
              <p className="text-xl text-gray-600">
                Empowering Rwandans with quality English education through interactive online courses. Start your journey to English fluency today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/free-courses">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Try Free Lessons
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="px-8 py-6 text-lg border-orange-200 hover:bg-orange-50">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/hero-image.png"
                alt="Students learning English"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose VUGANAWE?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for Rwandan learners, making English education accessible and effective.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Expert-Led Courses</CardTitle>
                <CardDescription>
                  Learn from qualified English teachers with experience in teaching Rwandan students.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Interactive Learning</CardTitle>
                <CardDescription>
                  Engage with video lessons, quizzes, and practical exercises designed for active learning.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Cultural Context</CardTitle>
                <CardDescription>
                  Content tailored to Rwandan culture and daily life situations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your learning goals and schedule.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Free Lessons</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-900">Free</div>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Basic English lessons
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    No account required
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Sample exercises
                  </li>
                </ul>
                <Link href="/free-courses">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className="border-orange-200 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Basic Plan</CardTitle>
                <CardDescription>For regular learners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-900">RWF 15,000<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    All Free lessons
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Progress tracking
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Basic exercises
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Email support
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Premium Plan</CardTitle>
                <CardDescription>For serious learners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-gray-900">RWF 25,000<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    All Basic features
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Advanced lessons
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Live sessions
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                    Certificate of completion
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Your English Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of Rwandan learners who are improving their English skills with VUGANAWE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-courses">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Try Free Lessons
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="px-8 py-6 text-lg border-orange-200 hover:bg-orange-100">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

