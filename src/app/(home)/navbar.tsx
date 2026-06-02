import Link from "next/link";
import { FileText } from "lucide-react";
import { SearchInput } from "./search-input";
import { UserMenu } from "@/components/user-menu";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-md bg-black flex items-center justify-center">
            <FileText className="size-4 text-white" />
          </div>
          <span className="text-base font-semibold text-neutral-900 tracking-tight">SyncPad</span>
        </Link>
      </div>
      <SearchInput />
      <div className="flex gap-3 items-center pl-6">
        <UserMenu />
      </div>
    </nav>
  );
};
