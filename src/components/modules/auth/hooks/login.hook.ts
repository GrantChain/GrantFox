import { useForm } from "react-hook-form";
import { authSchema } from "../ui/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (payload: z.infer<typeof authSchema>) => {
    try {
      let { data } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (data?.session) {
        console.log(data?.session);
        router.push("/dashboard");
      }
    } catch (error) {
      if (error) console.log(error);
    }
  };

  return {
    form,
    handleLogin,
  };
};
