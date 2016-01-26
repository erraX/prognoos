var rdfstore = require('rdfstore');
var fs = require('fs')

var turtleString = fs.readFileSync("digital.ttl", "utf-8");
var command = fs.readFileSync("cmd.rq", "utf-8")

rdfstore.create(function(err, store) {
    store.load("text/turtle", turtleString, function(err, results) {
        store.execute(command, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
        });
    });
});


// json2SPARQL("./cmd.rq");

// function  json2SPARQL(filePath) {
//     // Parse a SPARQL query to a JSON object
//     var command = fs.readFileSync(filePath, "utf-8")
//     var SparqlParser = require('sparqljs').Parser;
//     var parser = new SparqlParser();
//     var parsedQuery = parser.parse(command);
//     // console.log(parsedQuery.where[0]);
//     console.log(JSON.stringify(parsedQuery.where));
// }
//
// function SPARQL2json() {
//     // Regenerate a SPARQL query from a JSON object
//     var SparqlGenerator = require('sparqljs').Generator;
//     var generator = new SparqlGenerator();
//     query = {
//               "type": "query",
//               "prefixes": {
//                 "dbpedia-owl": "http://dbpedia.org/ontology/"
//               },
//               "queryType": "SELECT",
//               "variables": [ "?p", "?c" ],
//               "where": [
//                 {
//                   "type": "bgp",
//                   "triples": [
//                     {
//                       "subject": "?p",
//                       "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
//                       "object": "http://dbpedia.org/ontology/Artist"
//                     },
//                     {
//                       "subject": "?p",
//                       "predicate": "http://dbpedia.org/ontology/birthPlace",
//                       "object": "?c"
//                     },
//                     {
//                       "subject": "?c",
//                       "predicate": "http://xmlns.com/foaf/0.1/name",
//                       "object": "\"York\"@en"
//                     }
//                   ]
//                 }
//               ]
//             };
//
//     var generatedQuery = generator.stringify(query);
//     console.log(generatedQuery);
// }
