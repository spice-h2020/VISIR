import React, { useState, useEffect } from "react";

import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import { TresholdSlider } from "./tresholdSlider";

const initialHideLabels = true;
const initialHideEdges = false;
const initialEdgeWidth = false;
const initialBorder = false;
/**
 * Dropdown component
 */
export const OptionsDropdown = () => {

    const [selectedItems, setSelectedOptions] = useState<Array<boolean>>([initialHideLabels, initialHideEdges, initialEdgeWidth, initialBorder]);

    function hideLabels() {
        const newState = selectedItems;
        newState[0] = !newState[0];

        setSelectedOptions(newState)

        console.log("Toggle labels");
    }

    function hideEdges() {
        const newState = selectedItems;
        newState[1] = !newState[1];

        setSelectedOptions(newState)

        console.log("Toggle Edges");
    }

    function thresholdChange(value: number) {
        console.log(`Threshold change to ${value}`);
    }

    function changeEdgeWidth() {
        const newState = selectedItems;
        newState[2] = !newState[2];

        setSelectedOptions(newState)

        console.log("Toggle Width");
    }

    function activateNodeBorder() {
        const newState = selectedItems;
        newState[3] = !newState[3];

        setSelectedOptions(newState)

        console.log("Toggle Border");
    }

    const fileSourceButtons = [
        <Button
            content="Hide node labels"
            onClick={() => { hideLabels() }}
            state={selectedItems[0]}
        />,
        <Button
            content="Hide unselected Edges"
            onClick={() => { hideEdges() }}
            state={selectedItems[1]}
        />,
        <hr/>,
        // <TresholdSlider
        //     onInput = {thresholdChange}
        // />,
        <hr/>,
        <Button
            content="Make edge width variable"
            onClick={() => { changeEdgeWidth() }}
            state={selectedItems[2]}
        />,
        <hr/>,
        <Button
            content="Activate nodes borders"
            onClick={() => { activateNodeBorder() }}
            state={selectedItems[3]}
        />]

    return (
        <Dropdown
            items={fileSourceButtons}
            mainLabel="Options"
            extraClassName="dropdown-light"
        />
    );
};