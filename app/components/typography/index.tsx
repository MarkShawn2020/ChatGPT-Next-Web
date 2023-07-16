import React, { RefObject, useEffect, useRef, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import LoadingIcon from "@/app/icons/three-dots.svg";
import { MarkdownContent } from "@/app/components/typography/markdown";

import "katex/dist/katex.min.css";

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  const renderedHeight = useRef(0);
  const renderedWidth = useRef(0);
  const inView = useRef(!!props.defaultShow);
  const [_, triggerRender] = useState(0);
  const checkInView = useThrottledCallback(
    () => {
      const parent = props.parentRef?.current;
      const md = mdRef.current;
      if (parent && md && !props.defaultShow) {
        const parentBounds = parent.getBoundingClientRect();
        const twoScreenHeight = Math.max(500, parentBounds.height * 2);
        const mdBounds = md.getBoundingClientRect();
        const parentTop = parentBounds.top - twoScreenHeight;
        const parentBottom = parentBounds.bottom + twoScreenHeight;
        const isOverlap =
          Math.max(parentTop, mdBounds.top) <=
          Math.min(parentBottom, mdBounds.bottom);
        inView.current = isOverlap;
        triggerRender(Date.now());
      }

      if (inView.current && md) {
        const rect = md.getBoundingClientRect();
        renderedHeight.current = Math.max(renderedHeight.current, rect.height);
        renderedWidth.current = Math.max(renderedWidth.current, rect.width);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    300,
    {
      leading: true,
      trailing: true,
    },
  );

  useEffect(() => {
    props.parentRef?.current?.addEventListener("scroll", checkInView);
    checkInView();
    return () =>
      props.parentRef?.current?.removeEventListener("scroll", checkInView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSize = (x: number) => (!inView.current && x > 0 ? x : "auto");

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
        height: getSize(renderedHeight.current),
        width: getSize(renderedWidth.current),
        direction: /[\u0600-\u06FF]/.test(props.content) ? "rtl" : "ltr",
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
    >
      {inView.current &&
        (props.loading ? (
          <LoadingIcon />
        ) : (
          <MarkdownContent content={props.content} />
        ))}
    </div>
  );
}
