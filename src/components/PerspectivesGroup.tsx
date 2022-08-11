import React, { useEffect, useState } from "react";
import { PerspectivePair, PerspectiveData } from "../constants/perspectivesTypes";
import { PerspectiveView } from "./perspectiveView";
import { Layouts } from "../constants/perspectivesTypes"

interface PerspectivesGroupProps {
    perspectivePairs: PerspectivePair[],
    layout?: Layouts,
}

/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool
 */
export const PerspectivesGroups = ({
    perspectivePairs,
    layout,
}: PerspectivesGroupProps) => {

    console.log("perspective group render")
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
                    <div className="pairNetwork">
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