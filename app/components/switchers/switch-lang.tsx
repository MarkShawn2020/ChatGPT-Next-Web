import { IconLanguage } from "@tabler/icons-react";
import { ALL_LANG_OPTIONS, AllLangs, changeLang, Lang } from "@/app/locales";
import React from "react";
import { SwitcherScenarioType } from "@/app/components/switchers/ds";
import { SelectTrigger } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
} from "../ui/select";

export const SwitchLang = ({
  scenario,
}: {
  scenario: SwitcherScenarioType;
}) => {
  switch (scenario) {
    case SwitcherScenarioType.windowAction:
      return (
        <Select
          onValueChange={(v: Lang) => {
            changeLang(v);
          }}
        >
          {/* 这里不要用 shadcn 的 trigger，否则会有额外的下拉icon，以及会有复杂难缠的嵌套关系 */}
          <SelectTrigger>
            <IconLanguage
              className={
                "window-action-button p-2 border-in-light rounded-xl transition-all"
              }
              color={"gray"}
            />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {/* 中文，英文 */}
              {AllLangs.slice(0, 2).map((lang) => (
                <SelectItem value={lang} key={lang}>
                  {ALL_LANG_OPTIONS[lang]}
                </SelectItem>
              ))}
            </SelectGroup>

            <SelectSeparator />

            {/* 其他语言 */}
            <SelectGroup>
              {AllLangs.slice(2).map((lang) => (
                <SelectItem value={lang} key={lang}>
                  {ALL_LANG_OPTIONS[lang]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );

    // case SwitcherScenarioType.settings:
    // 	return (
    // 		<Select
    // 			value={getLang()}
    // 			onChange={(e) => {
    // 				changeLang(e.target.value as any)
    // 			}}
    // 		>
    // 			{AllLangs.map((lang) => (
    // 				<option value={lang} key={lang}>
    // 					{ALL_LANG_OPTIONS[lang]}
    // 				</option>
    // 			))}
    // 		</Select>
    // 	)
    //
    default:
      throw "UnexpectedDefault";
  }
};
