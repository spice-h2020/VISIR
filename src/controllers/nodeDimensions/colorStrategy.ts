

import { Dimensions, DimAttribute, node } from "../../constants/nodesConstants";
import { UserData } from "../../constants/perspectivesTypes";
import DimensionStrategy from "./dimensionStrat";

export default class ColorStrategy extends DimensionStrategy {

    constructor(attributes: DimAttribute[]) {
        super(attributes, Dimensions.Color, node.nodeDimensions.getColor);
    }


    change(user: UserData) {
        if (this.key !== undefined) {

            const value = user.explicit_community[this.key];

            user["color"] = {
                background: this.dimensionMap.get(value),
            }

        } else {
            user["color"] = {
                background: node.defaultColor,
            }
        }

        user["borderWidth"] = 0;
        user["borderWidthSelected"] = 0;

        user.defaultColor = true;
    }

    toColorless(user: UserData) {
        user.defaultColor = false;

        user["color"]["background"] = node.NoFocusColor.Background;
    }

}