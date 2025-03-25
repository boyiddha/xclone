"use client";

import { useState } from "react";
import styles from "./searchOverlay.module.css";
import { RxCross2 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchUsers } from "@/app/actions/searchActions";

const SearchOverlay = ({ setShowPopup, onUserSelect }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setTempSelectedUser] = useState(null);

  const active = search?.length > 0 ? true : false;
  const activeNext = selectedUser ? true : false;

  const router = useRouter();

  // Fetch users based on search query
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 0) {
      try {
        // Call the searchUsers function from actions to handle the API request
        const users = await searchUsers(value);
        setResults(users); // Set the results with the fetched users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setResults([]);
    }
  };

  const handleNext = async () => {
    onUserSelect(selectedUser);
    setShowPopup(false);
    router.push(`/messages/${selectedUser._id}`);
  };

  return (
    <>
      <div className={styles.popupOverlay}>
        <div className={styles.popupBox}>
          <div className={styles.popupHeader}>
            <div className={styles.firstCol}>
              <span
                className={styles.closeButton}
                onClick={() => setShowPopup(false)}
              >
                <RxCross2 />
              </span>
              <h2>New Message</h2>
            </div>
            <div className={styles.secondCol}>
              <span
                className={`${styles.next} ${
                  activeNext ? styles.nextActive : ""
                }`}
                onClick={activeNext ? handleNext : undefined}
              >
                Next
              </span>
            </div>
          </div>
          <div className={styles.popupContent}>
            <div className={styles.searchContent}>
              <div className={styles.searchBox}>
                <div
                  className={`${styles.searchIcon} ${
                    active ? styles.searchIconActive : ""
                  }`}
                >
                  <IoIosSearch />
                </div>
                <div className={styles.searchInput}>
                  <input
                    type="text"
                    placeholder="Search people..."
                    className={styles.searchInput}
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {selectedUser && (
                <div className={styles.selectedUser}>
                  <div
                    className={styles.selectedProfile}
                    onClick={() => {
                      setTempSelectedUser(null);
                    }}
                  >
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.fullName}
                      className={styles.profileImage}
                      width={25}
                      height={25}
                    />

                    <span className={styles.fullName}>
                      {selectedUser.fullName}
                    </span>
                    <span className={styles.crossIcon}>
                      {" "}
                      <RxCross2 />{" "}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.userList}>
              {results.map((user) => (
                <div
                  key={user._id}
                  className={styles.userItem}
                  onClick={() => {
                    setTempSelectedUser(user);
                    setSearch("");
                  }}
                >
                  <div>
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={`${user.fullName}'s profile`}
                        width={50}
                        height={50}
                        className={styles.profileImage}
                      />
                    )}
                  </div>
                  <div className={styles.name}>
                    <div>{user.fullName}</div>
                    <div className={styles.userName}>@{user.userName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
