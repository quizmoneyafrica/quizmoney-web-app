"use client";
import React, { useEffect, useState } from "react";
import QmDrawer from "../drawer/drawer";
import UserAPI, { getAuthUser } from "@/app/api/userApi";
import CustomTextField from "@/app/utils/CustomTextField";
import { useAppDispatch } from "@/app/hooks/useAuth";
import CustomButton from "@/app/utils/CustomBtn";
import { updateUser } from "@/app/store/authSlice";
import { toast } from "sonner";
import { toastPosition } from "@/app/utils/utils";

export const cleanValue = (val?: string) =>
  typeof val === "string" && val.toLowerCase() !== "undefined" ? val : "";

function SocialLinksDrawer() {
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const user = getAuthUser();
  const dispatch = useAppDispatch();
  const [socials, setSocials] = useState({
    facebook: cleanValue(user?.facebook),
    twitter: cleanValue(user?.twitter),
    whatsapp: cleanValue(user?.whatsapp),
    instagram: cleanValue(user?.instagram),
  });

  useEffect(() => {
    if (!user) return;

    const { facebook, twitter, whatsapp, instagram } = user;

    const handles = [
      cleanValue(facebook),
      cleanValue(twitter),
      cleanValue(whatsapp),
      cleanValue(instagram),
    ];

    const filledCount = handles.filter((handle) => handle.trim() !== "").length;
    console.log(user);

    if (filledCount < 2) {
      const timer = setTimeout(() => {
        setShowUpdateDrawer(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowUpdateDrawer(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(user);

  const handleUpdateSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    const { facebook, twitter, whatsapp, instagram } = socials;
    const filledCount = [facebook, twitter, whatsapp, instagram].filter(
      (field) => field && field.trim() !== ""
    ).length;

    if (filledCount < 2) {
      toast.error("Please provide at least two social handles.");
      return;
    }
    try {
      await UserAPI.updateSocialHandles(
        facebook.trim(),
        twitter.trim(),
        whatsapp.trim(),
        instagram.trim()
      );

      dispatch(updateUser({ facebook, twitter, whatsapp, instagram }));
      setShowUpdateDrawer(false);
      toast.success("Social handles updated", { position: toastPosition });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update social handles");
    }
  };
  return (
    <>
      <QmDrawer title="Complete your profile" open={showUpdateDrawer}>
        <p className="text-sm text-error-900">
          Please fill in minimum of two socials to continue
        </p>
        <form onSubmit={handleUpdateSocials} className="space-y-4 py-6">
          <CustomTextField
            label="Facebook Handle"
            name="facebook"
            placeholder="@username"
            value={socials.facebook}
            onChange={handleChange}
          />
          <CustomTextField
            label="X(twitter) Handle"
            name="twitter"
            placeholder="@username"
            value={socials.twitter}
            onChange={handleChange}
          />
          <CustomTextField
            label="WhatsApp Number"
            name="whatsapp"
            placeholder="+234 00000000"
            value={socials.whatsapp}
            onChange={handleChange}
          />
          <CustomTextField
            label="Instagram Handle"
            name="instagram"
            placeholder="@username"
            value={socials.instagram}
            onChange={handleChange}
          />
          <CustomButton
            type="submit"
            width="full"
            disabled={
              [
                socials.facebook,
                socials.twitter,
                socials.whatsapp,
                socials.instagram,
              ].filter((val) => val && val.trim() !== "").length < 2
            }
          >
            Update Profile
          </CustomButton>
        </form>
      </QmDrawer>
    </>
  );
}

export default SocialLinksDrawer;
