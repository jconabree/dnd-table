import { CharacterArgumentData } from "~/types/interface";
import { getConfig } from "./configurations";
import { getAllAreas } from "./areas";

export const publishCharacterStates = async (characters: CharacterArgumentData[]) => {
    console.log('updating player states', characters);

    const segmentData = characters.reduce<{ id: number, on: Boolean, col: number[][]}[]>((segments, character) => {
        let rgb = [255, 255, 255];
        if (typeof character.currentHealth === 'number' && typeof character.maxHealth  === 'number') {
            const percentage = (character.currentHealth / character.maxHealth) * 100;

            if (percentage < 0 || percentage > 100) {
                throw new Error('Percentage must be between 0 and 100.')
            }
    
            const green = (percentage / 100) * 255
            const red = 255 - ((percentage / 100) * 255)
            
            rgb = [red, green, 5];
        }

        segments.push({
            id: character.area.segment,
            on: true,
            col: [rgb]
        });

        if (typeof character.area.segmentPre === 'number') {
            segments.push({
                id: character.area.segmentPre,
                on: character.isCurrent,
                col: [[255, 255, 255]]
            })
        }

        if (typeof character.area.segmentPost === 'number') {
            segments.push({
                id: character.area.segmentPost,
                on: character.isCurrent,
                col: [[255, 255, 255]]
            })
        }

        return segments;
    }, []);

    const { wledAddress } = getConfig();
    const response = await fetch(
        `http://${wledAddress}/json/state`,
        {
            method: 'POST',
            body: JSON.stringify({
                seg: segmentData
            }),
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    )

    const data = await response.json();

    console.log('Initiative response', data);

    return data;
}

export const stopInitiative = async (keepHealth?: boolean) => {
    const allAreas = getAllAreas();

    const segmentData = allAreas.reduce<{ id: number, on: Boolean}[]>((segments, area) => {
        segments.push({
            id: area.segment,
            on: Boolean(keepHealth),
        });

        if (typeof area.segmentPre === 'number') {
            segments.push({
                id: area.segment,
                on: false,
            });
        }

        if (typeof area.segmentPost === 'number') {
            segments.push({
                id: area.segmentPost,
                on: false,
            });
        }

        return segments;
    }, []);

    const { wledAddress } = getConfig();
    const response = await fetch(
        `http://${wledAddress}/json/state`,
        {
            method: 'POST',
            body: JSON.stringify({
                seg: segmentData
            }),
            headers: new Headers({
                'content-type': 'application/json'
            })
        }
    )

    const data = await response.json();

    console.log('Initiative stop response', data);

    return data;
}