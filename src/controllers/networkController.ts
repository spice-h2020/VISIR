
//Namespace
import { edgeConst } from "../namespaces/edges";
import { PerspectiveInfo } from "../namespaces/perspectivesTypes";
import { ViewOptions } from "../namespaces/ViewOptions";
//Package
import { RefObject } from "react";
import { Data, DataSetEdges, DataSetNodes, Network, Options } from "vis-network";
import { DataSet } from "vis-data";
//Local Files
import EdgeVisuals from "./edgeVisuals";
import NodeVisuals from "./nodeVisuals";
import BoundingBoxes from "./boundingBoxes";
import EventsController from "./eventsController";



export interface StateFunctions{
    setSelectedNode: Function;
    setSelectedCommunity: Function;
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

    constructor(perspectiveInfo: PerspectiveInfo, htmlRef: RefObject<HTMLDivElement>, viewOptions: ViewOptions, sf: StateFunctions) {
        console.log("new manager")

        this.createOptions(viewOptions);
        this.nodes = new DataSet(perspectiveInfo.data.users);
        this.edges = new DataSet(perspectiveInfo.data.similarity);

        this.nodeVisuals = new NodeVisuals(perspectiveInfo.data, this.nodes, sf.setLegendData, viewOptions);
        this.edgeVisuals = new EdgeVisuals(this.edges, viewOptions, this.options)

        if (htmlRef.current !== null)
            this.net = new Network(htmlRef.current, {nodes: this.nodes, edges: this.edges} as Data, this.options);
        
        this.bbController = new BoundingBoxes(perspectiveInfo.data.communities, perspectiveInfo.data.users, this.net);

        this.eventsController = new EventsController(this, htmlRef, sf);
    }

    /**
     * Create the initial option object of vis.js
     * @param viewOptions viewOptions that will change some options
     */
    createOptions(viewOptions: ViewOptions) {
        this.options = {
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
            autoResize: true,
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
        };
    }
}