import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Users,
  CreditCard,
  FileText,
  Settings,
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
    title: "Approve Users",
    label: "",
    href: "/",
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: "Manage Users",
    label: "",
    href: "/manage-users",
    icon: <Briefcase size={18} />,
  },
  {
    title: "Utilities",
    label: "",
    href: "/utilities",
    icon: <Wrench size={18} />,
  },
  {
    title: "Consumer",
    label: "",
    href: "/consumer",
    icon: <Users size={18} />,
  },
  {
    title: "Billing Transactions",
    label: "",
    href: "/billing-transactions",
    icon: <CreditCard size={18} />,
  },
  {
    title: "MIS Reports",
    label: "",
    href: "/mis-reports",
    icon: <FileText size={18} />,
  },
  {
    title: "Project Bill Settings",
    label: "",
    href: "/project-bill-settings",
    icon: <Settings size={18} />,
  },
];
