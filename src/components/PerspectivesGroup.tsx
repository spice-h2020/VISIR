import React, { useEffect, useState } from "react";
import { PerspectivePair, PerspectiveData } from "../constants/perspectivesTypes";
import { PerspectiveView } from "./perspectiveView";
import { Layouts } from "../constants/perspectivesTypes"

interface PerspectivesGroupProps {
    //Pairs of networks that wil be active and interactuable
    perspectivePairs: PerspectivePair[],
    //Type of the layout of the pair networks
    layout: Layouts,
}

/**
 * Container that draw each active perspective
 */
export const PerspectivesGroups = ({
    perspectivePairs,
    layout,
}: PerspectivesGroupProps) => {

    const [pairs, setPairs] = useState<PerspectivePair[]>(perspectivePairs);

    useEffect(() => {
        setPairs(perspectivePairs);
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
                            content={perspective?.key}
                        />
                    </div>
                )
                break;
            case 2:
                perspectivesComponents.push(
                    <div className={`pairNetwork ${Layouts[layout]}`}>
                        <PerspectiveView
                            content={pairs[i].perspectives[0]?.key}
                        />
                        <PerspectiveView
                            content={pairs[i].perspectives[1]?.key}
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