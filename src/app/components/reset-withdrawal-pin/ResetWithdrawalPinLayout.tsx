"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import WalletApi from "@/app/api/wallet";
import { toastPosition } from "@/app/utils/utils";
import { toast } from "sonner";
import AppLoader from "@/app/components/loader/loader";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function ResetWithdrawalPinLayout() {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: EmailForm) => {
    setLoading(true);
    console.log("Send OTP to:", data.email);
    try {
      const response = await WalletApi.forgotPin({ email: data.email });

      console.log("====================================");
      console.log(JSON.stringify(response.data.data, null, 2));
      console.log("====================================");
      if (response?.data?.result.data) {
        localStorage.setItem("wallet-reset-email", data.email);
        toast.success(response?.data?.result?.message, {
          position: toastPosition,
        });
        route.push(`/wallet/reset-pin/verify-otp`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log("=========ERRO===========================");
      console.log(err);
      console.log("====================================");
      toast.error(`${err.message}`, {
        position: toastPosition,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center  pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full p-8 md:min-h-[60dvh] md:p-14"
      >
        <h1 className="text-3xl font-bold mb-2 text-[#3B3B3B]">Reset pin</h1>
        <p className="text-sm text-[#6D6D6D] mb-8">
          Enter the email linked to your account. We&apos;ll send you a 6-digit
          verification code.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-semibold mb-2 text-black"
            >
              Enter Email Address
            </label>
            <motion.input
              id="email"
              type="email"
              className={classNames(
                `w-full border rounded-xl text-sm px-4 py-4 focus:outline-none outline-none focus:ring-2 focus:ring-transparent mt-2`,
                errors.email ? "border-red-500" : "border-gray-400"
              )}
              placeholder="Johndoe@samplemail.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <motion.button
            type="submit"
            className="w-full cursor-pointer bg-[#17478B] hover:bg-[#133a6e] text-white text-lg font-semibold py-4 rounded-full mt-8 transition-colors duration-200 flex items-center justify-center"
            whileTap={{
              scale: 0.9,
              transition: { type: "spring", stiffness: 200, damping: 15 },
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className=" size-5 animate-spin rounded-full border-b-2 border-white" />
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
