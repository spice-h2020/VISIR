import React, { useEffect, useState } from "react";
import '../style/Datatable.css';

export class DataRow {
    key: React.ReactNode;
    value: React.ReactNode;
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
 * Basic UI component that execute a function when clicked
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
