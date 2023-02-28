/**
 * @fileoverview This file Tree map graph but only with one map. Its a diferent way of representing word clouds.
 * @package Requires React package. 
 * @package Requires ApexChart and its ReactApexChart package. 
 * @author Marco Expósito Pérez
 */
//Packages
import ReactApexChart from "react-apexcharts";
import { IStringNumberRelation } from "../constants/perspectivesTypes";

interface SingleTreeMapProps {
    data: IStringNumberRelation[];
    showPercentage: boolean;
}

/**
 * UI component that creates a tree map graph with only one map.
 */
export const SingleTreeMap = ({
    data,
    showPercentage,
}: SingleTreeMapProps) => {

    const options: ApexCharts.ApexOptions = {
        legend: {
            show: false
        },
        chart: {
            type: 'treemap',
            toolbar: {
                show: false
            }
        },
        tooltip: {
            enabled: showPercentage,
            y: {
                formatter: (value) => { return value + "%" },
            },
        }
    };

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
                options={options}
                series={series}
                type="treemap"
                height={"100%"}
            />
        </div>
    );
};
