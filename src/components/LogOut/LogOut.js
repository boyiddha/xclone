"use client";

import { doLogout } from "@/app/actions";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const LogOut = () => {
  const {data: session } = useSession();
  const [sess, setSession] = useState(null);

  console.log("✅ Client-side session:", session);
  //console.log(" session user is: ", session.user);

  const handleLogout = async () => {
    await doLogout();
  };


  if (!session || !session.user) {
    return <div>Please log in</div>;
  }

  return (
    <>
      {/* <div style={{ color: "white" }}>
        <h1>
          Welcome, {session.user.name}, {session.user.email}!
        </h1>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={72}
            height={72}
            style={{ borderRadius: "50%" }}
          />
        )}
      </div> */}
      <button
        onClick={handleLogout}
        style={{
          padding: "15px",
          backgroundColor: "green",
          color: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      
    </>
  );
};

export default LogOut;
