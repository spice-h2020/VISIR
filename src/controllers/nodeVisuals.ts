/**
 * @fileoverview This class find all explicit communities and its values in the user data of the perspective. 
 * Then create a dimension strategy that changes how the network ndoes look based on the explicitData.
 * Then it changes the node position in the canvas to create a circular distribution without node overlap.
 * @package Requires vis network package.
 * @author Marco Expósito Pérez
 */
//Constants
import { PerspectiveData, UserData } from "../constants/perspectivesTypes";
import { Dimensions, DimAttribute, nodeConst } from "../constants/nodes"
import { ViewOptions } from "../constants/viewOptions";
import { Point, StateFunctions } from "../constants/auxTypes";
//Packages
import { ChosenLabelValues, ChosenNodeValues, DataSetNodes, Node } from "vis-network";
//Local files
import NodeDimensionStrategy from "../managers/dimensionStrategy";


//Local aux class to help mantain and collect all the values of an Explicit Community
class ExplicitData {
    key: string;
    values: string[];

    /**
     * Constructor of the class
     * @param key Key of the explicit community
     * @param value Initial value of the explicit community
     */
    constructor(key: string, value: string) {
        this.key = key;
        this.values = new Array<string>();
        this.values.push(value);
    }
}

//Local aux interface to help group nodes in their partition of the canvas's layout
interface NodeGroup {
    nodes: string[],
    partition: {
        center: Point,
        nNodes: number
    }
}

export default class NodeVisuals {

    //All explicit Data of the users
    explicitData: ExplicitData[];
    //Current active dimensions strat
    dimensionsStrat!: NodeDimensionStrategy;
    //Atributes with the relations between explicit communities and their dimensions
    attributes!: DimAttribute[];
    //Nodes of the network
    nodes: DataSetNodes;
    //Selected nodes of the network
    selectedNodes?: string[];
    //Visual configuration based on the legend options
    legendConfig?: Map<string, boolean>
    //Boolean that controls if labels should be hidden
    hideLabel?: boolean

    /**
     * Constructor of the class
     * @param PerspectiveData Perspective info of the perspective that uses this object
     * @param nodes All nodes of the network
     * @param sf All functions that change the state
     * @param viewOptions All options that change visuals
     * @param dimStrat Dimenstion strategy object that is being used by all networks
     */
    constructor(PerspectiveData: PerspectiveData, nodes: DataSetNodes, sf: StateFunctions, viewOptions: ViewOptions, dimStrat: NodeDimensionStrategy | undefined) {
        this.explicitData = new Array<ExplicitData>();
        this.nodes = nodes;


        if (dimStrat === undefined) {

            this.obtainExplicitData();
            this.createNodeDimensionStrategy(viewOptions.border);
            sf.setDimensionStrategy(this.dimensionsStrat);

        } else
            this.dimensionsStrat = dimStrat;

        this.updateNodeDimensions(viewOptions.legendConfig);

        this.updateNodeLocation(PerspectiveData);
        this.hideLabels(viewOptions.hideLabels);

        sf.setLegendData(this.attributes);
    }

    /**
     * Obtain the explicit data from the explicit communities of the nodes of the network
     */
    obtainExplicitData() {
        this.nodes.forEach((node) => {
            const user = node as UserData;

            const explicitKeys = Object.keys(user.explicit_community);
            explicitKeys.forEach((key) => {

                if (this.explicitData.length === 0) {
                    this.explicitData.push(new ExplicitData(key, user.explicit_community[key]));
                } else {

                    let keyValues = this.explicitData.find(element => element.key === key);

                    if (keyValues !== undefined) {
                        if (!keyValues.values.includes(user.explicit_community[key])) {
                            keyValues.values.push(user.explicit_community[key]);
                        }
                    } else {
                        this.explicitData.push(new ExplicitData(key, user.explicit_community[key]));
                    }
                }
            });
        });
    }

    /**
     * Create the node dimension strategy and its necesary attributes
     * @param showBorder Boolean with the activate third dimension/border option
     */
    createNodeDimensionStrategy(showBorder: boolean) {
        this.attributes = new Array<DimAttribute>();

        if (this.explicitData[0] !== undefined) {
            this.attributes.push({
                key: this.explicitData[0].key,
                values: this.explicitData[0].values,
                dimension: Dimensions.Color,
            })
        }

        if (this.explicitData[1] !== undefined) {
            this.attributes.push({
                key: this.explicitData[1].key,
                values: this.explicitData[1].values,
                dimension: Dimensions.Shape,
            })
        }

        if (this.explicitData[2] !== undefined && showBorder) {
            this.attributes.push({
                key: this.explicitData[2].key,
                values: this.explicitData[2].values,
                dimension: Dimensions.Border,
            })
        }

        this.dimensionsStrat = new NodeDimensionStrategy(this.attributes);
    }

    /**
     * Update the location of the nodes in the canvas to resemble a circle without node overlaps
     * @param networkData Data of the perspective
     */
    updateNodeLocation(networkData: PerspectiveData) {
        const nAreas = networkData.communities.length;

        const areaPartitions: Point[] = this.createNetworkPartitions(networkData.users.length, nAreas);
        const nodesGrouped: Array<NodeGroup> = new Array<NodeGroup>();

        for (let i = 0; i < nAreas; i++) {
            nodesGrouped.push({
                nodes: new Array<string>(),
                partition: {
                    center: areaPartitions[i],
                    nNodes: 0
                }
            })
        }

        //Insert the nodes in each nodeGroup
        this.nodes.forEach((node) => {
            const user = node as UserData;
            const group = user.implicit_community;

            nodesGrouped[group].nodes.push(user.id);
            nodesGrouped[group].partition.nNodes++;
        });

        //Set the location for all nodes
        this.nodes.forEach((node) => {
            const user = node as UserData;
            const group = user.implicit_community;
            const nodePos: Point = this.getNodePos(nodesGrouped[group], user.id);

            user.x = nodePos.x;
            user.y = nodePos.y;
        });
    }

    /**
     * Create partitions in a circle to slot every implicit community
     * @param nUsers number of users
     * @param nAreas number of areas to make
     * @returns returns an array with the center poin of each partition
     */
    createNetworkPartitions(nUsers: number, nAreas: number): Point[] {
        const partitionsDistance = nodeConst.groupsBaseDistance * nUsers / 45;
        const pi2 = (2 * Math.PI);

        //Separate the network area in as many angle slices as necesary
        const angleSlice = pi2 / nAreas;
        let targetAngle = 0;

        //Increase the target angle for every group, and set the location of each area partition
        const areaPartitions = [];
        for (let i = 0; targetAngle < pi2; i++) {
            areaPartitions[i] = {
                x: Math.cos(targetAngle) * (partitionsDistance * nAreas),
                y: Math.sin(targetAngle) * (partitionsDistance * nAreas)
            };

            targetAngle += angleSlice;
        }


        return areaPartitions as Point[];
    }

    /**
     * Gets the exact node coordinates in the canvas
     * @param group Node group of the node
     * @param nodeId id of the node
     * @returns point coordinates
     */
    getNodePos(group: NodeGroup, nodeId: string): Point {
        const size = group.partition.nNodes;
        const center = group.partition.center;
        const nodeIndex = group.nodes.indexOf(nodeId);;

        const output = { x: 0, y: 0 };

        const angleSlice = (2 * Math.PI) / size;
        let targetAngle = angleSlice * nodeIndex;

        output.x = center.x + Math.cos(targetAngle) * size * nodeConst.betweenNodesDistance;
        output.y = center.y + Math.sin(targetAngle) * size * nodeConst.betweenNodesDistance;

        return output;
    }

    /**
     * Update all nodes dimensions based on the legend config
     * @param legendConfig (Optional) new legend config
     */
    updateNodeDimensions(legendConfig: Map<string, boolean> | undefined = undefined) {
        if (legendConfig !== undefined)
            this.legendConfig = legendConfig;

        if (this.legendConfig !== undefined)
            this.updateNodesBasedOnLegend();

    }
    /**
     * Updates the visuals of all nodes to match the legend configuration and nodes's selected status
     */
    updateNodesBasedOnLegend() {
        const newNodes = new Array<UserData>();

        this.nodes.forEach((node: Node) => {
            const user: UserData = node as UserData;
            const keys = Object.keys(user.explicit_community);

            //Find if the node must be colorless
            let toColorless = false;
            for (let i = 0; i < keys.length && !toColorless; i++) {
                const value = user.explicit_community[keys[i]]
                if (this.legendConfig!.get(value) === false)
                    toColorless = true;
            }

            if (toColorless) {
                this.dimensionsStrat.nodeToColorless(user);

                //If it must not be colorless, check if there are selected Nodes
            } else if (this.selectedNodes !== undefined && this.selectedNodes.length > 0) {

                //If there are selected nodes, we only move to default color the ones that are selected
                if (this.selectedNodes.includes(user.id.toString())) {
                    this.dimensionsStrat.nodeToDefault(user);
                }
            } else {
                this.dimensionsStrat.nodeToDefault(user);
            }
            newNodes.push(user);
        });

        this.nodes.update(newNodes)
    }

    /**
     * Hide the label/id of all nodes
     * @param hideLabels new value of hide labels option
     */
    hideLabels(hideLabels: boolean) {
        const newNodes = new Array<UserData>();
        this.hideLabel = hideLabels;

        this.nodes.forEach((node) => {
            const user = node as UserData;

            if (hideLabels)
                user.font.color = "#00000000"
            else
                user.font.color = "#000000FF"

            newNodes.push(user);
        });
        this.nodes.update(newNodes);
    }

    /**
     * Update selected node list and all node visuals
     * @param selectedNodes new selected nodes
     */
    selectNodes(selectedNodes: string[]) {
        this.selectedNodes = selectedNodes;
        this.updateNodeDimensions()
    }

    /**
     * Clear the selected node list and update all node visuals
     */
    unselectNodes() {
        this.selectedNodes = undefined;
        this.updateNodeDimensions()
    }

    /** 
     * Function executed when a node is selected that update the node visual attributes
     * @param {Object} values value of the parameters that will change
     * @param {Integer} id id of the node (unused)
     * @param {Boolean} selected Boolean that says if the node has been selected
     * @param {Boolean} hovering Boolean that says if the node has been hovered (unused)
     */
    nodeChosen(values: ChosenNodeValues, id: number, selected: boolean, hovering: boolean) {
        if (selected) {

            values.size = nodeConst.selectedSize;

            if (values.borderColor === "transparent") {
                values.borderColor = "#000000";
                values.borderWidth = nodeConst.selectedBorderWidth
            }
        }
    }

    /** 
     * Function executed when a node is selected that update node's attributes of its label
     * @param {Object} values label's parameters that will change
     * @param {Integer} id id of the node (unused)
     * @param {Boolean} selected Boolean that says if the node has been selected
     * @param {Boolean} hovering Boolean that says if the node has been hovered (unused)
     */
    labelChosen(values: ChosenLabelValues, id: number, selected: boolean, hovering: boolean) {
        if (selected) {
            values.vadjust -= 10;
        }
    }
}


