"use client";

import { signOut, useSession } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };
  function getInitalUserName(userName:string):string{
  // console.log(userName.charAt(0).toUpperCase())
  return userName.charAt(0).toUpperCase()
  }
  const user = session?.user;
  const isAuthPage: boolean = pathName === "/auth";
  if (isAuthPage) return null;
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-700 text-gray-100 shadow-md">
      {/* Logo */}
      <div className="text-3xl font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer">
        <Link href={"/"}>LAVIO</Link>
      </div>

      {/* Plan Upgrade */}
      <div>
        <Button className="bg-purple-600 text-white hover:bg-purple-500 px-4 py-2 rounded-lg transition">
          Upgrade Plan
        </Button>
      </div>

      {/* User Profile */}
      <div>
        {isPending ? null : user ? (
          <Popover>
            <PopoverTrigger>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-purple-400 transition ">
                <AvatarImage src={user?.image as string} alt="Lav Shah" />
                <AvatarFallback className="text-black">{getInitalUserName(user?.name)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col items-center justify-center w-48 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg shadow-lg p-4 gap-2">
              <p className=" text-gray-200">Hi,{user?.name}</p>
              <p className=" text-gray-200">{user?.email}</p>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-500 text-white transition"
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={() => router.push("/auth")}
            variant={"ghost"}
            className="font-semibold text-sm border"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
