import { Link } from "react-router-dom";

const AI_USER_ID = import.meta.env.VITE_AI_USER_ID;

const AIFloatingButton = () => {
  if (!AI_USER_ID) return null;

  return (
    <Link
      to={`/chat/${AI_USER_ID}`}
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      title="Chat with ChatWave AI"
    >
      <img
        src="https://api.dicebear.com/7.x/bottts/svg?seed=chatwave"
        alt="ChatWave AI"
        className="size-9 rounded-full"
      />
    </Link>
  );
};

export default AIFloatingButton;