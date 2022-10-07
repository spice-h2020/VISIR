/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ButtonState } from "../constants/viewOptions";
//Packages
import React, { useEffect, useState } from "react";

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
  //Text that will be shown to the user when hovering the button
  hoverText?: string;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const Button = ({
  content = "Button",
  state = ButtonState.unactive,
  autoToggle = false,
  onClick = (): void => { },
  extraClassName = "",
  hoverText = "",
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<ButtonState>(state);

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  const buttonClassState = buttonState !== ButtonState.unactive ? ButtonState[buttonState] : "";

  return (
    <button title={hoverText} type="button" className={`btn ${extraClassName} ${buttonClassState}`}
      onClick={(): void => {
        onClick(buttonState);

        if (autoToggle) {
          if (buttonState === ButtonState.unactive)
            setButtonState(ButtonState.active);
          else
            setButtonState(ButtonState.unactive);
        }
      }}
    >
      {content}
    </button >
  );
};
