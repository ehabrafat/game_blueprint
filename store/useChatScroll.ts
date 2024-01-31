import { useEffect, useState } from "react";
import { useScrollAction } from "./useScrollAction";

interface ChatScrollProbs {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  count: number;
  shouldLoadMore: boolean;
  loadMore: () => void;
}

export const useChatScroll = ({
  chatRef,
  bottomRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProbs) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const { scrollChatDown, setScrollChatDown } = useScrollAction();

  useEffect(() => {
    const chatDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = chatDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    chatDiv?.addEventListener("scroll", handleScroll);

    return () => {
      chatDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const chatDiv = chatRef.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && chatDiv) {
        setHasInitialized(true);
        return true;
      }
      return false;
    };

    const scrollForMessage = () => {
      const chatDiv = chatRef.current;
      if (!chatDiv) return;
      const bottomDistance =
        chatDiv.scrollHeight - chatDiv.clientHeight - chatDiv.scrollTop;
      return scrollChatDown && bottomDistance;
    };

    if (shouldAutoScroll() || scrollForMessage()) {
      setTimeout(() => {
        const chatDiv = chatRef?.current;
        chatDiv?.scrollBy({
          top: chatDiv.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
      setScrollChatDown(false);
    }
  }, [chatRef, bottomRef, count, hasInitialized, scrollChatDown]);
};
