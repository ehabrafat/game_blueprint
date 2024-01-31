"use client";

import { FaExclamationCircle } from "react-icons/fa";
import { ActionToolTip } from "./ActionTooltip";

export const ChatHeader = () => {
  return (
    <div className="flex items-center pb-2 pr-2 justify-between border-b-2 border-gray-600/30">
      <h2 className="font-semibold">Chat with team</h2>
      <ActionToolTip
        side="left"
        align="start"
        label="Messages for the last 24 hours"
      >
        <div>
          <FaExclamationCircle size={16} className="cursor-pointer" />
        </div>
      </ActionToolTip>
    </div>
  );
};
