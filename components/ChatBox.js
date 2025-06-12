import useChatFlow from './ChatFlow';
import ChatUI from './ChatUI';

export default function ChatBox() {
  const flow = useChatFlow();
  return <ChatUI {...flow} />;
}
