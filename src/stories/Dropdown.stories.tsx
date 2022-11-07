import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dropdown } from '../basicComponents/Dropdown';
import { Button } from '../basicComponents/Button';
import { EButtonState } from '../constants/viewOptions';
import '../style/base.css';

export default {
    title: 'Example/Dropdown',
    component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const selectedItems = [EButtonState.unactive, EButtonState.unactive, EButtonState.active];
const testButtons = [
    <Button
        content="Option A"
        state={selectedItems[0]}
    />,
    <hr />,
    <Button
        content="Option B"
        state={selectedItems[1]}
    />,
    <Button
        content="Option C"
        state={selectedItems[2]}
    />]

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const lightDropdown = Template.bind({});
lightDropdown.args = {
    items: testButtons,
    content: "Light dropdown",
    extraClassButton: "transparent"
};

export const primaryDropdown = Template.bind({});
primaryDropdown.args = {
    items: testButtons,
    content: "Primary dropdown",
    extraClassButton: "primary"
};

export const darkDropdown = Template.bind({});
darkDropdown.args = {
    items: testButtons,
    content: "Dark dropdown",
    extraClassButton: "dark"
};


