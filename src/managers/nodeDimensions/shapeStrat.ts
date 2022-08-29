/**
 * @fileoverview This class changes the shape and font vertical align of users/nodes.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { Dimensions, DimAttribute, nodeConst, shapeData } from "../../constants/nodes";
import { UserData } from "../../constants/perspectivesTypes";
//Local files
import GenericStrategy from "./genericStrat";

export default class ShapeStrategy extends GenericStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Shape, nodeConst.nodeDimensions.getShape);
    }

    /**
     * Changes the shape and font's vertical align
     * @param user user to edit
     */
    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            const shape: shapeData = this.dimensionMap.get(value);

            if (shape !== undefined) {

                user["shape"] = shape.name;
                
                user.font = {
                    vadjust: shape.vAdjust,
                }

            } else {
                console.log("Shape value is undefined in shape Strategy change function when it should not be");
            }

        } else {
            user["shape"] = nodeConst.defaultShape.name;
            user.font = {
                vadjust: nodeConst.defaultShape.vAdjust,
            }
        }

        user.size = nodeConst.defaultSize;
    }

    /**
     * This strategy doesnt do anything when a node turn colorless
     * @param user 
     */
    toColorless(): void {}
}