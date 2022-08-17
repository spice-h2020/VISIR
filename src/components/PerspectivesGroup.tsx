import React, { useEffect, useState } from "react";
import { PerspectivePair, PerspectiveData, UserData } from "../constants/perspectivesTypes";
import { PerspectiveView } from "./PerspectiveView";

import { Layouts } from "../constants/perspectivesTypes"
import { ViewOptions } from '../constants/toolbarOptions';

interface PerspectivesGroupProps {
    //Pairs of networks that wil be active and interactuable
    perspectivePairs: PerspectivePair[],
    //Type of the layout of the pair networks
    layout: Layouts,
    //View options for all networks
    viewOptions: ViewOptions,
}

/**
 * Container that draw each active perspective
 */
export const PerspectivesGroups = ({
    perspectivePairs,
    layout,
    viewOptions,
}: PerspectivesGroupProps) => {

    const [selectedNode, setSelectedNode] = useState<UserData | undefined>();

    if (perspectivePairs.length === 0 && selectedNode !== undefined) {
        setSelectedNode(undefined);
    }

    const perspectivesComponents = new Array();

    for (let i = 0; i < perspectivePairs.length; i++) {
        switch (perspectivePairs[i].size()) {
            case 0:
                break;
            case 1:
                const perspective = perspectivePairs[i].getSingle();
                if (perspective !== undefined) {
                    perspectivesComponents.push(
                        <div className="singleNetwork">
                            <PerspectiveView
                                perspectiveInfo={perspective}
                                viewOptions={viewOptions}
                                layout={layout}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                            />
                        </div>
                    )
                }
                break;
            case 2:
                const perspectiveA = perspectivePairs[i].perspectives[0];
                const perspectiveB = perspectivePairs[i].perspectives[1];

                if (perspectiveA !== undefined && perspectiveB !== undefined) {
                    perspectivesComponents.push(
                        <div className={`pairNetwork ${Layouts[layout]}`}>
                            <PerspectiveView
                                perspectiveInfo={perspectiveA}
                                viewOptions={viewOptions}
                                layout={layout}
                                isFirstPerspective={true}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                            />
                            <PerspectiveView
                                perspectiveInfo={perspectiveB}
                                viewOptions={viewOptions}
                                layout={layout}
                                isFirstPerspective={false}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                            />
                        </div>
                    )
                }
                break;
        }
    }

    return (
        <div className="perspectives-containers">
            {perspectivesComponents.map((item: any, index: number): JSX.Element => {
                return (<React.Fragment key={index}>{item}</React.Fragment>);
            })}

        </div>
    );
};