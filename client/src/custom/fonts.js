export const mediaQueries = {
  upXs: "@media (min-width:0px)",
  upSm: "@media (min-width:600px)",
  upMd: "@media (min-width:900px)",
  upLg: "@media (min-width:1200px)",
  upXl: "@media (min-width:1536px)",
};

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    [mediaQueries.upSm]: { fontSize: pxToRem(sm) },
    [mediaQueries.upMd]: { fontSize: pxToRem(md) },
    [mediaQueries.upLg]: { fontSize: pxToRem(lg) },
  };
}
