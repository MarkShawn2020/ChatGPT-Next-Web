import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Path } from "@/app/constant";

export const useEscHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
