import {
  Users,
  UserCheck,
  UserPlus,
  User,
  Users2,
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
    icon: <User size={18} />,
  },
  {
    title: "Customers",
    label: "",
    href: "/customers",
    icon: <Users2 size={18} />,
    sub: [
      {
        title: "Approve Customers",
        label: "",
        href: "/approve-customers",
        icon: <UserCheck size={18} />,
      },
      {
        title: "Manage Customers",
        label: "",
        href: "/manage-customers",
        icon: <UserPlus size={18} />,
      }
    ]
  }
];
