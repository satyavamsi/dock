import React, { useState } from "react";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import config from "../../config.js";
import PresentationLoading from "./PresentationLoading";
import CopyPresentation from "./CopyPresentation";
import Spacer from "../../ui/Spacer";
import CloseIcon from "@mui/icons-material/Close";

type CredentialFormProps = {
  show?: boolean;
  handleClose: any;
};

function CredentialForm({ show = false, handleClose }: CredentialFormProps) {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [context, setContext] = useState("");
  const [holder, setHolder] = useState("");
  const [credential, setCredential] = useState("");
  const [type, setType] = useState("VerifiableCredenial");

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [serverity, setSeverity] = useState("success");

  const [presentation, setPresentation] = useState(null);

  const [errors, setErrors] = useState({
    id: false,
    context: false,
    holder: false,
    credential: false,
  });

  const resetData = () => {
    setLoading(false);
    setId("");
    setContext("");
    setHolder("");
    setCredential("");
    setPresentation(null);
    handleClose();
  };

  const checkErrors = () => {
    let error = false;
    const newErrors = Object.assign({}, errors);
    if (!id) {
      error = true;
      newErrors.id = true;
    }
    if (!context) {
      error = true;
      newErrors.context = true;
    }
    if (context) {
      try {
        new URL(context);
      } catch (e) {
        newErrors.context = true;
      }
    }

    if (!credential) {
      error = true;
      newErrors.credential = true;
    }

    if (credential) {
      try {
        JSON.parse(credential);
      } catch (e) {
        newErrors.credential = true;
      }
    }

    if (!holder) {
      error = true;
      newErrors.holder = true;
    }

    setErrors(newErrors);

    return error;
  };

  const submitForm = async () => {
    const error = checkErrors();
    if (error) {
      return;
    }
    setLoading(true);
    const requestBody = {
      persist: false,
      anchor: true,
      credentials: [JSON.parse(credential)],
      holder,
    };

    try {
      const request = await fetch(`${config.API_URL}/presentations`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "DOCK-API-TOKEN": config.API_KEY,
        },
        body: JSON.stringify(requestBody),
      });
      const presentation = await request.json();
      setLoading(false);

      if (presentation.status === 500 || presentation.status === 400) {
        setShowMessage(true);
        setSeverity("error");
        setMessage(presentation.error);
      } else {
        setPresentation(presentation);
        setShowMessage(true);
        setSeverity("success");
        setMessage("Presentation have been issued");
      }
    } catch (error) {
      setLoading(false);

      setShowMessage(true);
      setMessage("Something went wrong");
    }

    setShowMessage(true);
  };

  return (
    <>
      {loading && <PresentationLoading />}
      {!loading && presentation && (
        <CopyPresentation resetData={resetData} presentation={presentation} />
      )}
      {!loading && !presentation && (
        <Dialog fullWidth onClose={handleClose} open={show}>
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Create Presentation</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column" }}>
            <Spacer height={20} />
            <TextField
              autoFocus
              id="id"
              label="Recepient ID"
              variant="outlined"
              value={id}
              error={errors.id}
              onChange={(e) => {
                setId(e.target.value);
                setErrors({ ...errors, id: false });
              }}
              helperText={errors.id ? "Recepient ID is required" : ""}
              size="small"
              required
            />
            <Spacer height={20} />
            <TextField
              id="context"
              label="Context"
              placeholder="https://www.w3.org/2018/credentials/v1"
              variant="outlined"
              value={context}
              error={errors.context}
              onChange={(e) => {
                setContext(e.target.value);
                setErrors({ ...errors, context: false });
              }}
              helperText={
                errors.context && context
                  ? "Context should be valid url"
                  : errors.context
                  ? "Context is required"
                  : ""
              }
              size="small"
              required
            />
            <Spacer height={20} />
            <TextField
              id="holder"
              label="Holder"
              variant="outlined"
              value={holder}
              error={errors.holder}
              onChange={(e) => {
                setHolder(e.target.value);
                setErrors({ ...errors, holder: false });
              }}
              helperText={errors.holder ? "Holder is required" : ""}
              size="small"
              required
            />
            <Spacer height={20} />
            <TextField
              id="degree"
              label="Type"
              variant="outlined"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
              SelectProps={{
                native: true,
              }}
              select
              size="small"
            >
              <option
                key={"VerifiablePresentation"}
                value={"VerifiablePresentation"}
              >
                Verifiable Credential
              </option>
              <option
                key={"UniversityDegreePresentation"}
                value={"UniversityDegreePresentation"}
              >
                University Degree
              </option>
            </TextField>
            <Spacer height={20} />
            <TextField
              id="credential"
              label="Credential"
              variant="outlined"
              value={credential}
              error={errors.credential}
              onChange={(e) => {
                setCredential(e.target.value);
                setErrors({ ...errors, credential: false });
              }}
              helperText={
                errors.credential && credential
                  ? "Credential is not valid"
                  : errors.credential
                  ? "Credential is required"
                  : ""
              }
              size="small"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={submitForm}
              disabled={loading}
              variant="contained"
            >
              Issue Presentation{" "}
              {loading && (
                <CircularProgress style={{ marginLeft: 5 }} size={16} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        open={showMessage}
        autoHideDuration={10000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => {
          setShowMessage(false);
        }}
      >
        <Alert
          onClose={() => {
            setShowMessage(false);
          }}
          severity={serverity as AlertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CredentialForm;
