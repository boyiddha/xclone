import Navbar from "@/components/Navbar/Navbar";
import styles from "./chat.module.css";
import Chat from "@/components/Chat/Chat";
import { getUserByIdentifier } from "../../actions/userActions";

export async function generateMetadata({ params }) {
  const { userId } = params;

  try {
    const user = await getUserByIdentifier(userId);
    if (!user) throw new Error("User not found");

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
  const { userId } = await params;

  const user = await getUserByIdentifier(userId);

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.navbar}`}>
          <Navbar />
        </div>

        <div className={styles.message}>
          <Chat user={user} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
