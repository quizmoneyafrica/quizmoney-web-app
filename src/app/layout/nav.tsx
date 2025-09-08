import { Gamepad2 } from "lucide-react";
import {
  CupIcon,
  HomeIcon,
  LogoutIcon,
  SettingIcon,
  StoreIcon,
  SupportIcon,
  WalletIcon,
  WithdrawIcon,
} from "../icons/icons";

export const navSidebar = [
  {
    icon: <HomeIcon />,
    path: "/home",
    name: "Home",
  },
  {
    icon: <WalletIcon />,
    path: "/wallet",
    name: "Wallet",
  },
  {
    icon: <WithdrawIcon />,
    path: "/withdraw-request",
    name: "Withdrawal Request",
  },
  {
    icon: <Gamepad2 />,
    path: "/game-zone",
    name: "Game Zone",
  },
  {
    icon: <StoreIcon />,
    path: "/store",
    name: "Store",
  },
  {
    icon: <CupIcon />,
    path: "/leaderboard",
    name: "Leaderboard",
  },
  {
    icon: <SettingIcon />,
    path: "/settings",
    name: "Settings",
  },
];
export const navs = [
  {
    icon: <HomeIcon />,
    path: "/home",
    name: "Home",
  },
  {
    icon: <WalletIcon />,
    path: "/wallet",
    name: "Wallet",
  },
  {
    icon: <WithdrawIcon />,
    path: "/withdraw-request",
    name: "Withdrawal Request",
  },
  {
    icon: <StoreIcon />,
    path: "/store",
    name: "Store",
  },
  {
    icon: <CupIcon />,
    path: "/leaderboard",
    name: "Leaderboard",
  },
  {
    icon: <SettingIcon />,
    path: "/settings",
    name: "Settings",
  },
];

export const bottomNav = [
  {
    icon: <SupportIcon />,
    path: "/support",
    name: "Support",
  },
  {
    icon: <LogoutIcon />,
    name: "Logout",
  },
];
