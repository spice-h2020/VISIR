import { useState, useEffect } from "react";

import { DataTable, DataRow } from "../basicComponents/Datatable";


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
    node: any,

    community: any,
}


/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool
 */
export const DataColumn = ({
    tittle,
    node,
    community,
}: DataColumnProps) => {

    const [nodeInfo, setNodeInfo] = useState<DatatableData>(new DatatableData());
    const [commInfo, setCommInfo] = useState<DatatableData>(new DatatableData());

    useEffect(() => {
        const newNodeData = new DatatableData();
        if (node !== undefined) {
            newNodeData.mainRows.push(new DataRow("Id", node.id))
            newNodeData.mainRows.push(new DataRow("Label", node.label))
            newNodeData.mainRows.push(new DataRow("Group", node.group))

            const keys = Object.keys(node.explicit_community);

            for (let i = 0; i < keys.length; i++) {
                newNodeData.subRows.push(new DataRow(keys[i], node.explicit_community[keys[i]]));
            }
        } else {
            newNodeData.mainRows.push(new DataRow("Id", ""))
            newNodeData.mainRows.push(new DataRow("Label", ""))
            newNodeData.mainRows.push(new DataRow("Group", ""))
        }

        setNodeInfo(newNodeData);
    }, [node]);

    useEffect(() => {
        const newCommData = new DatatableData();

        newCommData.mainRows.push(new DataRow("Id", community !== undefined ? community.id : ""))
        newCommData.mainRows.push(new DataRow("Name", community !== undefined ? community.name : ""))
        newCommData.mainRows.push(new DataRow("Explanation", community !== undefined ? community.explanation : ""))
        
        setCommInfo(newCommData);
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