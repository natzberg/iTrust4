var Random = require('random-js')
    marqdown = require('./marqdown.js'),
    fs = require('fs'),
    stackTrace = require('stacktrace-parser')
    ;

var fuzzer = 
{
    random : new Random(Random.engines.mt19937().seed(0)),
    
    seed: function (kernel)
    {
        fuzzer.random = new Random(Random.engines.mt19937().seed(kernel));
    },

    mutate:
    {
        string: function(val)
        {

            // MUTATE IMPLEMENTATION HERE
            var array = val.split('');

            if(fuzzer.random.bool(0.05)){
                array = array.reverse()
            }

            if(fuzzer.random.bool(0.1)){
                for(var i = 0; i < array.length; i++){
                    if(array[i]== '<'){
                        array[i] = '>'
                    }
                }
            }

            if(fuzzer.random.bool(.08)){
                for(var i = 0; i < array.length - 1; i++){
                    if(array[i] == '=' && array[i + 1] == '='){
                        array[i] = '!'
                    }
                }
            }

            if(fuzzer.random.bool(0.1)){
                for(var i = 0; i < array.length; i++){
                    if(array[i]== '0'){
                        array[i] = '1'
                    }
                }
            }

            if(fuzzer.random.bool(.10)){
                // add random characters
                for(var i = 0; i < array.length; i++){
                    var randomString = fuzzer.random.string(1)
                    array.splice(i, 0, randomString)
                }
            }

            // if( fuzzer.random.bool(0.05) )
            // {
            //     array = array.reverse()
            // }
            // // delete random characters
            // if( fuzzer.random.bool(0.25) )
            // {
            //     let length = array.length
            //     let index = fuzzer.random.integer(0,length)
            //     array.splice(index, 1, "")
            // }

            // let length = array.length

            // // add random characters
            // var randomString = fuzzer.random.string(10)
            // array.splice(length - 1, 0, randomString)

            return array.join('');
        }
    }
};

if( process.env.NODE_ENV != "test")
{
    fuzzer.seed(0);
    mutationTesting(['test.md','simple.md'],1000);
}

function mutationTesting(paths,iterations)
{    
    var failedTests = [];
    var reducedTests = [];
    var passedTests = 0;
    
    var markDownA = fs.readFileSync(paths[0],'utf-8');
    var markDownB = fs.readFileSync(paths[1],'utf-8');
    
    for (var i = 0; i < iterations; i++) {
        let mutuatedString = ""
        if(i%2 == 1){
            mutuatedString = fuzzer.mutate.string(markDownA);
        }
        else{
            mutuatedString = fuzzer.mutate.string(markDownB);
        }
        
        try
        {
            marqdown.render(mutuatedString);
            passedTests++;
        }
        catch(e)
        {
            failedTests.push( {input:mutuatedString, stack: e.stack} );
        }

        if( fuzzer.random.bool(0.05) )
        {
            i--
        }

    }

    reduced = {};
    // RESULTS OF FUZZING
    for( var i =0; i < failedTests.length; i++ )
    {
        var failed = failedTests[i];

        var trace = stackTrace.parse( failed.stack );
        var msg = failed.stack.split("\n")[0];
        console.log( msg, trace[0].methodName, trace[0].lineNumber );
        let key = trace[0].methodName + "." + trace[0].lineNumber;

        if( !reduced.hasOwnProperty( key ) )
        {
            reduced[key]= {input: failed.input, msg}
        }
        else{
            reducedTests.push(key)
            failedTests.splice(i,1)
        }
    }

    console.log( "passed {0}, failed {1}, reduced {2}".format(passedTests, failedTests.length, reducedTests.length) );
    
    for( var key in reduced )
    {
        console.log( `${marqdown.render(reduced[key].input)} resulted in ` );
        console.log( reduced[key].input );
    }

}

exports.mutationTesting = mutationTesting;
exports.fuzzer = fuzzer;

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}