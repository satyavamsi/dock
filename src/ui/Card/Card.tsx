import React, { CSSProperties, ReactNode } from "react";
import "./Card.css";

function Card({
  children,
  clickable = true,
  cardStyle = {},
}: {
  children: ReactNode;
  clickable?: boolean;
  cardStyle?: CSSProperties;
}) {
  return (
    <div style={cardStyle} className={`card ${clickable ? "clickable" : ""}`}>
      <div className="container">{children}</div>
    </div>
  );
}

export default Card;
