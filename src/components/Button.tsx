import React, { useEffect, useState } from "react";
import '../style/button.css';

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
  onClick?: () => any;

  extraClassName?: string;
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
  extraClassName = "",
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<boolean>(state);

  function buttonClick() {
    if (toggleState) {
      setButtonState(!buttonState);
      onClick();
    }
    else if (onClick()) {
      setButtonState(!buttonState);
    }
  }

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button
      type="button"
      className={buttonState ? `btn ${extraClassName} active` : `btn ${extraClassName}`}
      onClick={(): void => {
        buttonClick();
      }}
    >
      {content}
    </button >
  );
};
