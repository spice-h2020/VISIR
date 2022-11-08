/**
 * @fileoverview This class changes the background color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";
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
    change(user: IUserData, isFocus: Boolean) {
        if (this.attr !== undefined && this.attr.active && !user.isAnonimous) {

            const value = user.explicit_community[this.attr.key];

            user["color"] = {
                background: this.dimensionMap.get(value),
            }

        } else {
            user["color"] = {
                background: nodeConst.defaultColor,
            }
        }
    }

    /**
     * Change the background's color
     * @param user user to edit
     */
    toColorless(user: IUserData) {
        if (!user.isAnonimous) {
            if (user["color"] === undefined) {
                user["color"] = {
                    background: nodeConst.noFocusColor.background,
                }
            } else {
                user.color.background = nodeConst.noFocusColor.background;
            }
        }

    }

}