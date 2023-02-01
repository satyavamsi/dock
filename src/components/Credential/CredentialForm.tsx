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
  Divider,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import config from "../../config.js";
import CredentialLoading from "./CredentialLoading";
import CopyCredential from "./CopyCredential";
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
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [type, setType] = useState("VerifiableCredenial");

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [serverity, setSeverity] = useState("success");

  const [credential, setCredential] = useState(null);

  const [errors, setErrors] = useState({
    id: false,
    context: false,
    college: false,
    degree: false,
  });

  const resetData = () => {
    setLoading(false);
    setId("");
    setContext("");
    setCollege("");
    setDegree("");
    setCredential(null);
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

    if (!college) {
      error = true;
      newErrors.college = true;
    }
    if (!degree) {
      error = true;
      newErrors.degree = true;
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
      credential: {
        context: [context],
        type: [type],
        subject: {
          id,
          degree: {
            name: degree,
            college,
          },
        },

        issuer: config.ISSUER,
        issuanceDate: new Date(),
      },
    };

    try {
      const request = await fetch(`${config.API_URL}/credentials`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "DOCK-API-TOKEN": config.API_KEY,
        },
        body: JSON.stringify(requestBody),
      });
      const credential = await request.json();
      setLoading(false);

      if (credential.status === 500) {
        setShowMessage(true);
        setSeverity("error");
        setMessage(credential.error);
      } else {
        setCredential(credential);
        setShowMessage(true);
        setSeverity("success");
        setMessage("Credentials have been issued");
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
      {loading && <CredentialLoading />}
      {!loading && credential && (
        <CopyCredential resetData={resetData} credential={credential} />
      )}
      {!loading && !credential && (
        <Dialog fullWidth onClose={handleClose} open={show}>
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Add Credential</Typography>
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
            <Typography>Degree</Typography>
            <Divider />
            <Spacer height={20} />
            <TextField
              id="college"
              label="University"
              variant="outlined"
              value={college}
              error={errors.college}
              onChange={(e) => {
                setCollege(e.target.value);
                setErrors({ ...errors, college: false });
              }}
              helperText={errors.college ? "University is required" : ""}
              size="small"
              required
            />
            <Spacer height={20} />
            <TextField
              id="degree"
              label="Major"
              variant="outlined"
              value={degree}
              error={errors.degree}
              onChange={(e) => {
                setDegree(e.target.value);
                setErrors({ ...errors, degree: false });
              }}
              helperText={errors.degree ? "Major is required" : ""}
              size="small"
              required
            />
            <Spacer height={30} />
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
                key={"VerifiableCredential"}
                value={"VerifiableCredential"}
              >
                Verifiable Credential
              </option>
              <option
                key={"UniversityDegreeCredential"}
                value={"UniversityDegreeCredential"}
              >
                University Degree
              </option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: "none" }}
              onClick={submitForm}
              disabled={loading}
              variant="contained"
            >
              Issue Credential{" "}
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
