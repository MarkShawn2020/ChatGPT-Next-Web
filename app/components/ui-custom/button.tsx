import * as React from "react";
import { HTMLProps, ReactNode } from "react";

import { clsx } from "clsx";
import { ButtonType } from "@/app/ds/ui";

export function IconButton({
  bordered,
  shadow,
  text,
  icon,
  type,
  ...props
}: {
  icon?: ReactNode;
  type?: ButtonType;
  text?: string;
  bordered?: boolean;
  shadow?: boolean;
} & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        // .icon-button {background-color: var(--white);border-radius: 10px;display: flex;align-items: center;justify-content: center;padding: 10px;cursor: pointer;transition: all 0.3s ease;overflow: hidden;user-select: none;outline: none;border: none;color: var(--black); &[disabled] {cursor: not-allowed;opacity: 0.5;} &.primary {background-color: var(--primary);color: white; path {fill: white !important;} } &.danger {color: rgba($color: red, $alpha: 0.8);border-color: rgba($color: red, $alpha: 0.5);background-color: rgba($color: red, $alpha: 0.05); &:hover {border-color: red;background-color: rgba($color: red, $alpha: 0.1);} path {fill: red !important;} } }
        "rounded-lg flex-center p-2 cursor-pointer transition-all overflow-hidden select-none outline-none text-black",
        "hocus:border-primary hocus:border-2",
        "sm:p-4",
        type === "primary" && "bg-primary text-white fill-white",
        type === "danger" &&
          "text-red-800 border-red-500 bg-red-50 hover:border-red bg-red-100 fill-red-500",
        props.disabled && "cursor-none opacity-50",
        bordered && "border-in-light",
        shadow && "box-shadow-card",
        props.className,
      )}
      {...props}
    >
      {icon && (
        // .icon-button-icon {width: 16px;height: 16px;display: flex;justify-content: center;align-items: center;}
        <div
          className={clsx(
            "w-4 h-4 inline-flex-center",
            type === "primary" && "no-dark",
          )}
        >
          {icon}
        </div>
      )}

      {text && (
        // .icon-button-text {font-size: 12px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; &:not(:first-child) {margin-left: 5px;} }
        <div className="text-xs truncate not-first:ml-1">{text}</div>
      )}
    </button>
  );
}
