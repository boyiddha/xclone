import Image from "next/image";
import LogOut from "@/components/LogOut/LogOut";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const HomePage = async () => {
  //Get session using getServerSession() and your authOptions
  const session = await getServerSession(authOptions);
  //console.log("✅  session home page : , ", session);
  return (
    <div style={{ color: "white" }}>
      <h1>
        Welcome, {session?.user?.name} = {session?.user?.email}!
      </h1>

      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt={session?.user?.name || "User"}
          width={100}
          height={100}
          style={{ borderRadius: "50%", marginRight: "50px" }}
        />
      )}

      <LogOut />
    </div>
  );
};

export default HomePage;
