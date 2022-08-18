/**
 * @fileoverview This file creates two diferent datatables one on top of the other in a column. The props that contain the info will be parsed to decide what info to show.
 * @package It requires React package. 
 * @author Marco Expósito Pérez
 */
//Namespaces
import { UserData } from "../namespaces/perspectivesTypes";
//Packages
import { useState, useEffect } from "react";
//Local files
import { DataTable, DataRow } from "../basicComponents/Datatable";

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
    tittle: React.ReactNode
    node: UserData | undefined,

    community: any,
}


/**
 * Component that creates 2 datatables and tell them what datarow to show
 */
export const DataColumn = ({
    tittle,
    node,
    community,
}: DataColumnProps) => {

    const [nodeInfo, setNodeInfo] = useState<DatatableData>(new DatatableData());
    const [commInfo, setCommInfo] = useState<DatatableData>(new DatatableData());

    useEffect(() => {

        updateNodeInfo(node, setNodeInfo);
        updateCommInfo(community, setCommInfo);

    }, [node, community]);

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
 */

function updateNodeInfo(node: UserData | undefined, setNodeInfo: Function) {
    const newNodeData = new DatatableData();

    newNodeData.mainRows.push(new DataRow("Id", node !== undefined ? node.id : ""));
    newNodeData.mainRows.push(new DataRow("Label", node !== undefined ? node.label : ""));
    newNodeData.mainRows.push(new DataRow("Implicit_community", node !== undefined ? node.implicit_community : ""));

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
    newCommData.mainRows.push(new DataRow("Explanation", community !== undefined ? community.explanation : ""));

    setCommInfo(newCommData);

}