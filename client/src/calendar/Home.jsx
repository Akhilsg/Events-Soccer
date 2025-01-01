import { Grid } from "@mui/material";
import React from "react";
import Calendar from "./Calendar";
import Sidebar from "./sidebar/Sidebar";
import Tasks from "./tasks/Tasks";

export default function Home() {
  return (
    <Grid container justifyContent="space-between" spacing={3}>
      <Grid item lg={3}>
        <Sidebar />
      </Grid>
      {window.location.pathname === "/tasks" ? (
        <Grid item lg={9}>
          <Tasks />
        </Grid>
      ) : (
        <Grid item lg={9}>
          <Calendar />
        </Grid>
      )}
    </Grid>
  );
}
