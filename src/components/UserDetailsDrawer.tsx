import * as React from "react";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UserAssignment from "./UserAssignment";
import { Entity } from "../queries/types";

type UserDetailsDrawerProps = { 
  drawerIsOpen?: boolean, 
  setDrawerIsOpen?: React.Dispatch<React.SetStateAction<boolean>>, 
  currentSelectedUser?: Entity, 
};

export default function UserDetailsDrawer(props: UserDetailsDrawerProps) {

  const { drawerIsOpen, setDrawerIsOpen, currentSelectedUser } = props;

  return (
    <div>
        <React.Fragment>
          <Drawer
            anchor="right"
            PaperProps={{
              sx: { width: "45%" },
            }}
            open={drawerIsOpen}
            onClose={() => setDrawerIsOpen && setDrawerIsOpen(false)}
            >
              <>
                <Typography 
                  variant="h5" 
                  component="h5" sx={{
                  padding: "24px",
                  paddingLeft: "16px"
                  }}
                >
                  User Information
                </Typography>
                <Stack
                  key={currentSelectedUser?.id}
                  component="form"
                  sx={{
                    padding: '0 16px',
                  }}
                  spacing={2}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label="Name"
                    value={currentSelectedUser?.name}
                    disabled
                    size="small"
                  />
                  <TextField
                    label="Surname"
                    value={currentSelectedUser?.surname}
                    disabled
                    size="small"
                  />
                  <TextField
                    label="ID"
                    value={currentSelectedUser?.id}
                    disabled
                    size="small"
                  />
                  <TextField
                    label="Email"
                    value={currentSelectedUser?.email}
                    disabled
                    size="small"
                  />
                  <TextField
                    label="Country"
                    value={currentSelectedUser?.country}
                    disabled
                    size="small"
                  />
                  <TextField
                    label="City"
                    value={currentSelectedUser?.city}
                    disabled
                    size="small"
                  />
                  <div>
                    {currentSelectedUser && <UserAssignment currentSelectedUser={currentSelectedUser}/>}
                  </div>
                </Stack>
              </>
          </Drawer>
        </React.Fragment>
    </div>
  );
}
