import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import Image from "next/image";
import { CheckIcon } from "@radix-ui/react-icons";
import UserAPI from "@/app/api/userApi";
import CustomButton from "@/app/utils/CustomBtn";
import { useAppSelector, useAuth } from "@/app/hooks/useAuth";
import { decryptData, encryptData } from "@/app/utils/crypto";
import { User } from "@/app/api/interface";
import { AxiosError } from "axios";
// give me 12 images

interface IAvatar {
  _type: string;
  url: string;
  name: string;
}

const ImagePickerModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [selectedImage, setSelectedImage] = useState<IAvatar>();
  const handleSelectImage = () => {
    toast.info("Gallery Access Coming soon", {
      position: toastPosition,
    });
  };
  const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user: User | null = encrypted ? decryptData(encrypted) : null;
  const [isUpdating, setIsUpdating] = useState(false);
  const { loginUser } = useAuth();

  const handleSelectAvatar = (image: IAvatar) => {
    setSelectedImage(image);
    // setShowAvatar(false);
  };

  const getAvatar = async () => {
    await UserAPI.getAvatars()
      .then((res) =>
        setAvatars(
          res.data?.results?.map(
            (data: { avatar: { url: string } }) => data.avatar
          )
        )
      )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (open) {
      getAvatar();
    }
  }, [open]);

  const updateUser = async () => {
    setIsUpdating(true);

    await UserAPI.updateUser({
      firstName: user?.firstName,
      lastName: user?.lastName,
      dob: user?.dob?.iso,
      gender: user?.gender,
      country: user?.country,
      facebook: user?.facebook,
      instagram: user?.instagram,
      twitter: user?.twitter,
      whatsapp: user?.whatsapp,
      avatar: selectedImage?.url ? selectedImage?.url : user?.avatar,
      promotionalMails: user?.promotionalMails ?? false,
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Profile updated successfully", {
            position: "top-center",
          });
          const userData = res.data.result.updatedUser;
          const encryptedUser = encryptData(userData);
          console.log("Encrypted: ", encryptedUser);

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
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Choose a display picture"
      description="customize your profile "
    >
      {!showAvatar ? (
        <div className="mt-5 flex flex-col gap-4">
          <div
            onClick={() => setShowAvatar(true)}
            className="flex items-center justify-center h-[80px] md:h-[100px] w-full border border-primary-300 rounded-3xl cursor-pointer"
          >
            Select from our variety of images
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className=" min-w-[130px] h-[1px] bg-zinc-200" />
            Or
            <div className=" min-w-[130px] h-[1px] bg-zinc-200" />
          </div>
          <div
            onClick={handleSelectImage}
            className="flex items-center justify-center h-[80px] md:h-[100px] w-full border border-primary-300 rounded-3xl cursor-pointer"
          >
            Upload from your gallery
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-base md:text-lg font-medium">Pick an Avatar</p>
          <div className=" bg-zinc-800 rounded-3xl w-full h-full p-4 md:p-10">
            <div className="grid grid-cols-4 place-items-center gap-4">
              {avatars.map((image: IAvatar) => (
                <div
                  key={image.name}
                  onClick={() => handleSelectAvatar(image)}
                  className={`w-[60px] h-[60px] md:w-20 md:h-20 bg-zinc-700 rounded-full relative ${
                    selectedImage?.name === image.name
                      ? "border-2 border-primary-500"
                      : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />

                  {selectedImage?.name === image.name && (
                    <div className="absolute bottom-0 right-1 md:right-4 bg-primary-400 rounded-full flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <CustomButton
            loader={isUpdating}
            disabled={selectedImage === null || selectedImage === undefined}
            className="w-fit"
            onClick={updateUser}
          >
            Select Avatar
          </CustomButton>
        </div>
      )}
    </Modal>
  );
};

export default ImagePickerModal;
