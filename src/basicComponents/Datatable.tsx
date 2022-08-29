/**
 * @fileoverview This file creates a table with 2 columns that contains the data from the rows shared as props.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { DataRow } from "../constants/auxTypes";
//Packages
import React from "react";
//Local files
import '../style/Datatable.css';

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
                            <strong> <React.Fragment >{item.getKey()}</React.Fragment> </strong>
                            {"\u00a0\u00a0"}
                            <React.Fragment >{item.getValue(true)}</React.Fragment>
                        </div>
                    );
                })}
                {SubRows.map((item: DataRow, index: number): JSX.Element => {
                    return (
                        <div key={index} className="sub-row row">
                            <React.Fragment >{item.getKey()}</React.Fragment>
                            {"\u00a0\u00a0"}
                            <React.Fragment >{item.getValue()}</React.Fragment>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
