import { UserData } from "../constants/perspectivesTypes";
import { Dimensions, DimAttribute } from "../constants/nodesConstants"
import NodeDimensionStrategy from "./dimensionStrategyController";

class ExplicitData {
    key: string;
    values: string[];

    constructor(key: string, value: string) {
        this.key = key;
        this.values = new Array<string>();
        this.values.push(value);
    }
}

export default class UserVisuals {

    explicitData: ExplicitData[];
    dimensionsStrat: NodeDimensionStrategy | undefined;

    constructor(UserData: UserData[]) {
        this.explicitData = new Array<ExplicitData>();

        this.obtainExplicitData(UserData);
        this.createNodeDimensionStrategy();
        this.updateNodeDimensions(UserData);
    }

    obtainExplicitData(UserData: UserData[]) {
        UserData.forEach((user) => {

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

    createNodeDimensionStrategy() {
        const attributes = new Array<DimAttribute>();

        if (this.explicitData[0] !== undefined) {
            attributes.push({
                key: this.explicitData[0].key,
                values: this.explicitData[0].values,
                dimension: Dimensions.Color,
            })
        }

        if (this.explicitData[1] !== undefined) {
            attributes.push({
                key: this.explicitData[1].key,
                values: this.explicitData[1].values,
                dimension: Dimensions.Shape,
            })
        }

        //TODO link the allow third dimension option tho this
        if (this.explicitData[2] !== undefined && false) {
            attributes.push({
                key: this.explicitData[2].key,
                values: this.explicitData[2].values,
                dimension: Dimensions.Border,
            })
        }

        this.dimensionsStrat = new NodeDimensionStrategy(attributes);
    }


    updateNodeDimensions(UserData: UserData[]) {
        if (this.dimensionsStrat !== undefined) {

            UserData.forEach((user) => {
                this.dimensionsStrat?.nodeToDefault(user);
            });

        } else {
            console.log("Trying to update node visuals without dimension strat being defined")
        }
    }

    // /**
    //  * Update the visuals of all nodes to match the current node Dimension Strategy
    //  * @param {Dataset} nodes Dataset with the data of all nodes of the network
    //  */
    // updateNodeVisuals(nodes) {
    //     const newNodes = new Array();

    //     nodes.forEach((node) => {
    //         this.nodeDimensionStrategy.changeNodeVisuals(node);
    //         newNodes.push(node);
    //     });

    //     nodes.update(newNodes);
    // }

    // /**
    //  * Returns the attributes that change visualization
    //  * @returns {Object} Object with the attributes that change visualization
    //  * Format-> {attr: (string), vals: (string[], dimension: (string))}
    //  */
    // getVisualizationAttributes() {
    //     return this.nodeDimensionStrategy.attributes;
    // }

    // /**
    //  * Hide all nodes that contain any of these filtered communities values
    //  * @param {String[]} filter Array with the name of all values to be hidden
    //  * @param {DataSet} nodes Dataset with the network's data of all nodes
    //  */
    // updateFilterActives(filter, nodes) {
    //     const newNodes = new Array();

    //     nodes.forEach((node) => {
    //         const explComms = node[comms.ExpUserKsonKey];
    //         const keys = Object.keys(explComms);

    //         let isHidden = false;
    //         for (let i = 0; i < keys.length; i++) {
    //             const value = explComms[keys[i]]
    //             const key = keys[i];

    //             if (filter.includes(`${key}_${value}`)) {
    //                 isHidden = true;
    //                 this.nodeDimensionStrategy.nodeVisualsToColorless(node);
    //                 break;
    //             }
    //         }
    //         if (!isHidden) {
    //             this.nodeDimensionStrategy.nodeColorToDefault(node);
    //         }

    //         newNodes.push(node);
    //     });
    //     nodes.update(newNodes);
    // }

    // /**
    //  * Hide/Show the label of the nodes based on nodeLabelVisibility value
    //  * @param {DataSet} nodes Dataset with the network's data of all nodes
    //  */
    // updateNodeLabelsVisibility(nodes) {
    //     const newNodes = new Array();

    //     nodes.forEach((node) => {
    //         if (!this.nodeLabelVisibility)
    //             node["font"].color = "#00000000";
    //         else
    //             node["font"].color = "#000000FF";

    //         newNodes.push(node);
    //     });
    //     nodes.update(newNodes);
    // }

    // /** 
    //  * Function executed when a node is selected that update the node visual attributes
    //  * @param {Object} values value of the parameters that will change
    //  * @param {Integer} id id of the node (unused)
    //  * @param {Boolean} selected Boolean that says if the node has been selected
    //  * @param {Boolean} hovering Boolean that says if the node has been hovered (unused)
    //  */
    // nodeChosen(values, id, selected, hovering) {
    //     if (selected) {
    //         values.size = nodes.SelectedSize;
    //     }
    // }

    // /** 
    //  * Function executed when a node is selected that update node's attributes of its label
    //  * @param {Object} values label's parameters that will change
    //  * @param {Integer} id id of the node (unused)
    //  * @param {Boolean} selected Boolean that says if the node has been selected
    //  * @param {Boolean} hovering Boolean that says if the node has been hovered (unused)
    //  */
    // labelChosen(values, id, selected, hovering) {
    //     if (selected) {
    //         values.vadjust -= 10;
    //     }
    // }
}