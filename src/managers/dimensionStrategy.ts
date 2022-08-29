/**
 * @fileoverview This class creates all dimension strategies and broadcast the dimension change functions.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { DimAttribute } from "../constants/nodes"
import { UserData } from "../constants/perspectivesTypes";
//Local files
import BorderStrategy from "./nodeDimensions/borderStrat";
import ColorStrategy from "./nodeDimensions/colorStrat";
import GenericStrategy from "./nodeDimensions/genericStrat"
import ShapeStrategy from "./nodeDimensions/shapeStrat";

export default class NodeDimensionStrategy {

    //Array with all available strategies
    strategies: GenericStrategy[];

    /**
     * Constructor of the class
     * @param attributesArray Array with all Dimension attributes 
     */
    constructor(attributesArray: DimAttribute[]) {
        this.strategies = new Array<GenericStrategy>();

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