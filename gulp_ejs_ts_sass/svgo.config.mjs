export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupAttrs: false,
          removeDoctype: true,
          removeXMLProcInst: true,
          removeComments: true,
          removeMetadata: true,
          removeTitle: true,
          removeDesc: true,
          removeUselessDefs: true,
          removeEditorsNSData: true,
          removeEmptyAttrs: true,
          removeHiddenElems: true,
          removeEmptyText: true,
          removeEmptyContainers: true,
          convertColors: true,
          convertPathData: true,
          convertTransform: true,
          removeUnknownsAndDefaults: {
            keepDataAttrs: true,
          },
          removeNonInheritableGroupAttrs: true,
          removeUselessStrokeAndFill: true,
          removeUnusedNS: true,
          cleanupNumericValues: true,
          moveElemsAttrsToGroup: true,
          moveGroupAttrsToElems: true,
          collapseGroups: true,
          //removeRasterImages: false,
          mergePaths: false,
          convertShapeToPath: true,
          sortAttrs: true,
          inlineStyles: {
            onlyMatchedOnce: false,
            removeMatchedSelectors: false,
          },
        },
      },
    },
    // style, id, class属性を保持する設定
    {
      name: 'removeAttrs',
      params: {
        attrs: '^(?!style$|id$|class$)',
      },
    },
  ],
};
