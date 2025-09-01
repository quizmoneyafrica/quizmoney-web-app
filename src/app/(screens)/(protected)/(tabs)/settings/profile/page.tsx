/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import userApi, { getAuthUser } from "@/app/api/userApi";
import ImagePickerModal from "@/app/components/modal/ImagePickerModal";
import { useAppDispatch, useAuth } from "@/app/hooks/useAuth";
import { MailIcon, PersonIcon } from "@/app/icons/icons";
import CustomButton from "@/app/utils/CustomBtn";
import CustomTextField from "@/app/utils/CustomTextField";
import { formatDateTime, toastPosition } from "@/app/utils/utils";
import { CalendarIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Avatar, Flex, Grid } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { CameraIcon } from "lucide-react";
import { updateUser } from "@/app/store/authSlice";
import { useKycStep } from "@/app/hooks/useKycStep";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  dob: "",
  gender: "",
  country: "nigeria",
  facebook: "",
  instagram: "",
  twitter: "",
  whatsapp: "",
  tiktok: "",
};

const Page = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { customerKyc } = useKycStep();
  const bvnStep = customerKyc.find((s) => s.step === "BVN");

  const [formData, setFormData] = useState({
    ...initialForm,
    ...user,
  });
  const authUser = getAuthUser();
  const { fullDate } = formatDateTime(
    authUser?.createdAt ?? new Date().toISOString()
  );
  console.log("FormData:", formData);

  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUserInfo = async () => {
    setIsUpdating(true);
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      facebook: formData.facebookHandle ? formData.facebookHandle.trim() : "",
      instagram: formData.instagramHandle
        ? formData.instagramHandle.trim()
        : "",
      twitter: formData.twitterHandle ? formData.twitterHandle.trim() : "",
      whatsapp: formData.whatsappContact ? formData.whatsappContact.trim() : "",
      tiktok: formData.tiktokHandle ? formData.tiktokHandle.trim() : "",
    };
    try {
      await userApi.updateProfile(payload);
      toast.success("Profile updated successfully", {
        position: "top-center",
      });
      setIsEditing(false);
      dispatch(
        updateUser({
          facebookHandle: formData.facebookHandle
            ? formData.facebookHandle.trim()
            : "",
          instagramHandle: formData.instagramHandle
            ? formData.instagramHandle.trim()
            : "",
          twitterHandle: formData.twitterHandle
            ? formData.twitterHandle.trim()
            : "",
          whatsappContact: formData.whatsappContact
            ? formData.whatsappContact.trim()
            : "",
          tiktokHandle: formData.tiktokHandle
            ? formData.tiktokHandle.trim()
            : "",
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      );
    } catch (err: any) {
      toast.error(err.message, { position: toastPosition });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="rounded-lg w-full bg-white overflow-hidden pb-12">
        <div className="w-full h-[120px] md:h-[160px] bg-primary-800 overflow-hidden rounded-br-[60px]">
          <Image
            src="/assets/images/background-desktop.png"
            alt="background"
            width={500}
            height={500}
            className="w-full h-full object-cover brightness-75 scale-125"
          />
        </div>
        <div className="lg:px-20 px-4 h-full w-full">
          <div className="  relative min-h-[80vh] w-full ">
            <div className=" -translate-y-12 w-full border-b border-gray-200 h-fit pb-10">
              {/* profile pic */}
              <div
                onClick={() => setIsImageModalOpen(true)}
                className="relative inline-block"
              >
                <Avatar
                  src={user?.avatarUrl ?? "/assets/images/profile.png"}
                  fallback={user?.firstName?.charAt(0).toUpperCase() || ""}
                  radius="full"
                  className="bg-primary-100 w-full object-cover border-2 border-primary-400 backdrop-blur-sm"
                  size="6"
                />
                <CameraIcon
                  fill="#fff"
                  className="absolute bottom-0 right-0 text-primary-900"
                />
              </div>

              <Flex justify="between" className="w-full mt-4">
                <div className="flex flex-col gap-2">
                  <p
                    onClick={() => setIsImageModalOpen(true)}
                    className=" font-medium text-primary-500 cursor-pointer"
                  >
                    Change Image
                  </p>
                  <p className=" font-semibold capitalize">
                    {user?.firstName} {user?.lastName} 🇳🇬
                  </p>
                  <p className=" font-light">{user?.email}</p>
                  <p className=" font-light text-xs block sm:hidden">
                    Joined {user?.createdAt ? fullDate : "N/A"}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-end">
                  {!isEditing && (
                    <div
                      onClick={() => setIsEditing(!isEditing)}
                      className=" underline text-primary-500 cursor-pointer text-xs sm:text-sm flex items-center "
                    >
                      Edit Profile
                      <Pencil1Icon className="w-4 h-4" />
                    </div>
                  )}
                  <p className="font-light text-xs sm:block hidden">
                    Joined {user?.createdAt ? fullDate : "N/A"}
                  </p>
                </div>
              </Flex>
            </div>

            <div className=" space-y-10">
              <Grid
                columns={{ initial: "1", md: "2" }}
                gap={{ initial: "5", md: "40px" }}
              >
                <CustomTextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  type="text"
                  autoComplete="first-name"
                  placeholder="Enter your first name"
                  onChange={onChange}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                  className="capitalize"
                  disabled={
                    !isEditing || (bvnStep && bvnStep?.status === "COMPLETED")
                  }
                />

                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  onChange={onChange}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                  className="capitalize"
                  disabled={
                    !isEditing || (bvnStep && bvnStep?.status === "COMPLETED")
                  }
                />
                <CustomTextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  onChange={onChange}
                  disabled={true}
                  icon={<MailIcon className="text-[#A6ABC4]" />}
                  required
                />
                {/* <CustomSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  options={genders}
                  onChange={onChange}
                  disabledOption="Select your gender"
                  icon={<ArrowDownIcon className="text-[#A6ABC4]" />}
                  disabled
                /> */}
                <CustomTextField
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  type="date"
                  autoComplete="bday"
                  // onChange={onChange}
                  disabled
                  icon={<CalendarIcon className="text-[#A6ABC4] h-6 w-6" />}
                  required
                  // className="min-0 !w-full"
                />

                {/* <CustomSelect
                  label="Country"
                  name="gender"
                  value={formData.gender}
                  options={[{ label: "Nigeria", value: "nigeria" }]}
                  onChange={onChange}
                  disabled={!isEditing}
                  disabledOption="Select your country"
                  icon={<GlobeIcon className="text-[#A6ABC4] h-6 w-6" />}
                /> */}
              </Grid>

              <div>
                <p className="text-primary-800 font-medium text-lg">Social</p>
                <Grid
                  columns={{ initial: "1", md: "2" }}
                  gap={{ initial: "5", md: "40px" }}
                  mt="4"
                >
                  <CustomTextField
                    label="Facebook"
                    name="facebookHandle"
                    value={
                      formData.facebookHandle == "undefined"
                        ? ""
                        : formData.facebookHandle
                    }
                    type="text"
                    placeholder="username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FaFacebook className="text-[#A6ABC4] text-xl" />}
                    required
                    className="lowercase"
                  />

                  <CustomTextField
                    label="Instagram"
                    name="instagramHandle"
                    value={
                      formData.instagramHandle == "undefined"
                        ? ""
                        : formData.instagramHandle
                    }
                    type="text"
                    placeholder="username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FaInstagram className="text-[#A6ABC4] text-xl" />}
                    required
                    className="lowercase"
                  />

                  <CustomTextField
                    label="X Formerly Twitter"
                    name="twitterHandle"
                    value={
                      formData.twitterHandle == "undefined"
                        ? ""
                        : formData.twitterHandle
                    }
                    type="text"
                    placeholder="username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FaTwitter className="text-[#A6ABC4] text-xl" />}
                    required
                    className="lowercase"
                  />
                  <CustomTextField
                    label="Tiktok"
                    name="tiktokHandle"
                    value={
                      formData.tiktokHandle == "undefined"
                        ? ""
                        : formData.tiktokHandle
                    }
                    type="text"
                    placeholder="username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FaTiktok className="text-[#A6ABC4] text-xl" />}
                    required
                    className="lowercase"
                  />

                  <CustomTextField
                    label="Whatsapp"
                    name="whatsappContact"
                    value={formData.whatsappContact}
                    type="text"
                    placeholder="Enter your whatsapp number"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FaWhatsapp className="text-[#A6ABC4] text-xl" />}
                    required
                  />

                  {isEditing && (
                    <CustomButton
                      onClick={updateUserInfo}
                      loader={isUpdating}
                      disabled={isUpdating}
                    >
                      Update Profile
                    </CustomButton>
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImagePickerModal open={isImageModalOpen} setOpen={setIsImageModalOpen} />
    </motion.div>
  );
};

export default Page;
