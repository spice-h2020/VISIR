/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package Requires React package. 
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
    /**
     * Button contents.
     */
    minSize?: number;
    maxSize?: number;
    data: {
        props?: {}; value: string, count: number
    }[];
}

/**
 * Basic UI component that execute a function when clicked
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
