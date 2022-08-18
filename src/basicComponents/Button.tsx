/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { ButtonState } from '../namespaces/ViewOptions';
//Packages
import React, { useEffect, useState } from "react";
//Local files
import '../style/Button.css';

interface ButtonProps {
  //Button contents.
  content?: React.ReactNode;
  //Current visual state of the button.
  state?: ButtonState;
  //Auto toggle button state on click.
  autoToggle?: boolean;
  //On click handler
  onClick?: (params: any) => void;
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
  state = ButtonState.inactive,
  autoToggle = false,
  onClick = (): void => { },
  buttonId,
  extraClassName = "",
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<ButtonState>(state);

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  return (
    <button type="button" className={buttonState === ButtonState.active ? `btn ${extraClassName} active` : buttonState === ButtonState.inactive ? `btn ${extraClassName}` : `btn ${extraClassName} loading`}
      onClick={(): void => {
        onClick(buttonId);

        if (autoToggle) {
          if (buttonState === ButtonState.inactive)
            setButtonState(ButtonState.active);
          else
            setButtonState(ButtonState.inactive);
        }

      }}
    >
      {content}
    </button >
  );
};
