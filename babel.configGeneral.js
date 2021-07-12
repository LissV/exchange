const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
    },
  ],
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
];

module.exports = {
  presets
};
