
import { DimAttribute, Dimensions } from "../../constants/nodesConstants";
import { UserData } from "../../constants/perspectivesTypes";

export default abstract class DimensionStrategy {

    key: string | undefined
    dimensionMap: Map<string, any>

    constructor(attributesArray: DimAttribute[], dimension: Dimensions, getDimension: Function) {

        const attribute = attributesArray.filter(attr => attr.dimension === dimension)[0];

        this.dimensionMap = new Map<string, string>();
        if (attribute !== undefined) {

            this.key = attribute.key;
            this.fillMap(attribute.values, getDimension);

        }
    }


    fillMap(values: string[], getDimension: Function) {
        for (let i = 0; i < values.length; i++) {
            const color = getDimension(i);
            this.dimensionMap.set(values[i], color);
        }
    }


    abstract change(user: UserData): void;
    abstract toColorless(user: UserData): void;
}






