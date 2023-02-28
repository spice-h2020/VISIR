/**
 * @fileoverview This file creates a network controller based on the perspectiveData that has the responsability of 
 * creating the vis.js network object, creates a dataTable component updating it with the necesary information and 
 * reacts to diferent changes.
 * When some of the viewOptions attribute changes, the network will be updated accordingly.
 * When the selected object changes, the dataTable and the network will be updated.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ViewOptions } from '../constants/viewOptions';
import { IUserData, ICommunityData, EPerspectiveVisState, IPerspectiveData } from '../constants/perspectivesTypes';
import { ISelectedObject, ESelectedObjectAction, IStateFunctions, CTranslation, DiferentAttrbError } from '../constants/auxTypes';
//Packages
import React, { useEffect, useState, useRef } from "react";
//Local files
import NetworkController from '../controllers/networkController';
import NodeDimensionStrategy from '../managers/nodeDimensionStrat';
import { DataTable } from './DataColumn';

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
    perspectiveData: IPerspectiveData;
    //Options that change the view of a perspective.
    viewOptions: ViewOptions;
    //Object with all the functions that will change the state of the network.
    sf: IStateFunctions;
    //Current selected Object. Can be nothing, a node or a community.
    selectedObject: ISelectedObject | undefined;
    //Current node dimension strategy.
    dimStrat: NodeDimensionStrategy | undefined;
    //Id of the current network on the focus.
    networkFocusID: undefined | string;
    //Collapsed state of this perspective.
    perspectiveState: EPerspectiveVisState;
    //If true, mirror the dataTable and vis.js network position
    mirror?: boolean;
    /**
     * If its the unique active perspective in the app
     */
    unique: boolean;

    translationClass: CTranslation,
    cancelPerspective: (idToCancel: string) => (void),
}

/**
 * UI component that creates a vis.js network and a dataTable with diferent data based on the selected object.
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
    unique,
    translationClass: tClass,
    cancelPerspective,
}: PerspectiveViewProps) => {

    const [netManager, setNetManager] = useState<NetworkController | undefined>();

    const [selectedCommunity, setSelectedCommunity] = useState<ICommunityData>();
    const [selectedNode, setSelectedNode] = useState<IUserData | undefined>();

    const visJsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (netManager !== undefined) {
            if (networkFocusID === undefined) {
                netManager.eventsCtrl.focusedNetId = "-1";
            } else
                netManager.eventsCtrl.focusedNetId = networkFocusID;
        }
    }, [networkFocusID, netManager])

    ViewOptionsUseEffect(viewOptions, netManager, sf.setSelectedObject, networkFocusID);

    //Do something when the user clicks in a network
    useEffect(() => {
        //Check if something has been clicked
        if (netManager !== undefined) {
            if (selectedObject?.obj !== undefined) {
                //If a node has been clicked.
                if (selectedObject.obj.explanations === undefined && selectedObject.obj.id !== undefined) {

                    const nodeData: IUserData = netManager.nodes.get(selectedObject.obj.id) as IUserData;

                    //If the node exist in this network
                    if (nodeData !== undefined && nodeData !== null) {
                        //If its a medoid node
                        if (nodeData.isMedoid) {
                            if (selectedObject.sourceID === netManager.id) {
                                netManager.eventsCtrl.nodeClicked(selectedObject.obj.id);
                                setSelectedNode(nodeData as IUserData);
                                setSelectedCommunity(netManager.bbCtrl.comData[nodeData.implicit_community]);
                            } else {
                                netManager.eventsCtrl.nothingClicked();
                                setSelectedNode(undefined);
                                setSelectedCommunity(undefined);
                            }
                            //If its a normal node that exist in this network
                        } else {
                            netManager.eventsCtrl.nodeClicked(selectedObject.obj.id);
                            setSelectedNode(nodeData as IUserData);
                            setSelectedCommunity(netManager.bbCtrl.comData[nodeData.implicit_community]);
                        }

                        //If the node doesnt exist in this network
                    } else {
                        setSelectedNode(undefined);
                        setSelectedCommunity(undefined);
                        netManager.eventsCtrl.nothingClicked();
                    }

                } //If a community has been clicked
                else {
                    //If the community is from this network
                    if (selectedObject.sourceID === perspectiveData.id) {

                        netManager.eventsCtrl.boundingBoxClicked(selectedObject.obj as ICommunityData);

                        setSelectedNode(undefined);
                        setSelectedCommunity(selectedObject.obj as ICommunityData);

                    }//If the community is not from this network 
                    else {

                        netManager.eventsCtrl.externalCommunityClicked(selectedObject.obj as ICommunityData);

                        setSelectedNode(undefined);
                        setSelectedCommunity(undefined);
                    }
                }
            }//If nothing is selected 
            else {

                netManager.eventsCtrl.nothingClicked();

                setSelectedNode(undefined);
                setSelectedCommunity(undefined);
            }
        }
    }, [selectedObject?.obj, selectedObject?.sourceID, perspectiveData.id, netManager]);

    //Create the vis network controller
    useEffect(() => {
        if (netManager === undefined && visJsRef !== null && visJsRef !== undefined) {
            if (networkFocusID === undefined) {
                sf.setNetworkFocusId(perspectiveData.id);
            }

            try {
                setNetManager(new NetworkController(perspectiveData, visJsRef.current!, viewOptions,
                    sf, dimStrat, networkFocusID!, unique));

            } catch (error) {
                if (error instanceof DiferentAttrbError) {
                    cancelPerspective(perspectiveData.id);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visJsRef]);

    let networkState = "";
    if (netManager !== undefined && networkFocusID === netManager.id)
        networkState = "active";

    const networkContainer = <div style={getNetworkContainerStyle(perspectiveState)} key={1} ref={visJsRef} />

    if (perspectiveState !== EPerspectiveVisState.collapsed) {
        const dataCol =
            <DataTable
                tittle={perspectiveData.name}
                node={selectedNode}
                community={selectedCommunity}

                artworks={perspectiveData.artworks}
                allUsers={perspectiveData.users}

                showLabel={viewOptions.showLabels}
                state={networkState}
                translationClass={tClass}
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
 * Creates a series of UseEffect functions that will be executed when viewOptions object changes. 
 * They will update the network in diferent ways depending on the option
 * @param viewOptions object that will trigger the useEffects.
 * @param netMgr will execute the changes once useEffects are triggered
 */
function ViewOptionsUseEffect(viewOptions: ViewOptions, netMgr: NetworkController | undefined,
    setSelectedObject: Function, focusedId: string | undefined) {

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady) {
            if (netMgr.nodeVisuals.selectedNodes.length === 0) {
                netMgr.nodeVisuals.colorAllNodes(netMgr.nodes, viewOptions.legendConfig);
            } else {
                netMgr.nodeVisuals.selectNodes(netMgr.nodes, netMgr.nodeVisuals.selectedNodes,
                    netMgr.nodeVisuals.focusedNodes, viewOptions.legendConfig, netMgr.nodeVisuals.borderSelectedNodes);
            }
        }

    }, [viewOptions.legendConfig, netMgr]);

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady && netMgr.explicitCtrl !== undefined) {
            netMgr.explicitCtrl.makeArtworksUnique(viewOptions.nRelevantCommArtworks);
        }

    }, [viewOptions.nRelevantCommArtworks, netMgr]);

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady) {
            netMgr.nodeVisuals.toggleNodeLabels(netMgr.nodes, viewOptions.showLabels);
        }
    }, [viewOptions.showLabels, netMgr]);

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady) {
            netMgr.edgeCtrl.toggleHideEdges(viewOptions.hideEdges);
        }
    }, [viewOptions.hideEdges, netMgr]);

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady) {
            setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: focusedId });

            netMgr.edgeCtrl.updateEdgesThreshold(viewOptions.edgeThreshold);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewOptions.edgeThreshold, netMgr]);

    useEffect(() => {
        if (netMgr !== undefined && netMgr.isReady) {
            setSelectedObject({ action: ESelectedObjectAction.clear, newValue: undefined, sourceID: focusedId });

            netMgr.edgeCtrl.updateDeletedEdges(viewOptions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewOptions.deleteEdges, netMgr]);
}


function getNetworkContainerStyle(perspectiveState: EPerspectiveVisState): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(networkContainer)));

    if (perspectiveState === EPerspectiveVisState.collapsed) {
        newStyle.borderTop = "none";
    }

    return newStyle;
}