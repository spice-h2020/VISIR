/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * The button can also be disabled to negate any interaction with it, or change its colors with the state : ButtonState
 * property.
 * If auto toggle parameter is true, the button will automaticaly change its state between active and 
 * unactive when clicked.
 * PostIcon prop allows to add an icon at the end of the content of the button while extraClassName allows for further
 * style customization.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { EButtonState } from "../constants/viewOptions";
//Packages
import React, { useEffect, useState } from "react";

interface ButtonProps {
  /**
   * Button contents.
   */
  content?: React.ReactNode;
  /**
   * Current visual state of the button.
   */
  state?: EButtonState;
  /**
   * Auto toggle button state on click.
   */
  autoToggle?: boolean;

  onClick?: (params: any) => void;
  /**
   * Extra class name to add and change the CSS.
   */
  extraClassName?: string;
  /**
   * Text that will be shown to the user when hovering the button.
   */
  hoverText?: string;
  /**
  * Icon added to the end of the btn
  */
  postIcon?: React.ReactNode;
}

/**
 * UI component that executes a function when clicked.
 */
export const Button = ({
  content = "Button",
  state = EButtonState.unactive,
  autoToggle = false,
  onClick = (): void => { },
  extraClassName = "",
  hoverText = "",
  postIcon,
}: ButtonProps) => {

  const [buttonState, setButtonState] = useState<EButtonState>(state);

  useEffect(() => {
    setButtonState(state);
  }, [state]);

  const buttonClassState = buttonState !== EButtonState.unactive ? EButtonState[buttonState] : "";
  return (
    <button title={hoverText} type="button" className={`btn ${extraClassName} ${buttonClassState}`}
      onClick={(): void => {
        onClick(buttonState);

        if (autoToggle) {
          if (buttonState === EButtonState.unactive)
            setButtonState(EButtonState.active);
          else
            setButtonState(EButtonState.unactive);
        }
      }}
    >
      <div className="btn-content">
        <div style={{ width: "100%", overflow: "hidden" }}> {content} </div>
        {postIcon ? <div className="btn-icon-content"> {postIcon} </div> : ""}
      </div>
    </button >
  );
};
