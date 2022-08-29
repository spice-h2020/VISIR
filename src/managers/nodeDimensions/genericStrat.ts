/**
 * @fileoverview This abstract class is the parent of all diferent dimensions strats executing the generic functions.
 * @author Marco Expósito Pérez
 */
//Namespaces
import { DimAttribute, Dimensions } from "../../namespaces/nodes";
import { UserData } from "../../namespaces/perspectivesTypes";


export default abstract class GenericStrategy {
    //Key of the attribute that changes each strategy.
    key: string | undefined
    //Map with the relation "Value of the attribute whose key is this.key" -> "The corresponding dimension value for each dimensions strat"
    dimensionMap: Map<string, any>

    /**
     * Constructor of the class
     * @param attributesArray Array with all Dimension attributes 
     * @param dimension Dimension to look for in the attributesArray
     * @param getDimension Function that returns the values for the dimension map
     */
    constructor(attributesArray: DimAttribute[], dimension: Dimensions, getDimension: Function) {

        const attribute = attributesArray.filter(attr => attr.dimension === dimension)[0];

        this.dimensionMap = new Map<string, string>();
        if (attribute !== undefined) {

            this.key = attribute.key;
            this.fillMap(attribute.values, getDimension);

        }
    }

    /**
     * Fill the dimensionMap with the values and the dimension obtained from the function
     * @param values values that will be a key in the map
     * @param getDimension function that returns the value for each key in the map
     */
    fillMap(values: string[], getDimension: Function) {
        for (let i = 0; i < values.length; i++) {
            const color = getDimension(i);
            this.dimensionMap.set(values[i], color);
        }
    }

    //Change the user properties to fit the dimension strategy
    abstract change(user: UserData): void;
    //Change the user properties to make it colorless acordingly with the dimension strategy
    abstract toColorless(user: UserData): void;
}






