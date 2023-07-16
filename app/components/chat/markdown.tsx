import dynamic from "next/dynamic";
import LoadingIcon from "@/app/icons/three-dots.svg";
import React from "react";
import { Markdown as Markdown1 } from "@/app/components/typography";

export const Markdown = dynamic(async () => Markdown1, {
  loading: () => <LoadingIcon />,
});
