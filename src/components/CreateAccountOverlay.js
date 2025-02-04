"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import styles from "@/modules/createAccount.module.css";

export default function createAccountOverlay({ step }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL

  // Function to close the overlay
  const closeOverlay = () => {
    router.push("/", { scroll: false });
  };
  useEffect(() => {
    const handlePopState = () => {
      if (pathname.startsWith("/createAccount")) {
        router.push("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);

  return (
    <div className={styles.container}>
      <div className="bg-white p-6 rounded-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={closeOverlay}
          className="absolute top-3 left-3 text-xl"
        >
          ✖
        </button>

        {step === "createAccount" && (
          <div>
            <h2 className="text-xl font-bold">Create an Account</h2>
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mt-2"
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mt-2"
            />
            <button
              onClick={() => router.push("?step=password", { scroll: false })}
              className="bg-blue-500 text-white px-4 py-2 mt-4 w-full"
            >
              Next
            </button>
          </div>
        )}

        {step === "password" && (
          <div>
            <h2 className="text-xl font-bold">Set Your Password</h2>
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mt-2"
            />
            <button className="bg-green-500 text-white px-4 py-2 mt-4 w-full">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
