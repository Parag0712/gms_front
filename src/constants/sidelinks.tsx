import {
  UserCheck,
  UserPlus,
  User,
  Users2,
  Settings,
  Building2,
  MapPin,
  Home,
  Building,
  Layers,
  DoorOpen
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
    href: "",
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
  },
  {
    title: "Management",
    label: "",
    href: "",
    icon: <Settings size={18} />,
    sub: [
      {
        title: "Manage City",
        label: "",
        href: "/manage-city",
        icon: <Building2 size={18} />,
      },
      {
        title: "Manage Locality",
        label: "",
        href: "/manage-locality",
        icon: <MapPin size={18} />,
      },
      {
        title: "Manage Project",
        label: "",
        href: "/manage-project",
        icon: <Home size={18} />,
      },
      {
        title: "Manage Tower",
        label: "",
        href: "/manage-tower",
        icon: <Building size={18} />,
      },
      {
        title: "Manage Floor",
        label: "",
        href: "/manage-floor",
        icon: <Layers size={18} />,
      },
      {
        title: "Manage Flat",
        label: "",
        href: "/manage-flat",
        icon: <DoorOpen size={18} />,
      }
    ]
  }
];
