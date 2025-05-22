"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import type { FreeLesson } from "@/lib/types/free-course"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Loader2, Play, X, Search, Filter } from "lucide-react"
import { freeCourseService } from "@/lib/services/free-course.service"
import { toast } from "react-hot-toast"
import { useAuth } from "@/lib/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useDebounce } from "@/lib/hooks/use-debounce"

// Extend the FreeLesson type to include order
interface FreeLessonWithOrder extends FreeLesson {
  order: number
}

export default function AdminFreeCoursesPage() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState<FreeLessonWithOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Partial<FreeLessonWithOrder> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<FreeLessonWithOrder | null>(null)

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState(0)
  const [type, setType] = useState<"word_card" | "video">("word_card")
  const [englishWord, setEnglishWord] = useState("")
  const [kinyarwandaMeaning, setKinyarwandaMeaning] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [category, setCategory] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 })
  const [uploadError, setUploadError] = useState<{ video: string | null; thumbnail: string | null }>({
    video: null,
    thumbnail: null,
  })

  useEffect(() => {
    fetchLessons()

    if (user?.role !== "admin") {
      return
    }
  }, [user])

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await freeCourseService.getAllFreeCourses()
      setLessons(response.courses as FreeLessonWithOrder[])
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
  const types = ["All", "word_card", "video"]

  // Filter lessons based on search query and filters
  const filteredLessons = useMemo(() => {
    if (!Array.isArray(lessons)) return []

    return lessons.filter((lesson) => {
      // Filter by type
      const matchesType = selectedType === "All" || lesson.type === selectedType

      // Filter by category
      const matchesCategory = selectedCategory === "All" || lesson.category === selectedCategory

      // Filter by difficulty
      const matchesDifficulty = selectedDifficulty === "All" || lesson.difficulty_level === selectedDifficulty

      // Filter by search query
      const matchesSearch =
        !debouncedSearchQuery ||
        lesson.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (lesson.description || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (lesson.english_word || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (lesson.kinyarwanda_meaning || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        lesson.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

      return matchesType && matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [lessons, selectedType, selectedCategory, selectedDifficulty, debouncedSearchQuery])

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedDifficulty("All")
    setSelectedType("All")
  }

  const handleAddLesson = () => {
    setCurrentLesson(null)
    setTitle("")
    setDescription("")
    setOrder(lessons.length)
    setIsAddingLesson(true)
  }

  const handleEditLesson = (lesson: FreeLessonWithOrder) => {
    setCurrentLesson(lesson)
    setTitle(lesson.title)
    setDescription(lesson.description || "")
    setType(lesson.type)
    setEnglishWord(lesson.english_word || "")
    setKinyarwandaMeaning(lesson.kinyarwanda_meaning || "")
    setVideoUrl(lesson.video_url || "")
    setThumbnailUrl(lesson.thumbnail_url || "")
    setCategory(lesson.category)
    setDifficultyLevel(lesson.difficulty_level)
    setIsEditingLesson(true)
  }

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return

    try {
      setIsSubmitting(true)
      await freeCourseService.deleteFreeCourse(id)
      toast.success("Lesson deleted successfully")
      fetchLessons()
    } catch (err) {
      toast.error("Failed to delete lesson")
      console.error("Error deleting lesson:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = lessons.findIndex((lesson) => lesson._id === id)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= lessons.length) return

    try {
      setIsSubmitting(true)
      const updatedLessons = [...lessons]
      const [movedLesson] = updatedLessons.splice(currentIndex, 1)
      updatedLessons.splice(newIndex, 0, movedLesson)

      // Update orders
      const updatedLessonsWithOrder = updatedLessons.map((lesson, index) => ({
        ...lesson,
        order: index,
      }))

      // Update all lessons in the backend
      await Promise.all(
        updatedLessonsWithOrder.map((lesson) =>
          freeCourseService.updateFreeCourse(lesson._id, { order: lesson.order }),
        ),
      )

      setLessons(updatedLessonsWithOrder)
      toast.success("Lessons reordered successfully")
    } catch (err) {
      toast.error("Failed to reorder lessons")
      console.error("Error reordering lessons:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateFile = (file: File, fileType: "video" | "thumbnail"): string | null => {
    if (fileType === "video") {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB
        return "Video file size must be less than 100MB"
      }
      if (!file.type.startsWith("video/")) {
        return "Please upload a valid video file"
      }
    } else {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        return "Thumbnail file size must be less than 5MB"
      }
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"]
      if (!allowedImageTypes.includes(file.type)) {
        return "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
      }
    }
    return null
  }

  const handleFileChange = async (file: File | null, fileType: "video" | "thumbnail") => {
    setUploadError((prev) => ({ ...prev, [fileType]: null }))
    setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }))

    if (!file) {
      if (fileType === "video") {
        setVideoFile(null)
        setVideoUrl("")
      } else {
        setThumbnailFile(null)
        setThumbnailUrl("")
      }
      return
    }

    const error = validateFile(file, fileType)
    if (error) {
      setUploadError((prev) => ({ ...prev, [fileType]: error }))
      toast.error(error)
      return
    }

    try {
      if (fileType === "video") {
        setVideoFile(file)
        // Here you would typically upload to your storage service
        // For now, we'll just simulate a successful upload
        const interval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            video: Math.min(prev.video + 10, 90),
          }))
        }, 500)

        // Simulate file upload and get URL
        setTimeout(() => {
          clearInterval(interval)
          setUploadProgress((prev) => ({ ...prev, video: 100 }))
          // In a real implementation, this would be the URL from your storage service
          const mockUrl = URL.createObjectURL(file)
          setVideoUrl(mockUrl)
          toast.success("Video file ready for upload")
        }, 2000)
      } else {
        setThumbnailFile(file)
        // Here you would typically upload to your storage service
        // For now, we'll just simulate a successful upload
        const interval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            thumbnail: Math.min(prev.thumbnail + 20, 90),
          }))
        }, 300)

        // Simulate file upload and get URL
        setTimeout(() => {
          clearInterval(interval)
          setUploadProgress((prev) => ({ ...prev, thumbnail: 100 }))
          // In a real implementation, this would be the URL from your storage service
          const mockUrl = URL.createObjectURL(file)
          setThumbnailUrl(mockUrl)
          toast.success("Thumbnail file ready for upload")
        }, 1000)
      }
    } catch (err) {
      setUploadError((prev) => ({ ...prev, [fileType]: "Failed to process file" }))
      toast.error("Failed to process file")
      console.error("Error processing file:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (type === "word_card" && (!englishWord.trim() || !kinyarwandaMeaning.trim())) {
      toast.error("Please fill in both English word and Kinyarwanda meaning")
      return
    }

    if (type === "video" && !videoFile) {
      toast.error("Please upload a video file")
      return
    }

    if (uploadError.video || uploadError.thumbnail) {
      toast.error("Please fix file upload errors before submitting")
      return
    }

    try {
      setIsSubmitting(true)
      const lessonData = {
        title: title.trim(),
        description: description.trim(),
        type,
        english_word: englishWord.trim(),
        kinyarwanda_meaning: kinyarwandaMeaning.trim(),
        category: category.trim(),
        difficulty_level: difficultyLevel,
        order: currentLesson?.order ?? lessons.length,
        is_active: true,
      }

      if (currentLesson?._id) {
        await freeCourseService.updateFreeCourse(currentLesson._id, lessonData)
        toast.success("Lesson updated successfully")
      } else {
        const formData = new FormData()
        Object.entries(lessonData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString())
          }
        })

        if (videoFile) {
          formData.append("files", videoFile)
        }
        if (thumbnailFile) {
          formData.append("files", thumbnailFile)
        }

        if (type === "video") {
          await freeCourseService.createVideoFreeCourse(formData)
        } else {
          await freeCourseService.createCardFreeCourse(lessonData)
        }
        toast.success("Lesson created successfully")
      }

      // Reset form and state
      setIsAddingLesson(false)
      setIsEditingLesson(false)
      setVideoFile(null)
      setThumbnailFile(null)
      setUploadProgress({ video: 0, thumbnail: 0 })
      setUploadError({ video: null, thumbnail: null })
      fetchLessons()
    } catch (err) {
      toast.error(currentLesson?._id ? "Failed to update lesson" : "Failed to create lesson")
      console.error("Error saving lesson:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sky-900">Manage Free Courses</h1>
          <p className="text-sky-700 mt-1">Add, edit, and manage free Kinyarwanda lessons</p>
        </div>
        <Dialog
          open={isAddingLesson || isEditingLesson}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddingLesson(false)
              setIsEditingLesson(false)
              setVideoFile(null)
              setThumbnailFile(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={handleAddLesson}
              disabled={isSubmitting}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{currentLesson ? "Edit Course" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter course title"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(value: "word_card" | "video") => setType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="word_card">Word Card</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  disabled={isSubmitting}
                />
              </div>

              {type === "word_card" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="englishWord">English Word</Label>
                    <Input
                      id="englishWord"
                      value={englishWord}
                      onChange={(e) => setEnglishWord(e.target.value)}
                      placeholder="Enter English word"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kinyarwandaMeaning">Kinyarwanda Meaning</Label>
                    <Input
                      id="kinyarwandaMeaning"
                      value={kinyarwandaMeaning}
                      onChange={(e) => setKinyarwandaMeaning(e.target.value)}
                      placeholder="Enter Kinyarwanda meaning"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {type === "video" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Thumbnail Upload</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleFileChange(file, "thumbnail")
                        }}
                        className="border-2 border-dashed border-sky-200 rounded-lg p-2"
                      />
                      {thumbnailFile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileChange(null, "thumbnail")}
                          className="text-red-600 hover:text-red-700"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {uploadError.thumbnail && <p className="text-sm text-red-600">{uploadError.thumbnail}</p>}
                    {uploadProgress.thumbnail > 0 && (
                      <div className="space-y-1">
                        <Progress value={uploadProgress.thumbnail} className="h-2" />
                        <p className="text-xs text-sky-600">
                          {uploadProgress.thumbnail === 100 ? "Ready to upload" : "Processing..."}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Video Upload</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          handleFileChange(file, "video")
                        }}
                        className="border-2 border-dashed border-sky-200 rounded-lg p-2"
                      />
                      {videoFile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileChange(null, "video")}
                          className="text-red-600 hover:text-red-700"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {uploadError.video && <p className="text-sm text-red-600">{uploadError.video}</p>}
                    {uploadProgress.video > 0 && (
                      <div className="space-y-1">
                        <Progress value={uploadProgress.video} className="h-2" />
                        <p className="text-xs text-sky-600">
                          {uploadProgress.video === 100 ? "Ready to upload" : "Processing..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select
                    value={difficultyLevel}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") => setDifficultyLevel(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingLesson(false)
                    setIsEditingLesson(false)
                    setVideoFile(null)
                    setThumbnailFile(null)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-sky-600 hover:bg-sky-700">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Course"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-sky-500" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
              disabled={isLoading}
            />
          </div>
          <Button
            variant="outline"
            className="md:w-auto w-full border-sky-200 text-sky-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters {showFilters ? "(Hide)" : "(Show)"}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-sky-50 rounded-lg">
            <div>
              <Label htmlFor="filterType">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType} disabled={isLoading}>
                <SelectTrigger className="mt-1 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? "All Types" : type === "word_card" ? "Word Card" : "Video"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterCategory">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                <SelectTrigger className="mt-1 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
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
            <div>
              <Label htmlFor="filterDifficulty">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty} disabled={isLoading}>
                <SelectTrigger className="mt-1 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty === "All"
                        ? "All Difficulties"
                        : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-100"
              >
                Reset all filters
              </Button>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {(searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All" || selectedType !== "All") && (
          <div className="flex flex-wrap items-center gap-2">
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
            {selectedType !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-sky-100 text-sky-700">
                Type: {selectedType === "word_card" ? "Word Card" : "Video"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-sky-200"
                  onClick={() => setSelectedType("All")}
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
          </div>
        )}
      </div>

      {/* Results count */}
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
                  <Badge variant={selectedVideo.is_active ? "default" : "secondary"} className="text-xs">
                    {selectedVideo.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(filteredLessons) && filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <Card
                key={lesson._id}
                className="overflow-hidden border border-sky-100 hover:border-sky-300 transition-colors bg-white shadow-sm"
              >
                <CardHeader className="p-4 bg-gradient-to-r from-sky-50 to-white">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-sky-900 line-clamp-1">{lesson.title}</CardTitle>
                        <CardDescription className="mt-1 text-sky-700 line-clamp-2">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorder(lesson._id, "up")}
                          disabled={isSubmitting || lesson.order === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReorder(lesson._id, "down")}
                          disabled={isSubmitting || lesson.order === lessons.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant={lesson.is_active ? "default" : "secondary"} className="text-xs">
                          {lesson.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">{lesson.type}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLesson(lesson)}
                          disabled={isSubmitting}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLesson(lesson._id)}
                          disabled={isSubmitting}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                  <div className="mt-3 flex items-center gap-2 text-sm text-sky-600">
                    <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 text-xs">{lesson.category}</Badge>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs">
                      {lesson.difficulty_level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-sky-600 text-lg">No lessons found</p>
              {searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All" || selectedType !== "All" ? (
                <p className="text-sky-500 mt-2">Try adjusting your search or filters</p>
              ) : (
                <p className="text-sky-500 mt-2">Click the Add Course button to create your first lesson</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 
