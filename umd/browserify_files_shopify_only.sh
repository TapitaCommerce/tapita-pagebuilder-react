browserify ../dist/index.js -g [ envify --NODE_ENV production --TARGET_ENV shopify ] -g uglifyify --standalone PageBuilderComponent > simi-pagebuilder-react.umd.js
uglifyjs --compress --mangle -- simi-pagebuilder-react.umd.js > compressed.umd.js
