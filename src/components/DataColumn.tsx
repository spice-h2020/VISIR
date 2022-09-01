/**
 * @fileoverview This file creates two diferent datatables one on top of the other in a column. The props that contain the info will be parsed to decide what info to show.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { CommunityData, UserData } from "../constants/perspectivesTypes";
import { DataRow } from "../constants/auxTypes";
import { ViewOptions } from "../constants/viewOptions";
//Packages
import { useState, useEffect } from "react";
//Local files
import { DataTable } from "../basicComponents/Datatable";


/**
 * local aux class to hold the all the info of a datatable
 */
class DatatableData {
    mainRows: DataRow[]
    subRows: DataRow[]

    constructor() {
        this.mainRows = new Array();
        this.subRows = new Array();
    }
}

interface DataColumnProps {
    //Tittle shown above both tables
    tittle: React.ReactNode
    //Data of both tables
    node: UserData | undefined,
    community: CommunityData | undefined,
    //Options that may hide some of the rows values
    viewOptions: ViewOptions,
}

/**
 * Component that creates 2 datatables and tell them what datarows to show
 */
export const DataColumn = ({
    tittle,
    node,
    viewOptions,
    community,
}: DataColumnProps) => {

    //States that hold the info of the node and community datatables
    const [nodeInfo, setNodeInfo] = useState<DatatableData>(new DatatableData());
    const [commInfo, setCommInfo] = useState<DatatableData>(new DatatableData());


    useEffect(() => {
        updateNodeInfo(node, setNodeInfo, viewOptions);
    }, [node, viewOptions]);

    useEffect(() => {
        updateCommInfo(community, setCommInfo);
    }, [community]);


    return (
        <div className="dataColumn">
            <h1> {tittle} </h1>
            <hr />
            <div>
                <DataTable
                    tittle={"Citizen Attributes"}
                    MainRows={nodeInfo.mainRows}
                    SubRows={nodeInfo.subRows}
                />
            </div>
            <div>
                <DataTable
                    tittle={"Community Attributes"}
                    MainRows={commInfo.mainRows}
                    SubRows={commInfo.subRows}
                />
            </div>
        </div>
    );
};

/**
 * Updates the nodeInfo state when the node prop changes
 * @param node node prop
 * @param setNodeInfo function to update the nodeInfo state
 * @param viewOptions options that will change what attributes to visualize
 */

function updateNodeInfo(node: UserData | undefined, setNodeInfo: Function, viewOptions: ViewOptions) {
    const newNodeData = new DatatableData();

    if (!viewOptions.hideLabels) {
        newNodeData.mainRows.push(new DataRow("Id", node !== undefined ? node.id : ""));
        newNodeData.mainRows.push(new DataRow("Label", node !== undefined ? node.label : ""));
    }
    newNodeData.mainRows.push(new DataRow("Community", node !== undefined ? node.implicit_community : ""));

    if (node !== undefined) {
        const keys = Object.keys(node.explicit_community);

        for (let i = 0; i < keys.length; i++) {
            newNodeData.subRows.push(new DataRow(keys[i], node.explicit_community[keys[i]]));
        }
    }

    setNodeInfo(newNodeData);
}

/**
 * Updates the commInfo state when the community prop changes
 * @param community community prop
 * @param setCommInfo function to update the commInfo state
 */
function updateCommInfo(community: any, setCommInfo: Function) {

    const newCommData = new DatatableData();

    newCommData.mainRows.push(new DataRow("Id", community !== undefined ? community.id : ""));
    newCommData.mainRows.push(new DataRow("Name", community !== undefined ? community.name : ""));
    newCommData.mainRows.push(new DataRow("Explanation", community !== undefined ? community.explanation : "", true));

    if (community !== undefined && community.bb !== undefined) {
        newCommData.subRows.push(new DataRow("Color", community.bb.color.name))
    }
    setCommInfo(newCommData);

}