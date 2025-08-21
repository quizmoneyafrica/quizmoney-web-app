import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "@/app/utils/CustomBtn";
import { ArrowLeft, CircleCheck, Info, Loader } from "lucide-react";
import QmDrawer from "@/app/components/drawer/drawer";
import CustomImage from "@/app/components/wallet/CustomImage";
import { useRouter } from "next/navigation";

const bvnSchema = z.object({
  bvn: z
    .string()
    .min(11, "BVN must be 11 digits")
    .max(11, "BVN must be 11 digits")
    .regex(/^\d{11}$/, "BVN must contain only numbers"),
});

type BvnForm = z.infer<typeof bvnSchema>;

export default function BvnVerification({
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [successModal, setSuccessModal] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BvnForm>({
    resolver: zodResolver(bvnSchema),
    defaultValues: {
      bvn: "",
    },
  });

  const onSubmit = async (data: BvnForm) => {
    try {
      setSuccessModal(true);
    } catch (error) {
      console.error("BVN verification failed:", error);
    }
  };
  const backToDashboard = () => {
    setSuccessModal(false);
    router.back();
  };

  return (
    <Fragment>
      <div className="w-full">
        <div className="w-full">
          {/* Header */}
          <div className="w-full mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add BVN</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use our BVN to ensure security and that your account belongs to
              you
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Enter your bank verification Number (BVN)
              </label>
              <input
                {...register("bvn")}
                type="text"
                placeholder="Input your BVN"
                maxLength={11}
                className="w-full px-4 py-4 border border-[#3A3A3A80] rounded-lg focus:outline-none focus:ring-transparent  text-base"
              />
              {errors.bvn && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.bvn.message}
                </p>
              )}
            </div>

            {/* Why we need BVN section */}
            <div className="bg-[#DEF2FF] p-5 rounded-lg">
              <div className="flex items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Why we need your BVN?
                </h3>
                <div className="ml-2">
                  <Info className=" size-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <CircleCheck className=" text-[#009028] size-5" />

                  <span className="text-[#009028] text-sm font-medium">
                    Verify your Full Name
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <CircleCheck className=" text-[#009028] size-5" />

                  <span className="text-[#009028] text-sm font-medium">
                    Verify your Date of Birth
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <CircleCheck className=" text-[#009028] size-5" />
                  <span className="text-[#009028] text-sm font-medium">
                    Verify your Account Number
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4 w-full flex justify-between gap-2">
              <CustomButton
                onClick={() => {
                  setSuccessModal(false);
                  onBack?.();
                }}
                type="button"
                className=" flex border border-primary-900 bg-white hover:bg-white  items-center w-fit gap-2 flex-1 h-12"
              >
                <ArrowLeft className="text-primary-900" />
                <span className="text-primary-900">Back</span>
              </CustomButton>
              <CustomButton
                loaderComponent={
                  <Loader className="animate-spin size-5 text-white" />
                }
                type="submit"
                disabled={isSubmitting || !!errors.bvn}
                className="w-full h-12 flex items-center justify-center  py-4 rounded-full text-white font-semibold text-lg transition-all"
              >
                Verify
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
      <QmDrawer
        open={successModal}
        onOpenChange={backToDashboard}
        title=""
        titleLeft
        heightClass="h-[75%] md:h-[45%] lg:h-[65%]"
      >
        {/* Provide valid children here */}
        <div className=" flex-col flex gap-2 items-center pt-2">
          <CustomImage alt="succ" src={"/icons/success_bg.svg"} />
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl text-[#3B3B3B] text-center">
              KYC Completed!
            </p>
            <p className="text-sm leading-5 text-gray-600 text-center">
              Your identity is verified. You now have <br />
              full access to QuizMoney.
            </p>
          </div>
          <div className=" w-full pt-14">
            <CustomButton
              onClick={backToDashboard}
              loaderComponent={
                <Loader className="animate-spin size-5 text-white" />
              }
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center  py-4 rounded-full text-white font-semibold text-lg transition-all"
            >
              Proceed to Dashboard
            </CustomButton>
          </div>
        </div>
      </QmDrawer>
    </Fragment>
  );
}
