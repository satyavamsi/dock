import React from "react";
import Credential from "./Credential";
import Presentation from "./Presentation";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: 20,
        flex: 1,
        alignItems: "center",
        height: "calc(100% - 80px)",
      }}
    >
      <Credential />
      <Presentation />
    </div>
  );
}

export default Home;
