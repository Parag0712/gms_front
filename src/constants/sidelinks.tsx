import {
  UserCheck,
  UserPlus,
  Users2,
  Settings,
  Layers,
  CircleDollarSign,
  MapPinned,
  Receipt,
  CreditCard,
  Building,
  Blocks,
  Building2Icon,
  Home,
  FlaskConical,
  FileText,
  ClipboardList,
  Gauge,
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
    title: "Manage Users",
    label: "",
    href: "/",
    icon: <Users2 size={18} />, // Changed to Users2 as it better represents user management
  },
  {
    title: "Customers",
    label: "",
    href: "",
    icon: <UserPlus size={18} />,
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
        icon: <ClipboardList size={18} />, // Changed to ClipboardList for management tasks
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
        icon: <Building size={18} />, // Changed to Building for city management
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
        icon: <Blocks size={18} />, // Changed to Blocks for project management
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
    title: "Invoice",
    label: "",
    href: "/invoice",
    icon: <Receipt size={18} />, // Changed to Receipt for invoice
  },
  {
    title: "Payment",
    label: "",
    href: "/payment",
    icon: <CreditCard size={18} />, // Changed to CreditCard for payment
  }
];

// Project-specific navigation links
const getProjectLinks = (projectId: string): SideLink[] => [
  {
    title: "Manage Tower",
    label: "",
    href: `/manage-project/${projectId}`,
    icon: <Building2Icon size={18} />, // Changed to Building2Icon for tower
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
    icon: <Home size={18} />, // Changed to Home for flat
  },
  {
    title: "Meter Management",
    label: "",
    href: "",
    icon: <FlaskConical size={18} />, // Changed to FlaskConical for meter management
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
        icon: <FileText size={18} />, // Changed to FileText for logs
      }
    ]
  },
  {
    title: "Generate Bill",
    label: "",
    href: `/manage-project/${projectId}/generate-bill`,
    icon: <Receipt size={18} />, // Changed to Receipt for bill generation
  }
];

export const getNavigationLinks = (isProjectPage: boolean, projectId: string | null): SideLink[] => {
  if (isProjectPage && projectId) {
    return getProjectLinks(projectId);
  }
  return mainLinks;
};