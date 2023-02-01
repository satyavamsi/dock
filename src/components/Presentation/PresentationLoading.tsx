import {
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function CredentialLoading() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <div style={{ display: "flex", paddingRight: 40 }}>
          <div style={{ marginRight: 20, marginTop: 5 }}>
            <div
              style={{
                backgroundColor: "#F2F2F2",
                padding: 5,
                borderRadius: 99,
                display: "grid",
                alignItems: "center",
              }}
            >
              <AccessTimeIcon color="primary" fontSize="medium" />
            </div>
          </div>
          <div>
            <Typography fontWeight={"bold"} variant="h6">
              Issuing credentials ...
            </Typography>
            <Typography variant="caption">
              Please don't close this window
            </Typography>
            <LinearProgress style={{ marginTop: 20 }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CredentialLoading;
