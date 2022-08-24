/**
 * @fileoverview This file creates a Vis.js network based on the perspectiveData and also mantains the dataColumn of this network
 * @package It requires React package. 
 * @package It requires vis-network package. 
 * @package It requires vis-data package. 
 * @author Marco Expósito Pérez
 */

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
import EventsController from '../controllers/eventsController';
import EdgeVisuals from '../controllers/edgeVisuals';
import NetworkController, { StateFunctions } from '../controllers/networkController';

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
    //Function to setup the tooltip info
    setTooltipInfo: Function,
    //Function to setup the tooltip position
    setTooltipPos: Function,
    //Function to activate/disable the tooltip
    setTooltipState: Function,
}


let netMan: NetworkController | undefined;

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
    setTooltipInfo,
    setTooltipPos,
    setTooltipState,
}: PerspectiveViewProps) => {

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>();
    const [info, setInfo] = useState<PerspectiveInfo>(perspectiveInfo);
    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInfo(perspectiveInfo);
    }, [perspectiveInfo]);

    ViewOptionsUseEffect(viewOptions);

    useEffect(() => {
        //TODO asegurarse de que la comunidad que se muestra en cada tabla  es la correspondiente a cada network
        if (selectedNode !== undefined && netMan !== undefined) {
            setSelectedCommunity(netMan.bbController.comData[selectedNode.implicit_community]);
        } else {
            setSelectedCommunity(undefined);
        }
    }, [selectedNode]);

    useEffect(() => {
        const sf: StateFunctions = {
            setSelectedCommunity: setSelectedCommunity,
            setSelectedNode: setSelectedNode,
            setTooltipInfo: setTooltipInfo,
            setTooltipPosition: setTooltipPos,
            setTooltipState: setTooltipState,
            setLegendData: setLegendData
        }

        netMan = new NetworkController(info, visJsRef, viewOptions, sf);

    }, [visJsRef]);

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


function ViewOptionsUseEffect(viewOptions: ViewOptions) {
    useEffect(() => {
        if (netMan !== undefined ) {
            netMan.nodeVisuals.updateNodeDimensions(viewOptions.LegendConfig);
        }
    }, [viewOptions.LegendConfig]);

    useEffect(() => {
        if (netMan !== undefined) {
            netMan.nodeVisuals.hideLabels(viewOptions.HideLabels);
        }
    }, [viewOptions.HideLabels]);

    useEffect(() => {
        if (netMan !== undefined) {
            netMan.edgeVisuals.changeEdgeWidth(viewOptions.EdgeWidth, netMan.options);
            netMan.net.setOptions(netMan.options);
            netMan.edges.update(netMan.edges);
        }
    }, [viewOptions.EdgeWidth]);

    useEffect(() => {
        if (netMan !== undefined) {
            netMan.edgeVisuals.hideUnselectedEdges(viewOptions.HideEdges);
        }
    }, [viewOptions.HideEdges]);

    useEffect(() => {
        if (netMan !== undefined) {
            netMan.nodeVisuals.createNodeDimensionStrategy(viewOptions);
        }
    }, [viewOptions.Border]);
}
