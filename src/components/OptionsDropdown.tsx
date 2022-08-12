//WIP component
import React, { useState, useEffect } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";
import { TresholdSlider } from "./tresholdSlider";
import { ButtonState, tbOptions } from "../constants/toolbarOptions";


interface OptionsDropdownProps {
    //On click handler for hide labels option
    onHideLabels: (newValue: boolean) => boolean;
    //On click handler for hide edges option
    onHideEdges: (newValue: boolean) => boolean;
    //On click handler for variable edge width option
    onEdgeWidth: (newValue: boolean) => boolean;
    //On click handler for border option
    onBorder: (newValue: boolean) => boolean;
}

const initialState = new Array();
const init = () => {
    initialState.push(tbOptions.initialHideLabels);
    initialState.push(tbOptions.initialHideEdges);
    initialState.push(tbOptions.initialEdgeWidth);
    initialState.push(tbOptions.initialBorder);
}
init();
/**
 * Dropdown component
 */
export const OptionsDropdown = ({
    onHideLabels,
    onHideEdges,
    onEdgeWidth,
    onBorder,
}: OptionsDropdownProps) => {

    const [selectedItems, setSelectedOptions] = useState<Array<ButtonState>>(initialState);

    const onClick = (index: number, realOnclick: Function) => {
        if (selectedItems[index] !== ButtonState.loading) {
            const savedState = selectedItems[index];

            const newSelected = Object.assign(new Array(), selectedItems);
            newSelected[index] = ButtonState.loading;
            setSelectedOptions(newSelected);

            if (realOnclick(savedState !== ButtonState.active)) {
                const newSelected = Object.assign(new Array(), selectedItems);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setSelectedOptions(newSelected);
            } else {
                const newSelected = Object.assign(new Array(), selectedItems);
                newSelected[index] = savedState === ButtonState.active ? ButtonState.inactive : ButtonState.active;
                setSelectedOptions(newSelected);
            }
        }
    }

    const optionsButtons = [
        <Button
            content="Hide node labels"
            onClick={() => { onClick(0, onHideLabels); }}
            state={selectedItems[0]}
            key={0}
        />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { onClick(1, onHideEdges); }}
            state={selectedItems[1]}
            key={1}
        />,
        // <hr />,
        // <TresholdSlider
        //     onInput = {thresholdChange}
        // />,
        <hr key={3} />,
        <Button
            content="Make edge width variable"
            onClick={() => { onClick(2, onEdgeWidth); }}
            state={selectedItems[2]}
            key={4}
        />,
        <hr key={5} />,
        <Button
            content="Activate nodes borders"
            onClick={() => { onClick(3, onBorder); }}
            state={selectedItems[3]}
            key={6}
        />]

    return (
        <Dropdown
            items={[optionsButtons]}
            content="Options"
            extraClassName="dropdown-light"
        />
    );
};