import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';
import { ButtonState } from '../constants/viewOptions';

import '../style/navbar.css';
import '../style/dropdown.css';

export default {
  title: 'Example/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: "Default Button",
  state: ButtonState.inactive,
  autoToggle: true,
};


export const NavBarBtn = Template.bind({});
NavBarBtn.args = {
  content: "NavBar Button",
  state: ButtonState.inactive,
  autoToggle: false,
  extraClassName:"navBar-mainBtn",
};



export const DropdownLightBtn = Template.bind({});
DropdownLightBtn.args = {
  content: "Light Button",
  state: ButtonState.inactive,
  autoToggle: true,
  extraClassName:"dropdown-light",
};
export const DropdownDarkBtn = Template.bind({});
DropdownDarkBtn.args = {
  content: "Dark Button",
  state: ButtonState.inactive,
  autoToggle: true,
  extraClassName:"dropdown-dark",
};


