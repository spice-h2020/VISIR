/**
 * @fileoverview This class changes the border color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { Dimensions, DimAttribute, nodeConst } from "../../constants/nodes";
import { UserData } from "../../constants/perspectivesTypes";
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
    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            user["color"].border = this.dimensionMap.get(value);
            user["borderWidth"] = nodeConst.defaultBorderColorWidth;
            user["borderWidthSelected"] = nodeConst.selectedBorderColorWidth;

        } else {

            user["color"].border = "transparent";

            user["borderWidth"] = nodeConst.defaultBorderWidth;
            user["borderWidthSelected"] = nodeConst.selectedBorderWidth;

        }
    }

    /**
     * Change the border's color
     * @param user user to edit
     */
    toColorless(user: UserData) {
        user["color"]["border"] = nodeConst.noFocusColor.border;
    }
}