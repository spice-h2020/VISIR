/**
 * @fileoverview This file Tree map graph but only with one map. Its a diferent way of representing word clouds.
 * @package Requires React package. 
 * @package Requires ApexChart and its ReactApexChart package. 
 * @author Marco Expósito Pérez
 */
//Packages
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { IStringNumberRelation } from "../constants/perspectivesTypes";

interface SingleTreeMapProps {
    data: IStringNumberRelation[];
    showPercentage: boolean;
    onTreeClick?: Function;
    explKey?: string | undefined;
}

/**
 * UI component that creates a tree map graph with only one map.
 */
export const SingleTreeMap = ({
    data,
    showPercentage,
    onTreeClick,
    explKey,
}: SingleTreeMapProps) => {

    let options: ApexCharts.ApexOptions = {
        legend: {
            show: false
        },
        chart: {
            type: 'treemap',
            toolbar: {
                show: false
            },
            events: {
                dataPointSelection: (event: any, chartContext: any, config: any) => {
                    if (onTreeClick) {
                        onTreeClick(data[config.dataPointIndex].value)
                    }
                }
            }
        },
        tooltip: {
            enabled: showPercentage,
            y: {
                formatter: (value) => { return value + "%" },
            },
        }
    }

    const series = [];
    const serieData = [];

    for (const obj of data) {
        serieData.push({
            x: obj.value,
            y: obj.count
        })
    }

    series.push({
        data: serieData
    })

    return (
        <div className="treemap-container">
            <ReactApexChart
                key={explKey}
                options={options}
                series={series}
                type="treemap"
                height={"100%"}
            />
        </div>
    );
};
