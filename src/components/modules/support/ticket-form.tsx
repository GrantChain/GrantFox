"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bug,
  CheckCircle2,
  FileText,
  HelpCircle,
  Lightbulb,
  Send,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Form validation rules
const ticketFormSchema = z.object({
  category: z
    .string({
      required_error: "Please select a category for your ticket.",
    })
    .min(1, "Category is required"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters long")
    .max(100, "Subject must not exceed 100 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters long")
    .max(1000, "Message must not exceed 1000 characters"),
});

type TicketFormValues = z.infer<typeof ticketFormSchema>;

// Available ticket categories with metadata
const ticketCategories = [
  {
    value: "bug",
    label: "Bug Report",
    icon: Bug,
    description: "Report a technical issue or error you've encountered",
    color: "destructive" as const,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "feature",
    label: "Feature Request",
    icon: Lightbulb,
    description: "Suggest a new feature or improvement to the platform",
    color: "default" as const,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "question",
    label: "General Question",
    icon: HelpCircle,
    description: "Ask questions about features, billing, or general usage",
    color: "secondary" as const,
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
];

interface TicketFormProps {
  className?: string;
}

export function TicketForm({ className }: TicketFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      category: "",
      subject: "",
      message: "",
    },
  });

  const watchedCategory = form.watch("category");
  const watchedMessage = form.watch("message");

  async function onSubmit(data: TicketFormValues) {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(data);
      setShowSuccess(true);

      toast.success("Ticket submitted successfully!", {
        description: "We'll get back to you within 24 hours.",
      });

      form.reset();

      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit ticket", {
        description: "Please try again or contact support directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedCategory = ticketCategories.find(
    (cat) => cat.value === watchedCategory,
  );

  return (
    <div className={className}>
      {showSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="font-medium">
            Your support ticket has been submitted successfully! We&apos;ll
            respond within 24 hours.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Create Support Ticket</CardTitle>
              <CardDescription className="text-base">
                Describe your issue and we&apos;ll help you resolve it quickly
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select the type of support you need" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ticketCategories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className="p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-md p-2 ${category.bgColor}`}
                              >
                                <category.icon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {category.label}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {category.description}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedCategory && (
                <div
                  className={`rounded-lg border p-4 ${selectedCategory.bgColor} ${selectedCategory.borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <selectedCategory.icon className="h-5 w-5" />
                    <div>
                      <Badge variant={selectedCategory.color} className="mb-1">
                        {selectedCategory.label}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief summary of your issue or request"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear, concise subject line (5-100 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide detailed information about your issue. Include any error messages, steps to reproduce the problem, or additional context that might help us assist you better."
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        Describe your issue in detail (20-1000 characters)
                      </FormDescription>
                      <span className="text-xs text-muted-foreground">
                        {watchedMessage?.length || 0}/1000
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[140px] h-12 text-base"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
