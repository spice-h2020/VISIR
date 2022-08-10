import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import '../style/legend.css';
import '../style/Navbar.css';

import { Button } from '../components/Button';

export default {
  title: 'Example/Button',
  component: Button,

} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: <div dangerouslySetInnerHTML={{ __html: "<div> Im a button </div>" }} />,
};

const legendLikeButton =
  <div className="row legend">
    <div className="col-9 text" style={{ marginTop: "4px" }}>
      ENGLISH
    </div>
    <div className="col-3 icon">
      <div className="LegendShape star"> </div>
    </div>
  </div>;

export const LegendButton = Template.bind({});
LegendButton.args = {
  content: legendLikeButton,
};

export const startInit = Template.bind({});
startInit.args = {
  content: "Button",
  state: true,
};


