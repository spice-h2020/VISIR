/**
 * @fileoverview This file creates a panel with the data of a user and its interactions.
 * If no user is provided, the panel will be empty.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData, IInteraction, IUserData }
    from "../constants/perspectivesTypes";
//Packages
import React from "react";
//Local files
import { InteractionPanel } from "../basicComponents/Interaction";
import { Accordion } from "../basicComponents/Accordion";
import { CTranslation, ITranslation } from "../managers/CTranslation";

const sectionTittleStyle: React.CSSProperties = {
    fontSize: "1.2em",
    fontWeight: "bold",
    fontFamily: "var(--contentFont)",
    lineHeight: "135%",
    width: "100%",
    margin: "0.5rem 0px",
    color: "var(--title)",
}

const frenchIndent: React.CSSProperties = {
    textIndent: "-30px",
    paddingLeft: "40px"
}

interface NodePanelProps {
    tittle: String;
    node: IUserData | undefined;
    showLabel: boolean;
    artworks: IArtworkData[];
    translation: ITranslation | undefined;
}

/**
 * UI component that shows diferent types of data in a column
 */
export const NodePanel = ({
    tittle,
    node,
    showLabel,
    artworks,
    translation,
}: NodePanelProps) => {

    const tittleContainer = <div key={0} style={sectionTittleStyle}> {tittle} </div>;
    let content: React.ReactNode[] = new Array<React.ReactNode>();

    if (node !== undefined) {

        if (showLabel) {
            content.push(<p style={frenchIndent} key={1}> <strong> {`${translation?.dataColumn.userLabelLabel}:`} </strong> &nbsp; {node.label} </p>);
        }

        const keys = Object.keys(node.explicit_community);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = node.explicit_community[keys[i]];

            content.push(
                <p key={2 + i} style={frenchIndent}> <strong> {key} </strong> &nbsp; {value} </p >);
        }

        content.push(<div key={-1} style={{ margin: "0.5rem 0px" }}> {getInteractionsAccordion(node, artworks, translation)} </div>);
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
function getInteractionsAccordion(node: IUserData | undefined, artworks: IArtworkData[], translation: ITranslation | undefined) {
    let content: React.ReactNode[] = [];

    if (node !== undefined) {

        if (node.community_interactions !== undefined) {

            const { interactionPanels, tittles }: { interactionPanels: React.ReactNode[]; tittles: string[]; } =
                getInteractionsPanel(node.community_interactions, artworks, true);

            if (interactionPanels.length > 0) {
                content.push(
                    <div key={1} style={{ margin: "0.5rem 0px" }}>
                        <strong>
                            {`${translation?.dataColumn.relatedContributions}`}
                        </strong>
                        <Accordion
                            items={interactionPanels}
                            tittles={tittles}
                        />
                    </div>);
            }
        }

        if (node.no_community_interactions !== undefined) {
            const { interactionPanels, tittles }: { interactionPanels: React.ReactNode[]; tittles: string[]; } =
                getInteractionsPanel(node.no_community_interactions, artworks, false);

            if (interactionPanels.length > 0) {
                content.push(
                    <div key={0} style={{ margin: "0.5rem 0px" }}>
                        <strong>
                            {`${translation?.dataColumn.otherContributions}`}
                        </strong>
                        <Accordion
                            items={interactionPanels}
                            tittles={tittles}
                        />
                    </div>);
            }
        }

    }

    return content;
}

function getInteractionsPanel(interactions: IInteraction[], artworks: IArtworkData[], isCommunity: boolean) {
    const tittles: string[] = new Array<string>();
    const interactionPanels: React.ReactNode[] = new Array<React.ReactNode>();

    for (let i = 0; i < interactions.length; i++) {

        const interaction = interactions[i];
        const artwork = artworks.find((element: IArtworkData) => { return element.id === interaction.artwork_id; });

        if (artwork !== undefined) {
            tittles.push(artwork.tittle);
            interactionPanels.push(
                <InteractionPanel
                    artworksData={artworks}
                    interaction={interaction} />
            );
        }
    }
    return { interactionPanels, tittles };
}
