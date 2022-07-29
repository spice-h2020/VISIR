import React, { useEffect, useState } from "react";
import './button.css';

interface ButtonProps {
  /**
   * Button contents
   */
  content: React.ReactNode;
  /**
   * Toggle the visuals of the button when clicked
   */
  toggleState?: boolean;
  /**
   * Active state of the button
   */
  state?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;

  style?: React.CSSProperties
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  toggleState = true,
  state = false,
  content,
  onClick = (): void => {
    console.log(`Button Click`);
  },
  style = {},
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<boolean>(state);

  function buttonClick() {
    if (toggleState) {
      setButtonState(!buttonState)
    }
    onClick();
  }

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button
      type="button"
      className={buttonState ? "btn active" : "btn"}
      onClick={(): void => {
        buttonClick();
      }}
      style={style}
    >
      {content}
    </button >
  );
};
