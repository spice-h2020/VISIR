import React, { useEffect, useState } from "react";
import '../style/button.css';
import { ButtonState, ViewOptions } from '../constants/toolbarOptions';
import { PerspectiveData } from '../constants/perspectivesTypes';

interface PerspectiveViewProps {
    //Data of this perspective view.
    perspectiveInfo: PerspectiveData | undefined;
    //Options that change the view of a perspective
    viewOptions: ViewOptions;
    //Optional parameter to know if the its the first perspective of the pair, to mirror the table position in the horizontal layout
    isFirstPerspective?: boolean;
    //Current selected node
    selectedNode: number | undefined;
    //Function to select a node
    setSelectedNode: Function;
}

const nodes = [
    {
        "id": 1,
        "label": 1,
        "group": 5,
        "explicit_community": {
            "Selected language": "ENG",
            "Selected age": "Boomer",
            "Selected avatar": "p\u00e4ssi"
        }
    },
    {
        "id": 2,
        "label": 2,
        "group": 5,
        "explicit_community": {
            "Selected language": "ENG",
            "Selected age": "GenX",
            "Selected avatar": "p\u00e4ssi"
        }
    },
]

/**
 * Basic UI component that execute a function when clicked
 */
export const PerspectiveView = ({
    perspectiveInfo,
    viewOptions,
    isFirstPerspective = true,
    selectedNode,
    setSelectedNode,
}: PerspectiveViewProps) => {
    console.log(perspectiveInfo);
    
    if (isFirstPerspective) {
        return (
            <div className="row">
                <div className="col-4">
                    dataTable
                </div>
                <div className="col-8">
                    {perspectiveInfo?.info.name}
                </div>
            </div >
        );
    } else {
        return (
            <div className="row">
                <div className="col-8">
                    {perspectiveInfo?.info.name}
                </div>
                <div className="col-4">
                    dataTable
                </div>
            </div >
        );
    }
};
