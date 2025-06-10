import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Currency, PayoutStatus, PayoutType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { Check, Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { usePayoutForm } from "../../hooks/usePayoutForm";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import Link from "next/link";

interface PayoutFormProps {
  initialValues?: Partial<PayoutFormValues>;
  onSubmit: (values: PayoutFormValues) => void;
  isSubmitting?: boolean;
}

export const PayoutForm = ({
  initialValues,
  onSubmit,
  isSubmitting: externalIsSubmitting,
}: PayoutFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formContext = usePayoutForm({ initialValues, onSubmit });
  const {
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    metricsFieldArray,
    handleFormSubmit,
    isValidating,
    isSuccess,
    user,
  } = formContext;

  const isSubmitting = externalIsSubmitting ?? formIsSubmitting;

  return (
    <Form {...formContext}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Payout Grantee */}
          <div className="md:col-span-1 space-y-6">
            {user ? (
              <Link href={`/profile/${user.user_id}`} target="_blank">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Grantee Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user.profile_url || undefined}
                            alt={user.username || user.email}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.username?.[0]?.toUpperCase() ||
                              user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.username || user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Username
                          </span>
                          <span className="text-sm max-w-[200px] truncate">
                            {user.username || (
                              <span className="text-muted-foreground italic">
                                Not set
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Location
                          </span>
                          <span className="text-sm max-w-[200px] truncate">
                            {user.location || (
                              <span className="text-muted-foreground italic">
                                Not set
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Wallet
                          </span>
                          <span className="text-sm font-mono max-w-[200px] truncate">
                            {user.wallet_address ? (
                              `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
                            ) : (
                              <span className="text-muted-foreground italic">
                                Not set
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex flex-col justify-start items-start w-full">
                          <span className="text-sm text-muted-foreground">
                            Bio
                          </span>
                          <span className="text-sm line-clamp-4 w-full">
                            {user.bio || (
                              <span className="text-muted-foreground italic">
                                Not set
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted">
                      <span className="text-lg text-muted-foreground">?</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No Grantee Selected</p>
                    <p className="text-xs text-muted-foreground">
                      Enter a valid grantee email below to continue
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Payout Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter payout title"
                        aria-label="Title"
                        tabIndex={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="type"
                          aria-label="Type"
                          tabIndex={0}
                          className={cn(errors.type && "border-destructive")}
                        >
                          <SelectValue placeholder="Select payout type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PayoutType).map((type) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={type}
                              value={type}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter payout description"
                      aria-label="Description"
                      tabIndex={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="grantee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grantee Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Enter the grantee's email"
                        aria-label="Grantee Email"
                        tabIndex={0}
                        className={cn(
                          errors.grantee_id && "border-destructive",
                        )}
                      />
                      {isValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      {isSuccess && !isValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="h-4 w-4 text-green-700" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>{errors.grantee_id?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="status"
                          aria-label="Status"
                          tabIndex={0}
                          className={cn(errors.status && "border-destructive")}
                        >
                          <SelectValue placeholder="Select payout status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PayoutStatus ?? {}).map((status) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={status}
                              value={status}
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="total_funding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Funding</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        placeholder="Enter total funding amount"
                        aria-label="Total Funding"
                        tabIndex={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="currency"
                          aria-label="Currency"
                          tabIndex={0}
                          className={cn(
                            errors.currency && "border-destructive",
                          )}
                        >
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Currency ?? {}).map((currency) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={currency}
                              value={currency}
                            >
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="metrics"
              render={() => (
                <FormItem>
                  <FormLabel>Metrics</FormLabel>
                  <div className="space-y-2">
                    {metricsFieldArray.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <FormField
                          control={control}
                          name={`metrics.${idx}.name`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Metric name"
                                aria-label="Metric name"
                                tabIndex={0}
                                className={cn(
                                  "flex-1",
                                  errors.metrics?.[idx]?.name &&
                                    "border-destructive",
                                )}
                              />
                            </FormControl>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`metrics.${idx}.value`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Metric value"
                                aria-label="Metric value"
                                tabIndex={0}
                                className={cn(
                                  "flex-1",
                                  errors.metrics?.[idx]?.value &&
                                    "border-destructive",
                                )}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          aria-label="Remove metric"
                          tabIndex={0}
                          onClick={() => metricsFieldArray.remove(idx)}
                          disabled={metricsFieldArray.fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 mt-2"
                      onClick={() =>
                        metricsFieldArray.append({ name: "", value: "" })
                      }
                      aria-label="Add metric"
                      tabIndex={0}
                    >
                      <Plus className="w-4 h-4" /> Add Metric
                    </Button>
                    {typeof errors.metrics === "object" &&
                      !Array.isArray(errors.metrics) && (
                        <FormMessage>
                          {(errors.metrics as { message: string })?.message}
                        </FormMessage>
                      )}
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Payout Image */}
          <div className="space-y-6">
            <FormField
              control={control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 bg-muted/5">
                        {field.value ? (
                          <Image
                            src={field.value}
                            alt="Payout preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">No image selected</span>
                          </div>
                        )}
                        {field.value && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                            onClick={() => {
                              field.onChange("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  field.onChange(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          ref={fileInputRef}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {field.value ? "Change Image" : "Upload Image"}
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex w-full justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-1/5"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {initialValues ? "Saving..." : "Creating..."}
              </div>
            ) : initialValues ? (
              "Save Changes"
            ) : (
              "Create Payout"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
