browserify ../dist/index.js --standalone PageBuilderComponent > simi-pagebuilder-react.umd.js
uglifyjs --compress --mangle -- simi-pagebuilder-react.umd.js > compressed.umd.js