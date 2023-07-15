import { useNavigate } from "react-router-dom";
import { IconButton } from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import { Path } from "@/app/constant";

export const CloseBackToHomeIcon = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<CloseIcon />}
      onClick={() => navigate(Path.Home)}
      bordered
    />
  );
};
