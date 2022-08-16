import React, { useEffect, useState, useRef } from "react";

import { DataSet } from "vis-data";
import { Data, Network, Node, Edge } from "vis-network";
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

const options = {
    autoResize: true,
    groups: {
        useDefaultGroups: false
    },
    physics: {
        enabled: false,
    },
    interaction: {
        zoomView: true,
        dragView: true,
        hover: false,
        hoverConnectedEdges: false,
    },
    layout: {
        improvedLayout: false,
    }
};
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

    const [info, setInfo] = useState<PerspectiveData | undefined>(perspectiveInfo); 

    useEffect(() => {
        setInfo(perspectiveInfo);
    }, [perspectiveInfo]);

    //TODO enlazar el nodo/comunidad de la dataCol con el selectedNode/selectedCommunity


    const nodes = new DataSet(info?.data.users as Node[]);
    const edges = new DataSet(info?.data.similarity as Edge[]);


    const data = {
        nodes,
        edges
    };

    const visJsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const network =
            visJsRef.current &&
            new Network(visJsRef.current, data as Data, options);

        network?.on("click", (event) => {

            if (event.nodes.length > 0) {
                const node = nodes.get(event.nodes[0]);
                //TODO evitar hacer esto con los nodos
                (node as any)["color"] = { background: "black" }
                data.nodes.update(node);
                setSelectedNode(node);
            }
        });

    }, [visJsRef, nodes, edges]);

    const dataCol = <DataColumn
        tittle={info?.info.name}
        node={selectedNode}
        community={info?.data.communities[0]}
    />

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
