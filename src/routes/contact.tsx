import { createFileRoute } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react'

import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  useSendContactEmail,
  contactFormSchema,
  type ContactFormInput,
} from '@/actions/contact'
import { trackContactFormSubmitted } from '@/libs/posthog'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const sendEmail = useSendContactEmail()

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const handleSubmit = async (data: ContactFormInput) => {
    try {
      await sendEmail.mutateAsync(data)
      trackContactFormSubmitted()
      setIsSuccess(true)
      form.reset()
    } catch {
      // Error is handled by the mutation
    }
  }

  if (isSuccess) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">Message Sent!</h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for reaching out. We'll get back to you as soon as
              possible.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setIsSuccess(false)
                sendEmail.reset()
              }}
            >
              Send another message
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
              <CardDescription>
                Have a question or feedback? We'd love to hear from you.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              disabled={sendEmail.isPending}
                              {...field}
                            />
                          </FormControl>
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
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              disabled={sendEmail.isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What's this about?"
                            disabled={sendEmail.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more..."
                            rows={5}
                            disabled={sendEmail.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {sendEmail.error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                      {sendEmail.error.message ||
                        'Failed to send message. Please try again.'}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={sendEmail.isPending}
                  >
                    {sendEmail.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Additional Info */}
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  You can also reach us directly at{' '}
                  <a
                    href="mailto:contact@promptvalley.ai"
                    className="text-primary hover:underline"
                  >
                    contact@promptvalley.ai
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
