import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip } from './Tooltip';
import { Button } from './Button';

export default {
    title: 'Example/Tooltip',
    component: Tooltip,

} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

const legendLikehtml = `
<div class="popover-body legend" id="PopoverLegend"><div class="row">     
    <div class="col-6 legend color border-end border-dark">
        <h5 class="Legend-subTittle border-bottom border-dark text-center">  Selected language </h5>
        <div class="legendButtonContainer" id="legendButtonContainer color">
            <button class="legend btn" name="legendOption" id="legendButtonSelected language_ENG">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                            ENG
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendColor box" style="background-color: rgb(255, 0, 0);"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected language_FIN">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                            FIN
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendColor box" style="background-color: rgb(0, 255, 72);"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected language_SWE">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                            SWE
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendColor box" style="background-color: rgb(25, 166, 255);"></div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    </div>
    <div class="col-6 legend shape ">
        <h5 class="Legend-subTittle border-bottom border-dark text-center">  Selected age </h5>
        <div class="legendButtonContainer" id="legendButtonContainer shape">
            <button class="legend btn" name="legendOption" id="legendButtonSelected age_Boomer">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                             Boomer
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendShape dot"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected age_GenX">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                             Gen X
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendShape diamond"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected age_Silent">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                             Silent
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendShape star"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected age_Millenial">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                             Millenial
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendShape triangle"></div>
                        </div>
                    </div>
                </div>
            </button>
            <button class="legend btn" name="legendOption" id="legendButtonSelected age_GenZ">
                <div class="container legend">
                    <div class="row">
                        <div class="col-9">    
                             Gen Z
                        </div>
                        <div class="col-3 dimension">    
                            <div class="LegendShape square"></div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    </div>
</div>
`;



export const legendLike = Template.bind({});
legendLike.args = {
    alignment: 'right',
    state: false,
    content: legendLikehtml
};

export const bottomSpawn = Template.bind({});
bottomSpawn.args = {
    alignment: 'bottom',
    state: false,
    content: "<div> no Title </div>"
};


