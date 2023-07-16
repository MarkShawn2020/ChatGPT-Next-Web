import { useEffect, useRef } from "react";
import { EXPORT_MESSAGE_CLASS_NAME } from "@/app/constant";
import dynamic from "next/dynamic";
import { Markdown as Markdown1 } from "@/app/components/typography";
import LoadingIcon from "@/app/icons/three-dots.svg";
import { ChatMessage } from "@/app/ds/message";

export const Markdown = dynamic(async () => Markdown1, {
  loading: () => <LoadingIcon />,
});

export function RenderExport(props: {
  messages: ChatMessage[];
  onRender: (messages: ChatMessage[]) => void;
}) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!domRef.current) return;
    const dom = domRef.current;
    const messages = Array.from(
      dom.getElementsByClassName(EXPORT_MESSAGE_CLASS_NAME),
    );

    if (messages.length !== props.messages.length) {
      return;
    }

    const renderMsgs = messages.map((v, i) => {
      const [role, _] = v.id.split(":");
      return {
        id: i.toString(),
        role: role as any,
        content: role === "user" ? v.textContent ?? "" : v.innerHTML,
      };
    });

    props.onRender(renderMsgs);
  });

  return (
    <div ref={domRef}>
      {props.messages.map((m, i) => (
        <div
          key={i}
          id={`${m.role}:${i}`}
          className={EXPORT_MESSAGE_CLASS_NAME}
        >
          <Markdown content={m.content} defaultShow />
        </div>
      ))}
    </div>
  );
}
