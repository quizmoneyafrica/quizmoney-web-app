"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/useAuth";
import React, { useState } from "react";
import Modal from "../game/modal/ModalWindow";
import { handleInvalidSession } from "@/app/api/parse/handleInvalidSession";
import { clearWalletState } from "@/app/store/walletSlice";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LogoutDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    clearWalletState();
    setLoading(true);

    handleInvalidSession(dispatch);

    setLoading(false);
    onOpenChange(false);

    router.replace("/login");
  };

  return (
    <>
      <Modal
        open={open}
        handleClose={onOpenChange}
        redTitle
        title="Confirm Logout"
        actionBtnText="Log Out"
        actionOnClick={handleLogout}
        actionLoader={loading}
      >
        <div>
          <p>Are you sure you want to log out of Quiz Money?</p>
        </div>
      </Modal>
    </>
  );
};

export default LogoutDialog;
