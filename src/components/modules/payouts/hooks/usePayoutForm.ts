import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  payoutFormSchema,
  type PayoutFormValues,
} from "../schemas/payout.schema";

interface UsePayoutFormProps {
  initialValues?: Partial<PayoutFormValues>;
  onSubmit: (values: PayoutFormValues) => void;
}

export const usePayoutForm = ({
  initialValues,
  onSubmit,
}: UsePayoutFormProps) => {
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      type: undefined,
      status: undefined,
      total_funding: "",
      currency: undefined,
      metrics: [{ name: "", value: "" }],
      ...initialValues,
    },
    mode: "onChange",
  });

  const { control, handleSubmit, formState, reset } = form;
  const metricsFieldArray = useFieldArray({
    control,
    name: "metrics",
  });

  const handleFormSubmit = handleSubmit(onSubmit);

  return {
    ...form,
    metricsFieldArray,
    handleFormSubmit,
    reset,
    formState,
  };
};
