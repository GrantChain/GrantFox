import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePayoutForm } from "../../hooks/usePayoutForm";
import type { PayoutFormValues } from "../../schemas/payout.schema";

interface PayoutFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<PayoutFormValues>;
  onSubmit: (values: PayoutFormValues) => void;
  mode?: "create" | "edit";
  isSubmitting?: boolean;
}

export const PayoutFormModal = ({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  mode = "create",
  isSubmitting: externalIsSubmitting,
}: PayoutFormModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    metricsFieldArray,
    handleFormSubmit,
    register,
    reset,
  } = usePayoutForm({ initialValues, onSubmit });

  const isSubmitting = externalIsSubmitting ?? formIsSubmitting;

  useEffect(() => {
    if (open) {
      reset(initialValues || {});
    }
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <Form {...usePayoutForm({ initialValues, onSubmit })}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>
                {mode === "edit" ? "Edit Payout" : "Create Payout"}
              </DialogTitle>
              <DialogDescription>
                {mode === "edit"
                  ? "Edit the details of your payout."
                  : "Fill in the details to create a new payout."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                              className={cn(
                                errors.type && "border-destructive",
                              )}
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
                              className={cn(
                                errors.status && "border-destructive",
                              )}
                            >
                              <SelectValue placeholder="Select payout status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(PayoutStatus ?? {}).map(
                                (status) => (
                                  <SelectItem
                                    className="cursor-pointer"
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </SelectItem>
                                ),
                              )}
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
                          <div
                            key={field.id}
                            className="flex gap-2 items-center"
                          >
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
                              {(errors.metrics as any)?.message}
                            </FormMessage>
                          )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

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
                                <span className="text-sm">
                                  No image selected
                                </span>
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

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "edit" ? "Saving..." : "Creating..."}
                  </div>
                ) : mode === "edit" ? (
                  "Save Changes"
                ) : (
                  "Create Payout"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
