/**
 * @fileoverview This class changes the border color of users/nodes.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { Dimensions, DimAttribute, nodeConst } from "../../namespaces/nodes";
import { UserData } from "../../namespaces/perspectivesTypes";
//Local files
import DimensionStrategy from "./dimensionStrat";

export default class BorderStrategy extends DimensionStrategy {

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
        user["color"]["background"] = nodeConst.NoFocusColor.Border;
    }
}