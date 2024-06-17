import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function Notification({ message, severity, open, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity={severity} variant="filled" sx={{ width: "100%", color: "white" }}>
        <strong>{message}</strong>
      </Alert>
    </Snackbar>
  );
}
