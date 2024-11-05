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
  DoorOpen,
  Coins,
  LayoutDashboard,
  CircleDollarSign,
  Landmark,
  Building as BuildingIcon,
  HomeIcon,
  MapPinned,
  Warehouse,
  Gauge,
  FileSpreadsheet
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
    icon: <LayoutDashboard size={18} />,
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
        icon: <Landmark size={18} />,
      },
      {
        title: "Manage Locality",
        label: "",
        href: "/manage-locality",
        icon: <MapPinned size={18} />,
      },
      {
        title: "Manage Project",
        label: "",
        href: "/manage-project",
        icon: <Warehouse size={18} />,
      },
      {
        title: "Manage Tower",
        label: "",
        href: "/manage-tower",
        icon: <Building2 size={18} />,
      },
      {
        title: "Manage Wing",
        label: "",
        href: "/manage-wing",
        icon: <BuildingIcon size={18} />,
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
        icon: <HomeIcon size={18} />,
      }
    ]
  },
  {
    title: "Cost Configuration",
    label: "",
    href: "/cost-configuration",
    icon: <CircleDollarSign size={18} />,
  },
  {
    title: "Meter Management",
    label: "",
    href: "",
    icon: <Gauge size={18} />,
    sub: [
      {
        title: "Meter",
        label: "",
        href: "/meter",
        icon: <Gauge size={18} />,
      },
      {
        title: "Meter Log",
        label: "",
        href: "/meter-log",
        icon: <FileSpreadsheet size={18} />,
      }
    ]
  },
  {
    title: "Invoice",
    label: "",
    href: "/invoice",
    icon: <Coins size={18} />,
  },
  {
    title: "Payment",
    label: "",
    href: "/payment",
    icon: <Coins size={18} />,
  }
];
