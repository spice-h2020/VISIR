/**
 * @fileoverview This file creates a panel with the information of a user interaction with an artwork. This is used
 * inside accordion items to show all interactions in a compact way.
 * It shows the name,year,author and image of an artwork. And what the user said about the artwork with the emotions
 * they felt.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData, IStringNumberRelation, IInteraction } from "../constants/perspectivesTypes";
//Packages
import { useEffect, useState } from "react";
import { getWordClouds } from "../components/DataColumn";

const interactionBox: React.CSSProperties = {
    borderLeft: "1px solid var(--grayLineColor)",
    borderRight: "1px solid var(--grayLineColor)",
    padding: "0.5rem",
}

const userFeelings: React.CSSProperties = {
    width: "80%",
    margin: "1rem auto",
    border: "2px dashed var(--primaryButtonColor)",
    boxSizing: "border-box",
    textAlign: "center",
    padding: "1rem",
}

const artworkImage: React.CSSProperties = {
    maxHeight: "100%",
    maxWidth: "100%",
    border: "2px solid var(--grayLineColor)",
}

interface InteractionPanelProps {
    artworksData: IArtworkData[];
    interaction: IInteraction;
}

/**
 * UI component that only shows information about a single interaction of a user with an artwork.
 */
export const InteractionPanel = ({
    artworksData,
    interaction,
}: InteractionPanelProps) => {

    const [artworkData, setArtworkData] = useState<IArtworkData>();

    useEffect(() => {
        const newArtwork = artworksData.find((element: IArtworkData) => { return element.id === interaction.artwork_id })
        setArtworkData(newArtwork);

    }, [interaction, artworksData]);

    if (artworkData !== undefined) {
        return (
            <div style={interactionBox}>
                <div style={{ maxHeight: "20vh" }} className="row">
                    <div className="col">
                        <div style={{ fontSize: "80%" }}>
                            {artworkData.author}
                        </div>
                        <br />
                        <div className="row">
                            {artworkData.tittle}&nbsp;
                            ({artworkData.year})
                        </div>
                    </div>
                    <div className="col">
                        <img style={artworkImage} src={artworkData.image}
                            alt={artworkData.tittle}
                        />
                    </div>
                </div>
                <div className="row">
                    <div style={userFeelings}>
                        "{interaction.feelings}"
                    </div>
                </div>
                {getEmotions(interaction.extracted_emotions)}
            </div>
        );
    } else
        return (
            <div> </div>
        );
};

function getEmotions(extracted_emotions: IStringNumberRelation[] | undefined): React.ReactNode {
    if (extracted_emotions !== undefined) {
        return (
            <div>
                <strong> Makes me feel:</strong>
                {getWordClouds(extracted_emotions)}
            </div>);

    } else {
        return "";
    }
}


