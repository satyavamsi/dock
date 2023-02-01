import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

type CopyCredentialProps = {
  credential: JSON;
  resetData: () => void;
};

function CopyCredential({ credential, resetData }: CopyCredentialProps) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    resetData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Copy the credentials</DialogTitle>
      <DialogContent>
        <pre>{JSON.stringify(credential, undefined, 4)}</pre>
      </DialogContent>
      <DialogActions>
        <Button
          style={{ textTransform: "none" }}
          onClick={handleClose}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CopyCredential;
