/**
 * @fileoverview This file creates all objects related to a Vis.js network. 
 * Aditionaly creates the initial vis.js network's configuration
 * @package Requires vis network package.
 * @package Requires vis data package.
 * @author Marco Expósito Pérez
 */
//Constants
import { edgeConst } from "../constants/edges";
import { EdgeData, PerspectiveInfo } from "../constants/perspectivesTypes";
import { ViewOptions } from "../constants/viewOptions";
import { nodeConst } from "../constants/nodes";
import { StateFunctions } from "../constants/auxTypes";
//Package
import { Data, DataSetEdges, DataSetNodes, Network, NodeChosenLabelFunction, NodeChosenNodeFunction, Options } from "vis-network";
import { DataSet } from "vis-data";
//Local Files
import EdgeVisuals from "./edgeVisuals";
import NodeVisuals from "./nodeVisuals";
import BoxesController from "./boundingBoxes";
import EventsController from "./eventsController";
import NodeDimensionStrategy from "../managers/dimensionStrategy";

export default class NetworkController {
    //Options of the vis.js network
    options!: Options;
    //Node visuals controller
    nodeVisuals!: NodeVisuals;
    //Edge visuals controller
    edgeVisuals!: EdgeVisuals;
    //Bounding boxes controller
    bbController: BoxesController
    //Network event controller
    eventsController: EventsController

    //Vis.js network object
    net!: Network;
    //Nodes of the network
    nodes: DataSetNodes;
    //Edges of the network
    edges: DataSetEdges;

    /**
     * Constructor of the class 
     * @param perspectiveInfo All the information of this perspective
     * @param htmlRef HTMLDiv element where the canvas of the network will be holded
     * @param viewOptions Object with the view options
     * @param sf Obkect with the functions that change the state
     * @param dimStrat Current dimension strategy
     * @param networkFocusID ID of the current network with the tooltip focus
     */
    constructor(perspectiveInfo: PerspectiveInfo, htmlRef: HTMLDivElement, viewOptions: ViewOptions, sf: StateFunctions, dimStrat: NodeDimensionStrategy | undefined, networkFocusID: number) {

        this.nodes = new DataSet(perspectiveInfo.data.users);

        perspectiveInfo.data.similarity.sort(sortEdges);
        this.edges = new DataSet(perspectiveInfo.data.similarity);

        this.nodeVisuals = new NodeVisuals(perspectiveInfo.data, this.nodes, sf, viewOptions, dimStrat);
        this.createOptions(viewOptions);
        this.edgeVisuals = new EdgeVisuals(this.edges, perspectiveInfo.data.similarity, viewOptions, this.options)

        this.net = new Network(htmlRef, { nodes: this.nodes, edges: this.edges } as Data, this.options);
        this.edgeVisuals.net = this.net;
        
        this.bbController = new BoxesController(perspectiveInfo.data.communities, perspectiveInfo.data.users, this.net);

        this.eventsController = new EventsController(this, htmlRef, sf, networkFocusID, perspectiveInfo.details.id);
    }

    /**
     * Create the initial option object of vis.js
     * @param viewOptions viewOptions that will change some options
     */
    createOptions(viewOptions: ViewOptions) {
        this.options = {
            autoResize: true,
            edges: {
                scaling: {
                    min: edgeConst.minWidth,
                    max: viewOptions.edgeWidth ? edgeConst.maxWidth : edgeConst.minWidth,
                    label: {
                        enabled: false
                    }
                },
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
                borderWidthSelected: nodeConst.selectedBorderWidth,
                size: nodeConst.defaultSize,
                chosen: {
                    node: this.nodeVisuals.nodeChosen.bind(this.nodeVisuals) as NodeChosenNodeFunction,
                    label: this.nodeVisuals.labelChosen.bind(this.nodeVisuals) as NodeChosenLabelFunction,
                },
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