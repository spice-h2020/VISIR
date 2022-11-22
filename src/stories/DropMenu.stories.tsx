import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../basicComponents/Button';
import { EButtonState } from '../constants/viewOptions';
import '../style/base.css';
import { DropMenu, EDropMenuDirection } from '../basicComponents/DropMenu';

export default {
    title: 'Example/DropMenus',
    component: DropMenu,
} as ComponentMeta<typeof DropMenu>;


const Template: ComponentStory<typeof DropMenu> = (args) => <DropMenu {...args} />;

let testButtons = [
    <Button
        content="Option A"
        state={EButtonState.active}
        key={1}
        extraClassName={"btn-dropdown"}
        autoToggle={true}
    />,
    <hr key={0} />,
    <Button
        content="Option B"
        state={EButtonState.unactive}
        key={2}
        extraClassName={"btn-dropdown"}
        autoToggle={true}
    />,
    <Button
        content="Option C"
        state={EButtonState.unactive}
        key={3}
        extraClassName={"btn-dropdown"}
        autoToggle={true}
    />,]

export const lightDropdown = Template.bind({});
lightDropdown.args = {
    items: testButtons,
    content: "Light dropdown",
    extraClassButton: "transparent down-arrow",
    menuDirection: EDropMenuDirection.down,
};

export const primaryDropright = Template.bind({});
primaryDropright.args = {
    items: testButtons,
    content: "Primary dropright",
    extraClassButton: "primary down-right fixedWidth-15vw",
    menuDirection: EDropMenuDirection.right,
};

const innerDroprightButtons = [
    <Button
        content="Inner Option A"
        state={EButtonState.unactive}
        key={1}
        extraClassName={"btn-dropdown"}
        autoToggle={true}
    />,
    <Button
        content="Inner Option B"
        state={EButtonState.unactive}
        key={2}
        extraClassName={"btn-dropdown"}
        autoToggle={true}
    />]

testButtons.push(
    <DropMenu
        items={innerDroprightButtons}
        content="Inner dropright"
        extraClassButton="primary down-right fixedWidth-15vw"
        menuDirection={EDropMenuDirection.right}
        hoverChangesState={true}
    />)

export const dropDownintoDropright = Template.bind({});
dropDownintoDropright.args = {
    items: testButtons,
    content: "Main dropdown",
    extraClassButton: "primary down-arrow",
    menuDirection: EDropMenuDirection.down,
};



