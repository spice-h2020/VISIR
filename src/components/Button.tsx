import React, { useEffect, useState } from "react";
import internal from "stream";
import '../style/button.css';

interface ButtonProps {
  /**
   * Button contents
   */
  content: React.ReactNode;
  /**
   * Active state of the button
   */
  state?: boolean;
  /**
   * Optional click handler
   */
  onClick?: (params: any) => any;

  extraClassName?: string;

  buttonId?: number;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  state = false,
  content,
  buttonId,
  onClick = (): void => {
    console.log(`Button Click`);
  },
  extraClassName = "",
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<boolean>(state);

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button
      type="button"
      className={buttonState ? `btn ${extraClassName} active` : `btn ${extraClassName}`}
      onClick={(): void => {
        onClick(buttonId);
      }}
    >
      {content}
    </button >
  );
};
