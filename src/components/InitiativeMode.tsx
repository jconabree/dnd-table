type InitiativeModeProps = {
    onClose: () => void;
}
export default ({ onClose }: InitiativeModeProps) => {
    return (
        <div>
            Add Area to List
            Can have multiple of the same area
            Add nickname to Area (useful for DM and familiars)
        </div>
    )
}