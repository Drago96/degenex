"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";

type AppBodyProps = {
  children: ReactNode;
};

export default function AppBody({ children }: AppBodyProps) {
  return (
    <main>
      <Box sx={{ maxWidth: "1260px", margin: "auto", marginTop: "30px" }}>
        {children}
      </Box>
    </main>
  );
}
