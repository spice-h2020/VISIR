import React, { useEffect, useState } from "react";

import './Tooltip.css';

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
    content: string;
}

/**
 * Dropdown component
 */
export const Tooltip = ({
    alignment = "bottom",
    state = false,
    content,
}: TooltipProps) => {

    const [tooltipState, setTooltipState] = useState<boolean>(state);

    useEffect(() => {
        setTooltipState(state);
    }, [state]);

    return (
        <div className={`tooltip ${tooltipState ? "active" : ""}`} >
            <span className={`tooltiptext ${alignment}`}>
                <div dangerouslySetInnerHTML={{ __html: content }} />

                <div className="tooltipArrow"> </div>
            </span >
        </div >
    );
};