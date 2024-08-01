type InitiativeModeProps = {
    onClose: () => void;
}
export default ({ onClose }: InitiativeModeProps) => {
    return (
        <div>
            <ul>
                <li>
                    Add Area to List
                    <ul>
                        <li>Can have multiple of the same area (needed since DM will have multiple characters)</li>
                        <li>Only DND Player areas</li>
                        <li>Filters DND Player areas</li>
                        <li>Add nickname to Area (useful for DM and familiars)</li>
                        <li>Add initiative to each area which auto-sorts</li>
                    </ul>
                </li>
                <li>Reset button</li>
                <li>
                    Start encounter
                    <ul>
                        <li>Shows Next/Prev turn buttons and Stop encounter</li>
                        <li>Highlights current player</li>
                    </ul>
                </li>
                <li>
                    Health option for each area
                    <ul>
                        <li>If not set, don't show health</li>
                    </ul>
                </li>
                <li>
                    Can disable an area for when character is dead
                </li>
            </ul>
        </div>
    )
}