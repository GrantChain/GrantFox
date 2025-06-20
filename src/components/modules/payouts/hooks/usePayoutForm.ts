import type { GetUserServiceResponse } from "@/@types/responses.entity";
import { authService } from "@/components/modules/auth/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { usePayout } from "../context/PayoutContext";
import {
  type PayoutFormValues,
  payoutFormSchema,
} from "../schemas/payout.schema";

interface UsePayoutFormProps {
  initialValues?: Partial<PayoutFormValues>;
}

const DEVELOPMENT_TEMPLATE: PayoutFormValues = {
  title: "Development Template",
  description: "This is a development template for testing purposes",
  grantee_id: "test@example.com",
  image_url: "",
  type: "GRANT",
  status: "DRAFT",
  total_funding: 1000,
  currency: "USDC",
  milestones: [
    { description: "Milestone 1", amount: 500 },
    { description: "Milestone 2", amount: 500 },
  ],
};

export const usePayoutForm = ({ initialValues }: UsePayoutFormProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setSelectedGrantee } = usePayout();
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
      total_funding: 1000,
      currency: "USDC",
      milestones: [{ description: "", amount: 0 }],
      ...initialValues,
    },
    mode: "onChange",
  });

  const { control, formState, reset, setError, clearErrors } = form;
  const milestoneFieldArray = useFieldArray({
    control,
    name: "milestones",
  });

  const granteeEmail = form.watch("grantee_id");

  const loadTemplate = () => {
    if (process.env.NEXT_PUBLIC_ENV === "DEV") {
      reset(DEVELOPMENT_TEMPLATE);
    }
  };

  // Load user when initial values are provided
  useEffect(() => {
    const loadInitialUser = async () => {
      if (initialValues?.grantee_id) {
        setIsValidating(true);
        try {
          const result = await authService.getUserByEmail(
            initialValues.grantee_id,
          );
          if (result.exists) {
            setSelectedGrantee(result.user);
            clearErrors("grantee_id");
            setIsSuccess(true);
          } else {
            setSelectedGrantee(null);
            setError("grantee_id", {
              type: "manual",
              message: result.message,
            });
            setIsSuccess(false);
          }
        } catch (error) {
          console.error("Error loading initial user:", error);
          setSelectedGrantee(null);
          setError("grantee_id", {
            type: "manual",
            message: "Failed to load user",
          });
          setIsSuccess(false);
        } finally {
          setIsValidating(false);
        }
      }
    };
    loadInitialUser();
  }, [initialValues?.grantee_id, setSelectedGrantee, setError, clearErrors]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!granteeEmail) {
      setIsValidating(false);
      clearErrors("grantee_id");
      setSelectedGrantee(null);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsValidating(true);
      try {
        const result: GetUserServiceResponse =
          await authService.getUserByEmail(granteeEmail);

        if (result.exists) {
          setSelectedGrantee(result.user);
          clearErrors("grantee_id");
          setIsSuccess(true);
        } else {
          setSelectedGrantee(null);
          setError("grantee_id", {
            type: "manual",
            message: result.message,
          });
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Error validating email:", error);
        setSelectedGrantee(null);
        setError("grantee_id", {
          type: "manual",
          message: "Failed to validate email",
        });
        setIsSuccess(false);
      } finally {
        setIsValidating(false);
      }
    }, 2000); // 2 seconds

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [granteeEmail, setError, clearErrors, setSelectedGrantee]);

  return {
    ...form,
    milestoneFieldArray,
    reset,
    formState,
    isValidating,
    isSuccess,
    loadTemplate:
      process.env.NEXT_PUBLIC_ENV === "DEV" ? loadTemplate : undefined,
  };
};
