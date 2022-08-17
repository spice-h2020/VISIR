
import { Dimensions, DimAttribute, node } from "../../constants/nodesConstants";
import { UserData } from "../../constants/perspectivesTypes";
import DimensionStrategy from "./dimensionStrat";

export default class BorderStrategy extends DimensionStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Border, node.nodeDimensions.getBorder);
    }

    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            user["color"].border = this.dimensionMap.get(value);
            user["borderWidth"] = node.defaultBorderColorWidth;
            user["borderWidthSelected"] = node.selectedBorderColorWidth;

        } else {

            user["color"].border = "transparent";

            user["borderWidth"] = node.defaultBorderWidth;
            user["borderWidthSelected"] = node.selectedBorderWidth;
        }
    }

    toColorless(user: UserData) {
        user["color"]["background"] = node.NoFocusColor.Border;
    }
}