/**
 * @fileoverview This file creates a network controller based on the perspectiveData. Also mantains the dataColumn of this network
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */

//Namespaces
import { ViewOptions, AppLayout } from '../namespaces/ViewOptions';
import { PerspectiveInfo, UserData, CommunityData } from '../namespaces/perspectivesTypes';
//Packages
import { useEffect, useState, useRef } from "react";
//Local files
import { DataColumn } from "./DataColumn";
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
    //Object with all the functions that will change the state of the network
    sf: StateFunctions;
    //Current selected node
    selectedNodeId: undefined | number;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const PerspectiveView = ({
    perspectiveInfo,
    viewOptions,
    layout,
    isFirstPerspective = true,
    sf,
    selectedNodeId,
}: PerspectiveViewProps) => {


    const [netManager, setNetManager] = useState<NetworkController | undefined>();

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>();
    const [selectedNode, setSelectedNode] = useState<UserData | undefined>();

    const [info, setInfo] = useState<PerspectiveInfo>(perspectiveInfo);
    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInfo(perspectiveInfo);
    }, [perspectiveInfo]);

    ViewOptionsUseEffect(viewOptions, netManager);

    useEffect(() => {
        if (selectedNodeId === undefined) {
            //If no node id is selected, we clear the node dataTable info
            setSelectedNode(undefined);

        } else {
            //If its a number, it means the user clicked a node in some perspective. So we update the node table and the community table
            const nodeData = netManager!.eventsController.nodeClicked(selectedNodeId);
            setSelectedNode(nodeData);
            setSelectedCommunity(netManager!.bbController.comData[nodeData.implicit_community]);
        }
    }, [selectedNodeId]);

    useEffect(() => {
        if (netManager === undefined && visJsRef !== null && visJsRef !== undefined) {
            sf.setSelectedCommunity = setSelectedCommunity;

            setNetManager(new NetworkController(info, visJsRef.current!, viewOptions, sf));
        }

    }, [visJsRef]);

    const dataCol = <DataColumn
        tittle={info?.info.name}
        node={selectedNode}
        community={selectedCommunity}
        viewOptions={viewOptions}
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


function ViewOptionsUseEffect(viewOptions: ViewOptions, netManager: NetworkController | undefined) {
    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.updateNodeDimensions(viewOptions.LegendConfig);
        }
    }, [viewOptions.LegendConfig]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.hideLabels(viewOptions.HideLabels);
        }
    }, [viewOptions.HideLabels]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.changeEdgeWidth(viewOptions.EdgeWidth, netManager.options);
            netManager.net.setOptions(netManager.options);
            netManager.edges.update(netManager.edges);
        }
    }, [viewOptions.EdgeWidth]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.hideUnselectedEdges(viewOptions.HideEdges);
        }
    }, [viewOptions.HideEdges]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.createNodeDimensionStrategy(viewOptions);
        }
    }, [viewOptions.Border]);
}
