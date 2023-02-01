import { Typography } from "@mui/material";
import React, { useState } from "react";
import Card from "../..//ui/Card/Card";
import CredentialForm from "./CredentialForm";
import PaymentIcon from "@mui/icons-material/Payment";
import Spacer from "../../ui/Spacer";

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
            <PaymentIcon style={{ fontSize: 300, color: "#77a3c2" }} />
          </div>
          <Spacer height={40} />
          <Typography variant="button" style={{ padding: 10, margin: 10 }}>
            Create a verifiable Credential
          </Typography>
        </Card>
      </div>
      <CredentialForm handleClose={handleClose} show={show} />
    </>
  );
}

export default Credential;
