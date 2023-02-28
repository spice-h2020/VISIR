/**
 * @fileoverview This files creates popup that darken the background. The popup has a customizable loading text
 * and a spinner spining while loading.
 * When the popup appears, it does it in a transition. When it dissapear, it does it instantly.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React, { useEffect, useState } from "react";
//Local files
import { Spinner } from "./spinner";

export interface ILoadingState {
    isActive: boolean,
    msg?: React.ReactNode,
}

interface LoadingFrontPanelProps {
    /**
     * State of the loading panel.
     */
    state: ILoadingState;
}

/**
 * UI component that shows loading feedback to the user.
 */
export const LoadingFrontPanel = ({
    state,
}: LoadingFrontPanelProps) => {
    const [active, setActive] = useState<boolean>(state?.isActive);
    const [numDots, setNumdots] = useState<number>(1);

    useEffect(() => {
        setActive(state.isActive);
    }, [state, state.isActive]);

    //Adds points to the end of the text every half seccond
    useEffect(() => {
        if (active) {
            const intervalId = setInterval(() => {
                setNumdots(prev => Math.max((prev + 1) % 4, 1));
            }, 500);

            return () => clearInterval(intervalId);
        }
    }, [active]);

    if (state.msg === undefined) {
        return <React.Fragment />
    }
    return (
        <div className={active ? "dark-background toVisibleAnim " : "dark-background toHiddenAnim"}>
            <div className="inner-loading-panel" >
                <Spinner scale={1} />
                <span className="loading-text"> {state.msg + '.'.repeat(numDots)} </span>
            </div>
        </div >
    );
};
