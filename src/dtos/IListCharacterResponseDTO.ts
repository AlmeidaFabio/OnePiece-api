import { Character } from "../entities/Character";

export interface IListCharacterResponseDTO {
    data: Character[];
    count: number;
}