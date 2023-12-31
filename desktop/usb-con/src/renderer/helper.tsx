function hexToRgb(hex, factor) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
    return { r, g, b };
  }
  
  module.exports = {
    hexToRgb,
  };