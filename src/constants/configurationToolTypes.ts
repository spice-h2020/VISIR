export interface IConfigurationSeed {
    artwork_attributes: ISimilarityFunction[];
    user_attributes: INameAndTypePair[];
    interaction_similarity_functions: ISimilarityFunction[];
}

export interface ISimilarityFunction {
    name: string;
    params: any[];
    on_attribute: INameAndTypePair;
    interaction_object: INameAndTypePair;
}

export interface INameAndTypePair {
    att_name: string,
    att_type: string,
}
