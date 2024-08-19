const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function (options, webpack) {
	return {
		...options,
		entry: ['webpack/hot/poll?100', options.entry],
		target: 'node',
		externals: [
			nodeExternals({
				allowlist: ['webpack/hot/poll?100'],
			}),
		],
		resolve: {
			...options.resolve,
			extensions: ['.tsx', '.ts', '.js'],
			plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
		},
		plugins: [
			...options.plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.WatchIgnorePlugin({ paths: [/\.js$/, /\.d\.ts$/] }),
			new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false }),
		],
	};
};
