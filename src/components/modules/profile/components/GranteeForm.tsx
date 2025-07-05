"use client";

import type { Grantee } from "@/@types/grantee.entity";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { type GranteeFormData, granteeSchema } from "../schemas/profile.schema";

interface GranteeFormProps {
  grantee?: Grantee;
  onSubmit: (data: GranteeFormData) => void;
}

export function GranteeForm({ grantee, onSubmit }: GranteeFormProps) {
  const form = useForm<GranteeFormData>({
    resolver: zodResolver(granteeSchema),
    defaultValues: {
      name: grantee?.name || "",
      position_title: grantee?.position_title || "",
      twitter: grantee?.social_media?.twitter || "",
      linkedin: grantee?.social_media?.linkedin || "",
      github: grantee?.social_media?.github || "",
    },
  });

  const handleSubmit = (data: GranteeFormData) => {
    const { twitter, linkedin, github, ...rest } = data;

    const social_media = {
      ...(twitter && { twitter }),
      ...(linkedin && { linkedin }),
      ...(github && { github }),
    };

    const finalData = {
      ...rest,
      social_media: Object.keys(social_media).length > 0 ? social_media : null,
    };

    onSubmit(finalData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Grantee Information
        </CardTitle>
        <CardDescription>
          Manage your grantee profile and social links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Lead Developer, Project Manager"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (formerly Twitter)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
