export default function BackgroundSvg({ color }: { color: string }) {
  const colorVars = [];
  const numOfColors = 5;

  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/); // yeah I used AI for this tbh, it expects a string shaped like hsl(H, S%, L%)
  if (!hslMatch) throw new Error(" Invalid HSL Color Format");

  //   Assign the HSL colors for adjusting
  const h = parseInt(hslMatch[1]);
  const s = parseInt(hslMatch[2]);
  const l = parseInt(hslMatch[3]);

  //   define the adjustment steps
  const adjustments = [-20, -10, 0, 10, 20];

  //   Acutally apply the adjustments
  for (let i = 0; i < numOfColors; i++) {
    const newLightness = Math.max(0, Math.min(100, l + adjustments[i]));
    colorVars.push(`hsl(${h}, ${s}%, ${newLightness}%)`);
  }

  return (
    <div className={`overflow-clip `}>
      <svg
        id="canvas"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 512 512"
        width="auto"
      >
        <rect width="512" height="512" fill="#000000" />
        <rect width="45" height="45" x="0" y="0" fill={colorVars[0]} />
        <rect width="45" height="45" x="45" y="0" fill={colorVars[1]} />
        <rect width="45" height="45" x="90" y="0" fill={colorVars[1]} />
        <rect width="45" height="45" x="135" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="180" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="225" y="0" fill={colorVars[0]} />
        <rect width="45" height="45" x="270" y="0" fill={colorVars[0]} />
        <rect width="45" height="45" x="315" y="0" fill={colorVars[1]} />
        <rect width="45" height="45" x="360" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="405" y="0" fill={colorVars[3]} />
        <rect width="45" height="45" x="450" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="495" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="540" y="0" fill={colorVars[2]} />
        <rect width="45" height="45" x="0" y="45" fill={colorVars[2]} />
        <rect width="45" height="45" x="45" y="45" fill={colorVars[1]} />
        <rect width="45" height="45" x="90" y="45" fill={colorVars[2]} />
        <rect width="45" height="45" x="135" y="45" fill={colorVars[1]} />
        <rect width="45" height="45" x="180" y="45" fill={colorVars[0]} />
        <rect width="45" height="45" x="225" y="45" fill={colorVars[3]} />
        <rect width="45" height="45" x="270" y="45" fill={colorVars[3]} />
        <rect width="45" height="45" x="315" y="45" fill={colorVars[3]} />
        <rect width="45" height="45" x="360" y="45" fill={colorVars[0]} />
        <rect width="45" height="45" x="405" y="45" fill={colorVars[1]} />
        <rect width="45" height="45" x="450" y="45" fill={colorVars[1]} />
        <rect width="45" height="45" x="495" y="45" fill={colorVars[4]} />
        <rect width="45" height="45" x="540" y="45" fill={colorVars[0]} />
        <rect width="45" height="45" x="0" y="90" fill={colorVars[5]} />
        <rect width="45" height="45" x="45" y="90" fill={colorVars[5]} />
        <rect width="45" height="45" x="90" y="90" fill={colorVars[1]} />
        <rect width="45" height="45" x="135" y="90" fill={colorVars[3]} />
        <rect width="45" height="45" x="180" y="90" fill={colorVars[0]} />
        <rect width="45" height="45" x="225" y="90" fill={colorVars[0]} />
        <rect width="45" height="45" x="270" y="90" fill={colorVars[5]} />
        <rect width="45" height="45" x="315" y="90" fill={colorVars[4]} />
        <rect width="45" height="45" x="360" y="90" fill={colorVars[0]} />
        <rect width="45" height="45" x="405" y="90" fill={colorVars[2]} />
        <rect width="45" height="45" x="450" y="90" fill={colorVars[2]} />
        <rect width="45" height="45" x="495" y="90" fill={colorVars[4]} />
        <rect width="45" height="45" x="540" y="90" fill={colorVars[1]} />
        <rect width="45" height="45" x="0" y="135" fill={colorVars[2]} />
        <rect width="45" height="45" x="45" y="135" fill={colorVars[2]} />
        <rect width="45" height="45" x="90" y="135" fill={colorVars[2]} />
        <rect width="45" height="45" x="135" y="135" fill={colorVars[0]} />
        <rect width="45" height="45" x="180" y="135" fill={colorVars[4]} />
        <rect width="45" height="45" x="225" y="135" fill={colorVars[5]} />
        <rect width="45" height="45" x="270" y="135" fill={colorVars[0]} />
        <rect width="45" height="45" x="315" y="135" fill={colorVars[0]} />
        <rect width="45" height="45" x="360" y="135" fill={colorVars[4]} />
        <rect width="45" height="45" x="405" y="135" fill={colorVars[4]} />
        <rect width="45" height="45" x="450" y="135" fill={colorVars[0]} />
        <rect width="45" height="45" x="495" y="135" fill={colorVars[5]} />
        <rect width="45" height="45" x="540" y="135" fill={colorVars[1]} />
        <rect width="45" height="45" x="0" y="180" fill={colorVars[2]} />
        <rect width="45" height="45" x="45" y="180" fill={colorVars[3]} />
        <rect width="45" height="45" x="90" y="180" fill={colorVars[4]} />
        <rect width="45" height="45" x="135" y="180" fill={colorVars[1]} />
        <rect width="45" height="45" x="180" y="180" fill={colorVars[0]} />
        <rect width="45" height="45" x="225" y="180" fill={colorVars[1]} />
        <rect width="45" height="45" x="270" y="180" fill={colorVars[5]} />
        <rect width="45" height="45" x="315" y="180" fill={colorVars[2]} />
        <rect width="45" height="45" x="360" y="180" fill={colorVars[4]} />
        <rect width="45" height="45" x="405" y="180" fill={colorVars[4]} />
        <rect width="45" height="45" x="450" y="180" fill={colorVars[4]} />
        <rect width="45" height="45" x="495" y="180" fill={colorVars[1]} />
        <rect width="45" height="45" x="540" y="180" fill={colorVars[1]} />
        <rect width="45" height="45" x="0" y="225" fill={colorVars[5]} />
        <rect width="45" height="45" x="45" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="90" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="135" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="180" y="225" fill={colorVars[1]} />
        <rect width="45" height="45" x="225" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="270" y="225" fill={colorVars[1]} />
        <rect width="45" height="45" x="315" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="360" y="225" fill={colorVars[0]} />
        <rect width="45" height="45" x="405" y="225" fill={colorVars[1]} />
        <rect width="45" height="45" x="450" y="225" fill={colorVars[2]} />
        <rect width="45" height="45" x="495" y="225" fill={colorVars[2]} />
        <rect width="45" height="45" x="540" y="225" fill={colorVars[5]} />
        <rect width="45" height="45" x="0" y="270" fill={colorVars[1]} />
        <rect width="45" height="45" x="45" y="270" fill={colorVars[1]} />
        <rect width="45" height="45" x="90" y="270" fill={colorVars[0]} />
        <rect width="45" height="45" x="135" y="270" fill={colorVars[3]} />
        <rect width="45" height="45" x="180" y="270" fill={colorVars[2]} />
        <rect width="45" height="45" x="225" y="270" fill={colorVars[1]} />
        <rect width="45" height="45" x="270" y="270" fill={colorVars[0]} />
        <rect width="45" height="45" x="315" y="270" fill={colorVars[2]} />
        <rect width="45" height="45" x="360" y="270" fill={colorVars[3]} />
        <rect width="45" height="45" x="405" y="270" fill={colorVars[0]} />
        <rect width="45" height="45" x="450" y="270" fill={colorVars[1]} />
        <rect width="45" height="45" x="495" y="270" fill={colorVars[5]} />
        <rect width="45" height="45" x="540" y="270" fill={colorVars[4]} />
        <rect width="45" height="45" x="0" y="315" fill={colorVars[0]} />
        <rect width="45" height="45" x="45" y="315" fill={colorVars[2]} />
        <rect width="45" height="45" x="90" y="315" fill={colorVars[4]} />
        <rect width="45" height="45" x="135" y="315" fill={colorVars[0]} />
        <rect width="45" height="45" x="180" y="315" fill={colorVars[3]} />
        <rect width="45" height="45" x="225" y="315" fill={colorVars[5]} />
        <rect width="45" height="45" x="270" y="315" fill={colorVars[4]} />
        <rect width="45" height="45" x="315" y="315" fill={colorVars[4]} />
        <rect width="45" height="45" x="360" y="315" fill={colorVars[1]} />
        <rect width="45" height="45" x="405" y="315" fill={colorVars[0]} />
        <rect width="45" height="45" x="450" y="315" fill={colorVars[5]} />
        <rect width="45" height="45" x="495" y="315" fill={colorVars[1]} />
        <rect width="45" height="45" x="540" y="315" fill={colorVars[4]} />
        <rect width="45" height="45" x="0" y="360" fill={colorVars[2]} />
        <rect width="45" height="45" x="45" y="360" fill={colorVars[1]} />
        <rect width="45" height="45" x="90" y="360" fill={colorVars[2]} />
        <rect width="45" height="45" x="135" y="360" fill={colorVars[1]} />
        <rect width="45" height="45" x="180" y="360" fill={colorVars[1]} />
        <rect width="45" height="45" x="225" y="360" fill={colorVars[4]} />
        <rect width="45" height="45" x="270" y="360" fill={colorVars[4]} />
        <rect width="45" height="45" x="315" y="360" fill={colorVars[4]} />
        <rect width="45" height="45" x="360" y="360" fill={colorVars[4]} />
        <rect width="45" height="45" x="405" y="360" fill={colorVars[4]} />
        <rect width="45" height="45" x="450" y="360" fill={colorVars[0]} />
        <rect width="45" height="45" x="495" y="360" fill={colorVars[1]} />
        <rect width="45" height="45" x="540" y="360" fill={colorVars[5]} />
        <rect width="45" height="45" x="0" y="405" fill={colorVars[2]} />
        <rect width="45" height="45" x="45" y="405" fill={colorVars[4]} />
        <rect width="45" height="45" x="90" y="405" fill={colorVars[4]} />
        <rect width="45" height="45" x="135" y="405" fill={colorVars[1]} />
        <rect width="45" height="45" x="180" y="405" fill={colorVars[3]} />
        <rect width="45" height="45" x="225" y="405" fill={colorVars[0]} />
        <rect width="45" height="45" x="270" y="405" fill={colorVars[5]} />
        <rect width="45" height="45" x="315" y="405" fill={colorVars[2]} />
        <rect width="45" height="45" x="360" y="405" fill={colorVars[4]} />
        <rect width="45" height="45" x="405" y="405" fill={colorVars[5]} />
        <rect width="45" height="45" x="450" y="405" fill={colorVars[1]} />
        <rect width="45" height="45" x="495" y="405" fill={colorVars[4]} />
        <rect width="45" height="45" x="540" y="405" fill={colorVars[0]} />
        <rect width="45" height="45" x="0" y="450" fill={colorVars[3]} />
        <rect width="45" height="45" x="45" y="450" fill={colorVars[0]} />
        <rect width="45" height="45" x="90" y="450" fill={colorVars[1]} />
        <rect width="45" height="45" x="135" y="450" fill={colorVars[1]} />
        <rect width="45" height="45" x="180" y="450" fill={colorVars[4]} />
        <rect width="45" height="45" x="225" y="450" fill={colorVars[2]} />
        <rect width="45" height="45" x="270" y="450" fill={colorVars[5]} />
        <rect width="45" height="45" x="315" y="450" fill={colorVars[1]} />
        <rect width="45" height="45" x="360" y="450" fill={colorVars[3]} />
        <rect width="45" height="45" x="405" y="450" fill={colorVars[3]} />
        <rect width="45" height="45" x="450" y="450" fill={colorVars[2]} />
        <rect width="45" height="45" x="495" y="450" fill={colorVars[1]} />
        <rect width="45" height="45" x="540" y="450" fill={colorVars[2]} />
        <rect width="45" height="45" x="0" y="495" fill={colorVars[0]} />
        <rect width="45" height="45" x="45" y="495" fill={colorVars[2]} />
        <rect width="45" height="45" x="90" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="135" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="180" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="225" y="495" fill={colorVars[2]} />
        <rect width="45" height="45" x="270" y="495" fill={colorVars[3]} />
        <rect width="45" height="45" x="315" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="360" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="405" y="495" fill={colorVars[0]} />
        <rect width="45" height="45" x="450" y="495" fill={colorVars[1]} />
        <rect width="45" height="45" x="495" y="495" fill={colorVars[4]} />
        <rect width="45" height="45" x="540" y="495" fill={colorVars[2]} />
        <rect width="45" height="45" x="0" y="540" fill={colorVars[1]} />
        <rect width="45" height="45" x="45" y="540" fill={colorVars[4]} />
        <rect width="45" height="45" x="90" y="540" fill={colorVars[5]} />
        <rect width="45" height="45" x="135" y="540" fill={colorVars[0]} />
        <rect width="45" height="45" x="180" y="540" fill={colorVars[0]} />
        <rect width="45" height="45" x="225" y="540" fill={colorVars[4]} />
        <rect width="45" height="45" x="270" y="540" fill={colorVars[2]} />
        <rect width="45" height="45" x="315" y="540" fill={colorVars[2]} />
        <rect width="45" height="45" x="360" y="540" fill={colorVars[2]} />
        <rect width="45" height="45" x="405" y="540" fill={colorVars[1]} />
        <rect width="45" height="45" x="450" y="540" fill={colorVars[4]} />
        <rect width="45" height="45" x="495" y="540" fill={colorVars[1]} />
        <rect width="45" height="45" x="540" y="540" fill={colorVars[1]} />
      </svg>
    </div>
  );
}
