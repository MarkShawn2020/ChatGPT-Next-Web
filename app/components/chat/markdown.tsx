import dynamic from "next/dynamic";
import LoadingIcon from "@/app/icons/three-dots.svg";
import React from "react";

export const Markdown = dynamic(
  async () => (await import("../markdown")).Markdown,
  {
    loading: () => <LoadingIcon />,
  },
);
