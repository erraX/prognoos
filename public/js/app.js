define(function(require) {
    var ajax = require('ajax');
    var $ = require('jquery');

    function tripleExists($table, data) {
        var isExists = false;

        function exists(data) {
            $table.find('tr').each(function(i, e) {
                var $tds = $(e).find('td');
                if ($tds.eq(0).text() === data.entA &&
                        $tds.eq(1).text() === data.rel &&
                        $tds.eq(2).text() === data.entB) {
                    isExists = true;
                }
            });
        }

        if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                exists(data[0]);
            }
        } else {
            exists(data);
        }
        return isExists;
    }

    function startLinkPrediction(e) {
        var postData = {};
        postData.entA = $('#ipt-entA').val();
        postData.entB = $('#ipt-entB').val();

        if (!postData.entA || !postData.entB) {
            return;
        }

        ajax.post('/demo/linkprediction', postData).then(linkPredictionCallback);
    }

    function startRuleInference(e) {
        var postData = prepareRule();
        // console.log(postData);
        ajax.post('/demo/inference', postData).then(inferenceCallback);
    }

    function linkPredictionCallback(data) {
        var $table = $('#lp-result');
        if ($.isEmptyObject(data)) {
            alert('Relation not found!');
            return;
        }

        if (tripleExists($table, data)) {
            return;
        }
        $table.append(resultRaw(data));
    }

    function inferenceCallback(data) {
        var $table = $('#infer-result');
        if ($.isEmptyObject(data) || !data.length || tripleExists($table, data)) {
            alert("Didn't find any relation in database.");
            return;
        }
        for (var i = 0; i < data.length; i++) {
            $table.append(resultRaw(data[i]));
        }
    }

    function resultRaw(data) {
        return [
            '<tr>',
                '<td>' + data.entA + '</td>',
                '<td>' + data.rel + '</td>',
                '<td>' + data.entB + '</td>',
            '</tr>'
        ].join('');
    }

    function prepareRule() {
        var data = {};
        data.one = [];
        data.two = [];
        data.three = {};
        data.results = {};

        // Step one
        $('#step-one-table .space').each(function(i ,e) {
            var $ipts = $(e).find('input');
            data.one.push({
                entA: $ipts.eq(0).val(),
                prop: $ipts.eq(1).val(),
                entB: $ipts.eq(2).val()
            });
        });

        // Step two
        $('#step-two-table .space').each(function(i ,e) {
            var $ipts = $(e).find('input');
            data.two.push({
                entA: $ipts.eq(0).val(),
                prop: $ipts.eq(1).val(),
                func: $ipts.eq(2).val(),
                entB: $ipts.eq(3).val()
            });
        });

        // Step three
        var $ipts = $('#step-three-table input');
        data.three = {
            entA: $ipts.eq(0).val(),
            prop: $ipts.eq(1).val(),
            func: $ipts.eq(2).val(),
            entB: $ipts.eq(3).val()
        };

        // Step four
        var $ipts = $('#step-four-table input');
        data.results = {
            entA: $ipts.eq(0).val(),
            prop: $ipts.eq(1).val(),
            entB: $ipts.eq(2).val()
        };

        return data;
    }

    function clearLink() {
        $('#lp-result').find('tr').remove();
    }

    function clearRule() {
        $('#infer-result').find('tr').remove();
    }

    function navTab(e) {
        var $curNav = $(this);
        var $tabs = $('section.tab');
        var $nav = $curNav.closest('ul');
        var curIdx = $curNav.index();

        $nav.find('li').removeClass('current');
        $curNav.addClass('current');

        $tabs.removeClass('current');
        $tabs.eq(curIdx).addClass('current');
    }

    function bindEvents() {
        $('nav li').on('click', navTab);
        $('#start-lp').on('click', startLinkPrediction);
        $('#start-rule').on('click', startRuleInference);
        $('#clear-lp').on('click', clearLink);
        $('#clear-rule').on('click', clearRule);

        $('#start').on('click', function(e) {
            $('nav li').eq(1).click();
        });
    }

    var app = {
        start: function() {
            bindEvents();
        }
    };

    return app;
});
