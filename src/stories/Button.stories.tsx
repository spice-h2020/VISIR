import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../basicComponents/Button';
import { ButtonState } from '../constants/viewOptions';

import '../style/navbar.css';

export default {
  title: 'Example/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  content: "Default Button",
  state: ButtonState.unactive,
  autoToggle: true,
  extraClassName: "primary"
};

export const Secondary = Template.bind({});
Secondary.args = {
  content: "Default Button",
  state: ButtonState.unactive,
  autoToggle: true,
  extraClassName: "secondary"
};

export const NavBarBtn = Template.bind({});
NavBarBtn.args = {
  content: "NavBar Button",
  state: ButtonState.unactive,
  autoToggle: false,
  extraClassName:"transparent",
};

export const DropdownLightBtn = Template.bind({});
DropdownLightBtn.args = {
  content: "Light Button",
  state: ButtonState.unactive,
  autoToggle: true,
  extraClassName:"dropdown-light",
};
export const DropdownDarkBtn = Template.bind({});
DropdownDarkBtn.args = {
  content: "Dark Button",
  state: ButtonState.unactive,
  autoToggle: true,
  extraClassName:"dropdown-dark",
};


