import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip } from './Tooltip';
import { Button } from './Button';

export default {
    title: 'Example/Tooltip',
    component: Tooltip,

} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

const textColStyle = {
    marginTop: "4px",
    overflow: "hidden",
    whiteSpace: "nowrap"
} as React.CSSProperties;

const button1 =
    <div className="row legendButton">
        <div className="col-9 text" style={textColStyle}>
            Boomer
        </div>
        <div className="col-3 icon">
            <div className="LegendShape star"> </div>
        </div>
    </div >;

const button2 =
    <div className="row legendButton">
        <div className="col-9 text" style={textColStyle}>
            Gen X
        </div>
        <div className="col-3 icon">
            <div className="LegendShape square"> </div>
        </div>
    </div >;

const button3 =
    <div className="row legendButton">
        <div className="col-9 text" style={textColStyle}>
            Silent
        </div>
        <div className="col-3 icon">
            <div className="LegendShape triangle"> </div>
        </div>
    </div >;

const button4 =
    <div className="row legendButton">
        <div className="col-9 text" style={textColStyle}>
            ENG
        </div>
        <div className="col-3 icon">
            <div className="LegendColor box" style={{ backgroundColor: "rgb(255, 0, 0)" }}></div>
        </div>
    </div >;

const button5 =
    <div className="row legendButton">
        <div className="col-9 text" style={textColStyle}>
            FIN
        </div>
        <div className="col-3 icon">
            <div className="LegendColor box" style={{ backgroundColor: "rgb(0, 255, 0)" }}></div>
        </div>
    </div >;

const legendContent =
    <div className='row'>
        <div className="col legend">
            <h5 className="legend">Selected language</h5>
            <div className='buttonLegendContainer'>
                <Button
                    content={button4}
                />
                <Button
                    content={button5}
                />
            </div>
        </div>
        <div className="col legend">
            <h5 className="legend">Selected age</h5>
            <div className='buttonLegendContainer'>
                <Button
                    content={button1}
                />
                <Button
                    content={button2}
                />
                <Button
                    content={button3}
                />
            </div>
        </div>
    </div>

export const legendLike = Template.bind({});
legendLike.args = {
    alignment: 'right',
    state: false,
    content: legendContent,
    showArrow: false
};

const buttonStyle = {
    height: "20px",
    float: "right",
    width: "auto",
    verticalAlign: "middle",

} as React.CSSProperties;

textColStyle["margin"] = "0px";

const nodeContent =
    <div style={{maxWidth: "300px"}}>
        <div className='row' style={{ borderBottom: "1px solid #212529" }}>
            <div className="col">
                <h3 style={textColStyle}>Node Title</h3>
            </div>
            <div className="col">
                <Button
                    content= "X"
                    style={buttonStyle}
                />
            </div>

        </div>
        <div className='col' style={{ padding: "5px 5px" }}>
            <strong> Id: </strong> 14 <br></br>
            <strong> Label: </strong> 14 <br></br>
            <strong> AgeGroup: </strong> Adult <br></br>
            <strong> Language: </strong> ESP <br></br>
            <strong> Explanation: </strong>  Representative Properties: 'Artefacts collected': 'Aalto vase' <br></br>
        </div>
    </div>


export const nodeLike = Template.bind({});
nodeLike.args = {
    alignment: 'right',
    state: false,
    content: nodeContent,
    showArrow: true
};