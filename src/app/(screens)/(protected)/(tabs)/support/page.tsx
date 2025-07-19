/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareShare } from "lucide-react";
import QmDrawer from "@/app/components/drawer/drawer";
import CustomButton from "@/app/utils/CustomBtn";
import UserAPI, { getAuthUser } from "@/app/api/userApi";
import { SuccessIcon } from "@/app/utils/successIcon";
import useTawkHidden from "@/app/components/tawk/useTawkHidden";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks/useAuth";
const Support = () => {
  useTawkHidden();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = getAuthUser();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [experienceRating, setExperienceRating] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFeedbackForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingForm(true);
    const form = {
      rating: experienceRating,
      message: feedbackMsg,
    };
    try {
      console.log("form", form);
      const res = await UserAPI.sendFeedback(form, dispatch);
      console.log(res);
      setSubmittingForm(false);
      setIsSuccess(true);
    } catch (error: any) {
      console.log(error);
      setSubmittingForm(false);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="pb-20"
      >
        <Flex direction="column" gap="40px">
          <div
            onClick={() => router.back()}
            className="flex items-center gap-2 font-semibold cursor-pointer"
          >
            <ArrowLeftIcon />
            <p>Back</p>
          </div>
          <Flex
            direction={"column"}
            gap={"20px"}
            className=" md:bg-white sm:p-5 lg:p-10 rounded-3xl"
          >
            <div>
              <p className="text-xl md:text-2xl text-primary-700 font-bold">
                We are available 24 hours 7 days a week
              </p>

              <p className="text-xs md:text-sm">
                Got questions or need help? Our support team is here for you
                anytime, day or night.
              </p>
            </div>

            <div className="flex gap-6 md:gap-10 mt-4 flex-col">
              {/* <div className="flex items-center gap-6 border-b border-zinc-200 pb-4">
              <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                <Image
                  src="/icons/ticket.svg"
                  alt="ticket"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className=" font-semibold">
                  Log your issue to the support team
                </p>
                <p
                  onClick={() => router.push("/support/ticket")}
                  className="text-sm underline text-primary-700 mt-1 cursor-pointer"
                >
                  View ticket
                </p>
              </div>
            </div> */}

              <div className="flex items-center border-b border-zinc-200 pb-4 gap-6">
                <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                  <Image
                    src="/icons/question.svg"
                    alt="ticket"
                    width={13}
                    height={13}
                  />
                </div>
                <div>
                  <p className=" font-semibold">Visit Our Help Section</p>
                  <Link
                    href="https://quizmoney.ng/faqs"
                    className="text-sm underline text-primary-700 mt-1"
                  >
                    Faqs & Help{" "}
                  </Link>
                </div>
              </div>

              <div className="flex items-center border-b border-zinc-200 pb-4 gap-6">
                <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                  <Image
                    src="/icons/device-message.svg"
                    alt="ticket"
                    width={22}
                    height={22}
                  />
                </div>
                <div>
                  <p className=" font-semibold">Contact us via email</p>
                  <Link
                    href="mailto:hi@quizmoney.ng"
                    className="text-sm underline text-primary-700 mt-1"
                  >
                    hi@quizmoney.ng
                  </Link>
                </div>
              </div>

              {/* FeedBack  */}
              <QmDrawer
                open={openDrawer}
                onOpenChange={setOpenDrawer}
                heightClass={`${!isSuccess ? "md:h-[90%]" : "h-[60%]"}`}
                trigger={
                  <div
                    onClick={() => setOpenDrawer(true)}
                    className="cursor-pointer flex items-center gap-6 border-b border-zinc-200 pb-4"
                  >
                    <div className="bg-primary-50 rounded-full h-[48px] w-[48px] p-2 flex items-center justify-center">
                      <MessageSquareShare
                        width={20}
                        className="text-primary-800"
                      />
                    </div>
                    <div>
                      <p className=" font-semibold">
                        How are you liking Quiz Money?
                      </p>
                      <p className="text-sm underline text-primary-700 mt-1 cursor-pointer">
                        Send a feedback
                      </p>
                    </div>
                  </div>
                }
                title={`${!isSuccess ? "Send us your feedback!" : ""}`}
                titleLeft
              >
                {!isSuccess ? (
                  <div className="pt-4 space-y-4">
                    <div className="border-t border-neutral-300 w-[70%] mx-auto" />
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-primary-900">
                        How was your experience?
                      </h3>
                      <p className="text-sm">
                        Your review will help us improve our product and make it
                        more user friendly for you and your friends
                      </p>
                    </div>

                    <form
                      onSubmit={handleFeedbackForm}
                      className="w-full space-y-5 pt-4"
                    >
                      <Flex
                        align="center"
                        direction="column"
                        className="gap-4 pb-14"
                        justify="center"
                      >
                        <p>Rate us</p>
                        <div className="flex gap-4">
                          <label className="relative cursor-pointer text-3xl hover:scale-110 transition-transform">
                            <input
                              type="radio"
                              name="experience"
                              value="really_good"
                              onChange={(e) =>
                                setExperienceRating(e.target.value)
                              }
                              className="hidden peer"
                              required
                            />
                            <span
                              tabIndex={0}
                              className="text-6xl peer-checked:grayscale-0 grayscale-75 peer-checked:ring-2 peer-checked:bg-positive-900 peer-checked:ring-positive-900 peer-checked:rounded-full py-1 px-2"
                            >
                              😍
                            </span>
                            <p className="hidden peer-checked:block bg-positive-900 text-neutral-50 rounded-full text-sm py-1 w-26 text-center absolute -left-3 -bottom-12 text-nowrap">
                              Really Good
                            </p>
                          </label>

                          <label className="relative cursor-pointer text-3xl hover:scale-110 transition-transform">
                            <input
                              type="radio"
                              name="experience"
                              value="good"
                              onChange={(e) =>
                                setExperienceRating(e.target.value)
                              }
                              className="hidden peer"
                            />
                            <span
                              tabIndex={0}
                              className="text-6xl peer-checked:grayscale-0 grayscale-75 peer-checked:ring-2 peer-checked:bg-warning-900 peer-checked:ring-warning-900 peer-checked:rounded-full py-1 px-2"
                            >
                              😊
                            </span>
                            <p className="hidden peer-checked:block bg-warning-900 text-neutral-50 rounded-full text-sm py-1 w-26 text-center absolute -left-3 -bottom-12 text-nowrap">
                              Good
                            </p>
                          </label>

                          <label className="relative cursor-pointer text-3xl hover:scale-110 transition-transform">
                            <input
                              type="radio"
                              name="experience"
                              value="bad"
                              onChange={(e) =>
                                setExperienceRating(e.target.value)
                              }
                              className="hidden peer"
                            />
                            <span
                              tabIndex={0}
                              className="text-6xl peer-checked:grayscale-0 grayscale-75 peer-checked:ring-2 peer-checked:bg-error-900 peer-checked:ring-error-900 peer-checked:rounded-full py-1 px-2"
                            >
                              😞
                            </span>
                            <p className="hidden peer-checked:block bg-error-900 text-neutral-50 rounded-full text-sm py-1 w-26 text-center absolute -left-3 -bottom-12 text-nowrap">
                              Bad
                            </p>
                          </label>
                        </div>
                      </Flex>
                      <textarea
                        name=""
                        id=""
                        rows={5}
                        value={feedbackMsg}
                        onChange={(e) => setFeedbackMsg(e.target.value)}
                        placeholder="Share feedback..."
                        className="border border-neutral-400 focus:outline-primary-900 resize-none caret-primary-900 rounded-xl w-full placeholder:text-neutral-400 p-4"
                        required
                      ></textarea>
                      {!submittingForm ? (
                        <CustomButton width="full" type="submit">
                          Submit Review
                        </CustomButton>
                      ) : (
                        <CustomButton
                          type="button"
                          width="full"
                          loader
                          disabled
                        />
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 pt-6">
                    <SuccessIcon />
                    <h3 className="font-bold text-2xl text-primary-900">
                      Amazing
                    </h3>
                    <p>
                      Thank you{" "}
                      <span className="capitalize font-medium text-primary-900">
                        {user.firstName}
                      </span>{" "}
                      for your feedback.
                    </p>
                    <div className="pt-4 w-full flex items-center justify-center">
                      <CustomButton
                        width="medium"
                        onClick={() => router.push("/home")}
                      >
                        Go to home
                      </CustomButton>
                    </div>
                  </div>
                )}
              </QmDrawer>

              <CustomButton
                width="full"
                onClick={() => window.Tawk_API?.maximize()}
                className="px-4 py-2 bg-primary-700 text-white rounded-xl"
              >
                Live Chat with Support
              </CustomButton>
            </div>
          </Flex>
        </Flex>
      </motion.div>

      {/* <Script
        id="tawk-to"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/68428acad7b1f2190a47426f/1it1usa0o';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      /> */}
    </div>
  );
};

export default Support;
