import React from "react";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

function MyButton({ title }: { title: string }) {
  return <button>{title}</button>;
}

export default function MyApp() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Paper elevation={0} />
      <Paper />
      <Paper elevation={3} />
      <div>
        <h1>Welcome to my app</h1>
        <MyButton title="I'm a button" />
      </div>
    </Grid>
  );
}
