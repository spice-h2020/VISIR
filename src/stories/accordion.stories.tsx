import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Accordion } from '../basicComponents/Accordion';
import { InteractionPanel } from '../basicComponents/Interaction';
import { IArtworkData, IInteraction } from '../constants/perspectivesTypes';

import '../style/base.css';

export default {
    title: 'Complex/Accordion',
    component: Accordion,

} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => <Accordion {...args} />;

const loreIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const artworkData: IArtworkData[] = [
    {
        id: "1",
        tittle: "Le tre finestre, La pianura della torre",
        author: "Jessie Boswell Leeds",
        year: 1924,
        image: "https://www.gamtorino.it/sites/default/files/opere/MALINCONIA-%20BOSWELL%20Le%20tre%20finestre.jpg"
    },
    {
        id: "2",
        tittle: "Mercato Vecchio",
        author: "Antonio Fontanesi Reggio Emilia",
        year: 1867,
        image: "https://www.gamtorino.it/sites/default/files/opere/FONTANESI_P_790.jpg"
    },
    {
        id: "3",
        tittle: loreIpsum,
        author: loreIpsum,
        year: 2016,
        image: "https://www.gamtorino.it/sites/default/files/opere/MALINCONIA-%20BOSWELL%20Le%20tre%20finestre.jpg"
    },
]
const interactions: IInteraction[] = [{
    artwork_id: '1',
    feelings: 'scettico',
    extracted_emotions: [
        { value: "Serenity", count: 0.7 },
        { value: "Trust", count: 0.3 },
        { value: "Fear", count: 0.5 }
    ]
},
{
    artwork_id: '2',
    feelings: 'Vociare, odori, curiosità, calore',
    extracted_emotions: [
        { value: "Surprise", count: 0.62 },
        { value: "Anger", count: 1 },
        { value: "Disgust", count: 1 },
        { value: "Love", count: 1 }
    ]
},
{
    artwork_id: '3',
    feelings: loreIpsum,
    extracted_emotions: [
        { value: "Surprise", count: 0.62 },
        { value: "Anger", count: 1 },
        { value: "Disgust", count: 1 },
        { value: "Love", count: 1 }
    ]
}]

export const ExampleA = Template.bind({});

const items: React.ReactNode[] = [
    < InteractionPanel
        artworksData={artworkData}
        interaction={interactions[0]}
    />,
    < InteractionPanel
        artworksData={artworkData}
        interaction={interactions[1]}
    />,
    < InteractionPanel
        artworksData={artworkData}
        interaction={interactions[2]}
    />
];

const tittles: string[] = [
    artworkData[0].tittle,
    artworkData[1].tittle,
    artworkData[2].tittle,
]

ExampleA.args = {
    items: items,
    tittles: tittles,
};