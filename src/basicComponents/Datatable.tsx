/**
 * @fileoverview This file creates a table with 2 columns that contains the data from the rows shared as props.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import React from "react";
//Local files
import '../style/Datatable.css';

/**
 * Aux class to streamline the data of each row. Key will be at the left of the row, value at the right
 */
export class DataRow {
    key: React.ReactNode;
    value: React.ReactNode;

    /**
     * Constructor of the class. There is no real distinction between the key param and the value param. 
     * Current datatable implementation shows key at the left of the row, and value at the right
     * @param key component of the row
     * @param value another component of the row
     */
    constructor(key: React.ReactNode, value: React.ReactNode) { this.key = key; this.value = value }
}

interface DatatableProps {
    //Tittle of the datatable.
    tittle?: React.ReactNode;
    //Rows of the datatable that will be "stronger"
    MainRows: DataRow[];
    //Rows of the datatable
    SubRows: DataRow[];
}

/**
 * Basic UI component that show data in a table of 2 columns format
 */
export const DataTable = ({
    tittle = "Datatable",
    MainRows,
    SubRows,
}: DatatableProps) => {

    return (
        <div className="datatable">
            <h2> {tittle} </h2>
            <div className="datatable-content">
                {MainRows.map((item: DataRow, index: number): JSX.Element => {
                    return (
                        <div key={index} className="main-row row">
                            <strong className="col-6"> <React.Fragment >{item.key}</React.Fragment> </strong>
                            <div className="col-6"> <React.Fragment >{item.value}</React.Fragment> </div>
                        </div>
                    );
                })}
                {SubRows.map((item: DataRow, index: number): JSX.Element => {
                    return (
                        <div key={index} className="sub-row row">
                            <div className="col-6"> <React.Fragment >{item.key}</React.Fragment> </div>
                            <div className="col-6"> <React.Fragment >{item.value}</React.Fragment> </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
