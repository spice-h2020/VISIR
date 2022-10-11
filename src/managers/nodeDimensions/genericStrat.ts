/**
 * @fileoverview This abstract class is the parent of all diferent dimensions strats executing the generic functions.
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions } from "../../constants/nodes";
import { UserData } from "../../constants/perspectivesTypes";

export default abstract class GenericStrategy {
    //Attribute of this strategy.
    attr: DimAttribute;
    //Map with the relation "Value of the attribute whose key is this.key" -> "The corresponding dimension value for each dimensions strat"
    dimensionMap: Map<string, any>

   
    /**
     * Constructor of the class
     * @param attributesArray Array with all Dimension attributes 
     * @param dimension Dimension to look for in the attributesArray
     * @param getDimension Function that returns the values for the dimension map
     */
    constructor(attributesArray: DimAttribute[], dimension: Dimensions, getDimension: Function) {

        this.attr = attributesArray.filter(attr => attr.dimension === dimension)[0];

        this.dimensionMap = new Map<string, string>();
        if (this.attr !== undefined) {

            this.fillMap(getDimension);

        }
    }

    /**
     * Fill the dimensionMap with the values and the dimension obtained from the function
     * @param values values that will be a key in the map
     * @param getDimension function that returns the value for each key in the map
     */
    fillMap(getDimension: Function) {
        for (let i = 0; i < this.attr.values.length; i++) {
            const color = getDimension(i);
            this.dimensionMap.set(this.attr.values[i], color);
        }
    }

    //Change the user properties to fit the dimension strategy
    abstract change(user: UserData, isFocus: boolean): void;
    //Change the user properties to make it colorless acordingly with the dimension strategy
    abstract toColorless(user: UserData): void;
}






