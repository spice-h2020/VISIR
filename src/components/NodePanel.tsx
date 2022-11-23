/**
 * @fileoverview This file creates a panel with the data of a user and its interactions.
 * If no user is provided, the panel will be empty.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData, IUserData }
    from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { InteractionPanel } from "../basicComponents/Interaction";
import { Accordion } from "../basicComponents/Accordion";

const sectionTittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "400",
    fontFamily: "var(--contentFont)",
    lineHeight: "135%",
    width: "100%",
    margin: "0.5rem 0px"
}

interface NodePanelProps {
    tittle: String;
    node: IUserData | undefined;
    hideLabel: boolean;
    artworks: IArtworkData[];
}

/**
 * UI component that shows diferent types of data in a column
 */
export const NodePanel = ({
    tittle,
    node,
    hideLabel,
    artworks,
}: NodePanelProps) => {

    const tittleContainer = <div key={0} style={sectionTittleStyle}> {tittle} </div>;
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (node !== undefined) {

        if (!hideLabel) {
            content.push(<div className="row" key={1}> <strong> Label: </strong> &nbsp; {node.label} </div>);
        }

        const keys = Object.keys(node.explicit_community);

        for (let i = 0; i < keys.length; i++) {
            content.push(<div className="row" key={2 + i}> {`${keys[i]}: ${node.explicit_community[keys[i]]}`} </div>);
        }

        content.push(<div key={-1} style={{ margin: "0.5rem 0px" }}> {getInteractionsAccordion(node, artworks)} </div>);
    }

    if (content.length === 0) {
        return <React.Fragment />;
    } else {
        return (
            <React.Fragment>
                <div style={{ borderBottom: "1px #dadce0 inset", paddingBottom: "3px" }}>
                    {tittleContainer}
                    {content}
                </div>
            </React.Fragment>
        )
    }
};

/**
 * Returns an accordion that includes all the node's interactions.
 * @param node source node
 * @param artworks all artworks' data
 * @returns a react component with the node's interactions accordion.
 */
function getInteractionsAccordion(node: IUserData | undefined, artworks: IArtworkData[]) {
    let content: React.ReactNode = <React.Fragment />;

    if (node !== undefined && node.interactions !== undefined) {

        const tittles: string[] = new Array<string>();
        const interactions: React.ReactNode[] = new Array<React.ReactNode>();

        for (let i = 0; i < node.interactions.length; i++) {

            const interaction = node.interactions[i];
            const artwork = artworks.find((element: IArtworkData) => { return element.id === interaction.artwork_id });

            if (artwork !== undefined) {
                tittles.push(artwork.tittle);
                interactions.push(
                    <InteractionPanel
                        artworksData={artworks}
                        interaction={interaction}
                    />
                );
            }
        }

        content =
            <div style={{ margin: "0.5rem 0px" }}>
                <Accordion
                    items={interactions}
                    tittles={tittles}
                />
            </div>;
    }

    return content;
}