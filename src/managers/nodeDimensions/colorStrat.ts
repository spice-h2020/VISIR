/**
 * @fileoverview This class changes the background color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst } from "../../constants/nodes";
import { UserData } from "../../constants/perspectivesTypes";
//Local files
import GenericStrategy from "./genericStrat";

export default class ColorStrategy extends GenericStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Color, nodeConst.nodeDimensions.getColor);
    }

    /**
     * Changes the background's color
     * @param user user to edit
     */
    change(user: UserData) {
        if (this.attr !== undefined && this.attr.active) {

            const value = user.explicit_community[this.attr.key];

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

        user["color"]["background"] = nodeConst.noFocusColor.background;
    }

}