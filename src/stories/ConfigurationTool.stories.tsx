import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SetStateAction } from 'react';
import { ILoadingState } from '../basicComponents/LoadingFrontPanel';
import { ConfigurationTool } from '../components/ConfigurationTool';
import { CTranslation } from '../constants/auxTypes';
import { EFileSource } from '../constants/viewOptions';
import RequestManager from '../managers/requestManager';

import '../style/base.css';

export default {
  title: 'Complete/ConfigurationTool',
  component: ConfigurationTool,

} as ComponentMeta<typeof ConfigurationTool>;

const Template: ComponentStory<typeof ConfigurationTool> = (args) => <ConfigurationTool {...args} />;

const rqMan = new RequestManager(setLoadingState, new CTranslation(undefined));
rqMan.changeBaseURL(EFileSource.Local);

export const Primary = Template.bind({});
Primary.args = {
  requestManager: rqMan
};

//Useless but necesary for the storybook testing
function setLoadingState(value: SetStateAction<ILoadingState>): void {
  console.log(value);
}

