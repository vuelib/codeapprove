module.exports = {
  important: false,
  theme: {
    // fontFamily: {
    //   display: ['Gilroy', 'sans-serif'],
    //   body: ['Graphik', 'sans-serif'],
    // },
    // extend: {
    //   colors: {
    //     cyan: '#9cdbff',
    //   },
    // }
    extend: {
      colors: {
        dark: {
          // https://www.w3schools.com/colors/colors_mixer.asp
          "0": "#201d23",
          "1": "#221f25", // Center
          "2": "#252228",
          "3": "#28252b",
          "4": "#2a272d",
          "5": "#2d2a30",
          "6": "#302d33",
          "7": "#323036",
          "8": "#353338",
          "9": "#38353b",
        },
        wht: {
          "brt": "rgba(255,255,255,0.87)",
          "med": "rgba(255,255,255,0.60)",
          "dim": "rgba(255,255,255,0.38)",
        },
        diff: {
          "green": "#373d29"
        }
      }
    }
  },
  variants: {
    shadow: ["hover"]
  }
};
