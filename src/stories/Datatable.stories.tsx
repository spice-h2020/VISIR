import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DataTable } from '../components/Datatable';
import { ArtworkData, CommunityData, UserData } from '../constants/perspectivesTypes';
import '../style/base.css';

export default {
    title: 'Example/newDatatable',
    component: DataTable,

} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = (args) => <DataTable {...args} />;


export const Example = Template.bind({});

const loreIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const node: UserData = {
    id: '1',
    label: '213435',
    implicit_community: 0,
    explicit_community: {
        AgeGroup: "Adult",
        Language: "ESP"
    },
    interactions: [{
        artwork_id: '1',
        feelings: 'scettico',
        extracted_emotions: {
            "Serenity": 0.7,
            "Trust": 0.3,
            "Fear": 0.5
        }
    },
    {
        artwork_id: '2',
        feelings: 'Vociare, odori, curiosità, calore',
        extracted_emotions: {
            "Surprise": 0.622342,
            "Anger": 1,
            "Disgust": 1,
            "Love": 1
        }
    },
    {
        artwork_id: '3',
        feelings: loreIpsum,
        extracted_emotions: {
            "Surprise": 0.622342,
            "Anger": 1,
            "Disgust": 1,
            "Love": 1
        }
    }]
};

const comm: CommunityData = {
    id: "0",
    name: 'Community 1',
    explanation: "Representative Properties: {'Artefacts collected': 'Stool60, Pastille chair, Pehtoori'}'",
    users: ["1", "2", "3", "4", "5", "6"],
    explicitCommunity: {}
};

const artworkData: ArtworkData[] = [
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

Example.args = {
    node: node,
    community: comm,
    artworks: artworkData,

    hideLabel: false
};


export const Empty = Template.bind({});

Empty.args = {
    artworks: artworkData,

    hideLabel: false
};

