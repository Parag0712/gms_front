import {
  // User related
  Users2,
  UserCheck,
  UserCog,
  
  // Building related
  Building,
  Building2,
  HomeIcon,
  Warehouse,
  
  // Management related
  Settings,
  Layers,
  CircleDollarSign,
  
  // Location related
  MapPin,
  
  // Utility related
  Gauge,
  GaugeCircle,
  FileSpreadsheet,
  
  // Payment related
  // CreditCard,
  ScrollText,
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

// Main navigation links
const mainLinks: SideLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "/dashboard",
    icon: <HomeIcon size={18} />,
  },
  {
    title: "Manage Users",
    label: "",
    href: "/",
    icon: <UserCog size={18} />, // Changed to UserCog as it better represents user management
  },
  {
    title: "Agent",
    label: "",
    href: "/agent",
    icon: <UserCheck size={18} />, // Using UserCheck to represent verified/trusted agents
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
        icon: <Building2 size={18} />, // Changed to Building2 for city-scale buildings
      },
      {
        title: "Manage Locality",
        label: "",
        href: "/manage-locality",
        icon: <MapPin size={18} />, // Changed to simpler MapPin for locality
      },
      {
        title: "Manage Project",
        label: "",
        href: "/manage-project",
        icon: <Warehouse size={18} />, // Changed to Warehouse as it better represents projects/complexes
      }
    ]
  },
  {
    title: "Meter Management",
    label: "",
    href: "/meter",
    icon: <GaugeCircle size={18} />, // Changed to GaugeCircle for better meter representation
  },
  {
    title: "Cost Configuration",
    label: "",
    href: "/cost-configuration",
    icon: <CircleDollarSign size={18} />,
  },
  // {
  //   title: "Invoice",
  //   label: "",
  //   href: "/invoice",
  //   icon: <ScrollText size={18} />, // Changed to ScrollText for better invoice representation
  // },
  // {
  //   title: "Payment",
  //   label: "",
  //   href: "/payment",
  //   icon: <CreditCard size={18} />,
  // }
];

// Project-specific navigation links
const getProjectLinks = (projectId: string): SideLink[] => [
  {
    title: "Manage Tower",
    label: "",
    href: `/manage-project/${projectId}`,
    icon: <Building2 size={18} />,
  },
  {
    title: "Manage Wing",
    label: "",
    href: `/manage-project/${projectId}/manage-wing`,
    icon: <Building size={18} />,
  },
  {
    title: "Manage Floor",
    label: "",
    href: `/manage-project/${projectId}/manage-floor`,
    icon: <Layers size={18} />,
  },
  {
    title: "Manage Flat",
    label: "",
    href: `/manage-project/${projectId}/manage-flat`,
    icon: <HomeIcon size={18} />, // Changed to HomeIcon for consistency
  },
  {
    title: "Meter Management",
    label: "",
    href: "",
    icon: <GaugeCircle size={18} />, // Changed to GaugeCircle for consistency
    sub: [
      {
        title: "Meter",
        label: "",
        href: `/manage-project/${projectId}/meter`,
        icon: <Gauge size={18} />,
      },
      {
        title: "Meter Log",
        label: "",
        href: `/manage-project/${projectId}/meter-log`,
        icon: <FileSpreadsheet size={18} />, // Changed to FileSpreadsheet for better log representation
      }
    ]
  },
  {
    title: "Customers",
    label: "",
    href: "",
    icon: <Users2 size={18} />, // Changed to Users2 for customer group
    sub: [
      {
        title: "Approve Customers",
        label: "",
        href: `/manage-project/${projectId}/approve-customers`,
        icon: <UserCheck size={18} />,
      },
      {
        title: "Manage Customers",
        label: "",
        href: `/manage-project/${projectId}/manage-customers`,
        icon: <UserCog size={18} />, // Changed to UserCog for customer management
      }
    ]
  },
  {
    title: "Generate Bill",
    label: "",
    href: `/manage-project/${projectId}/generate-bill`,
    icon: <ScrollText size={18} />, // Changed to ScrollText for consistency with invoice
  }
];

export const getNavigationLinks = (isProjectPage: boolean, projectId: string | null): SideLink[] => {
  if (isProjectPage && projectId) {
    return getProjectLinks(projectId);
  }
  return mainLinks;
};