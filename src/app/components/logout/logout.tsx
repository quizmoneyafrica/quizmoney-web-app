"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/useAuth";
import { logout } from "@/app/store/authSlice";
import React, { useState } from "react";
import { setTransactions, setWallet } from "@/app/store/walletSlice";
import { persistor } from "@/app/store/store";
import Modal from "../game/modal/ModalWindow";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LogoutDialog = ({ open, onOpenChange }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    dispatch(logout());
    dispatch(setWallet(undefined));
    dispatch(setTransactions([]));

    await persistor.purge();

    localStorage.clear();
    sessionStorage.clear();

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
