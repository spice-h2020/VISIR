
/**
 * @fileoverview This file controlls all functions related to a Vis.js network. Changing node visuals and edge, reacting to vis.js events and viewOptions and drawing bounding boxes
 * @package It requires vis network package.
 * @package It requires vis data package.
 * @author Marco Expósito Pérez
 */
//Namespace
import { edgeConst } from "../namespaces/edges";
import { EdgeData, PerspectiveInfo } from "../namespaces/perspectivesTypes";
import { ViewOptions } from "../namespaces/ViewOptions";
import { nodeConst } from "../namespaces/nodes";
//Package
import { Data, DataSetEdges, DataSetNodes, Network, NodeChosenLabelFunction, NodeChosenNodeFunction, Options } from "vis-network";
import { DataSet } from "vis-data";
//Local Files
import EdgeVisuals from "./edgeVisuals";
import NodeVisuals from "./nodeVisuals";
import BoundingBoxes from "./boundingBoxes";
import EventsController from "./eventsController";
import NodeDimensionStrategy from "../managers/dimensionStrategy";

export interface StateFunctions {    //TODO move this interface to some other place
    setSelectedNodeId: Function;
    setTooltipInfo: Function;
    setTooltipPosition: Function;
    setTooltipState: Function;
    setLegendData: Function;
    setDimensionStrategy: Function;
    setNetowkrFocusId: Function;
    setSelectedCommunity?: Function;
}

export default class NetworkController {
    //Options of the vis.js network
    options!: Options;
    //Node visuals controller
    nodeVisuals!: NodeVisuals;
    //Edge visuals controller
    edgeVisuals!: EdgeVisuals;
    //Bounding boxes controller
    bbController: BoundingBoxes
    //Network event controller
    eventsController: EventsController

    //Vis.js network object
    net!: Network;
    //Nodes of the network
    nodes: DataSetNodes;
    //Edges of the network
    edges: DataSetEdges;

    constructor(perspectiveInfo: PerspectiveInfo, htmlRef: HTMLDivElement, viewOptions: ViewOptions, sf: StateFunctions, dimStrat: NodeDimensionStrategy | undefined, networkFocusID: number) {

        this.nodes = new DataSet(perspectiveInfo.data.users);

        perspectiveInfo.data.similarity.sort(sortEdges);
        this.edges = new DataSet(perspectiveInfo.data.similarity);

        this.nodeVisuals = new NodeVisuals(perspectiveInfo.data, this.nodes, sf, viewOptions, dimStrat);
        this.createOptions(viewOptions);
        this.edgeVisuals = new EdgeVisuals(this.edges, viewOptions, this.options)

        this.net = new Network(htmlRef, { nodes: this.nodes, edges: this.edges } as Data, this.options);

        this.bbController = new BoundingBoxes(perspectiveInfo.data.communities, perspectiveInfo.data.users, this.net);

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


const sortEdges = (a: EdgeData, b: EdgeData) => {
    if (a.value > b.value) {
        return 1;
    }
    if (a.value < b.value) {
        return -1;
    }
    return 0;
}