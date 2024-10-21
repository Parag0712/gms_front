import {
  Users,
} from "lucide-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: "Manage Users",
    label: "",
    href: "/",
    icon: <Users size={18} />,
  },
];
