/**
 * @fileoverview This file creates all objects related to a Vis.js network. 
 * Aditionaly creates the initial vis.js network's configuration
 * @package Requires vis network package.
 * @package Requires vis data package.
 * @author Marco Expósito Pérez
 */
//Constants
import { edgeConst } from "../constants/edges";
import { EdgeData, PerspectiveData, UserData } from "../constants/perspectivesTypes";
import { ViewOptions } from "../constants/viewOptions";
import { nodeConst } from "../constants/nodes";
import { StateFunctions } from "../constants/auxTypes";
//Package
import { Data, DataSetEdges, DataSetNodes, Network, Options } from "vis-network";
import { DataSet } from "vis-data";
//Local Files
import BoxesController from "./boundingBoxes";
import NodeDimensionStrategy from "../managers/dimensionStrategy";
import NodeLocation from "./nodeLocation";
import NodeExplicitComms from "./nodeExplicitComms";
import NodeVisualsCtrl from "./nodeVisualsCtrl";
import EdgeVisualsCtrl from "./edgeVisualCtrl";
import EventsCtrl from "./eventsCtrl";

export default class NetworkController {
    //Options of the vis.js network
    options!: Options;
    //Bounding boxes controller
    bbCtrl!: BoxesController;
    //Edge visuals controller
    edgeCtrl!: EdgeVisualsCtrl;
    //Node visuals controller
    nodeVisuals!: NodeVisualsCtrl;

    //Network event controller
    eventsCtrl: EventsCtrl;

    //Vis.js network object
    net!: Network;
    //Nodes of the network
    nodes: DataSetNodes;
    //Edges of the network
    edges: DataSetEdges;

    //Id of this network
    id: string;
    htmlRef: HTMLDivElement

    /**
     * Constructor of the class 
     * @param perspectiveInfo All the information of this perspective
     * @param htmlRef HTMLDiv element where the canvas of the network will be holded
     * @param viewOptions Object with the view options
     * @param sf Obkect with the functions that change the state
     * @param dimStrat Current dimension strategy
     * @param networkFocusID ID of the current network with the tooltip focus
     */
    constructor(perspectiveData: PerspectiveData, htmlRef: HTMLDivElement, viewOptions: ViewOptions, sf: StateFunctions,
        dimStrat: NodeDimensionStrategy | undefined, networkFocusID: string) {

        this.id = perspectiveData.id;
        this.htmlRef = htmlRef;

        this.nodes = new DataSet(perspectiveData.users);
        perspectiveData.similarity.sort(sortEdges);
        this.edges = new DataSet(perspectiveData.similarity);

        this.createOptions();
        this.net = new Network(htmlRef, { nodes: this.nodes, edges: this.edges } as Data, this.options);

        this.parseNodes(perspectiveData, dimStrat, sf, viewOptions);
        this.parseEdges(this.edges, perspectiveData.similarity, viewOptions);

        this.eventsCtrl = new EventsCtrl(this, sf, networkFocusID);
    }

    parseNodes(perspectiveData: PerspectiveData, dimStrat: NodeDimensionStrategy | undefined, sf: StateFunctions, viewOptions: ViewOptions) {
        const explicitCtrl = new NodeExplicitComms(perspectiveData.communities);
        const nodeLocation = new NodeLocation(perspectiveData.communities.length, perspectiveData.users.length);

        perspectiveData.users.forEach((user: UserData) => {
            nodeLocation.updateNodeGroup(user);
            explicitCtrl.parseExplicitCommunity(user, dimStrat);
        });

        this.nodeVisuals = new NodeVisualsCtrl(dimStrat, sf, explicitCtrl.explicitData, viewOptions, this.nodes.getIds() as string[]);
        this.bbCtrl = new BoxesController(perspectiveData.communities);

        perspectiveData.users.forEach((user: UserData) => {
            nodeLocation.setNodeLocation(user);
            this.nodeVisuals.setNodeInitialVisuals(user, viewOptions.hideLabels);
            this.bbCtrl.calculateBoundingBoxes(user);
        });

        this.nodes.update(perspectiveData.users);
    }

    parseEdges(edgeDataset: DataSetEdges, baseData: EdgeData[], viewOptions: ViewOptions) {
        this.edgeCtrl = new EdgeVisualsCtrl(edgeDataset, baseData, viewOptions);
    }

    /**
     * Create the initial option object of vis.js
     */
    createOptions() {
        this.options = {
            autoResize: true,
            edges: {
                width: edgeConst.minWidth,
                color: {
                    color: edgeConst.defaultColor,
                    highlight: edgeConst.selectedColor
                },
                chosen: false,
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
            nodes: {
                shape: nodeConst.defaultShape.name,
                shapeProperties: {
                    interpolation: false,
                },
                borderWidth: nodeConst.defaultBorderWidth,
                size: nodeConst.defaultSize,
                chosen: false,
                color: {
                    background: nodeConst.defaultColor,
                    border: nodeConst.defaultColor,
                },
                font: {
                    vadjust: nodeConst.labelvOffset,
                    size: nodeConst.labelSize,
                }
            },
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
        } as Options;
    }
}

/**
 * Function that compares EdgeData.
 * @param a EdgeData A
 * @param b EdgeData B
 * @returns Returns 1 if A has higher value. Returns 0 if both have the same value. Returns -1 if B has higher value
 */
const sortEdges = (a: EdgeData, b: EdgeData) => {
    if (a.value > b.value) {
        return 1;
    }
    if (a.value < b.value) {
        return -1;
    }
    return 0;
}