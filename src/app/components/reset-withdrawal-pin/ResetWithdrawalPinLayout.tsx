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
import CustomButton from "@/app/utils/CustomBtn";
import { useAuth } from "@/app/hooks/useAuth";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function ResetWithdrawalPinLayout() {
  const route = useRouter();
  const { user } = useAuth();
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
      const response = await WalletApi.forgotPin();

      if (response.data) {
        localStorage.setItem("wallet-reset-email", data.email);
        toast.success("Check email for OTP", {
          position: toastPosition,
        });
        route.push(`/wallet/reset-pin/verify-otp`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
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
          We&apos;ll send you a 6-digit verification code to the email below.
          Click reset pin.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-semibold mb-2 text-black"
            >
              Your Email Address
            </label>
            <motion.input
              id="email"
              type="email"
              className={classNames(
                `w-full border rounded-xl md:max-w-2xl  text-sm px-4 py-4 focus:outline-none outline-none focus:ring-2 focus:ring-transparent mt-2`,
                errors.email ? "border-red-500" : "border-gray-400"
              )}
              placeholder="Johndoe@samplemail.com"
              {...register("email")}
              aria-invalid={!!errors.email}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              value={user?.email}
              disabled
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <CustomButton
            type="submit"
            className=" md:max-w-2xl w-full mt-5 md:mt-10"
            disabled={loading}
            loader={loading}
          >
            Reset Pin
          </CustomButton>
        </form>
      </motion.div>
    </div>
  );
}
