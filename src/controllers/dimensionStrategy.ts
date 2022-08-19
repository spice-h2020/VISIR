/**
 * @fileoverview This class creates all strategies and broadcast the dimension change functions.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { DimAttribute } from "../namespaces/nodes"
import { UserData } from "../namespaces/perspectivesTypes";
//Local files
import BorderStrategy from "./nodeDimensions/borderStrat";
import ColorStrategy from "./nodeDimensions/colorStrat";
import DimensionStrategy from "./nodeDimensions/genericStrat"
import ShapeStrategy from "./nodeDimensions/shapeStrat";

export default class NodeDimensionStrategy {

    //Array with all available strategies
    strategies: DimensionStrategy[];

    /**
     * Constructor of the class
     * @param attributesArray Array with all Dimension attributes 
     */
    constructor(attributesArray: DimAttribute[]) {
        this.strategies = new Array<DimensionStrategy>();

        this.strategies.push(new ColorStrategy(attributesArray));
        this.strategies.push(new ShapeStrategy(attributesArray));
        this.strategies.push(new BorderStrategy(attributesArray));

    }

    /**
     * Change user to its default state based on the active strategies
     * @param user node to edit
     */
    nodeToDefault(user: UserData) {
        this.strategies.forEach((strat) => {
            strat.change(user);
        });
    }

    /**
     * Change user to colorless state based on the active strategies
     * @param user node to edit
     */
    nodeToColorless(user: UserData) {
        this.strategies.forEach((strat) => {
            strat.toColorless(user);
        });
    }
}