import { Typography } from "@mui/material";
import React, { useState } from "react";
import Card from "../../ui/Card/Card";
import Spacer from "../../ui/Spacer";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PresentationForm from "./PresentationForm";

function Credential() {
  const [show, setShow] = useState(false);

  const openDialog = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <div onClick={openDialog}>
        <Card cardStyle={{ height: 500, width: 400 }}>
          <Spacer height={40} />
          <div>
            <AssessmentIcon
              style={{ fontSize: 300, color: "rgb(194 143 119)" }}
            />
          </div>
          <Spacer height={40} />
          <Typography variant="button" style={{ padding: 10, margin: 10 }}>
            Create a verifiable Presentation
          </Typography>
        </Card>
      </div>
      <PresentationForm handleClose={handleClose} show={show} />
    </>
  );
}

export default Credential;
