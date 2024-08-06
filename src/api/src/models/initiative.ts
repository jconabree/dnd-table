import { CharacterArgumentData } from "~/types/interface";
import ledStrip from "../ledStrip";

export const publishCharacterStates = (characters: CharacterArgumentData[]) => {
    ledStrip.updateInitiative(characters);
    console.log('updating player states', characters)
}