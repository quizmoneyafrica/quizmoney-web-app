import {
  CupIcon,
  HomeIcon,
  LogoutIcon,
  SettingIcon,
  StoreIcon,
  SupportIcon,
  WalletIcon,
} from "../icons/icons";

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
    icon: <StoreIcon />,
    path: "/store",
    name: "Store",
  },
  {
    icon: <CupIcon />,
    path: "/leaderboard",
    name: "Chart",
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
