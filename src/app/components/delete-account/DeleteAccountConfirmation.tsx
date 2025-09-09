"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const deleteAccountSchema = z.object({
  reason: z
    .string()
    .min(1, "Please provide a reason for deleting your account"),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

type Props = {
  onCancel?: () => void;
  onConfirm?: (reason: string) => void;
  isLoading?: boolean;
};

const DeleteAccountConfirmation = ({ onCancel, isLoading = false }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: DeleteAccountForm) => {
    console.log("====================================");
    console.log(data.reason || "np data");
    console.log("====================================");
    // onConfirm?.(data.reason);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full pt-14"
    >
      <div className="flex-1 flex flex-col justify-center text-center px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4">
          Are you sure you want to delete your account?
        </h2>

        <p className="text-black text-sm sm:text-base mb-8 leading-relaxed">
          Deleting your account is permanent. You will lose your profile,
          progress, rewards, and purchased items.
        </p>

        <div className="mb-8">
          <label className="block text-left text-[#3B3B3B] text-sm font-medium mb-3">
            Tell us the reason why you want to delete your Account
          </label>
          <textarea
            {...register("reason")}
            placeholder="Please provide a reason..."
            className={cn(
              "w-full p-4 border  rounded-md resize-none h-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-transparent ",
              errors.reason
                ? "border-red-500"
                : "border-gray-300 focus:border-primary-800"
            )}
            disabled={isLoading}
          />
          {errors.reason && (
            <p className="text-red-500 text-start text-sm mt-1">
              {errors.reason.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="destructive"
          className="flex-1 h-12 text-base font-semibold rounded-full bg-[#C30012] hover:bg-[#C30012]"
          disabled={ isLoading}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-12 text-base font-semibold rounded-full bg-[#17478B] hover:bg-[#17478B] text-white border-[#17478B]"
          disabled={isLoading}
        >
          No, Cancel
        </Button>
      </div>
    </form>
  );
};

export default DeleteAccountConfirmation;
