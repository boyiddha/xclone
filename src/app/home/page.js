import Image from "next/image";
import LogOut from "@/components/LogOut/LogOut";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { redirect } from "next/navigation";

const HomePage = async () => {
  // Get session using getServerSession() and your authOptions
  const session = await getServerSession(authOptions);

  //console.log("✅  session data:  ", session);

  // If no session or user, redirect to login page
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div style={{ color: "white" }}>
      <h1>
        Welcome, {session.user.name} = {session.user.email}!
      </h1>

      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={72}
          height={72}
        />
      )}

      <LogOut />
    </div>
  );
};

export default HomePage;
