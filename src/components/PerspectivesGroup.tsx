import React, { useEffect, useState } from "react";
import { PerspectivePair, PerspectiveData } from "../constants/perspectivesTypes";
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

    const [pairs, setPairs] = useState<PerspectivePair[]>(perspectivePairs);
    const [selectedNode, setSelectedNode] = useState<number>();


    useEffect(() => {
        console.log(perspectivePairs)
        setPairs(perspectivePairs);

        if(perspectivePairs.length === 0){
            setSelectedNode(undefined);
        }
    }, [perspectivePairs]);

    const perspectivesComponents = new Array();

    for (let i = 0; i < pairs.length; i++) {
        switch (pairs[i].size()) {
            case 0:
                break;
            case 1:
                const perspective = pairs[i].getSingle();
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
                break;
            case 2:
                perspectivesComponents.push(
                    <div className={`pairNetwork ${Layouts[layout]}`}>
                        <PerspectiveView
                            perspectiveInfo={pairs[i].perspectives[0]}
                            viewOptions={viewOptions}
                            layout={layout}
                            isFirstPerspective={true}
                            selectedNode={selectedNode}
                            setSelectedNode={setSelectedNode}
                        />
                        <PerspectiveView
                            perspectiveInfo={pairs[i].perspectives[1]}
                            viewOptions={viewOptions}
                            layout={layout}
                            isFirstPerspective={false}
                            selectedNode={selectedNode}
                            setSelectedNode={setSelectedNode}
                        />
                    </div>
                )
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