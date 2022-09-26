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

    }, [networkFocusID, netManager])

    ViewOptionsUseEffect(viewOptions, netManager, sf);

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
    }, [selectedNodeId, info.details.id, netManager, networkFocusID]);

    useEffect(() => {
        if (netManager === undefined && visJsRef !== null && visJsRef !== undefined) {
            sf.setSelectedCommunity = setSelectedCommunity;

            if (networkFocusID === undefined) {
                sf.setNetworkFocusId(info.details.id);
            }
            setNetManager(new NetworkController(info, visJsRef.current!, viewOptions, sf, dimStrat, networkFocusID!));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visJsRef]);

    const dataCol = <DataColumn
        tittle={info?.details.name}
        node={selectedNode}
        community={selectedCommunity}
        viewOptions={viewOptions}
    />

    const networkContainer = <div className="network-container" key={1} ref={visJsRef} />

    return (
        <div className="perspective row" key={10}>
            <div className="col-4" key={1}>
                {dataCol}
            </div>
            <div className="col-8" key={0}>
                {networkContainer}
            </div>
        </div >
    );
};

/**
 * Creates a series of UseEffect functions that will be executed when viewOptions object changes. They will update the network in diferent ways depending on the option
 * @param viewOptions object that will trigger the useEffects.
 * @param netManager will execute the changes once useEffects are triggered
 */
function ViewOptionsUseEffect(viewOptions: ViewOptions, netManager: NetworkController | undefined, sf: StateFunctions) {
    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.updateNodeDimensions(viewOptions.legendConfig);
        }
    }, [viewOptions.legendConfig, netManager]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.nodeVisuals.hideLabels(viewOptions.hideLabels);
        }
    }, [viewOptions.hideLabels, netManager]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.changeEdgeWidth(viewOptions.edgeWidth, netManager.options);
            netManager.net.setOptions(netManager.options);
            netManager.edges.update(netManager.edges);
        }
    }, [viewOptions.edgeWidth, netManager]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.hideUnselectedEdges(viewOptions.hideEdges);
        }
    }, [viewOptions.hideEdges, netManager]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.updateEdgesThreshold(viewOptions.edgeThreshold);
        }
    }, [viewOptions.edgeThreshold, netManager]);

    useEffect(() => {
        if (netManager !== undefined) {
            netManager.edgeVisuals.deleteEdges(viewOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewOptions.deleteEdges, netManager]);
}
