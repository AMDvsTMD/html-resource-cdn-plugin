
'use strict';
var assert = require('assert');

function HtmlResourceCdnPlugin (options) {
    assert.equal(options, undefined, 'The HtmlResourceCdnPlugin does not accept any options');
}

HtmlResourceCdnPlugin.prototype.apply = function (compiler) {
    var self = this;

    // Hook into the html-webpack-plugin processing

    (compiler.hooks
        ? compiler.hooks.compilation.tap.bind(compiler.hooks.compilation, 'html-resource-cdn-plugin')
        : compiler.plugin.bind(compiler, 'compilation'))(function (compilation) {
        (compilation.hooks
            ? compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync.bind(compilation.hooks.htmlWebpackPluginAlterAssetTags, 'html-resource-cdn-plugin')
            : compilation.plugin.bind(compilation, 'html-webpack-plugin-alter-asset-tags'))(function (htmlPluginData, callback) {
            if (!htmlPluginData.plugin.options.cdnSource) {
                return callback(null, htmlPluginData);
            }
            var result = self.processTags(compilation, htmlPluginData);
            callback(null, result);
        });
    });
};

HtmlResourceCdnPlugin.prototype.processTags = function (compilation, pluginData) {
    var self = this;
    var body = [];
    var head = [];
    var cdnSource = pluginData.plugin.options.cdnSource;
    for(var i=0;i<cdnSource.length;i++) {
        var type=cdnSource[i].type;
        var regexStr=cdnSource[i].regstr;
        var publicPath=cdnSource[i].publicPath;
        var regex=new RegExp(regexStr);
        pluginData.head.forEach(function (tag) {
            head.push(self.processTag(compilation, regex,type,publicPath, tag));
        });

        pluginData.body.forEach(function (tag) {
            body.push(self.processTag(compilation, regex,type,publicPath, tag));
        });
    }

    return {
        head: head,
        body: body,
        plugin: pluginData.plugin,
        chunks: pluginData.chunks,
        outputName: pluginData.outputName
    };
};

HtmlResourceCdnPlugin.prototype.processTag = function (compilation, regex,type,publicPath, tag) {
    var assetUrl;

    // change js publicpath
    if (tag.tagName === 'script'&&type==="js" && regex.test(tag.attributes.src)) {
        assetUrl = tag.attributes.src;
        tag = {
            tagName: 'script',
            closeTag: true,
            attributes: {
                type: 'text/javascript'
            }
        };

        // change css publicpath
    } else if (tag.tagName === 'link' &&type==="css" && regex.test(tag.attributes.href)) {
        assetUrl = tag.attributes.href;
        tag = {
            tagName: 'style',
            closeTag: true,
            attributes: {
                type: 'text/css'
            }
        };
    }

    if (assetUrl) {
        // Strip public URL prefix from asset URL to get Webpack asset name
        var publicUrlPrefix = compilation.outputOptions.publicPath || '';
        tag.attributes.href = assetUrl.replace(publicUrlPrefix,publicPath);
    }

    return tag;
};

module.exports = HtmlResourceCdnPlugin;