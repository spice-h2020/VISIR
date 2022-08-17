import { Dimensions, DimAttribute } from "../constants/nodesConstants"
import { UserData } from "../constants/perspectivesTypes";
import BorderStrategy from "./nodeDimensions/borderStrategy";
import ColorStrategy from "./nodeDimensions/colorStrategy";
import DimensionStrategy from "./nodeDimensions/dimensionStrat"
import ShapeStrategy from "./nodeDimensions/shapeStrategy";

export default class NodeDimensionStrategy {

    strategies: DimensionStrategy[];

    constructor(attributesArray: DimAttribute[]) {
        this.strategies = new Array<DimensionStrategy>();

        this.strategies.push(new ColorStrategy(attributesArray));
        this.strategies.push(new ShapeStrategy(attributesArray));
        this.strategies.push(new BorderStrategy(attributesArray));

    }

    nodeToDefault(node: UserData) {
        this.strategies.forEach((strat) => {
            strat.change(node);
        });
    }

    nodeToColorless(node: UserData) {
        this.strategies.forEach((strat) => {
            strat.toColorless(node);
        });
    }
}