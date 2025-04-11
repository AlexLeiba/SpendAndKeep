/**
 
 * It is also used to create the responsive breakpoints
 * The values are based on the 12 column grid system (12 columns in desktop, 6 in tablet and 4 in mobile)
 * The unit used is rem and the base font size is 10px
 * EXCEPTION: The breakpoints are in px because they are used in the media queries, these have unpredictable behaviour with rem
 *
 * If values are in px you need to convert them to rem by dividing them by 10(root font size)
 */
const breakpoints = {
  desktop: {
    breakpoints: {
      min: 1280,
    },
    maxWidth: 127.2,
    gutter: 3.2,
  },
  tablet: {
    breakpoints: {
      max: 1279,
      min: 768,
    },
    maxWidth: 67.2,
    gutter: 3.2,
  },
  mobile: {
    breakpoints: {
      max: 767,
    },
    maxWidth: 37.2,
    gutter: 1.6,
  },
};

export default breakpoints;
