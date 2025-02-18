"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import styles from "@/modules/newUserDateOfBirth.module.css";
import xLogo from "./../../../public/images/x_profile.png";
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";
import NewUserSetPassword from "@/components/NewUser/NewUserSetPassword";
import NewUserSetUsername from "@/components/NewUser/NewUserSetUsername";
import Link from "next/link";

const NewUser = () => {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");

  const [passwordOverlay, setPasswordOverlay] = useState(false);
  const [usernameOverlay, setUserNameOverlay] = useState(false);

  const [isFocusedMonth, setIsFocusedMonth] = useState(false);
  const [isFocusedDay, setIsFocusedDay] = useState(false);
  const [isFocusedYear, setIsFocusedYear] = useState(false);
  const monthRef = useRef("");
  const dayRef = useRef("");
  const yearRef = useRef("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, index) => currentYear - index);

  // Check if all fields are filled
  const isFormComplete = month && day && year;

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

  const handleClick = () => {
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    setDob(formattedDate);
    setPasswordOverlay(true);
  };

  return (
    <>
      <div className={styles.containerDiv}>
        <div className={styles.containerFlex}>
          <div className={styles.row1ContainerDiv}>
            <div className={styles.row1ContainerFlex}>
              <div className={styles.logo}>
                <Image src={xLogo} alt="X Logo" width="40" height="40" />
              </div>
            </div>
          </div>

          <div className={styles.row2ContainerDiv}>
            <div className={styles.row2ContainerFlex}>
              {!passwordOverlay && !usernameOverlay && (
                <>
                  <div className={styles.titleRow}>
                    <span>What's your birth date?</span>
                  </div>
                  <div className={styles.titleRow2}>
                    <span>This won't be public.</span>
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
                          <option disabled value=""></option>
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
                          <option disabled value></option>
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
                          <option disabled value></option>
                          {years.map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className={styles.titleRow3}>
                    <span>
                      By signing up, you aree to the{" "}
                      <Link
                        className={styles.link}
                        target="_blank"
                        href="https://x.com/en/tos"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        className={styles.link}
                        target="_blank"
                        href="https://x.com/en/privacy"
                      >
                        Privacy Policy
                      </Link>{" "}
                      , including{" "}
                      <Link
                        className={styles.link}
                        target="_blank"
                        href="https://help.x.com/en/rules-and-policies/x-cookies"
                      >
                        Cookie Use
                      </Link>
                      . X may use your contact information, including your email
                      address and phone number for purposes outlined in our
                      Privacy Policy, like keeping your acount secure and
                      personalizing our services, including ads. Learn more.
                      Others will be able to find you by email or phone number,
                      when provided, unless you choose otherwise here.
                    </span>
                  </div>
                  <div className={styles.nextBtnContainerDiv}>
                    <div
                      className={`${styles.nextBtnContainerFlex} ${
                        isFormComplete ? styles.active : ""
                      }`}
                      onClick={handleClick}
                    >
                      <span className={styles.nextButton}>Next</span>
                    </div>
                  </div>
                </>
              )}
              {passwordOverlay && (
                <NewUserSetPassword
                  setPassword={setPassword}
                  setUserNameOverlay={setUserNameOverlay}
                  setPasswordOverlay={setPasswordOverlay}
                />
              )}
              {usernameOverlay && (
                <NewUserSetUsername dob={dob} password={password} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUser;
