/**
 * @fileoverview This file creates a words cloud graph. Currently the colors of the words are randomized 
 * by the package.
 * @package Requires React package.  
 * @package Requires react-tagcloud package.
 * @author Marco Expósito Pérez
 */
//Packages
import React from 'react';
import { TagCloud } from 'react-tagcloud'

const tagCloudStyle: React.CSSProperties = {
    maxHeight: "200px",
    border: "1px solid black",
    cursor: "default",
    backgroundColor: "white",
    width: "80%",
    margin: "auto"
}

interface WordCloudProps {
    minSize?: number;
    maxSize?: number;
    data: {
        props?: {}; value: string, count: number
    }[];
}

/**
 * UI component that creates a word cloud graph.
 */
export const WordCloudGraph = ({
    minSize = 10,
    maxSize = 30,
    data,
}: WordCloudProps) => {

    for (let obj of data) {
        obj.props = {
            title: `${obj.count * 100}%`
        }
    }

    return (
        <div style={tagCloudStyle}>
            <TagCloud
                tags={data}
                minSize={minSize}
                maxSize={maxSize}
            />
        </div>
    );
};
