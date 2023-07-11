import { CircularProgress } from "@mui/material";
import React from "react";
import "./App.css";
import { storageInit, storageKey } from "./queries/constants";
import UserTable from "./components/UserTable";

// used to initialize mock storage
function useInitializeStorage() {
  const [init, setInit] = React.useState(true);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(storageInit));
    const value = localStorage.getItem(storageKey);
    if (value) {
      setInit(false);
    }
  }, []);

  return init;
}

export default function App() {
  const init = useInitializeStorage();

  if (init) {
    return <CircularProgress sx={{ m: "auto" }} />;
  }

  return <UserTable />;
}
