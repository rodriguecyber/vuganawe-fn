"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, BookOpen, Search, Filter } from "lucide-react"
import { freeCourseService } from "@/lib/services/free-course.service"
import { toast } from "react-hot-toast"
import { useDebounce } from "@/lib/hooks/use-debounce"
import type { FreeLesson } from "@/lib/types/free-course"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X } from "lucide-react"

export default function FreeCoursesPage() {
  const [lessons, setLessons] = useState<FreeLesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [activeTab, setActiveTab] = useState<"words" | "videos">("words")
  const [selectedVideo, setSelectedVideo] = useState<FreeLesson | null>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    // Only fetch lessons once on initial load
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await freeCourseService.getFreeCourses()
      setLessons(response.courses)
    } catch (err) {
      setError("Failed to fetch lessons. Please try again later.")
      toast.error("Failed to fetch lessons")
      console.error("Error fetching lessons:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories from lessons
  const categories = useMemo(() => {
    if (!Array.isArray(lessons)) return ["All"]
    const uniqueCategories = new Set(lessons.map((lesson) => lesson.category))
    return ["All", ...Array.from(uniqueCategories)]
  }, [lessons])

  const difficulties = ["All", "beginner", "intermediate", "advanced"]

  const filteredLessons = useMemo(() => {
    if (!Array.isArray(lessons)) return []

    return lessons.filter((lesson) => {
      // Filter by content type (words/videos)
      const matchesType = lesson.type === (activeTab === "words" ? "word_card" : "video")

      // Filter by category
      const matchesCategory = selectedCategory === "All" || lesson.category === selectedCategory

      // Filter by difficulty
      const matchesDifficulty = selectedDifficulty === "All" || lesson.difficulty_level === selectedDifficulty

      // Filter by search query
      const matchesSearch =
        !debouncedSearchQuery ||
        lesson.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        lesson.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        lesson.english_word?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        lesson.kinyarwanda_meaning?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

      return matchesType && matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [lessons, activeTab, selectedCategory, selectedDifficulty, debouncedSearchQuery])

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchLessons} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-b from-sky-50/50 to-white">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-sky-900">Free Kinyarwanda Lessons</h1>
        <p className="text-sky-700">Learn Kinyarwanda for free with our interactive lessons</p>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        {/* Mobile filter toggle */}
        <div className="md:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-sky-200 text-sky-700">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
                    <Input
                      placeholder="Search lessons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Difficulty</h3>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty} disabled={isLoading}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Content Type</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={activeTab === "words" ? "default" : "outline"}
                      onClick={() => setActiveTab("words")}
                      className={`flex-1 ${activeTab === "words" ? "bg-sky-600 hover:bg-sky-700" : "border-sky-200 text-sky-700 hover:bg-sky-50"}`}
                      disabled={isLoading}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Words
                    </Button>
                    <Button
                      variant={activeTab === "videos" ? "default" : "outline"}
                      onClick={() => setActiveTab("videos")}
                      className={`flex-1 ${activeTab === "videos" ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200 text-orange-700 hover:bg-orange-50"}`}
                      disabled={isLoading}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Videos
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                      setSelectedDifficulty("All")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
              disabled={isLoading}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
            <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-400">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty} disabled={isLoading}>
            <SelectTrigger className="border-sky-200 focus:border-sky-400 focus:ring-sky-400">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "words" ? "default" : "outline"}
              onClick={() => setActiveTab("words")}
              className={`flex-1 ${activeTab === "words" ? "bg-sky-600 hover:bg-sky-700" : "border-sky-200 text-sky-700 hover:bg-sky-50"}`}
              disabled={isLoading}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Words
            </Button>
            <Button
              variant={activeTab === "videos" ? "default" : "outline"}
              onClick={() => setActiveTab("videos")}
              className={`flex-1 ${activeTab === "videos" ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200 text-orange-700 hover:bg-orange-50"}`}
              disabled={isLoading}
            >
              <Play className="mr-2 h-4 w-4" />
              Videos
            </Button>
          </div>
        </div>

        {/* Active filters display and reset button */}
        <div className="flex flex-wrap items-center gap-2">
          {(searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All") && (
            <>
              <div className="text-sm text-sky-700">Active filters:</div>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                  Search: {searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-sky-200"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "All" && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                  Category: {selectedCategory}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-sky-200"
                    onClick={() => setSelectedCategory("All")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedDifficulty !== "All" && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                  Difficulty: {selectedDifficulty}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-sky-200"
                    onClick={() => setSelectedDifficulty("All")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100 h-7"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedDifficulty("All")
                }}
              >
                Reset all
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-sky-600 font-medium">
          {isLoading ? "Loading..." : `Found ${filteredLessons.length} lessons`}
        </div>
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent" />
        )}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedVideo && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 text-white hover:bg-white/10"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="aspect-video">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={selectedVideo.thumbnail_url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-sky-900">{selectedVideo.title}</h3>
                <p className="text-sm text-sky-700 mt-1">{selectedVideo.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">{selectedVideo.category}</Badge>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                    {selectedVideo.difficulty_level}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson) => (
          <Card
            key={lesson._id}
            className="overflow-hidden border border-sky-100 hover:border-sky-300 transition-colors bg-white shadow-sm"
          >
            <CardHeader className="p-4 bg-gradient-to-r from-sky-50 to-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-sky-900 line-clamp-1">{lesson.title}</CardTitle>
                  <div className="flex gap-1">
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">{lesson.category}</Badge>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                      {lesson.difficulty_level}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm text-sky-700 line-clamp-2">{lesson.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {lesson.type === "word_card" ? (
                <div className="bg-sky-50 rounded-lg p-3 hover:bg-sky-100 transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-lg font-medium text-sky-900">{lesson.english_word}</h4>
                    <p className="text-orange-600 font-medium">{lesson.kinyarwanda_meaning}</p>
                  </div>
                </div>
              ) : (
                <div
                  className="relative aspect-video bg-orange-50 rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedVideo(lesson)}
                >
                  {lesson.thumbnail_url ? (
                    <img
                      src={lesson.thumbnail_url || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-orange-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-orange-200"
                    >
                      <Play className="h-6 w-6 text-orange-600" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {!isLoading && filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sky-600 text-lg">No lessons found</p>
          <p className="text-sky-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
} 
