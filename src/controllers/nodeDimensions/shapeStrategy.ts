
import { Dimensions, DimAttribute, node, shapeData } from "../../constants/nodesConstants";
import { UserData } from "../../constants/perspectivesTypes";
import DimensionStrategy from "./dimensionStrat";

export default class ShapeStrategy extends DimensionStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Shape, node.nodeDimensions.getShape);
    }


    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            const shape = this.dimensionMap.get(value);

            if (shape !== undefined) {

                user["shape"] = shape.name;
                
                user.font = {
                    vadjust: shape.vAdjust,
                    selectedVAdjust: shape.selectedVAdjust
                }

            } else {
                console.log("Shape value is undefined in shape Strategy change function when it should not be");
            }

        } else {
            user["shape"] = node.defaultShape.name;
            user.font = {
                vadjust: node.defaultShape.vAdjust,
                selectedVAdjust: node.defaultShape.selectedVAdjust
            }
        }
    }

    toColorless(user: UserData): void {}
}