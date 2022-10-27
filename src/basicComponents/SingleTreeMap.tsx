/**
 * @fileoverview This file creates a button that can be clicked and will execute the onClick function prop.
 * @package Requires React package. 
 * @author Marco Expósito Pérez
 */
//Packages
import ReactApexChart from "react-apexcharts";

interface SingleTreeMapProps {
    data: {
        props?: {}; value: string, count: number
    }[];
}

/**
 * Basic UI component that execute a function when clicked
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

    for (let obj of data) {
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
