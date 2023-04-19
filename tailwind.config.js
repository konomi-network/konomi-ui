module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d7d7',
        error: '#FF007A',
        tableBg: '#2A324D',
        tableHoverBg: '#194A61',
        optionBg: '#B2B2B2',
        themeColor: '#221334'
      },
      backgroundImage: {
        verticalSegment:
          'linear-gradient(360deg,rgba(0, 215, 215, 0) 0%,#00d7d7 11.49%,#00d7d7 93.39%,rgba(0, 215, 215, 0) 98.37%);'
      }
    },
    fontFamily: {
      rubik: 'Rubik, sans-serif'
    },
    borderColor: (theme) => ({
      primary: '#00d7d7',
      secondary: '#2a4b65'
    })
  },
  variants: {},
  plugins: []
};
