import { useEffect, useState } from "react";
import { Updater } from "@/app/typings/typing";

export function useMessageSelector() {
  const [selection, setSelection] = useState(new Set<string>());
  const updateSelection: Updater<Set<string>> = (updater) => {
    const newSelection = new Set<string>(selection);
    updater(newSelection);
    setSelection(newSelection);
  };

  return {
    selection,
    updateSelection,
  };
}

export function useShiftRange() {
  const [startIndex, setStartIndex] = useState<number>();
  const [endIndex, setEndIndex] = useState<number>();
  const [shiftDown, setShiftDown] = useState(false);

  const onClickIndex = (index: number) => {
    if (shiftDown && startIndex !== undefined) {
      setEndIndex(index);
    } else {
      setStartIndex(index);
      setEndIndex(undefined);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      setShiftDown(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      setShiftDown(false);
      setStartIndex(undefined);
      setEndIndex(undefined);
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return {
    onClickIndex,
    startIndex,
    endIndex,
  };
}
