var demo = require('express').Router();
var rdfstore = require('rdfstore');
var fs = require('fs')
var turtleString = fs.readFileSync('digital.ttl', 'utf-8');

/**
    results: [
        {
            x: { token: 'uri', value: 'http://www.ecnu.ica.com/ditital#Nexus5' },
            y: { token: 'uri', value: 'http://www.ecnu.ica.com/ditital#iPhone5' }
        }
    ]
 */
function getTriple(results) {
    var converted = [];
    results.forEach(function(triple, idx) {
        var tmp = [];
        for (var key in triple) {
            var uri = triple[key].value;
            var entityName = uri.split('#')[1];
            tmp.push(entityName);
        }
        converted.push(tmp);
    });
    return converted;
}

function attachRelation(triples, rel) {
    var converted = [];
    triples.forEach(function(triple, idx) {
        converted.push({
            entA: triple[0],
            rel: rel,
            entB: triple[1],
        });
    });
    return converted;
}

function handleLinkPrediction(entA, rel, entB) {
    return {
        entA: entA,
        rel: rel.split('#')[1],
        entB: entB
    };
}

/*
PREFIX schema:<http://www.ecnu.ica.com/ditital#>

SELECT ?rel
WHERE {
    schema:长城BTX-800SP ?rel "CCC认证" .
}
*/
demo.post('/linkprediction', function (req, res, next) {
    var params = req.body;
    var entA = params.entA;
    var entB = params.entB;
    var cmd = ['PREFIX schema:<http://www.ecnu.ica.com/ditital#>',
               'SELECT ?rel',
               'WHERE {',
               'schema:' + entA + ' ?rel "' + entB + '" .',
               '}'
              ];
    cmd = cmd.join('\n');
    console.log(cmd);
    rdfstore.create(function(err, store) {
        store.load("text/turtle", turtleString, function(err, results) {
            store.execute(cmd, function(err, results) {
                if (err || !results || !results.length) {
                    console.log(err);
                    res.send({});
                } else {
                    res.send(handleLinkPrediction(entA, results[0].rel.value, entB));
                }
            });
        });
    });
});

/*
PREFIX schema:<http://www.ecnu.ica.com/ditital#>

SELECT ?x ?y
WHERE {
    ?x schema:isA "手机" .
    ?y schema:isA "手机" .
    ?x schema:released ?releasedA .
    ?y schema:released ?releasedB .
    ?x schema:price ?priceA .
    ?y schema:price ?priceB .
    FILTER( ?releasedA > 2012
    && ?releasedB > 2012
    && ( (0 < ?priceA - ?priceB < 1000)
    || (0 < ?priceB - ?priceA < 1000) )
    && str(?x) < str(?y) ) }
*/

demo.post('/inference', function (req, res, next) {
    var params = req.body;
    var operator = '-';
    var cmd = ['PREFIX schema:<http://www.ecnu.ica.com/ditital#>',
                    'SELECT ' + params.one[0].entA + ' ' +  params.one[1].entA,
                    'WHERE {',
                    params.one[0].entA + ' schema:' + params.one[0].prop + ' "' + params.one[0].entB + '" .',
                    params.one[1].entA + ' schema:' + params.one[1].prop + ' "' + params.one[1].entB + '" .',
                    params.one[0].entA + ' schema:' + params.two[0].prop + ' ?' + params.two[0].prop + 'A .',
                    params.one[1].entA + ' schema:' + params.two[1].prop + ' ?' + params.two[1].prop + 'B .',
                    params.one[0].entA + ' schema:' + params.three.prop + ' ?' + params.three.prop + 'A .',
                    params.one[1].entA + ' schema:' + params.three.prop + ' ?' + params.three.prop + 'B .',
                    'FILTER( ?' + params.two[0].prop + 'A ' + params.two[0].func + ' ' + params.two[0].entB,
                    '&& ?' + params.two[1].prop + 'B ' + params.two[1].func + ' ' + params.two[1].entB, 
                    '&& ?' + params.three.prop + 'A ' + operator + ' ?' + params.three.prop + 'B' +  ' < ' + params.three.entB,
                    '&& str(' + params.one[0].entA + ') < str(' + params.one[1].entA + ') ) }'
                    ];
    cmd = cmd.join('\n');
    console.log(cmd);
    rdfstore.create(function(err, store) {
        store.load("text/turtle", turtleString, function(err, results) {
            store.execute(cmd, function(err, results) {
                if (err || !results || !results.length) {
                    console.log(err);
                    res.send([]);
                } else {
                    // console.log(results);
                    // res.send(handleRule(results));
                    var triples = getTriple(results);
                    res.send(attachRelation(triples, params.results.prop));
                }
            });
        });
    });
});

module.exports = demo;
