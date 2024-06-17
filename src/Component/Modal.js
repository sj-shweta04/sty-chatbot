import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const materialTheme = materialExtendTheme();

export default function BasicModalDialog({ open, setOpen, setQaData, setMinimize }) {
  return (
    <React.Fragment>
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <JoyCssVarsProvider>
          <CssBaseline enableColorScheme />
          <Modal open={open}>
            <ModalDialog
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DialogTitle>Confirm Exit?</DialogTitle>
              <DialogContent>
                On exiting, all chat history will be cleared
              </DialogContent>
              <Stack direction="row" spacing={1}>
                <Button
                  color="primary"
                  onClick={() => {
                    setQaData([]);
                    setOpen(false);
                  
                  }}
                >
                  Confirm
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    setOpen(false); 
                    setMinimize(true);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </ModalDialog>
          </Modal>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </React.Fragment>
  );
}
