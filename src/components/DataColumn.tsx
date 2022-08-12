import { useState } from "react";

import { Button } from "../basicComponents/Button";
import { Dropdown } from "../basicComponents/Dropdown";

import { FileSource, tbOptions, ButtonState } from "../constants/toolbarOptions";

interface DataColumnProps {
    node: Object,

    community?: Object,
}


/**
 * Dropdown component that holds the options to change the source of perspective files in the visualization tool
 */
export const DataColumn = ({
    node,
    community,
}: DataColumnProps) => {

    const [nodeInfo, setNodeInfo] = useState<Object>(node);
  
    return (
        <div className="dataColumn">
            <div>

                nodeInfo

            </div>
            <div>

                community Info

            </div>
        </div>
    );
};