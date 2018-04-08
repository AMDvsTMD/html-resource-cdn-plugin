 Source CDN extension for the HTML Webpack Plugin
========================================

Enhances [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
functionality by adding the `{cdnSource: [{"type":js,"regstr":".*","publicPath":"//1.cdn.xxx.com/"}]}` option.

This is an extension plugin for the [webpack](http://webpack.github.io) plugin [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).  It allows you to define every javascript and css source publicPath.

Installation
------------
You must be running webpack on node 4 or higher

Basic Usage
-----------
Require the plugin in your webpack config:

```javascript
var HtmlResourceCdnPlugin=require("html-resource-cdn-plugin");
```

Add the plugin to your webpack config as follows:

```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackInlineSourcePlugin()
]  
```
The above configuration will actually do nothing due to the configuration defaults.

When you set `inlineSource` to a regular expression the source code for any javascript or css file names that match will be embedded inline in the resulting html document.
```javascript
plugins: [
  new HtmlWebpackPlugin({
		cdnSource: [{"type":js,"regstr":".*","publicPath":"//1.cdn.xxx.com/"}]
	}),
  new HtmlWebpackInlineSourcePlugin()
]  
```

