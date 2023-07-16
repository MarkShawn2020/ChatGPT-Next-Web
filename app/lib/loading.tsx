import styles from "@/app/components/home.module.scss";
import BotIcon from "@/public/logo/44.svg";
import LoadingIcon from "@/app/icons/three-dots.svg";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}
