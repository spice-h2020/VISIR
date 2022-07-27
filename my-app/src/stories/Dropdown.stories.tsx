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
  optionsLabels: ["GAM", "HECHT", "IMMA"],
  mainLabel:  "Select Only One",
  selectOptions: "selectOnlyOne",
};

export const diferents = Template.bind({});
diferents.args = {
  optionsLabels: ["GAM", "HECHT", "IMMA"],
  mainLabel:  "Select Diferents",
  selectOptions: "selectDiferents",
};


