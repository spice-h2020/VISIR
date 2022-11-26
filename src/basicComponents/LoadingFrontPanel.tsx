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

const darkBackgroundStyle: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.3)",

    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",

    zIndex: 100,
}

const loadingText: React.CSSProperties = {
    marginTop: "1rem",
}

const innerPanelStyle: React.CSSProperties = {
    display: "flex",
    width: "30vw",
    height: "30vh",

    //Center the panel in the view screen
    position: "fixed",
    top: "50%",
    left: "50%",
    marginTop: "-15vh",
    marginLeft: "-15vw",

    background: "var(--bodyBackground)",
    borderRadius: "15px",

    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    flexWrap: "nowrap",
};


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
        const intervalId = setInterval(() => {
            setNumdots(prev => Math.max((prev + 1) % 4, 1));
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    const darkBackground: React.CSSProperties = JSON.parse(JSON.stringify(darkBackgroundStyle));

    return (

        <div style={darkBackground} className={active ? "toVisibleAnim" : "toHiddenAnim"}>
            <div style={innerPanelStyle} >
                <Spinner scale={1} />
                <span style={loadingText}> {state.msg + '.'.repeat(numDots)} </span>
            </div>
        </div >
    );
};
