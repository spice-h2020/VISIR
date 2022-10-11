/**
 * @fileoverview This class creates all dimension strategies and broadcast the dimension change functions.
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions } from "../constants/nodes"
import { UserData } from "../constants/perspectivesTypes";
//Local files
import BorderStrategy from "./nodeDimensions/borderStrat";
import ColorStrategy from "./nodeDimensions/colorStrat";
import GenericStrategy from "./nodeDimensions/genericStrat"
import ShapeStrategy from "./nodeDimensions/shapeStrat";

export default class NodeDimensionStrategy {

    //Array with all available strategies
    strategies: GenericStrategy[];
    //Function to set the legend configuration
    setLegendData: Function;

    /**
     * Constructor of the class
     * @param attributesArray Array with all Dimension attributes 
     */
    constructor(attributesArray: DimAttribute[], setLegendData: Function) {
        this.setLegendData = setLegendData;

        this.strategies = new Array<GenericStrategy>();

        this.strategies.push(new ColorStrategy(attributesArray));
        this.strategies.push(new ShapeStrategy(attributesArray));
        this.strategies.push(new BorderStrategy(attributesArray));

        this.setLegendData(attributesArray);
    }

    /**
     * Change user to its default state based on the active strategies
     * @param user node to edit
     */
    nodeToDefault(user: UserData, isFocus: boolean = false) {
        this.strategies.forEach((strat) => {
            strat.change(user, isFocus);
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

    /**
     * Toggle the state of the border strategy based on the newValue
     * @param newValue new toggle border value
     */
    toggleBorderStat(newValue: boolean){
        const attributes = new Array<DimAttribute>();
        
        this.strategies.forEach((strat) => {
            if(strat.attr !== undefined){
                if(strat.attr.dimension === Dimensions.Border)
                    strat.attr.active = newValue;

                attributes.push(strat.attr)
            }
        });

        this.setLegendData(attributes);
    }
}