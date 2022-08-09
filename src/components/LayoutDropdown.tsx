import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { Dropdown } from "./Dropdown";

enum Layouts {
    Horizontal,
    Vertical,
}

const initialSource = Layouts.Horizontal
/**
 * Dropdown component
 */
export const LayoutDropdown = () => {

    const initialState = new Array();
    for (let i = 0; i < Object.keys(Layouts).length; i++) {
        if (i === initialSource) {
            initialState.push(true);
        } else {
            initialState.push(false);
        }
    }

    const [selectedItems, setSelectedOptions] = useState<Array<boolean>>(initialState);

    function changeLayout(key: Layouts) {
        switch (key) {
            case Layouts.Horizontal:
                console.log("Change to Horizontal");
                setSelectedOptions([true, false]);
                break;
            case Layouts.Vertical:
                console.log("Change to Vertical");
                setSelectedOptions([false, true]);
                break;
        }
    }
    const LayoutButtons = [
        <Button
            content="Horizontal"
            onClick={() => { changeLayout(Layouts.Horizontal) }}
            state={selectedItems[0]}
        />,
        <Button
            content="Vertical"
            onClick={() => { changeLayout(Layouts.Vertical) }}
            state={selectedItems[1]}
        />]

    return (
        <Dropdown
            items={LayoutButtons}
            mainLabel="Layout"
            extraClassName="dropdown-light"
        />
    );
};