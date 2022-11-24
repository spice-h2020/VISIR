/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * The button can also be disabled to negate any interaction with it, or change its colors with the state : ButtonState
 * property.
 * If auto toggle parameter is true, the button will automaticaly change its state between active and 
 * unactive when clicked.
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


interface LoadingFrontPanelProps {
    /**
     * Message shown to the user.
     */
    message?: React.ReactNode;
    /**
     * If the loading panel is active or not.
     */
    isActive: boolean;
}

/**
 * UI component that executes a function when clicked.
 */
export const LoadingFrontPanel = ({
    message = "",
    isActive,
}: LoadingFrontPanelProps) => {

    const [active, setActive] = useState<boolean>(isActive);
    const [numDots, setNumdots] = useState<number>(1);

    useEffect(() => {
        setActive(isActive);
    }, [isActive]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNumdots(prev => Math.max((prev + 1) % 4, 1));
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    const darkBackground: React.CSSProperties = JSON.parse(JSON.stringify(darkBackgroundStyle));
    darkBackground.display = active ? "flex" : "none";

    return (

        <div style={darkBackground}>
            <div style={innerPanelStyle} >
                <Spinner scale={1} />
                <span style={loadingText}> {message + '.'.repeat(numDots)} </span>
            </div>
        </div >
    );
};
