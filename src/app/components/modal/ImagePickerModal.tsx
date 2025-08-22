/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import UserAPI from "@/app/api/userApi";
import CustomButton from "@/app/utils/CustomBtn";
import { useAppDispatch, useAuth } from "@/app/hooks/useAuth";
import QmDrawer from "../drawer/drawer";
import { toast } from "sonner";
import { updateUser, UserObject } from "@/app/store/authSlice";

interface IAvatar {
  avatarUrl: string;
  id: string;
}

const ImagePickerModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatars, setAvatars] = useState<IAvatar[]>([]);
  const [selectedImage, setSelectedImage] = useState<IAvatar>();
  // const handleSelectImage = () => {
  //   toast.info("Gallery Access Coming soon", {
  //     position: toastPosition,
  //   });
  // };
  // const encrypted = useAppSelector((s) => s.auth.userEncryptedData);
  const user = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectAvatar = (image: IAvatar) => {
    setSelectedImage(image);
    // setShowAvatar(false);
  };

  const getAvatar = async () => {
    try {
      const res = await UserAPI.getAvatars();
      const results = res.data || [];

      // const mappedAvatars = results.map((item: RootObject) => item.avatar);
      console.log("mappedAvatars", results);
      setAvatars(results);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (open) {
      getAvatar();
    }
  }, [open]);

  const updateUserAvatar = async () => {
    setIsUpdating(true);
    const payload: UserObject = {
      firstName: user.user?.firstName,
      lastName: user.user?.lastName,
      avatarUrl: selectedImage?.avatarUrl || "",
    };
    try {
      const res = await UserAPI.updateUser(payload);
      console.log(res);
      dispatch(updateUser({ avatarUrl: selectedImage?.avatarUrl }));
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message, { position: "top-right" });
    } finally {
      setIsUpdating(false);
    }
  };
  console.log(avatars);

  return (
    <>
      <QmDrawer title="Select Avatar" open={open} onOpenChange={setOpen}>
        {!showAvatar ? (
          <div className="mt-5 md:pt-10 flex flex-col gap-4">
            <div
              onClick={() => setShowAvatar(true)}
              className="flex items-center justify-center h-[80px] md:h-[100px] w-full border border-primary-300 rounded-3xl cursor-pointer"
            >
              Select from our variety of images
            </div>
            {/* <div className="flex items-center justify-center gap-2">
              <div className=" min-w-[130px] h-[1px] bg-zinc-200" />
              Or
              <div className=" min-w-[130px] h-[1px] bg-zinc-200" />
            </div>
            <div
              onClick={handleSelectImage}
              className="flex items-center justify-center h-[80px] md:h-[100px] w-full border border-primary-300 rounded-3xl cursor-pointer"
            >
              Upload from your gallery
            </div> */}
          </div>
        ) : (
          <div className="grid gap-4">
            {/* <p className="text-base md:text-lg font-medium">Pick an Avatar</p> */}
            <div className=" bg-zinc-800 rounded-3xl w-full h-full p-4 md:p-10">
              {avatars.length > 0 ? (
                <div className="grid grid-cols-4 place-items-center gap-4">
                  {avatars.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => handleSelectAvatar(image)}
                      className={`cursor-pointer w-[60px] h-[60px] md:w-20 md:h-20 bg-zinc-700 rounded-full relative ${
                        selectedImage?.id === image.id
                          ? "border-2 border-primary-500"
                          : ""
                      }`}
                    >
                      <img
                        src={image.avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />

                      {selectedImage?.id === image.id && (
                        <div className="absolute bottom-0 right-1 md:right-4 bg-primary-400 rounded-full flex items-center justify-center">
                          <div className="text-white text-2xl font-bold">
                            <CheckIcon className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            {!isUpdating ? (
              <CustomButton
                loader={isUpdating}
                disabled={selectedImage === null || selectedImage === undefined}
                onClick={updateUserAvatar}
              >
                Select Avatar
              </CustomButton>
            ) : (
              <CustomButton size="md" width="inline" loader disabled>
                Updating..
              </CustomButton>
            )}
          </div>
        )}
      </QmDrawer>
      {/* <Modal
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
      </Modal> */}
    </>
  );
};

export default ImagePickerModal;
