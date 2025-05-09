"use client";
import { genders } from "@/app/(screens)/(preAuthScreen)/signup/formSteps/step2";
import ImagePickerModal from "@/app/components/modal/ImagePickerModal";
import {
  ArrowDownIcon,
  FacebookIcon,
  MailIcon,
  PersonIcon,
} from "@/app/icons/icons";
import CustomSelect from "@/app/utils/CustomSelect";
import CustomTextField from "@/app/utils/CustomTextField";
import {
  CalendarIcon,
  CameraIcon,
  GlobeIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Grid } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

const page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="pb-20"
    >
      <div className="rounded-lg w-full bg-white overflow-hidden">
        <div className="w-full h-[120px] md:h-[160px] bg-primary-500 overflow-hidden rounded-br-[60px]">
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
              <div className="sm:w-[100px] sm:h-[100px] w-[80px] h-[80px] rounded-full  border-2 border-primary-400  z-10 bg-white/50 backdrop-blur-sm">
                <div className="w-full h-full flex items-center justify-center relative">
                  <Image
                    src="/assets/images/profile.png"
                    alt="profile"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <CameraIcon className="w-6 h-6 absolute bottom-0 right-0 text-black fill-black z-40" />
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
                  <p className=" font-semibold">Joseph Michael</p>
                  <p className=" font-light">olamideolamide@gmail.com</p>
                </div>

                <div className="flex flex-col justify-between items-end">
                  {!isEditing && (
                    <p
                      onClick={() => setIsEditing(!isEditing)}
                      className=" underline text-primary-500 cursor-pointer"
                    >
                      Edit Profile
                    </p>
                  )}
                  <p className=" font-light text-sm">Joined Feb 4th, 2025</p>
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
                  // value={formData.firstName}
                  type="text"
                  autoComplete="first-name"
                  placeholder="Enter your first name"
                  // onChange={onChange}
                  readOnly={!isEditing}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                />
                <CustomTextField
                  label="Last Name"
                  name="lastName"
                  // value={formData.lastName}
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  // onChange={onChange}
                  readOnly={!isEditing}
                  icon={<PersonIcon className="text-[#A6ABC4]" />}
                  required
                />
                <CustomTextField
                  label="Email"
                  name="email"
                  // value={formData.email}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  // onChange={onChange}
                  readOnly={!isEditing}
                  icon={<MailIcon className="text-[#A6ABC4]" />}
                  required
                />
                <CustomSelect
                  label="Gender"
                  name="gender"
                  // value={formData.gender}
                  options={genders}
                  // onChange={onChange}
                  disabledOption="Select your gender"
                  icon={<ArrowDownIcon className="text-[#A6ABC4]" />}
                  readOnly={!isEditing}
                />
                <CustomTextField
                  label="Date of Birth"
                  name="dob"
                  // value={formData.dob}
                  type="date"
                  autoComplete="bday"
                  // onChange={onChange}
                  readOnly={!isEditing}
                  icon={<CalendarIcon className="text-[#A6ABC4] h-6 w-6" />}
                  required
                />

                <CustomSelect
                  label="Country"
                  name="gender"
                  // value={formData.gender}
                  options={[{ label: "Nigeria", value: "nigeria" }]}
                  // onChange={onChange}
                  readOnly={!isEditing}
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
                    // value={formData.lastName}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    // onChange={onChange}
                    readOnly={!isEditing}
                    icon={<FacebookIcon className="text-[#A6ABC4] h-6 w-6" />}
                    required
                  />

                  <CustomTextField
                    label="Instagram"
                    name="instagram"
                    // value={formData.lastName}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    // onChange={onChange}
                    readOnly={!isEditing}
                    icon={
                      <InstagramLogoIcon className="text-[#A6ABC4] h-6 w-6" />
                    }
                    required
                  />

                  <CustomTextField
                    label="X Formerly Twitter"
                    name="twitter"
                    // value={formData.lastName}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    // onChange={onChange}
                    readOnly={!isEditing}
                    icon={
                      <TwitterLogoIcon className="text-[#A6ABC4] h-6 w-6" />
                    }
                    required
                  />

                  <CustomTextField
                    label="Whatsapp"
                    name="whatsapp"
                    // value={formData.lastName}
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    // onChange={onChange}
                    readOnly={!isEditing}
                    icon={<PersonIcon className="text-[#A6ABC4] h-6 w-6" />}
                    required
                  />

                  {isEditing && (
                    <div
                      onClick={() => setIsEditing(false)}
                      className=" rounded-3xl py-3 bg-primary-700 w-full flex cursor-pointer items-center justify-center text-white"
                    >
                      Update Profile
                    </div>
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

export default page;
