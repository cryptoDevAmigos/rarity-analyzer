
/** RGB 8-bit
 *
 * - r,g,b: [0 - 255]
 *
 * */
 export type RgbColor = { r: number, g: number, b: number };

 /** Hsl float
  *
  * Note: float precision is required to support roundtrip back to rgb without loss
  *
  *  - h: [0.0 - 360.0]
  *  - s: [0.0 - 100.0]
  *  - l: [0.0 - 100.0]
  *
 */
 export type HslColor = { h: number, s: number, l: number };
 
 /** RGB => HSL
  * Based on https://en.wikipedia.org/wiki/HSL_and_HSV
  * and https://gist.github.com/mjackson/5311256
  */
 const rgbToHsl = ({ r, g, b }: RgbColor): HslColor => {
     const rNorm = Math.max(0, Math.min(1, Math.floor(r) / 255));
     const gNorm = Math.max(0, Math.min(1, Math.floor(g) / 255));
     const bNorm = Math.max(0, Math.min(1, Math.floor(b) / 255));
 
     const vMax = Math.max(rNorm, gNorm, bNorm);
     const vMin = Math.min(rNorm, gNorm, bNorm);
     const l = (vMax + vMin) / 2;
 
     if (vMax == vMin) {
         // No color
         return {
             h: 0,
             s: 0,
             l: l * 100,
         };
     }
 
     /**
      * (V-L) / min(L,1-L)
      */
     const s = (vMax - l) / Math.min(l, 1 - l);
 
     const chroma = vMax - vMin;
     let h = 0;
     switch (vMax) {
     /** V===R => 60deg * (0 + (G-B)/C),   0deg + 60deg * x */
     case rNorm: h = (gNorm - bNorm) / chroma + 0; break;
     /** V===G => 60deg * (2 + (B-R)/C), 120deg + 60deg * x */
     case gNorm: h = (bNorm - rNorm) / chroma + 2; break;
     /** V===B => 60deg * (4 + (R-G)/C), 240deg + 60deg * x */
     case bNorm: h = (rNorm - gNorm) / chroma + 4; break;
     }
     // Wrap red (when G<B)
     if (h < 0){ h += 6;}
     // Normalize[0,1]
     h /= 6;
 
     return {
         h: h * 360,
         s: s * 100,
         l: l * 100,
     };
 };
 
 /** RGB => HSL
  * Based on https://en.wikipedia.org/wiki/HSL_and_HSV
  * and https://gist.github.com/mjackson/5311256
  */
 const hslToRgb = (hsl: HslColor): RgbColor => {
     const hNorm = Math.max(0, Math.min(hsl.h % 360 / 360, 1));
     const sNorm = Math.max(0, Math.min(hsl.s / 100, 1));
     const lNorm = Math.max(0, Math.min(hsl.l / 100, 1));
 
     if (sNorm === 0) {
         // No color
         return {
             r: Math.floor(lNorm * 255),
             g: Math.floor(lNorm * 255),
             b: Math.floor(lNorm * 255),
         };
     }
 
     const hueToRgbNorm = (p: number, q: number, t: number) => {
         if (t < 0) t += 1;
         if (t > 1) t -= 1;
         if (t < 1 / 6) return p + (q - p) * 6 * t;
         if (t < 1 / 2) return q;
         if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
         return p;
     };
 
     const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + (1 - lNorm) * sNorm;
     const p = 2 * lNorm - q;
 
     const rNorm = hueToRgbNorm(p, q, hNorm + 1 / 3);
     const gNorm = hueToRgbNorm(p, q, hNorm);
     const bNorm = hueToRgbNorm(p, q, hNorm - 1 / 3);
 
     return {
         r: Math.floor(rNorm * 255),
         g: Math.floor(gNorm * 255),
         b: Math.floor(bNorm * 255),
     };
 };
 
 
 export type RgbHexColor = string & { __type: `#FFFFFF` };
 const rgbToRgbHex = ({ r, g, b }: RgbColor): RgbHexColor => {
     return `#${r.toString(16).padStart(2, `0`)}${g.toString(16).padStart(2, `0`)}${b.toString(16).padStart(2, `0`)}` as RgbHexColor;
 };
 const rgbHexToRgb = (rgbHex: RgbHexColor): RgbColor => {
     const hex = rgbHex.startsWith(`#`) ? rgbHex.substr(1) : rgbHex;
     return {
         r: parseInt(hex.substr(0, 2), 16),
         g: parseInt(hex.substr(2, 2), 16),
         b: parseInt(hex.substr(4, 2), 16),
     };
 };
 
 export const colorFormat = {
     rgbToHsl,
     hslToRgb,
     rgbToRgbHex,
     rgbHexToRgb,
 };
 