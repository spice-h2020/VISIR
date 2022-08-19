/**
 * @fileoverview This class changes the background color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { Dimensions, DimAttribute, nodeConst } from "../../namespaces/nodes";
import { UserData } from "../../namespaces/perspectivesTypes";
//Local files
import DimensionStrategy from "./genericStrat";

export default class ColorStrategy extends DimensionStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Color, nodeConst.nodeDimensions.getColor);
    }

    /**
     * Changes the background's color
     * @param user user to edit
     */
    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            user["color"] = {
                background: this.dimensionMap.get(value),
            }

        } else {
            user["color"] = {
                background: nodeConst.defaultColor,
            }
        }

        user.defaultColor = true;
    }

    /**
     * Change the background's color
     * @param user user to edit
     */
    toColorless(user: UserData) {
        user.defaultColor = false;

        user["color"]["background"] = nodeConst.NoFocusColor.Background;
    }

}