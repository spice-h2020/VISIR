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
import { ExplicitData } from "./nodeExplicitComms";

export default class NodeVisualsCtrl {
    dimStrat: NodeDimensionStrategy;
    legendConfig: Map<string, boolean>;
    focusedNodes: Array<string>;

    constructor(dimStrat: NodeDimensionStrategy | undefined, sf: StateFunctions, explicitData: ExplicitData[], viewOptions: ViewOptions) {

        if (dimStrat === undefined) {
            this.dimStrat = this.createDimensionStrategy(explicitData, viewOptions.border, sf.setLegendData);
            sf.setDimensionStrategy(this.dimStrat);
        } else {
            this.dimStrat = dimStrat;
        }

        this.focusedNodes = new Array<string>();
        this.legendConfig = viewOptions.legendConfig;
    }


    createDimensionStrategy(explicitData: ExplicitData[], showBorder: boolean, setLegendData: Function) {
        const attributes = new Array<DimAttribute>();

        if (explicitData[0] !== undefined) {
            attributes.push({
                key: explicitData[0].key,
                values: explicitData[0].values,
                dimension: Dimensions.Color,
                active: true
            })
        }

        if (explicitData[1] !== undefined) {
            attributes.push({
                key: explicitData[1].key,
                values: explicitData[1].values,
                dimension: Dimensions.Shape,
                active: true
            })
        }

        if (explicitData[2] !== undefined) {
            attributes.push({
                key: explicitData[2].key,
                values: explicitData[2].values,
                dimension: Dimensions.Border,
                active: showBorder
            })
        }

        return new NodeDimensionStrategy(attributes, setLegendData);
    }

    setNodeInitialVisuals(node: UserData, hideLabel: boolean) {
        this.updateNodeVisual(node);
        this.updateNodeLabel(node, hideLabel);
    }

    updateNodeVisual(node: UserData) {
        const keys = Object.keys(node.explicit_community);

        //Find if the node must be colorless
        let toColorless = false;
        for (let i = 0; i < keys.length && !toColorless; i++) {
            const value = node.explicit_community[keys[i]]

            if (this.legendConfig!.get(value))
                toColorless = true;
        }

        if (toColorless) {
            this.dimStrat.nodeToColorless(node);

            //If it must not be colorless, check if there are selected Nodes
        } else if (this.focusedNodes.length > 0) {

            //If there are selected nodes, we only move to default color the ones that are selected
            if (this.focusedNodes.includes(node.id.toString())) {
                this.dimStrat.nodeToDefault(node);
            } else {
                this.dimStrat.nodeToColorless(node);
            }
        } else {
            this.dimStrat.nodeToDefault(node);
        }
    }

    toggleNodeLabels(allNodes: DataSetNodes, hideLabel:boolean){
        const newNodes: Node[] = new Array<Node>();

        allNodes.forEach((node) => {

            this.updateNodeLabel(node as UserData, hideLabel);
            newNodes.push(node);
            
        })

        allNodes.update(newNodes);
    }
    
    updateNodeLabel(node: UserData, hideLabel: boolean) {
        if (hideLabel) {
            if (node.font !== undefined) {
                node.font.color = "#00000000"
            } else {
                node.font = {
                    color: "#00000000"
                }
            }
        }
        else {
            if (node.font !== undefined) {
                node.font.color = "#000000FF"
            } else {
                node.font = {
                    color: "#000000FF"
                }
            }
        }
    }

    selectNodes(allNodes: DataSetNodes, selectedNodes: string[], focusedId: string[]) {
        const newNodes: Node[] = new Array<Node>();

        allNodes.forEach((node) => {
            const id = node.id;
            if (selectedNodes.includes(id as string)) {
                this.coloredNodeVisuals(node as UserData);

            } else if (focusedId.includes(id as string)) {
                this.focusedNodeVisuals(node as UserData);

            } else {
                this.hideNodeVisuals(node as UserData);
            }

            newNodes.push(node);
        })

        allNodes.update(newNodes);
    }

    colorAllNodes(allNodes: DataSetNodes) {
        const newNodes: Node[] = new Array<Node>();

        allNodes.forEach((node) => {
            this.coloredNodeVisuals(node as UserData);
            newNodes.push(node);
        })

        allNodes.update(newNodes);
    }

    coloredNodeVisuals(node: UserData) {
        this.dimStrat.nodeToDefault(node);
    }

    focusedNodeVisuals(node: UserData) {
        this.dimStrat.nodeToDefault(node, true);
    }

    hideNodeVisuals(node: UserData) {
        this.dimStrat.nodeToColorless(node);
    }


}


