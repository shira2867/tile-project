import React from "react";

interface Props {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, type = "button", onClick, disabled = false }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ padding: "8px 16px", marginTop: 10 }}
    >
      {text}
    </button>
  );
}
