"use client";
import { genders } from "@/app/(screens)/(preAuthScreen)/signup/formSteps/step2";
import { User } from "@/app/api/interface";
import userApi, { getAuthUser } from "@/app/api/userApi";
import ImagePickerModal from "@/app/components/modal/ImagePickerModal";
import { useAppSelector, useAuth } from "@/app/hooks/useAuth";
import {
  ArrowDownIcon,
  FacebookIcon,
  MailIcon,
  PersonIcon,
} from "@/app/icons/icons";
import { decryptData, encryptData } from "@/app/utils/crypto";
import CustomButton from "@/app/utils/CustomBtn";
import CustomSelect from "@/app/utils/CustomSelect";
import CustomTextField from "@/app/utils/CustomTextField";
import { formatDateTime } from "@/app/utils/utils";
import {
  CalendarIcon,
  GlobeIcon,
  InstagramLogoIcon,
  Pencil1Icon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Flex, Grid } from "@radix-ui/themes";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

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
};

const Page = () => {
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  const formattedDOB = new Date(user?.dob?.iso ?? "")
    .toISOString()
    .split("T")[0];
  const [formData, setFormData] = useState({
    ...initialForm,
    ...user,
    dob: formattedDOB,
  });
  const authUser = getAuthUser();
  const { fullDate } = formatDateTime(
    authUser.createdAt ?? new Date().toISOString()
  );
  console.log("FormData:", formData);

  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { loginUser } = useAuth();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUser = async () => {
    setIsUpdating(true);

    await userApi
      .updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        country: formData.country,
        facebook: formData.facebook ?? "",
        instagram: formData.instagram ?? "",
        twitter: formData.twitter ?? "",
        whatsapp: formData.whatsapp ?? "",
        avatar: user?.avatar ?? "",
        promotionalMails: user?.promotionalMails ?? false,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsEditing(false);
          toast.success("Profile updated successfully", {
            position: "top-center",
          });

          const userData = res.data.result.updatedUser;
          const encryptedUser = encryptData(userData);

          // ✅ Dispatch to Redux
          loginUser(encryptedUser);
        }
      })
      .catch((err: AxiosError) => {
        toast.error(
          (err.response?.data as unknown as { error: string }).error ||
            "Failed to update profile. Please try again later.",
          {
            position: "top-center",
          }
        );
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="pb-20"
    >
      <div className="rounded-lg w-full bg-white overflow-hidden">
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
                className="cursor-pointer sm:w-[100px] sm:h-[100px] w-[80px] h-[80px] rounded-full  border-2 border-primary-400  z-10 bg-white/50 backdrop-blur-sm"
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  <Image
                    src={user?.avatar ?? "/assets/images/profile.png"}
                    alt="profile"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Image
                    src={"/icons/camera.svg"}
                    alt="profile"
                    width={100}
                    height={100}
                    className="w-6 h-6 absolute bottom-0 right-0 text-black fill-black z-40 bg-white"
                  />
                </div>
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
                  disabled={!isEditing}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                  className="capitalize"
                />
                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  onChange={onChange}
                  disabled={!isEditing}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                  className="capitalize"
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
                <CustomSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  options={genders}
                  onChange={onChange}
                  disabledOption="Select your gender"
                  icon={<ArrowDownIcon className="text-[#A6ABC4]" />}
                  disabled={!isEditing}
                />
                <CustomTextField
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  type="date"
                  autoComplete="bday"
                  // onChange={onChange}
                  disabled={!isEditing}
                  icon={<CalendarIcon className="text-[#A6ABC4] h-6 w-6" />}
                  required
                  // className="min-0 !w-full"
                />

                <CustomSelect
                  label="Country"
                  name="gender"
                  value={formData.gender}
                  options={[{ label: "Nigeria", value: "nigeria" }]}
                  onChange={onChange}
                  disabled={!isEditing}
                  disabledOption="Select your country"
                  icon={<GlobeIcon className="text-[#A6ABC4] h-6 w-6" />}
                />
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
                    name="facebook"
                    value={
                      formData.facebook == "undefined" ? "" : formData.facebook
                    }
                    type="text"
                    placeholder="@username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<FacebookIcon className="text-[#A6ABC4] h-6 w-6" />}
                    required
                  />

                  <CustomTextField
                    label="Instagram"
                    name="instagram"
                    value={
                      formData.instagram == "undefined"
                        ? ""
                        : formData.instagram
                    }
                    type="text"
                    placeholder="@username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={
                      <InstagramLogoIcon className="text-[#A6ABC4] h-6 w-6" />
                    }
                    required
                  />

                  <CustomTextField
                    label="X Formerly Twitter"
                    name="twitter"
                    value={
                      formData.twitter == "undefined" ? "" : formData.twitter
                    }
                    type="text"
                    placeholder="@username"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={
                      <TwitterLogoIcon className="text-[#A6ABC4] h-6 w-6" />
                    }
                    required
                  />

                  <CustomTextField
                    label="Whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    type="text"
                    placeholder="Enter your whatsapp number"
                    onChange={onChange}
                    disabled={!isEditing}
                    icon={<PersonIcon className="text-[#A6ABC4] h-6 w-6" />}
                    required
                  />

                  {isEditing && (
                    <CustomButton
                      onClick={updateUser}
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
