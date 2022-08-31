/**
 * @fileoverview This file creates a network controller based on the perspectiveData. Also mantains the dataColumn of this network
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */

//Constants
import { ViewOptions, AppLayout } from '../constants/viewOptions';
import { PerspectiveInfo, UserData, CommunityData } from '../constants/perspectivesTypes';
import { StateFunctions } from '../constants/auxTypes';
//Packages
import { useEffect, useState, useRef } from "react";
//Local files
import { DataColumn } from "./DataColumn";
import NetworkController from '../controllers/networkController';
import NodeDimensionStrategy from '../managers/dimensionStrategy';


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
    //Current node dimension strategy
    dimStrat: NodeDimensionStrategy | undefined;
    //Id of the current network on the focus
    networkFocusID: undefined | number
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
    dimStrat,
    networkFocusID,
}: PerspectiveViewProps) => {

    const [netManager, setNetManager] = useState<NetworkController | undefined>();

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>();
    const [selectedNode, setSelectedNode] = useState<UserData | undefined>();

    const [info, setInfo] = useState<PerspectiveInfo>(perspectiveInfo);
    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInfo(perspectiveInfo);
    }, [perspectiveInfo]);

    useEffect(() => {
        if (netManager !== undefined && networkFocusID !== undefined) {
            netManager.eventsController.networkFocusID = networkFocusID;
        }

    }, [networkFocusID])

    ViewOptionsUseEffect(viewOptions, netManager);

    useEffect(() => {
        if (selectedNodeId === undefined) {
            //If no node id is selected, we clear the node dataTable info
            setSelectedNode(undefined);
            if (netManager !== undefined) {
                netManager.eventsController.removeSelectedItems();

                if (networkFocusID !== info.details.id)
                    netManager.eventsController.zoomOut();
            }
        } else {
            //If its a number, it means the user clicked a node in some perspective. So we update the node table and the community table
            if (netManager !== undefined) {
                const nodeData = netManager.eventsController.nodeClicked(selectedNodeId);
                setSelectedNode(nodeData);
                setSelectedCommunity(netManager.bbController.comData[nodeData.implicit_community]);
            }
        }
    }, [selectedNodeId]);

    useEffect(() => {
        if (netManager === undefined && visJsRef !== null && visJsRef !== undefined) {
            sf.setSelectedCommunity = setSelectedCommunity;

            if (networkFocusID === undefined) {
                sf.setNetworkFocusId(info.details.id);
            }
            setNetManager(new NetworkController(info, visJsRef.current!, viewOptions, sf, dimStrat, networkFocusID!));
        }

    }, [visJsRef]);

    const dataCol = <DataColumn
        tittle={info?.details.name}
        node={selectedNode}
        community={selectedCommunity}
        viewOptions={viewOptions}
    />

    if (isFirstPerspective === undefined || isFirstPerspective === true || layout === AppLayout.Vertical) {
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

/**
 * Creates a series of UseEffect functions that will be executed when viewOptions object changes. They will update the network in diferent ways depending on the option
 * @param viewOptions object that will trigger the useEffects.
 * @param netManager will execute the changes once useEffects are triggered
 */
function ViewOptionsUseEffect(viewOptions: ViewOptions, netManager: NetworkController | undefined) {
    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.updateNodeDimensions(viewOptions.legendConfig);
        }
    }, [viewOptions.legendConfig]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.hideLabels(viewOptions.hideLabels);
        }
    }, [viewOptions.hideLabels]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.changeEdgeWidth(viewOptions.edgeWidth, netManager.options);
            netManager.net.setOptions(netManager.options);
            netManager.edges.update(netManager.edges);
        }
    }, [viewOptions.edgeWidth]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.hideUnselectedEdges(viewOptions.hideEdges);
        }
    }, [viewOptions.hideEdges]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.createNodeDimensionStrategy(viewOptions.border);
        }
    }, [viewOptions.border]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.updateEdgesThreshold(viewOptions.edgeThreshold);
        }
    }, [viewOptions.edgeThreshold]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.deleteEdges(viewOptions);
        }
    }, [viewOptions.deleteEdges]);
}
