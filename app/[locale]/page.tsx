"use client";

import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";

export default function Home() {
  const t = useTranslations("Home");

  return <Typography>{t("welcomeMessage")}</Typography>;
}
