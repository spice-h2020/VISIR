import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Navbar } from '../basicComponents/Navbar';
import { Button } from '../basicComponents/Button';
import { Dropdown } from '../basicComponents/Dropdown';
import { ButtonState } from '../constants/viewOptions';

export default {
  title: 'Example/Navbar',
  component: Navbar,
  argTypes: { onClick: { action: 'option clicked' } },

} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;

const selectedItems = [ButtonState.unactive, ButtonState.unactive, ButtonState.active];
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

export const example = Template.bind({});
example.args = {
  leftAlignedItems: [
    <Button
      content="Button"
      extraClassName="transparent"
    />,
    ,
    <Dropdown
      items={testButtons}
      content="Dropdown <- A"
      extraClassButton='transparent'
    />
    ,
    <Dropdown
      items={testButtons}
      content="Dropdown <- B"
      extraClassButton='transparent'
    />
  ],
  midAlignedItems: [
    <Dropdown
      items={testButtons}
      content="Dropdown <-> A"
      extraClassButton='primary'
    />,
    <Dropdown
      items={testButtons}
      content="Dropdown <-> B"
      extraClassButton='dark'
    />
  ],
  rightAlignedItems: [
    <Dropdown
      items={testButtons}
      content="Dropdown -> A"
      extraClassButton='dark'
    />,
    <Dropdown
      items={testButtons}
      content="Dropdown -> B"
      extraClassButton='primary'
    />
  ]
};


