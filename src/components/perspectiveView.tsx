import React, { useEffect, useState } from "react";
import '../style/button.css';
import { ButtonState } from '../constants/toolbarOptions';

interface PerspectiveViewProps {
    //Button contents.
    content?: React.ReactNode;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const PerspectiveView = ({
    content = "Perspective",
}: PerspectiveViewProps) => {


    return (
        <div>
            {content}
        </div>
    );
};
