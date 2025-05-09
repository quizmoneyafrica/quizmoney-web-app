import React, { useState } from "react";
import Modal from "./Modal";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import Image from "next/image";
import { CheckIcon } from "@radix-ui/react-icons";
// give me 12 images
const images = [
  {
    id: 1,
    image: "/assets/images/profile.png",
  },
  {
    id: 2,
    image: "/assets/images/profile.png",
  },
  {
    id: 3,
    image: "/assets/images/profile.png",
  },
  {
    id: 4,
    image: "/assets/images/profile.png",
  },
  {
    id: 5,
    image: "/assets/images/profile.png",
  },
  {
    id: 6,
    image: "/assets/images/profile.png",
  },
  {
    id: 7,
    image: "/assets/images/profile.png",
  },
  {
    id: 8,
    image: "/assets/images/profile.png",
  },
  {
    id: 9,
    image: "/assets/images/profile.png",
  },
  {
    id: 10,
    image: "/assets/images/profile.png",
  },
  {
    id: 11,
    image: "/assets/images/profile.png",
  },
  {
    id: 12,
    image: "/assets/images/profile.png",
  },
];

const ImagePickerModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const handleSelectImage = () => {
    toast.info("Gallery Access Coming soon", {
      position: toastPosition,
    });
  };

  const handleSelectAvatar = (id: number) => {
    setSelectedImage(id);
    // setShowAvatar(false);
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
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleSelectAvatar(image.id)}
                  className={`w-[60px] h-[60px] md:w-20 md:h-20 bg-zinc-700 rounded-full relative ${
                    selectedImage === image.id
                      ? "border-2 border-primary-500"
                      : ""
                  }`}
                >
                  <Image
                    src={image.image}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />

                  {selectedImage === image.id && (
                    <div className="absolute bottom-5 md:bottom-4 right-1 md:right-4 bg-primary-400 rounded-full flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ImagePickerModal;
