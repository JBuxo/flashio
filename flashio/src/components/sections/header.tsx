import { signOut } from "@/supabase/auth/sign-out";
import { LogOut } from "lucide-react";
import BrandedText from "../ui/branded-text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { useUserStore } from "@/app/stores/user-store";

export default function Header() {
  const { authUser, userCleverShards } = useUserStore();
  return (
    <div className="flex justify-between items-center sm:h-14 h-16 mt-2 mx-4 px-2 rounded-lg bg-black/50">
      <BrandedText
        className="text-4xl brightness-200 "
        style={{ color: "var(--ray-color)" }}
      >
        Flashio
      </BrandedText>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Image
            src={`/images/clever-shard.png`}
            alt=""
            height={32}
            width={32}
          />
          <div className="ml-1 font-semibold text-white">
            {userCleverShards}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center text-black">
              {authUser?.email?.charAt(0).toUpperCase()}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="rounded-none bg-pink-500 text-white border-0"
            style={{
              boxShadow: "12px 12px 0px rgba(0,0,0,1)",
            }}
          >
            <DropdownMenuLabel className="bg-pink-700 -mx-1 -mt-1 py-2 mb-1">
              My Account
            </DropdownMenuLabel>

            <DropdownMenuItem className="rounded-none lg:hover:bg-white/20 text-pink-100 hover:text-white">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-none lg:hover:bg-white/20 text-pink-100 hover:text-white">
              Sessions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={signOut}
              className="rounded-none lg:hover:bg-white/20 text-pink-100 hover:text-white"
            >
              Log Out <LogOut className="text-pink-100 hover:text-white" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
