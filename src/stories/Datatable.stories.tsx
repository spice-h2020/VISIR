import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DataTable } from '../components/DataColumn';
import { Dimensions } from '../constants/nodes';
import { ECommunityType, EExplanationTypes, IArtworkData, ICommunityData, IExplicitCommData, IInteraction, IStringNumberRelation, IUserData } from '../constants/perspectivesTypes';


import '../style/base.css';

export default {
    title: 'Example/newDatatable',
    component: DataTable,

} as ComponentMeta<typeof DataTable>;

const Template: ComponentStory<typeof DataTable> = (args) => <DataTable {...args} />;


export const Example = Template.bind({});

const loreIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const node: IUserData = {
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
            { value: "Surprise", count: 0.6 },
            { value: "Anger", count: 1 },
            { value: "Disgust", count: 1 },
            { value: "Love", count: 1 }
        ]
    },
    {
        artwork_id: '3',
        feelings: loreIpsum,
        extracted_emotions: [
            { value: "Surprise", count: 0.6 },
            { value: "Anger", count: 1 },
            { value: "Disgust", count: 1 },
            { value: "Love", count: 1 }
        ]
    }] as IInteraction[],
    isMedoid: false,
    isAnonymous: false,
    isAnonGroup: false
};

const comm: ICommunityData = {
    id: "0",
    name: 'Community 1',
    explanations: [
        {
            explanation_type: EExplanationTypes.explicit_attributes,
            explanation_data: {},
            visible: true,
        },
        {
            explanation_type: EExplanationTypes.medoid,
            explanation_data: { id: "0" },
            visible: true,
        },
        {
            explanation_type: EExplanationTypes.implicit_attributes,
            explanation_data: {
                label: "Percentage distribution of the implicit attribute (emotions):",
                data: [
                    { value: "trust", count: 66.6 },
                    { value: "fear", count: 33.3 }
                ]

            },
            visible: true,
        },
    ],
    users: ["1", "2", "3", "4", "5", "6"],
    explicitDataArray: [
        {
            key: "Language",
            values: [
                { value: "ES", count: 40, props: 3 },
                { value: "EN", count: 30, props: 2 },
                { value: "DE", count: 20, props: 1 },
                { value: "FR", count: 10, props: 0 }
            ],
            dimension: Dimensions.Color
        },
        {
            key: "Age",
            values: [
                { value: "young", count: 40, props: 0 },
                { value: "adult", count: 30, props: 2 },
                { value: "elder", count: 20, props: 1 },
                { value: "", count: 10, props: 3 }
            ],
            dimension: Dimensions.Shape
        }
    ] as IExplicitCommData[],
    anonUsers: [],
    type: ECommunityType.implicit,
    explicitDataMap: new Map<string, Map<string, number>>()
};

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

const allUsers = [
    {
        id: '0',
        label: '113435',
        implicit_community: 0,
        explicit_community: {
            AgeGroup: "adult",
            Language: "ES"
        },
        interactions: [{
            artwork_id: '1',
            feelings: 'scettico',
            extracted_emotions: [
                { value: "Serenity", count: 0.7 },
                { value: "Trust", count: 0.3 },
                { value: "Fear", count: 0.5 }
            ]
        }] as IInteraction[],
        isMedoid: true,
        isAnonymous: false,
        isAnonGroup: false
    },
    {
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
                { value: "Surprise", count: 0.6 },
                { value: "Anger", count: 1 },
                { value: "Disgust", count: 1 },
                { value: "Love", count: 1 }
            ]
        },
        {
            artwork_id: '3',
            feelings: loreIpsum,
            extracted_emotions: [
                { value: "Surprise", count: 0.6 },
                { value: "Anger", count: 1 },
                { value: "Disgust", count: 1 },
                { value: "Love", count: 1 }
            ]
        }] as IInteraction[],
        isMedoid: false,
        isAnonymous: false,
        isAnonGroup: false
    },
]

Example.args = {
    node: node,
    community: comm,
    artworks: artworkData,

    allUsers: allUsers,
    hideLabel: false
};


export const Empty = Template.bind({});

Empty.args = {
    artworks: artworkData,

    hideLabel: false
};

