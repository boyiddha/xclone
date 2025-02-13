const PasswordForgetOverlay = ({ email }) => {
  return (
    <div
      style={{
        zIndex: "10000",
        backgroundColor: "green",
        height: "700px",
        width: "500px",
      }}
    >
      <h1>hello {email}</h1>
    </div>
  );
};

export default PasswordForgetOverlay;
