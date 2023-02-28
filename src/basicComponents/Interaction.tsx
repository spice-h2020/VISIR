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
import { getWordClouds, isAllZero } from "../components/DataColumn";

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
            <div className="interaction-container">
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
                        <img className="artwork-image" src={artworkData.image}
                            alt={artworkData.tittle}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="user-makes-me-feel">
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

        if (isAllZero(extracted_emotions)) {
            for (let pair of extracted_emotions) {
                pair.count = 1;
            }
        }

        return (
            <div>
                <strong> Makes me feel:</strong>
                {getWordClouds(extracted_emotions, false)}
            </div>);

    } else {
        return "";
    }
}


