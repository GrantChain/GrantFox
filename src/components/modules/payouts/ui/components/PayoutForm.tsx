import { Button } from "@/components/ui/button";
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
import { useEffect, useRef } from "react";
import { usePayout } from "../../context/PayoutContext";
import { usePayoutForm } from "../../hooks/usePayoutForm";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { GranteeDetailsCard } from "./GranteeDetailsCard";
import TooltipInfo from "@/components/shared/TooltipInfo";

interface PayoutFormProps {
  initialValues?: Partial<PayoutFormValues>;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  onSubmit: (data: PayoutFormValues) => void;
}

export const PayoutForm = ({
  initialValues,
  isSubmitting: externalIsSubmitting,
  mode,
  onSubmit,
}: PayoutFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formContext = usePayoutForm({ initialValues });
  const { selectedGrantee } = usePayout();

  const {
    control,
    formState: { errors, isSubmitting: formIsSubmitting },
    milestoneFieldArray,
    isValidating,
    isSuccess,
    handleSubmit,
    watch,
    setValue,
  } = formContext;

  const isSubmitting = externalIsSubmitting ?? formIsSubmitting;

  // Watch milestone amounts and calculate total
  const milestones = watch("milestones");
  useEffect(() => {
    const total = milestones.reduce((sum, milestone) => {
      const amount =
        typeof milestone.amount === "string"
          ? Number.parseFloat(milestone.amount)
          : milestone.amount;
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
    setValue("total_funding", total.toString());
  }, [milestones, setValue]);

  return (
    <Form {...formContext}>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Payout Grantee */}
          <div className="md:col-span-1 space-y-6">
            <GranteeDetailsCard selectedGrantee={selectedGrantee} />
          </div>

          {/* Payout Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Title</FormLabel>
                      <TooltipInfo content="Enter a descriptive title for this payout that clearly identifies its purpose" />
                    </div>
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
                    <div className="flex items-center gap-1">
                      <FormLabel>Type</FormLabel>
                      <TooltipInfo content="Select the type of payout. This determines how the funds will be distributed" />
                    </div>
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
                  <div className="flex items-center gap-1">
                    <FormLabel>Description</FormLabel>
                    <TooltipInfo content="Provide a detailed description of what this payout is for and its objectives" />
                  </div>
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
                  <div className="flex items-center gap-1">
                    <FormLabel>Grantee Email</FormLabel>
                    <TooltipInfo content="Enter the email address of the grantee who will receive this payout" />
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Enter the grantee's email"
                        disabled={mode === "edit"}
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
                    <div className="flex items-center gap-1">
                      <FormLabel>Status</FormLabel>
                      <TooltipInfo content="Current status of the payout. This indicates where the payout is in its lifecycle" />
                    </div>
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
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Currency</FormLabel>
                      <TooltipInfo content="Select the currency in which the payout will be made" />
                    </div>
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

              <FormField
                control={control}
                name="total_funding"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Total Funding</FormLabel>
                      <TooltipInfo content="Total amount of funding for this payout. This is automatically calculated from milestone amounts" />
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="any"
                        disabled
                        placeholder="Total funding amount"
                        aria-label="Total Funding"
                        tabIndex={0}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="milestones"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel>Milestones</FormLabel>
                    <TooltipInfo content="Add milestones to break down the payout into smaller, trackable deliverables" />
                  </div>
                  <div className="space-y-2">
                    {milestoneFieldArray.fields.map((field, idx) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <FormField
                          control={control}
                          name={`milestones.${idx}.description`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Milestone description"
                                aria-label="Milestone description"
                                tabIndex={0}
                                className={cn(
                                  "flex-1",
                                  errors.milestones?.[idx]?.description &&
                                    "border-destructive",
                                )}
                              />
                            </FormControl>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`milestones.${idx}.amount`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Milestone amount"
                                aria-label="Milestone amount"
                                type="number"
                                step="any"
                                tabIndex={0}
                                className={cn(
                                  "flex-1",
                                  errors.milestones?.[idx]?.amount &&
                                    "border-destructive",
                                )}
                                value={field.value?.toString() || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === "" ? "" : Number(value),
                                  );
                                  // Calculate total immediately
                                  const currentMilestones = [...milestones];
                                  currentMilestones[idx] = {
                                    ...currentMilestones[idx],
                                    amount: value === "" ? 0 : Number(value),
                                  };
                                  const total = currentMilestones.reduce(
                                    (sum, milestone) => {
                                      const amount =
                                        typeof milestone.amount === "string"
                                          ? Number.parseFloat(milestone.amount)
                                          : milestone.amount;
                                      return (
                                        sum +
                                        (Number.isNaN(amount) ? 0 : amount)
                                      );
                                    },
                                    0,
                                  );
                                  setValue("total_funding", total.toString());
                                }}
                              />
                            </FormControl>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          aria-label="Remove milestone"
                          tabIndex={0}
                          onClick={() => milestoneFieldArray.remove(idx)}
                          disabled={milestoneFieldArray.fields.length === 1}
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
                        milestoneFieldArray.append({
                          description: "",
                          amount: 0,
                        })
                      }
                      aria-label="Add milestone"
                      tabIndex={0}
                    >
                      <Plus className="w-4 h-4" /> Add Milestone
                    </Button>
                    {typeof errors.milestones === "object" &&
                      !Array.isArray(errors.milestones) && (
                        <FormMessage>
                          {(errors.milestones as { message: string })?.message}
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
                  <div className="flex items-center gap-1">
                    <FormLabel>Image</FormLabel>
                    <TooltipInfo content="Upload an image that represents or is related to this payout" />
                  </div>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 bg-muted/5">
                        {field.value && field.value.trim() !== "" ? (
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
                        {field.value && field.value.trim() !== "" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                            onClick={() => {
                              field.onChange(null);
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

        <div className="flex w-full justify-end gap-4">
          {process.env.NEXT_PUBLIC_ENV === "DEV" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => formContext.loadTemplate?.()}
              className="w-full md:w-1/5"
            >
              Use Template
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || isValidating}
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
