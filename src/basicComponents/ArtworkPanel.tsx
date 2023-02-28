/**
 * @fileoverview This file creates a panel with the information of a user interaction with an artwork. This is used
 * inside accordion items to show all interactions in a compact way.
 * It shows the name,year,author and image of an artwork. And what the user said about the artwork with the emotions
 * they felt.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Constants
import { IArtworkData } from "../constants/perspectivesTypes";
//Packages
import { useEffect, useState } from "react";
import React from "react";

interface ArtworkPanelProps {
    artworksData: IArtworkData[];
    id: string;
    nInteractions?: number;
}

/**
 * UI component that only shows information about a single interaction of a user with an artwork.
 */
export const ArtworkPanel = ({
    artworksData,
    id,
    nInteractions,
}: ArtworkPanelProps) => {

    const [artworkData, setArtworkData] = useState<IArtworkData>();

    useEffect(() => {
        const newArtwork = artworksData.find((element: IArtworkData) => { return element.id === id })
        setArtworkData(newArtwork);

    }, [id, artworksData]);

    if (artworkData !== undefined) {
        return (
            <div className="interaction-container row">
                <div className="col">
                    <div style={{ fontSize: "80%" }}>
                        {artworkData.author}
                    </div>
                    <br />
                    <div className="row">
                        {artworkData.tittle}&nbsp;
                        ({artworkData.year})
                    </div>
                    <br />
                    {getNInteractionsRow(nInteractions)}

                </div>
                <div className="col">
                    <img className="artwork-image" src={artworkData.image}
                        alt={artworkData.tittle}
                    />
                </div>
            </div>
        );
    } else
        return (
            <div> </div>
        );
};



function getNInteractionsRow(nInteractions: number | undefined) {
    if (nInteractions !== undefined)
        return (<div className="row">
            Number of interactions: &nbsp; {nInteractions}
        </div>)
    else {
        return <React.Fragment />
    }
}