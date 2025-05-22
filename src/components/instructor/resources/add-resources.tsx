'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { toast } from 'react-toastify'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  resource_type: z.enum(['pdf', 'doc', 'video', 'audio', 'other']),
  file: z.instanceof(File),
})

export const AddResourceForm = ({ lessonId, onSuccess }: { lessonId: string, onSuccess: () => void })=> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL 

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      resource_type: "pdf",
    },
  })

  const onSubmit = async(values: z.infer<typeof formSchema>) =>{
    setIsLoading(true)
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('resource_type', values.resource_type)
    formData.append('file', values.file)
    formData.append('lesson_id', lessonId)

    try {
      const response = await axios.post(`${API_URL}/api/resources`, 
        formData,{
        headers:{
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success(response.data.message)
      onSuccess()
      form.reset()
    } catch (error) {
      toast.error('failed to add resources')

      console.error('Error creating resource:', error)
     
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter resource title" {...field} />
              </FormControl>
              <FormDescription>
                This is the title of your resource.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resource_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of resource you&apos;re uploading.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload your resource file here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Resource"}
        </Button>
      </form>
    </Form>
  )
}

