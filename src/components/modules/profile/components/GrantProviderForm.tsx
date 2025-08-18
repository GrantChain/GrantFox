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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PayoutProvider } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type GrantProviderFormData,
  grantProviderSchema,
} from "../schemas/profile.schema";
import { useProfileLoaders } from "../context/ProfileLoadersContext";

interface GrantProviderFormProps {
  grantProvider?: PayoutProvider;
  onSubmit: (data: GrantProviderFormData) => void;
}

export function GrantProviderForm({
  grantProvider,
  onSubmit,
}: GrantProviderFormProps) {
  const form = useForm<GrantProviderFormData>({
    resolver: zodResolver(grantProviderSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      organization_name: grantProvider?.organization_name || "",
      network_type: grantProvider?.network_type || "",
      email: grantProvider?.email || "",
    },
  });

  const handleSubmit = async (data: GrantProviderFormData) => {
    onSubmit(data);
  };

  const { getLoading } = useProfileLoaders();
  const isSaving = getLoading("updateGrantProvider");

  const networkTypes = [
    "Ethereum",
    "Stellar",
    "Starknet",
    "Optimism",
    "Worldcoin",
    "Solana",
    "Other",
  ];

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
                name="organization_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="network_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {networkTypes.map((network) => (
                          <SelectItem key={network} value={network}>
                            {network}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="organization@example.com"
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
