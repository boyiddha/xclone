// import Navbar from "@/components/Navbar/Navbar";
// import styles from "./chat.module.css";
// import Chat from "@/components/Chat/Chat";

// export const metadata = {
//   title: "Messages / X",
// };

// const ChatPage = async ({ params }) => {
//   const { userId } = await params;

//   return (
//     <>
//       <div className={styles.container}>
//         <div className={`$styles.column} ${styles.navbar}`}>
//           <Navbar />
//         </div>

//         <div className={styles.message}>
//           <Chat userId={userId} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatPage;

import Navbar from "@/components/Navbar/Navbar";
import styles from "./chat.module.css";
import Chat from "@/components/Chat/Chat";

export async function generateMetadata({ params }) {
  const { userId } = await params;

  try {
    const res = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/users/${userId}`
    );
    if (!res.ok) throw new Error("Failed to fetch user data");

    const data = await res.json();
    const user = data.user;

    return {
      title: `${user.fullName} / X`,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Messages / X",
    };
  }
}

const ChatPage = async ({ params }) => {
  const { userId } = params;

  // Fetch user data on the server
  const res = await fetch(
    `${process.env.API_SERVER_BASE_URL}/api/users/${userId}`
  );
  const data = await res.json();
  const user = data.user;

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.navbar}`}>
          <Navbar />
        </div>

        <div className={styles.message}>
          {/* Pass user data to Chat component */}
          <Chat user={user} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
