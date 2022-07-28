import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dropdown } from './Dropdown';

export default {
  title: 'Example/Dropdown',
  component: Dropdown,
  argTypes: { onClick: { action: 'option clicked' } },


} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const onlyOne = Template.bind({});
onlyOne.args = {
  itemsLabels: ["GAM", "HECHT", "-", "IMMA"],
  mainLabel:  "Select Only One",
  selectBehaviour: "selectOnlyOne",
};

export const diferents = Template.bind({});
diferents.args = {
  itemsLabels: ["GAM", "-", "HECHT", "IMMA"],
  mainLabel:  "Select Diferents",
  selectBehaviour: "selectDiferents",
};


