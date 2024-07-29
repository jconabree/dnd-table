type EffectListProps = {
    onClose: () => void;
}
export default ({ onClose }: EffectListProps) => {
    return (
        <div>
            Create effects, attach them to areas
            Activate effects
            Can disable or remove areas
        </div>
    )
}