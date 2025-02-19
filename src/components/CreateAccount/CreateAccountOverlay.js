"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import styles from "@/modules/createAccount.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";
import VerificationOverlay from "@/components/CreateAccount/VerificationOverlay";

export default function CreateAccountOverlay({
  step,
  isSetEmail,
  isSetName,
  isSetDob,
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const [isFocusedMonth, setIsFocusedMonth] = useState(false);
  const [isFocusedDay, setIsFocusedDay] = useState(false);
  const [isFocusedYear, setIsFocusedYear] = useState(false);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, index) => currentYear - index);

  // Check if all fields are filled
  const isFormComplete = name.trim() && email.trim() && month && day && year;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value); // Update email state

    isSetEmail(value); // pass this email to it's parent component

    // Example: Validate Email Format
    // if (!value.includes("@")) {
    //   console.log("Invalid email format");
    // }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    isSetName(value); // pass this name to it's parent component
  };

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

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setIsFocusedMonth(false);
      }
      if (dayRef.current && !dayRef.current.contains(event.target)) {
        setIsFocusedDay(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setIsFocusedYear(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateAccount = async () => {
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    isSetDob(formattedDate);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email in the body
      });

      const data = await res.json();

      if (res.status === 200) {
        //console.log("User found:", data);
        //return data; // Return user data if needed
        setError(" This Email already exist! Try with another");
      } else {
        router.push("?step=verification", { scroll: false });
      }
    } catch (err) {
      setError("Error finding user: ", err);
    }
  };

  return (
    <>
      <div className={styles.overlayContainer}>
        <div className={styles.overlayContent}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
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
          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              <div className={styles.inputTitle}>
                <span>Create your account</span>
              </div>
              <div className={styles.inputName}>
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={name}
                    autoComplete="off"
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              <div className={styles.inputEmail}>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  autoComplete="off"
                  onChange={handleEmailChange}
                />
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
                  <div
                    ref={monthRef}
                    className={`${styles.monthContainer} ${
                      isFocusedMonth ? styles.focusedBorder : ""
                    }`}
                  >
                    <div
                      className={`${styles.month} ${
                        isFocusedMonth ? styles.focusedText : ""
                      }`}
                    >
                      <span>Month</span>
                      <span className={styles.arrowSignMonth}>
                        {" "}
                        <GoChevronDown />
                      </span>
                    </div>
                    <div>
                      <select
                        name="month"
                        id="month"
                        required
                        onFocus={() => setIsFocusedMonth(true)}
                        onBlur={() => setIsFocusedMonth(false)}
                        onChange={(e) => setMonth(e.target.value)}
                        className={styles.monthSelector}
                      >
                        <option value=""></option>
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
                  <div
                    ref={dayRef}
                    className={`${styles.dayContainer} ${
                      isFocusedDay ? styles.focusedBorder : ""
                    }`}
                  >
                    <div
                      className={`${styles.day} ${
                        isFocusedDay ? styles.focusedText : ""
                      }`}
                    >
                      <span>Day</span>
                      <span className={styles.arrowSignDay}>
                        {" "}
                        <GoChevronDown />
                      </span>
                    </div>
                    <div>
                      <select
                        name="day"
                        id="day"
                        required
                        onFocus={() => setIsFocusedDay(true)}
                        onBlur={() => setIsFocusedDay(false)}
                        onChange={(e) => setDay(e.target.value)}
                        className={styles.daySelector}
                      >
                        <option value></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                      </select>
                    </div>
                  </div>
                  <div
                    ref={yearRef}
                    className={`${styles.yearContainer} ${
                      isFocusedYear ? styles.focusedBorder : ""
                    }`}
                  >
                    <div
                      className={`${styles.year} ${
                        isFocusedYear ? styles.focusedText : ""
                      }`}
                    >
                      <span>Year</span>
                      <span className={styles.arrowSignYear}>
                        {" "}
                        <GoChevronDown />
                      </span>
                    </div>
                    <div>
                      <select
                        name="year"
                        id="year"
                        required
                        onFocus={() => setIsFocusedYear(true)}
                        onBlur={() => setIsFocusedYear(false)}
                        onChange={(e) => setYear(e.target.value)}
                        className={styles.yearSelector}
                      >
                        <option value></option>
                        {years.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.row3ContainerDiv}>
            <div className={styles.row3ContainerFlex}>
              {error && (
                <p style={{ color: "red" }}>
                  {email} {error}
                </p>
              )}
            </div>
          </div>
          <div className={styles.row4ContainerDiv}>
            <div
              className={`${styles.row4ContainerFlex} ${
                isFormComplete ? styles.active : ""
              }`}
              onClick={() => {
                if (isFormComplete) {
                  handleCreateAccount();
                }
              }}
            >
              <span className={styles.nextButton}>Next</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
