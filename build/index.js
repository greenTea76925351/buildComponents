const { buildComponents } = require('./loader')
const { autoBuildComp, publicComponents, svgDir } = require('./config')

if (autoBuildComp) {
  let stat = [
    "import Vue from 'vue'; \n",
    "const requireAll = requireContext => requireContext.keys().map(requireContext);",
    "requireAll(require.context('" + svgDir + "', false, /\.svg$/)); "
  ]
  buildComponents(publicComponents, stat.join('\n') + '\n\n');
}
