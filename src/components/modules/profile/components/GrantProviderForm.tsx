"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PayoutProvider } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type GrantProviderFormData,
  grantProviderSchema,
} from "../schemas/profile.schema";

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
    defaultValues: {
      organization_name: grantProvider?.organization_name || "",
      network_type: grantProvider?.network_type || "",
      email: grantProvider?.email || "",
    },
  });

  const handleSubmit = async (data: GrantProviderFormData) => {
    onSubmit(data);
  };

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
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Grant Provider Information
        </CardTitle>
        <CardDescription>
          Manage your organization details and grant provider settings
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
              name="organization_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
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

            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
