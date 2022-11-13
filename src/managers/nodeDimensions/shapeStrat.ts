/**
 * @fileoverview This class changes the shape and font vertical align of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst, shapeData } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";
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
    change(user: IUserData, isFocus: boolean) {
        if (this.attr !== undefined && this.attr.active) {

            if (user.isAnonGroup) {
                user["shape"] = nodeConst.defaultShape.name;
                user.font = {
                    vadjust: nodeConst.defaultShape.vAdjust,
                }
            } else if (user.isAnonimous) {
                user["shape"] = "image";
                user["image"] = "../../images/unknown.svg";

            } else {
                const value = user.explicit_community[this.attr.key];

                const shape: shapeData = this.dimensionMap.get(value);

                if (shape !== undefined) {

                    user["shape"] = shape.name;

                    user.font = {
                        vadjust: shape.vAdjust,
                    }

                } else {
                    console.log("Shape value is undefined in shape Strategy change function when it should not be");
                }
            }

        } else {

            user["shape"] = nodeConst.defaultShape.name;
            user.font = {
                vadjust: nodeConst.defaultShape.vAdjust,
            }
        }

        if (isFocus) {
            user.size = nodeConst.selectedSize;
        } else if (user.isMedoid) {
            user.size = nodeConst.medoidSize;
        } else {
            user.size = nodeConst.defaultSize;
        }

        user.size = user.isAnonimous ? user.size + nodeConst.anonimousSizeIncrease : user.size;
    }

    /**
     * This strategy doesnt do anything when a node turn colorless
     * @param user 
     */
    toColorless(user: IUserData): void {
        user.size = user.isAnonimous ? nodeConst.defaultSize + nodeConst.anonimousSizeIncrease : nodeConst.defaultSize;

        if (user.isAnonimous && !user.isAnonGroup) {
            user["image"] = "../../images/colorlessUnknown.svg";
        }
    }
}