import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMath from "remark-math";
import RemarkGfm from "remark-gfm";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RehypeHighlight from "rehype-highlight";
import { PreCode } from "@/app/components/typography/code";

function _MarkDownContent(props: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        a: (aProps) => {
          const href = aProps.href || "";
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {props.content}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);
