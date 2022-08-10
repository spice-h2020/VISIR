import React, { useEffect, useState } from "react";
import '../style/button.css';

interface ButtonProps {
  //Button contents.
  content?: React.ReactNode;
  //Current visual state of the button.
  state?: boolean;
  //Auto toggle state.
  autoToggle?: boolean;
  //On click handler
  onClick?: (params: any) => any;
  //Extra class name to add and change the CSS
  extraClassName?: string;
  //Button id that will be send as a parameter of the onclick handler
  buttonId?: number;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const Button = ({
  content = "Button",
  state = false,
  autoToggle = false,
  onClick = (): void => { },
  buttonId,
  extraClassName,
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<boolean>(state);

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button type="button" className={buttonState ? `btn ${extraClassName} active` : `btn ${extraClassName}`}
      onClick={(): void => {
        onClick(buttonId);

        if (autoToggle)
          setButtonState(!buttonState);
      }}
    >
      {content}
    </button >
  );
};
