export const OtherRarityTools = ()=>{
    return (
        <>
            <div style={{marginTop: 64}}>
                <div>Our Friends - Also making cool tools!</div>
                <OtherRarityTool name='Punkscapes Cool Rarity' url='https://punkscape.coolrarity.com/' />
                <OtherRarityTool name='Punkscapes Rarity' url='https://punkscapes-rarity.vercel.app/' />
                <OtherRarityTool name='Kinesis Rarity' url='https://kinesis-rarity.vercel.app/' />
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

