/**
 * @fileoverview This abstract class is the parent of all diferent dimensions strats. Executes the functions that
 * are the same for all dim strats, like finding its dimension in the attributes array and filling the map with the
 * (Explicit Community value -> specific dimensions data) relationship.
 * 
 * @author Marco Expósito Pérez
 */
//Constants
import { DimAttribute, Dimensions } from "../../constants/nodes";
import { IUserData } from "../../constants/perspectivesTypes";

export default abstract class GenericStrategy {
    //Attribute of this strategy.
    attr: DimAttribute;
    /*Map with the relation: 
    "Value of the attribute whose key is this.key" -> "The corresponding dimension value for each dimensions strat"
    */
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
     * @param getDimension function that returns the value for each key in the map
     */
    fillMap(getDimension: Function) {
        for (let i = 0; i < this.attr.values.length; i++) {
            const dimension = getDimension(i);
            this.dimensionMap.set(this.attr.values[i], dimension);
        }
    }

    // <-- MUST BE OVERRIDEN -->
    //Change the user properties to fit the dimension strategy. 
    abstract change(user: IUserData, isFocus: boolean, increasedSize: boolean): void;
    //Change the user properties to make it colorless acordingly with the dimension strategy
    abstract toColorless(user: IUserData): void;
}






