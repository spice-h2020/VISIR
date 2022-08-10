//WIP component
import React, { useEffect, useState } from "react";

import '../style/Tooltip.css';

interface TooltipProps {
    /**
     * Components that will be aligned to the leftside of the navbar.
     */
    alignment?: "top" | "right" | "bottom" | "left";

    /**
     * Active state of the tooltip
     */
    state?: boolean;

    /**
     * Content of the tooltip
     */
    content: React.ReactNode;

    /**
     * Show arrow
     */
    showArrow?: boolean;
}

/**
 * Dropdown component
 */
export const Tooltip = ({
    alignment = "bottom",
    state = false,
    content,
    showArrow = true,
}: TooltipProps) => {

    const [tooltipState, setTooltipState] = useState<boolean>(state);

    useEffect(() => {
        setTooltipState(state);
    }, [state]);

    return (
        <div className={`tooltip ${tooltipState ? "active" : ""}`} >
            <div className={`tooltiptext ${alignment}`}>
                {content}
                {showArrow ? <div className="tooltipArrow"> </div> : ""}
            </div >
        </div >
    );
};