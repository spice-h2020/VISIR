import React, { useEffect, useState, useRef } from "react";

import { Network } from "vis-network";
import { ButtonState, ViewOptions } from '../constants/toolbarOptions';
import { Layouts, PerspectiveData } from '../constants/perspectivesTypes';
import { DataColumn } from "./DataColumn";

interface PerspectiveViewProps {
    //Data of this perspective view.
    perspectiveInfo: PerspectiveData | undefined;
    //Options that change the view of a perspective
    viewOptions: ViewOptions;
    //Function to select a node
    layout: Layouts;
    //Optional parameter to know if the its the first perspective of the pair, to mirror the table position in the horizontal layout
    isFirstPerspective?: boolean;
    //Current selected node
    selectedNode: number | undefined;
    //Function to select a node
    setSelectedNode: Function;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const PerspectiveView = ({
    perspectiveInfo,
    viewOptions,
    layout,
    isFirstPerspective = true,
    selectedNode,
    setSelectedNode,
}: PerspectiveViewProps) => {

    //TODO enlazar el nodo/comunidad de la dataCol con el selectedNode/selectedCommunity
    const dataCol = <DataColumn
        tittle={perspectiveInfo?.info.name}
        node={perspectiveInfo?.data.users[0]}
        community={perspectiveInfo?.data.communities[0]}
    />

    const nodes = [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
    ];

    const edges = [
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
    ];
    const visJsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const network =
            visJsRef.current &&
            new Network(visJsRef.current, { nodes, edges }, {});

    }, [visJsRef, nodes, edges]);

    if (isFirstPerspective || layout === Layouts.Vertical) {
        return (
            <div className="perspective row">
                <div className="col-4">
                    {dataCol}
                </div>
                <div className="col-8">
                    <div className="network-container" ref={visJsRef} />
                </div>
            </div >
        );
    } else {
        return (
            <div className="perspective row">
                <div className="col-8">
                    <div className="network-container" ref={visJsRef} />
                </div>
                <div className="col-4">
                    {dataCol}
                </div>
            </div >
        );
    }
};
