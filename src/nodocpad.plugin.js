var fs = require("fs"),
	path = require("path");

module.exports = function (BasePlugin) {
	function isNodocpad(prefix, relativePath) {
		var dirname = path.dirname(relativePath);

		return fs.existsSync(prefix + dirname + "/.nodocpad") || ((dirname !== ".") && isNodocpad(prefix, dirname));
	}

	function NodocpadPlugin() {
		BasePlugin.apply(this, arguments);
	}

	var p = NodocpadPlugin.prototype = Object.create(BasePlugin.prototype);

	p.name = "nodocpad";

	p.renderDocument = function (options, next) {
		var fullPath = options.file.attributes.fullPath,
			relativePath = options.file.attributes.relativePath,
			prefix = fullPath.replace(relativePath, "");

		if (isNodocpad(prefix, relativePath)) {
			options.file.attributes.write = false;
		}

		return next();
	};

	return NodocpadPlugin;
};
