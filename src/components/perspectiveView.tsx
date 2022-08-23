/**
 * @fileoverview This file creates a Vis.js network based on the perspectiveData and also mantains the dataColumn of this network
 * @package It requires React package. 
 * @package It requires vis-network package. 
 * @package It requires vis-data package. 
 * @author Marco Expósito Pérez
 */

//TODO currently is highly on development

//Namespaces
import { ViewOptions, AppLayout } from '../namespaces/ViewOptions';
import { PerspectiveInfo, UserData, CommunityData } from '../namespaces/perspectivesTypes';
import { edgeConst } from '../namespaces/edges';

//Packages
import { useEffect, useState, useRef } from "react";
import { DataSet } from "vis-data";
import { Data, Network, Edge, Options } from "vis-network";

//Local files
import { DataColumn } from "./DataColumn";
import NodeVisuals from "../controllers/nodeVisuals";
import BoundingBoxes from '../controllers/boundingBoxes';
import NetworkEvents from '../controllers/networkEvents';
import EdgeVisuals from '../controllers/edgeVisuals';

interface PerspectiveViewProps {
    //Data of this perspective view.
    perspectiveInfo: PerspectiveInfo;
    //Options that change the view of a perspective
    viewOptions: ViewOptions;
    //Function to select a node
    layout: AppLayout;
    //Optional parameter to know if the its the first perspective of the pair, to mirror the table position in the horizontal layout
    isFirstPerspective?: boolean;
    //Current selected node
    selectedNode: UserData | undefined;
    //Function to select a node
    setSelectedNode: Function;
    //Function to setup the legend's data
    setLegendData: Function,
}



let options: Options;
let network: Network | null | undefined = undefined;
let nodes: DataSet<UserData, "id"> | undefined = undefined;
let edges: DataSet<Edge, "id"> | undefined = undefined;
let boundingBoxes: BoundingBoxes;
let userVisuals: NodeVisuals;
let edgeVisuals: EdgeVisuals;

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
    setLegendData,
}: PerspectiveViewProps) => {

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>();
    const [info, setInfo] = useState<PerspectiveInfo>(perspectiveInfo);
    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInfo(perspectiveInfo);
    }, [perspectiveInfo]);

    ViewOptionsUseEffect(viewOptions);

    useEffect(() => {   //TODO asegurarse de que la comunidad que se muestra en cada tabla  es la correspondiente a cada network
        if (selectedNode !== undefined && boundingBoxes !== undefined) {
            setSelectedCommunity(boundingBoxes.comData[selectedNode.implicit_community]);
        } else {
            setSelectedCommunity(undefined);
        }
    }, [selectedNode]);

    useEffect(() => {
        if (options === undefined) {
            options = getOptions(viewOptions, options);
        }

        if (nodes === undefined) {
            nodes = new DataSet(info.data.users);
            userVisuals = new NodeVisuals(info.data, nodes, setLegendData, viewOptions);
        }

        if (edges === undefined) {
            edges = new DataSet(info.data.similarity);
            edgeVisuals = new EdgeVisuals(viewOptions, edges, options)
        }

        if (network === undefined) {
            network = visJsRef.current && new Network(visJsRef.current, { nodes, edges } as Data, options);
            boundingBoxes = new BoundingBoxes(info.data.communities, info.data.users, network!);
            const networkEvents = new NetworkEvents(network!, nodes, edges, boundingBoxes, userVisuals, edgeVisuals, setSelectedNode, setSelectedCommunity);
        }

    }, [visJsRef, nodes, edges]);

    const dataCol = <DataColumn
        tittle={info?.info.name}
        node={selectedNode}
        community={selectedCommunity}
    />

    if (isFirstPerspective || layout === AppLayout.Vertical) {
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



const getOptions = (viewOptions: ViewOptions, options: Options | undefined): Options => {
    options = {
        edges: {
            scaling: {
                min: edgeConst.minWidth,
                max: viewOptions.EdgeWidth ? edgeConst.maxWidth : edgeConst.minWidth,
                label: {
                    enabled: false
                }
            },
            color: {
                color: edgeConst.defaultColor,
                highlight: edgeConst.selectedColor
            },
            font: {
                strokeWidth: edgeConst.LabelStrokeWidth,
                size: edgeConst.LabelSize,
                color: edgeConst.LabelColor,
                strokeColor: edgeConst.LabelStrokeColor,
                align: edgeConst.LabelAlign,
                vadjust: edgeConst.labelVerticalAdjust
            },
            smooth: false
        },
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

    return options;
}

function ViewOptionsUseEffect(viewOptions: ViewOptions) {
    useEffect(() => {
        if (userVisuals !== undefined && nodes !== undefined) {
            userVisuals.updateNodeDimensions(viewOptions.LegendConfig);
        }
    }, [viewOptions.LegendConfig]);

    useEffect(() => {
        if (userVisuals !== undefined && nodes !== undefined) {
            userVisuals.hideLabels(viewOptions.HideLabels);
        }
    }, [viewOptions.HideLabels]);

    useEffect(() => {
        if (edgeVisuals !== undefined && nodes !== undefined) {
            edgeVisuals.changeEdgeWidth(viewOptions.EdgeWidth, options);
            network?.setOptions(options);
            edges?.update(edges);
        }
    }, [viewOptions.EdgeWidth]);

    useEffect(() => {
        if (edgeVisuals !== undefined && nodes !== undefined) {
            edgeVisuals.hideUnselectedEdges(viewOptions.HideEdges);
        }
    }, [viewOptions.HideEdges]);

    useEffect(() => {
        if (userVisuals !== undefined && nodes !== undefined) {
            userVisuals.createNodeDimensionStrategy(viewOptions);
        }
    }, [viewOptions.Border]);
}
