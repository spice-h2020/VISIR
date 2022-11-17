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
}

/**
 * UI component that creates a tree map graph with only one map.
 */
export const SingleTreeMap = ({
    data,
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
        }
    };

    const series = [];
    const serieData = [];

    for (const obj of data) {
        if (obj.count <= 10) {
            obj.count *= 100;
        }

        serieData.push({
            x: obj.value,
            y: obj.count
        })
    }

    series.push({
        data: serieData
    })

    return (
        <div style={{
            width: "80%",
            margin: "auto",
            maxHeight: "200px"
        }}>
            <ReactApexChart
                options={options}
                series={series}
                type="treemap"
                height={"100%"}
            />
        </div>
    );
};
