"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signIn, signOut, useSession } from "next-auth/react";

import ThemeSwitcher from "./(theme)/theme-switcher";

export default function AppHeader() {
  const { status } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Degenex
          </Typography>
          <Box>
            <ThemeSwitcher />
            {status !== "authenticated" && (
              <Button color="inherit" onClick={() => signIn("google")}>
                Login
              </Button>
            )}
            {status === "authenticated" && (
              <Button color="inherit" onClick={() => signOut()}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
