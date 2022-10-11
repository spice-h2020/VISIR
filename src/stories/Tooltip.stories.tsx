import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tooltip } from '../basicComponents/Tooltip';
import { SelectedObject } from '../constants/auxTypes';
import { CommunityData, UserData } from '../constants/perspectivesTypes';

import '../style/base.css';

export default {
  title: 'Example/Tooltip',
  component: Tooltip,

} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

export const userExample = Template.bind({});

const user: UserData = {
  id: '01',
  label: 'user1',
  implicit_community: 0,
  explicit_community: { ageGroup: "adult", Language: "ESP" },
  interactions: []
}

const userObject: SelectedObject = {
  obj: user,
  position: { x: 100, y: 150 }
}
userExample.args = {
  selectedObject: userObject
};

export const commExample = Template.bind({});

const comm: CommunityData = {
  id: "0",
  name: 'Community 1',
  explanation: "Representative Properties: {'Artefacts collected': 'Fiskars scissors, Pehtoori, Cast Iron Pot, Stool60, Pastille chair'}",
  users: [],
  explicitCommunity: {}

}
const commObject: SelectedObject = {
  obj: comm,
  position: { x: 100, y: 150 }
}
commExample.args = {
  selectedObject: commObject
};

