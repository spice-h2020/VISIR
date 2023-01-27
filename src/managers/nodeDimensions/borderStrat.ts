/**
 * @fileoverview This class changes the border color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Constants
import { Dimensions, DimAttribute, nodeConst } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";
//Local files
import GenericStrategy from "./genericStrat";

export default class BorderStrategy extends GenericStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Border, nodeConst.nodeDimensions.getBorder);
    }

    /**
     * Changes the border's color and width
     * @param user user to edit
     */
    change(user: IUserData, isFocus: boolean, increasedSize: boolean) {
        if (this.attr !== undefined && this.attr.active) {

            const value = user.explicit_community[this.attr.key];

            user["color"].border = this.dimensionMap.get(value);

            if (isFocus && increasedSize) {
                user["borderWidth"] = nodeConst.selectedBorderColorWidth;
            } else {
                user["borderWidth"] = nodeConst.defaultBorderColorWidth;
            }

        } else {

            user["color"].border = "black";

            if (isFocus) {
                if (increasedSize)
                    user["borderWidth"] = nodeConst.selectedBorderWidth;
                else
                    user["borderWidth"] = nodeConst.defaultBorderWidth;
            } else {
                user["borderWidth"] = 0;
            }

        }
    }

    /**
     * Change the border's color
     * @param user user to edit
     */
    toColorless(user: IUserData) {
        user["color"]["border"] = nodeConst.noFocusColor.border;

        if (this.attr !== undefined && this.attr.active)
            user["borderWidth"] = nodeConst.defaultBorderColorWidth;
        else
            user["borderWidth"] = 0;
    }
}