/**
 * @fileoverview This file creates a network controller based on the perspectiveData. Also mantains the dataColumn of this network
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ViewOptions } from '../constants/viewOptions';
import { PerspectiveInfo, UserData, CommunityData, PerspectiveState, PerspectiveData } from '../constants/perspectivesTypes';
import { SelectedObject, StateFunctions } from '../constants/auxTypes';
//Packages
import React, { useEffect, useState, useRef } from "react";
//Local files
import NetworkController from '../controllers/networkController';
import NodeDimensionStrategy from '../managers/dimensionStrategy';
import { DataTable } from './Datatable';

const networkContainer: React.CSSProperties = {
    margin: "0px 1.5% 15px 1.5%",
    height: "80vh",
    borderRadius: "10px",
    border: "1px solid var(--grayLineColor)",
    borderTop: "5px solid var(--primaryButtonColor)",
    boxSizing: "border-box",
    backgroundColor: "var(--headerBackground)",
}

interface PerspectiveViewProps {
    //Data of this perspective view.
    perspectiveData: PerspectiveData;
    //Options that change the view of a perspective
    viewOptions: ViewOptions;
    //Object with all the functions that will change the state of the network
    sf: StateFunctions;
    //Current selected Object. Can be nothing, a node or a community
    selectedObject: SelectedObject | undefined;
    //Current node dimension strategy
    dimStrat: NodeDimensionStrategy | undefined;
    //Id of the current network on the focus
    networkFocusID: undefined | string;

    perspectiveState: PerspectiveState;

    mirror?: boolean;
}

/**
 * Basic UI component that execute a function when clicked
 */
export const PerspectiveView = ({
    perspectiveData,
    viewOptions,
    sf,
    selectedObject,
    dimStrat,
    networkFocusID,
    perspectiveState,
    mirror = false,
}: PerspectiveViewProps) => {

    const [netManager, setNetManager] = useState<NetworkController | undefined>();

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityData>();
    const [selectedNode, setSelectedNode] = useState<UserData | undefined>();

    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (netManager !== undefined) {
            if (networkFocusID === undefined) {
                netManager.eventsController.networkFocusID = "-1";
            } else
                netManager.eventsController.networkFocusID = networkFocusID;
        }

    }, [networkFocusID, netManager])

    ViewOptionsUseEffect(viewOptions, netManager);

    /**
     * Cuando se seleccione algo que no es de esta perspectiva, es necesario buscar si el nodo/community esta en esta perspectiva,
     * para ello, no hay mas que,
     * 
     * 
     * Dropdown (morelesss) para configurar perspectivas etc.
     * 
     * similar emotions in same artworks
     * ______   ________     ____     ___________
     * same      values     similar     attribute1
     * distinct  thematics  distinct    attribute2
     *                                  attribute3
     * ___________________________________________
     */
    useEffect(() => {
        //If something is selected
        if (selectedObject?.obj !== undefined && netManager !== undefined) {
            //If a node has been selected
            if (selectedObject.obj.explanation === undefined) {

                const nodeData = netManager.eventsController.nodeClicked(selectedObject.obj.id as number);

                setSelectedNode(nodeData as UserData);
                setSelectedCommunity(netManager.bbController.comData[nodeData.implicit_community]);

            } else {//If a community has been selected
                //If the community is from this network
                if (selectedObject.sourceID === perspectiveData.id) {

                    setSelectedNode(undefined);
                    setSelectedCommunity(selectedObject.obj as CommunityData);

                } else { //If the community is not from this network

                    setSelectedNode(undefined);
                    setSelectedCommunity(undefined);

                    if (netManager !== undefined) {
                        netManager.eventsController.removeSelectedItems();
                        netManager.eventsController.selectNodesByID(selectedObject.obj.users);
                    }
                }
            }
        } else { //Nothing is selected

            setSelectedNode(undefined);
            setSelectedCommunity(undefined);

            if (netManager !== undefined) {
                netManager.eventsController.removeSelectedItems();
                netManager.eventsController.zoomOut();
            }
        }
    }, [selectedObject?.obj, selectedObject?.sourceID, perspectiveData.id, netManager]);

    //Create the vis network controller
    useEffect(() => {
        if (netManager === undefined && visJsRef !== null && visJsRef !== undefined) {
            sf.setSelectedCommunity = setSelectedCommunity;

            if (networkFocusID === undefined) {
                sf.setNetworkFocusId(perspectiveData.id);
            }
            setNetManager(new NetworkController(perspectiveData, visJsRef.current!, viewOptions, sf, dimStrat, networkFocusID!));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visJsRef]);

    let networkState = "";
    if (netManager !== undefined && networkFocusID === netManager?.eventsController.networkID)
        networkState = "active";

    const networkContainer = <div style={getNetworkContainerStyle(perspectiveState)} key={1} ref={visJsRef} />

    if (perspectiveState !== PerspectiveState.collapsed) {
        const dataCol = <DataTable
            tittle={""}
            node={selectedNode}
            community={selectedCommunity}
            artworks={perspectiveData.artworks}
            hideLabel={viewOptions.hideLabels}
            state={networkState}
        />

        return (
            <div className="row" style={{ flexDirection: mirror ? "row-reverse" : "row" }} key={10}>
                <div className="col-4" key={1}>
                    {dataCol}
                </div>
                <div className="col-8" key={0}>
                    {networkContainer}
                </div>
            </div >
        );
    } else {
        return (
            <div className="row" key={10}>
                <div className="col-12" key={0}>
                    {networkContainer}
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


function getNetworkContainerStyle(perspectiveState: PerspectiveState): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(networkContainer)));

    if (perspectiveState === PerspectiveState.collapsed) {
        newStyle.borderTop = "none";
    }

    return newStyle;
}