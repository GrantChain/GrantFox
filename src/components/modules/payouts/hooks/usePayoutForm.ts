import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  type PayoutFormValues,
  payoutFormSchema,
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
      grantee_id: "",
      image_url: "",
      type: "GRANT",
      status: "DRAFT",
      total_funding: "",
      currency: "USDC",
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

  const grantee = form.watch("grantee_id");

  console.log(grantee);

  const handleFormSubmit = handleSubmit(onSubmit);

  return {
    ...form,
    metricsFieldArray,
    handleFormSubmit,
    reset,
    formState,
  };
};
