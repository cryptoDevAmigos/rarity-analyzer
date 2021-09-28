export const OtherRarityTools = ()=>{
    return (
        <>
            <div style={{margin: 8, marginTop: 64}}>
                <div>Our Friends - Also making cool tools!</div>
                <OtherRarityTool name='Fukuball - One-day-punk Cool Rarity' url='https://onedaypunk-rarity-tool.herokuapp.com/' />
                <OtherRarityTool name='Fukuball - Punkscapes Cool Rarity' url='https://punkscape.coolrarity.com/' />
                <OtherRarityTool name='Nishu - One-day-punk Rarity' url='https://odp-rarity.vercel.app/' />
                <OtherRarityTool name='OxNight - Punkscapes Rarity' url='https://rarity-punkscape.vercel.app/' />
                <OtherRarityTool name='Mikk-o - Punkscapes Rarity' url='https://punkscapes-rarity.vercel.app/' />
                <OtherRarityTool name='Mikk-o - Kinesis Rarity' url='https://kinesis-rarity.vercel.app/' />
                <OtherRarityTool name='Rarity Tools' url='https://rarity.tools' />
                <OtherRarityTool name='Rarity Guide' url='https://rarity.guide' />
            </div>
        </>
    );
};

const OtherRarityTool = ({
    url,
    name,
}:{
    name: string,
    url: string,
})=>{
    return (
        <>
            <div>
                <a href={url} target='_blank' rel="noreferrer">{name}</a>
            </div>
        </>
    );
};

