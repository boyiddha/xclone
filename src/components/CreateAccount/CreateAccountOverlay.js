// "use client";

// import { useRouter, usePathname } from "next/navigation";
// import { useEffect } from "react";

// import styles from "@/modules/createAccount.module.css";

// export default function createAccountOverlay({ step }) {
//   const router = useRouter();
//   const pathname = usePathname(); // Get current URL

//   // Function to close the overlay
//   const closeOverlay = () => {
//     router.push("/", { scroll: false });
//   };
//   useEffect(() => {
//     const handlePopState = () => {
//       if (pathname.startsWith("/createAccount")) {
//         router.push("/");
//       }
//     };

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [pathname]);

//   return (
//     <div className={styles.overlayContainer}>
//       <div className={styles.overlayContent}>
//         {/* Close Button */}
//         <button
//           onClick={closeOverlay}
//           className="absolute top-3 left-3 text-xl"
//         >
//           ✖
//         </button>

//         {step === "createAccount" && (
//           <div>
//             <h2 className="text-xl font-bold">Create your account</h2>
//             <input
//               type="text"
//               placeholder="Name"
//               className="border p-2 w-full mt-2"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               className="border p-2 w-full mt-2"
//             />
//             <button
//               onClick={() => router.push("?step=password", { scroll: false })}
//               className="bg-blue-500 text-white px-4 py-2 mt-4 w-full"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === "password" && (
//           <div>
//             <h2 className="text-xl font-bold">Set Your Password</h2>
//             <input
//               type="password"
//               placeholder="Password"
//               className="border p-2 w-full mt-2"
//             />
//             <button className="bg-green-500 text-white px-4 py-2 mt-4 w-full">
//               Submit
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import styles from "@/modules/createAccount.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { FaCalendar } from "react-icons/fa";
export default function createAccountOverlay({ step }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL
  const [name, setName] = useState("");

  const [isMonthClick, setMonthClicked] = useState(false);

  const handleSelectFocus = () => setMonthClicked(true); // When select is clicked/focused
  const handleSelectBlur = () => setMonthClicked(false); // When select loses focus

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

  const inputRef = useRef(null);

  // Detect clicks outside the container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsExpanded(false); // Collapse when clicking outside
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div>
            <div className={styles.row1Container}>
              <div className={styles.close}>
                <button className={styles.closeButton} onClick={closeOverlay}>
                  X
                </button>
              </div>
              <div className={styles.space}></div>
              <div className={styles.logo}>
                <Image src={xLogo} alt="X Logo" width="30" height="30" />
              </div>
              <div className={styles.space}></div>
            </div>
          </div>
          <div>
            <div className={styles.row2Container}>
              <div className={styles.inputTitle}>
                <span>Create your account</span>
              </div>
              <div className={styles.inputName}>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputEmail}>
                <input type="text" placeholder="Email" name="email" />
              </div>
              <div className={styles.dateOfBirth}>
                <div className={styles.dobTitle}>
                  <span>Date of birth</span>
                </div>
                <div className={styles.dobDeclaration}>
                  <span>
                    This will not be shown publicly. Confirm your own age, even
                    if this account is for a business, a pet, or something else.
                  </span>
                </div>
                <div className={styles.calendarContainer}>
                  <div className={styles.monthContainer}>
                    <div className={styles.month}>
                      <span>Month</span>
                    </div>
                    <div>
                      <select
                        name="month"
                        id="month"
                        required
                        onFocus={handleSelectFocus}
                        onBlur={handleSelectBlur}
                        className={styles.monthSelector}
                      >
                        <option disabled value></option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.dayContainer}>
                    <div className={styles.day}>Day</div>
                    <div className={styles.daySelector}>Select V</div>
                  </div>
                  <div className={styles.yearContainer}>
                    <div className={styles.year}>Year</div>
                    <div className={styles.yearSelector}>Select V</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.row3Container}>Row3</div>
          </div>
          <div>
            <div className={styles.row4Container}>Row4</div>
          </div>
        </div>
      </div>
    </>

    // <div className={styles.overlayContainer}>
    //   <div className={styles.overlayContent}>
    //     {/* Close Button */}
    //     <button
    //       onClick={closeOverlay}
    //       className="absolute top-3 left-3 text-xl"
    //     >
    //       X
    //     </button>

    //     {step === "createAccount" && (
    //       <div>
    //         <h2 className="text-xl font-bold">Create your account</h2>
    //         <input
    //           type="text"
    //           placeholder="Name"
    //           className="border p-2 w-full mt-2"
    //         />
    //         <input
    //           type="email"
    //           placeholder="Email"
    //           className="border p-2 w-full mt-2"
    //         />
    //         <button
    //           onClick={() => router.push("?step=password", { scroll: false })}
    //           className="bg-blue-500 text-white px-4 py-2 mt-4 w-full"
    //         >
    //           Next
    //         </button>
    //       </div>
    //     )}

    //     {step === "password" && (
    //       <div>
    //         <h2 className="text-xl font-bold">Set Your Password</h2>
    //         <input
    //           type="password"
    //           placeholder="Password"
    //           className="border p-2 w-full mt-2"
    //         />
    //         <button className="bg-green-500 text-white px-4 py-2 mt-4 w-full">
    //           Submit
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}
