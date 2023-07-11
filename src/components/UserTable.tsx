import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UserDetailsDrawer from "./UserDetailsDrawer";
import { Entity } from "../queries/types";
import { useListUsers } from "../queries/useListUsers";
import { CircularProgress, Stack } from "@mui/material";

export default function UserTable() {
  const { data: users, isLoading } = useListUsers();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = React.useState<Entity | null>(null);

  return (
    <Stack>
      {isLoading ? (
        <CircularProgress sx={{ m: "auto" }} />
        ) : (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "Gainsboro" }}>
                <TableCell>Name</TableCell>
                <TableCell align="right">Surname</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Country</TableCell>
                <TableCell align="right">City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user: Entity) => (
                <TableRow
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#E3F9FF",
                  },
                }}
                  onClick={() => {
                    setDrawerIsOpen(!drawerIsOpen);
                    setCurrentSelectedUser(user);
                  }}
                  key={user.id}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell align="right">{user.surname}</TableCell>
                  <TableCell align="right">{user.id}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.country}</TableCell>
                  <TableCell align="right">{user.city}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {currentSelectedUser && 
          <UserDetailsDrawer 
            drawerIsOpen={drawerIsOpen} 
            setDrawerIsOpen={setDrawerIsOpen} 
            currentSelectedUser={currentSelectedUser}
          />
        }
      </>
      )}
    </Stack>
  );
}
