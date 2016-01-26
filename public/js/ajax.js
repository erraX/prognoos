define(function(require) {
    var exports = {};

    exports.post = function(url, data, opts) {
        opts = opts || {};
        $.extend(opts, {
            type: 'POST',
            contentType: 'application/json'
        });
        return this.get(url, data, opts);
    };

    exports.get = function(url, data, opts) {
        var DEFAULT_OPTIONS = {
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            cache: false,
            timeout: 5000
        };
        data = data || {};
        opts = opts || {};

        opts = $.extend({
            url: url,
            data: JSON.stringify(data)
        }, DEFAULT_OPTIONS, opts);

        return $.ajax(opts);
    };

    return exports;
});

