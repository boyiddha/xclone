"use client";

const NewsFeed = ({ posts }) => {
  return (
    <>
      <h1>Nees Fed pos</h1>

      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <p>{post.content}</p>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewsFeed;
