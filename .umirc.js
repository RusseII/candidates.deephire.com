
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
   targets: {
    ie: 11,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'DeepHire',
      dll: false,
      routes: {
        exclude: [
        
          /components\//,
        ],
      },
    }],
  ],
}
