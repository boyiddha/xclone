"use client";

import { useEffect, useState } from "react";
import styles from "./mainSection.module.css";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { formatJoiningDate } from "@/utils/calendarUtils";
import HeaderSection from "./HeaderSection";
import UserPost from "./UserPost";
import UserReply from "./UserReply";
import UserLike from "./UserLike";
import {
  fetchUserData,
  fetchUsersData,
  getLoggedInUser,
} from "@/app/actions/userActions";
import {
  deletePost,
  fetchAllPostsData,
  fetchUserPosts,
} from "@/app/actions/tweetActions";

const MainSection = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  const [userId, setCurrentUserId] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [userCoverImage, setUserCoverImage] = useState(null);
  const [joiningDateMessage, setJoiningDateMessage] = useState("");
  const [following, setFollowing] = useState(0);
  const [follower, setFollower] = useState(0);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [users, setUsers] = useState([]);

  const justChangeURL = (page) => {
    const basePath = pathname.split("/")[1];
    const newUrl = page === "posts" ? `/${basePath}` : `/${basePath}/${page}`;
    window.history.pushState(null, "", newUrl);
  };

  const fetchMe = async () => {
    const data = await getLoggedInUser();

    setLoggedInUserId(data._id);
  };

  // fetch all users (fullName, userName)
  const fetchUsers = async () => {
    const data = await fetchUsersData();
    setUsers(data);
  };

  // fetch user posts
  const fetchPosts = async () => {
    try {
      const fetchedPosts = await fetchUserPosts(username);
      setPosts(fetchedPosts); // Update the posts state with the fetched data
    } catch (error) {
      console.error("Error fetching user post:", error);
    }
  };

  // Fetch all posts
  const fetchAllPosts = async () => {
    setLoading(true); // Start loading
    try {
      const fetchedPosts = await fetchAllPostsData(); // Call the refactored API function
      setAllPosts(fetchedPosts); // Update the allPosts state with the fetched data
    } catch (error) {
      setError("Failed to fetch posts " + error.message); // Handle error if needed
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle new post submission and add it to the posts list
  const handleNewPost = async (newPost) => {
    setPosts([newPost, ...posts]); // Add new post at the top
  };

  const handlePostRemoved = (repostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== repostId)); // Remove repost
  };

  const handleDeletePost = async (postId) => {
    // Find the post by its ID
    const postToDelete = posts.find((post) => post._id === postId);

    // Check if the current user is the owner of the post
    if (!postToDelete || postToDelete.userId !== loggedInUserId) {
      alert("You are not the OWNER of this post.");
      return;
    }

    try {
      const result = await deletePost(postId); // Call the refactored API function

      if (result) {
        // Remove deleted post from the state
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }
    } catch (error) {
      console.error("Error deleting post:", error); // Handle error
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchUserData(username);
      setFullName(data.user.fullName);
      setUserName(data.user.userName);
      setUserImage(data.user.image || null);
      setUserCoverImage(data.user.coverImage || null);
      setCurrentUserId(data.user._id);
      setFollowing(data?.user?.following?.length || 0);
      setFollower(data?.user?.followers?.length || 0);
      setFollowingList(data?.user?.following);
      setFollowerList(data?.user?.followers);

      const joiningDate = formatJoiningDate(data.user.createdAt);
      setJoiningDateMessage(joiningDate);
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMe();
      await fetchUsers();
      await fetchPosts();
      await fetchAllPosts();
    };

    fetchData();
  }, [userId]); // run after fetchMe

  return (
    <>
      <div className={styles.profileContainer}>
        <div>
          <HeaderSection
            totalPost={posts.length || 0}
            loading={loading}
            fullName={fullName}
            userName={userName}
            userImage={userImage}
            userCoverImage={userCoverImage}
            joiningDateMessage={joiningDateMessage}
            following={following}
            follower={follower}
            followingList={followingList}
            followerList={followerList}
            userId={userId}
            loggedInUserId={loggedInUserId}
            setFullName={setFullName}
            setUserImage={setUserImage}
            setUserCoverImage={setUserCoverImage}
          />
        </div>
        {/* Page Navigation */}
        <div className={styles.pages}>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("posts")}
          >
            Posts
          </div>
          <div
            className={`${styles.pageItem} ${
              pathname === `/${userName}/with_replies` ? styles.active : ""
            }`}
            onClick={() => justChangeURL("with_replies")}
          >
            Replies
          </div>
          {userId === loggedInUserId && (
            <div
              className={`${styles.pageItem} ${
                pathname === `/${userName}/likes` ? styles.active : ""
              }`}
              onClick={() => justChangeURL("likes")}
            >
              Likes
            </div>
          )}
          <div className={styles.pageItem}>Highlights</div>
          <div className={styles.pageItem}>Media</div>
        </div>

        <div className={styles.contentSection}>
          {pathname === `/${userName}` && (
            <UserPost
              posts={posts}
              originalPosts={allPosts} // pass same posts to find originals
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              currentUserId={userId}
              users={users}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
          {pathname === `/${userName}/with_replies` && (
            <UserReply
              posts={posts}
              originalPosts={allPosts} // Contains all posts to find original post if needed
              users={users}
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
          {pathname === `/${userName}/likes` && (
            <UserLike
              posts={allPosts}
              userId={userId}
              users={users}
              fullName={fullName}
              userName={userName}
              userImage={userImage}
              onDeletePost={handleDeletePost}
              onPostReposted={handleNewPost}
              handlePostRemoved={handlePostRemoved}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainSection;
