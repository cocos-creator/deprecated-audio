﻿var Path = require('fire-path');

// AudioClipMeta
Editor.AudioClipMeta = Fire.Class({
    name: 'Editor.AudioClipMeta',
    extends: Editor.AssetMeta,

    constructor: function () {
        // overridable properties
        this.assetType = Fire.AudioClip;
    },

    createAsset: function ( path, cb ) {
        // load Fire.AudioClip
        var asset = new Fire.AudioClip();
        asset._setRawExtname(Path.extname(path));
        cb ( null, asset );
    },

    import: function (file) {
        var scope = this;
        var Async = require('async');

        Async.parallel([
            function ( next ) {
                Editor.AssetDB.saveAssetToLibrary( file.meta.uuid, file.asset, next );
            },

            function ( next ) {
                Editor.AssetDB.copyToLibrary( file.meta.uuid, Path.extname(file.path), file.path, next );
            },
        ], function ( err ) {
            if ( err ) {
                scope.error(err);
                return;
            }
            scope.done();
        });
    },
});

module.exports = Editor.AudioClipMeta;
