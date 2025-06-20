/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import QmDrawer from "../drawer/drawer";
import UserAPI, { getAuthUser } from "@/app/api/userApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import CustomButton from "@/app/utils/CustomBtn";
import { updateUser } from "@/app/store/authSlice";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";
import { Select } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/app/icons/icons";

export const cleanValue = (val?: string) =>
  typeof val === "string" && val.toLowerCase() !== "undefined" ? val : "";

const socialPlatforms = {
  Facebook: {
    urlPrefix: "https://facebook.com/",
    icon: <FacebookIcon />,
  },
  Instagram: {
    urlPrefix: "https://instagram.com/",
    icon: <InstagramIcon />,
  },
  Twitter: {
    urlPrefix: "https://twitter.com/",
    icon: <XIcon />,
  },
  WhatsApp: {
    urlPrefix: "https://tiktok.com/",
    icon: <TikTokIcon />,
  },
} as const;

type Platform = keyof typeof socialPlatforms;

interface SocialInput {
  platform: Platform | "";
  username: string;
}

function SocialLinksDrawer() {
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const user = getAuthUser();
  const dispatch = useAppDispatch();
  const { wallet } = useAppSelector((state) => state.wallet);

  const [socialInputs, setSocialInputs] = useState<SocialInput[]>([
    { platform: "Instagram", username: "" },
  ]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user || !wallet || initialized) return;

    const initialLinks: SocialInput[] = [];

    Object.entries(socialPlatforms).forEach(([key]) => {
      const username = cleanValue(
        user?.[key.toLowerCase() as keyof typeof user]
      );
      if (username) {
        initialLinks.push({ platform: key as Platform, username });
      }
    });

    setSocialInputs(initialLinks);
    setInitialized(true);

    const filledCount = initialLinks.length;

    if (Number(wallet.balance) > 0 && filledCount < 2) {
      const timer = setTimeout(() => setShowUpdateDrawer(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowUpdateDrawer(false);
    }
  }, [user, wallet, initialized]);

  const handleChange = (
    index: number,
    field: "platform" | "username",
    value: string
  ) => {
    const updated = [...socialInputs];

    if (field === "username") {
      value = value.replace(/\s/g, "").trim();
    }

    updated[index][field] = value as any;
    setSocialInputs(updated);
  };

  const isValidURL = (platform: Platform, username: string) => {
    const url = socialPlatforms[platform].urlPrefix + username;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addNewLink = () => {
    if (socialInputs.length < 4) {
      const selected = socialInputs.map((s) => s.platform);
      const remaining = Object.keys(socialPlatforms).filter(
        (p) => !selected.includes(p as Platform)
      );
      if (remaining.length === 0) {
        toast.warning("All social platforms are already added. ");
        return;
      }
      setSocialInputs((prev) => [...prev, { platform: "", username: "" }]);
    }
  };

  const handleUpdateSocials = async (e: React.FormEvent) => {
    e.preventDefault();

    const validLinks = socialInputs.filter(
      (link) =>
        link.platform &&
        link.username &&
        isValidURL(link.platform as Platform, link.username)
    );

    if (validLinks.length < 2) {
      toast.error("Please provide at least two valid social handles.");
      return;
    }

    const payload: { [key: string]: string } = {};
    validLinks.forEach(({ platform, username }) => {
      payload[platform.toLowerCase()] = username;
    });

    try {
      await UserAPI.updateSocialHandles(
        payload.facebook || "",
        payload.twitter || "",
        payload.whatsapp || "",
        payload.instagram || ""
      );
      dispatch(updateUser(payload));
      toast.success("Social handles updated", { position: toastPosition });
      setShowUpdateDrawer(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update social handles");
    }
  };
  const selectedPlatforms = socialInputs.map((input) => input.platform);
  return (
    <QmDrawer titleLeft title="Complete your profile" open={showUpdateDrawer}>
      <p className="text-sm text-neutral-600 -mt-4">
        We need you to add your social handle to complete your profile
      </p>
      <form onSubmit={handleUpdateSocials} className="space-y-4 py-6">
        <p className="text-primary-900 font-medium">Add Social Links</p>

        {socialInputs.map((input, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Select.Root
              value={input.platform}
              onValueChange={(value) => handleChange(index, "platform", value)}
            >
              <Select.Trigger className="inline-flex items-center justify-between w-18 px-3 py-2 text-sm bg-white border rounded shadow-sm hover:bg-gray-50 focus:outline-none">
                <Select.Value placeholder="Select " />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white border rounded shadow-md">
                  <Select.Viewport className="p-1">
                    {Object.entries(socialPlatforms)
                      .filter(
                        ([platform]) =>
                          !selectedPlatforms.includes(platform as Platform) ||
                          input.platform === platform
                      )
                      .map(([platform, data]) => (
                        <Select.Item
                          key={platform}
                          value={platform}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-black cursor-pointer rounded hover:bg-gray-100 focus:outline-none"
                        >
                          <Select.ItemText>
                            <div className="flex items-center text-sm">
                              <span className="mr-1">{data.icon}</span>
                            </div>
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <div className="flex flex-1 border rounded overflow-hidden">
              <span className="bg-gray-100 px-2 text-sm text-gray-600 flex items-center">
                {input.platform
                  ? socialPlatforms[input.platform as Platform].urlPrefix
                  : "https://"}
              </span>
              <input
                type="text"
                className="flex-1 p-2 py-[10px] outline-none text-sm"
                placeholder="EnterUsername"
                value={input.username}
                onChange={(e) =>
                  handleChange(index, "username", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={addNewLink}
        >
          + Add New Link
        </button>

        <CustomButton
          type="submit"
          width="full"
          disabled={
            socialInputs.filter(
              (link) =>
                link.platform &&
                link.username &&
                isValidURL(link.platform as Platform, link.username)
            ).length < 2
          }
        >
          Update Profile
        </CustomButton>
      </form>
    </QmDrawer>
  );
}

export default SocialLinksDrawer;
