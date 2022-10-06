/**
 * @fileoverview This file creates a table with the data of a community, a user and its interactions.
 * If a user is provided, the communnity will be the users community.
 * Otherwise, no user data will be shown.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { ArtworkData, CommunityData, UserData } from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { InteractionPanel } from "../basicComponents/Interaction";
import { Accordion } from "../basicComponents/Accordion";

const tittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "400",
    fontFamily: "Raleway",
    lineHeight: "135%",
    width: "100%",
    margin: "5px 0px"
}

const tableContainer: React.CSSProperties = {
    margin: "auto",
    padding: "16px 16px 24px 16px",
    backgroundColor: "white",
    border: "1px solid #dadce0",
    boxSizing: "border-box",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    wordWrap: "break-word",
}

interface DataTableProps {
    tittle?: String;
    node?: UserData;
    community?: CommunityData;
    artworks: ArtworkData[];

    hideLabel: boolean;
    state: string;
}

/**
 * Basic UI component that shows some data in a table
 */
export const DataTable = ({
    tittle = "Perspective A",
    node,
    community,
    artworks,
    hideLabel,
    state,
}: DataTableProps) => {

    const nodePanel = getNodePanel(node, hideLabel);
    const interactions = getInteractionsAccordion(node, artworks);
    const communities = getCommunityPanel(community)

    return (
        <div className= {state} style={getContainerStyle(state)}>
            <h2 className="tittle"> {tittle} </h2>
            {nodePanel}
            {interactions}
            {communities}
        </div>
    )
};

function getNodePanel(node: UserData | undefined, hideLabel: boolean) {
    const tittle = <div style={tittleStyle}> Citizen Attributes </div>;
    let content: React.ReactNode[] = [];

    if (node !== undefined) {

        if (!hideLabel) {
            content.push(<div className="row" key={-1}> <strong> Label: </strong> &nbsp; {node.label} </div>);
        }

        const keys = Object.keys(node.explicit_community);

        for (let i = 0; i < keys.length; i++) {
            content.push(<div className="row" key={i}> {`${keys[i]}: ${node.explicit_community[keys[i]]}`} </div>);
        }
    }

    return (
        <div style={{ borderBottom: "1px #dadce0 inset", paddingBottom: "3px" }} key={1}>
            {tittle}
            {content}
        </div>
    )
}

function getInteractionsAccordion(node: UserData | undefined, artworks: ArtworkData[]) {
    let content: React.ReactNode[] = [];

    if (node !== undefined && node.interactions !== undefined) {

        const tittles: string[] = [];
        const interactions: React.ReactNode[] = [];

        for (let i = 0; i < node.interactions.length; i++) {

            const interaction = node.interactions[i];
            const artwork = artworks.find((element: ArtworkData) => { return element.id === interaction.artwork_id });

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

        content.push(
            <div key={2} style={{margin: "5px 0px"}}>
                <Accordion
                    items={interactions}
                    tittles={tittles}
                />
            </div>
        )
    }

    return (<React.Fragment key={2}>
        {content}
    </React.Fragment>);
}

function getCommunityPanel(community: CommunityData | undefined) {
    const tittle = <div style={tittleStyle}> Community Attributes </div>;
    let content: React.ReactNode[] = [];

    if (community !== undefined) {

        content.push(<div className="row" key={-1}> <strong> Name: </strong> &nbsp; {community.name} </div>);
        content.push(<div className="row" key={-2}> <strong> Explanation: </strong> &nbsp; {community.explanation} </div>);

        const users = community.users.toString();
        content.push(<div className="row" key={-4}> {` Users: ${users.replace(/,/g, ', ')}`} </div>);
    }

    return (
        <div style={{ borderTop: "1px #dadce0 inset", paddingTop: "3px" }} key={3}>
            {tittle}
            {content}
        </div>
    )
}

function getContainerStyle(currentState: string): React.CSSProperties {
    let newStyle: React.CSSProperties = (JSON.parse(JSON.stringify(tableContainer)));

    if (currentState === "active") {
        newStyle.borderLeft = "7px solid var(--primaryButtonColor)";
    }

    return newStyle;
}