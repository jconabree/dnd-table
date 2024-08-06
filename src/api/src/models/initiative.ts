import { CharacterArgumentData } from "~/types/interface";
import ledStrip from "~/ledStrip";

export const publishPlayerStates = (characters: CharacterArgumentData[]) => {
    ledStrip.updateInitiative(characters);
}