"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Grantee } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useProfileLoaders } from "../context/ProfileLoadersContext";
import { type GranteeFormData, granteeSchema } from "../schemas/profile.schema";

interface GranteeFormProps {
  grantee?: Grantee & {
    social_media: { twitter: string; linkedin: string; github: string };
  };
  onSubmit: (
    data: Partial<Omit<Grantee, "user_id" | "created_at" | "updated_at">>,
  ) => void;
}

export function GranteeForm({ grantee, onSubmit }: GranteeFormProps) {
  const form = useForm<GranteeFormData>({
    resolver: zodResolver(granteeSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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

    const finalData: Partial<
      Omit<Grantee, "user_id" | "created_at" | "updated_at">
    > = {
      ...rest,
      social_media: Object.keys(social_media).length > 0 ? social_media : null,
    };

    onSubmit(finalData);
  };

  const { getLoading } = useProfileLoaders();
  const isSaving = getLoading("updateGrantee");

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
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
            </div>

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

            <Button
              type="submit"
              className="w-full"
              disabled={isSaving || form.formState.isSubmitting}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
