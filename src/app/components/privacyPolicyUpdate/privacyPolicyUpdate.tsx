"use client";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import QmDrawer from "../drawer/drawer";
import CustomButton from "@/app/utils/CustomBtn";
import { getAuthUser } from "@/app/api/userApi";

function PrivacyPolicyUpdate() {
  const [htmlContent, setHtmlContent] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [open, setOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  const user = getAuthUser();
  console.log(user.createdAt);

  useEffect(() => {
    const user = getAuthUser();
    const accepted = localStorage.getItem("acceptedPrivacyPolicy") === "true";

    // Define the cutoff date
    const cutoff = new Date("2025-06-27T00:00:00Z");

    if (user?.createdAt) {
      const createdDate = new Date(user.createdAt);
      if (createdDate < cutoff && !accepted) {
        setShouldShow(true);
        setOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/privacy-policy.html")
      .then((res) => res.text())
      .then((html) => setHtmlContent(html));
  }, []);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;

    const threshold = 20;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;

    if (atBottom) {
      setHasScrolledToEnd(true);
    }
  };

  const onAccept = () => {
    localStorage.setItem("acceptedPrivacyPolicy", "true");
    setOpen(false);
  };
  if (!shouldShow) return null;
  return (
    <QmDrawer
      open={open}
      onOpenChange={setOpen}
      dismissible={false}
      hideCloseBtn
      heightClass="md:h-[85%]"
      title="Updated Privacy Policy"
      titleLeft
      background="bg-primary-50"
    >
      <div>
        <div className="bg-primary-100 p-4 rounded-lg overflow-y-scroll max-h-[80%] space-y-4">
          <p className="font-bold">QM Technologies &quot;Quiz Money&quot;</p>
          <hr />
          <div
            ref={contentRef}
            onScroll={handleScroll}
            className="h-[50dvh] overflow-y-auto p-4 bg-primary-50 rounded-lg text-sm text-[#0f0f1a] space-y-4"
          >
            <div
              className="prose max-w-none text-sm space-y-4"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <CustomButton
            width="full"
            size="lg"
            onClick={onAccept}
            disabled={!hasScrolledToEnd}
            className={`${!hasScrolledToEnd && "cursor-not-allowed"}`}
          >
            Accept Terms & Privacy Policy
          </CustomButton>
        </div>
      </div>
    </QmDrawer>
  );
}

export default PrivacyPolicyUpdate;
