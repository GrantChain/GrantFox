import type { GetUserServiceResponse } from "@/@types/responses.entity";
import { authService } from "@/components/modules/auth/services/auth.service";
import type { User } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
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
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const { control, handleSubmit, formState, reset, setError, clearErrors } =
    form;
  const metricsFieldArray = useFieldArray({
    control,
    name: "metrics",
  });

  const granteeEmail = form.watch("grantee_id");
  console.log(user);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!granteeEmail) {
      setIsValidating(false);
      clearErrors("grantee_id");
      setUser(null);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsValidating(true);
      const result: GetUserServiceResponse =
        await authService.checkUserByEmail(granteeEmail);

      if (result.exists) {
        setUser(result.user);
        clearErrors("grantee_id");
        setIsSuccess(true);
      } else {
        setUser(null);
        setError("grantee_id", {
          type: "manual",
          message: result.message,
        });
        setIsSuccess(false);
      }
      setIsValidating(false);
    }, 2000); // 2 seconds

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [granteeEmail, setError, clearErrors]);

  const handleFormSubmit = handleSubmit(onSubmit);

  return {
    ...form,
    metricsFieldArray,
    handleFormSubmit,
    reset,
    formState,
    isValidating,
    isSuccess,
    user,
  };
};
