import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { signOut } from "next-auth/react";
const Profile = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/signin",
      redirect: true,
    });
  };
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-8 h-8 border border-black rounded-full flex items-center justify-center cursor-pointer">
          <span className="font-medium ">
            <User className="w-5 h-5" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/reset-password")}>
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
