import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePayoutForm } from "../../hooks/usePayoutForm";
import { Currency, PayoutStatus, PayoutType } from "@/generated/prisma";
import { Plus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { useEffect, useRef } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

interface PayoutFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<PayoutFormValues>;
  onSubmit: (values: PayoutFormValues) => void;
  mode?: "create" | "edit";
}

export const PayoutFormModal = ({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  mode = "create",
}: PayoutFormModalProps) => {
  const {
    control,
    formState: { errors, isSubmitting },
    metricsFieldArray,
    handleFormSubmit,
    register,
    reset,
  } = usePayoutForm({ initialValues, onSubmit });

  useEffect(() => {
    if (open) {
      reset(initialValues || {});
    }
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
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

            <div className="space-y-4">
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

              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={control}
                  name="total_funding"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-4">
                        {field.value && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={field.value}
                              alt="Payout preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => field.onChange("")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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
                                  field.onChange(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            ref={(input) => {
                              if (input) {
                                input.id = "image-upload";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              document.getElementById("image-upload")?.click();
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

              <FormField
                control={control}
                name="metrics"
                render={() => (
                  <FormItem>
                    <FormLabel>Metrics</FormLabel>
                    <div className="space-y-2">
                      {metricsFieldArray.fields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              placeholder="Metric name"
                              {...register(`metrics.${idx}.name` as const)}
                              aria-label="Metric name"
                              tabIndex={0}
                              className={cn(
                                "flex-1",
                                errors.metrics?.[idx]?.name &&
                                  "border-destructive",
                              )}
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder="Metric value"
                              {...register(`metrics.${idx}.value` as const)}
                              aria-label="Metric value"
                              tabIndex={0}
                              className={cn(
                                "flex-1",
                                errors.metrics?.[idx]?.value &&
                                  "border-destructive",
                              )}
                            />
                          </FormControl>
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

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {mode === "edit" ? "Save Changes" : "Create Payout"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
