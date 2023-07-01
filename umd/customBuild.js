const browserify = require("browserify");
const envify = require("envify/custom");
const fs = require("fs");

const b = browserify("../dist/index.js", {
	standalone: "PageBuilderComponent"
});
const output = fs.createWriteStream("simi-pagebuilder-react.umd.js");

b.transform(
	envify({
		NODE_ENV: "production"
	}), { global: true }
).transform(
	"uglifyify", {
		global: true,
		compress: {
			passes: 1
		},
		mangle: {
			// properties: true,
			safari10: true
		}
	}
);

b.bundle().pipe(output);
