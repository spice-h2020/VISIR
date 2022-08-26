
/**
 * @fileoverview This file controlls all functions related to a Vis.js network. Changing node visuals and edge, reacting to vis.js events and viewOptions and drawing bounding boxes
 * @package It requires vis network package.
 * @package It requires vis data package.
 * @author Marco Expósito Pérez
 */
//Namespace
import { edgeConst } from "../namespaces/edges";
import { PerspectiveInfo } from "../namespaces/perspectivesTypes";
import { ViewOptions } from "../namespaces/ViewOptions";
//Package
import { Data, DataSetEdges, DataSetNodes, EdgeOptions, Network, NodeChosenLabelFunction, NodeChosenNodeFunction, Options } from "vis-network";
import { DataSet } from "vis-data";
//Local Files
import EdgeVisuals from "./edgeVisuals";
import NodeVisuals from "./nodeVisuals";
import BoundingBoxes from "./boundingBoxes";
import EventsController from "./eventsController";
import { nodeConst } from "../namespaces/nodes";

export interface StateFunctions {    //TODO move this interface to some other place
    setSelectedNode: Function;
    setSelectedCommunity?: Function;
    setTooltipInfo: Function;
    setTooltipPosition: Function;
    setTooltipState: Function;
    setLegendData: Function;
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

    key: number;
    constructor(perspectiveInfo: PerspectiveInfo, htmlRef: HTMLDivElement, viewOptions: ViewOptions, sf: StateFunctions) {
        this.key = Math.random();

        this.nodes = new DataSet(perspectiveInfo.data.users);
        this.edges = new DataSet(perspectiveInfo.data.similarity);

        this.nodeVisuals = new NodeVisuals(perspectiveInfo.data, this.nodes, sf.setLegendData, viewOptions);
        this.createOptions(viewOptions);
        this.edgeVisuals = new EdgeVisuals(this.edges, viewOptions, this.options)

        this.net = new Network(htmlRef, { nodes: this.nodes, edges: this.edges } as Data, this.options);

        this.bbController = new BoundingBoxes(perspectiveInfo.data.communities, perspectiveInfo.data.users, this.net);

        this.eventsController = new EventsController(this, htmlRef, sf);
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
                borderWidthSelected: nodeConst.defaultBorderWidth,
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