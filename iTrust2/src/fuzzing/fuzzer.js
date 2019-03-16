var Random = require('random-js')
    fs = require('fs'),
    stackTrace = require('stacktrace-parser')
    ;

var fuzzer = 
{
    random : new Random(),
    
    seed: function (kernel)
    {
        fuzzer.random = new Random();
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
                for(var i = 0; i < array.length; i++) {
                    if(array[i] == 'i' && array[i+1] == 'f') {
                        i += 2;
                        if((array[i] == ' ' && array[i+1] == '(') || array[i] == '(') {
                            var found = false;
                            while( !found ) {
                                i++;

                                if(array[i] == ')')
                                    break;

                                if(array[i] == '<') {
                                    array[i] = '>'
                                    found = true;
                                }
                                    
                                if(array[i] == '>') {
                                    array[i] = '<'
                                    found = true;
                                }

                                if(array[i] == '=' && array[i+1] == '=') {
                                    array[i] = '!'
                                    found = true;
                                }

                                if(array[i] == '!' && array[i+1] == '=') {
                                    array[i] = '='
                                    found = true;
                                }

                                
                            }
                        }
                    }
                }
            }

            if(fuzzer.random.bool(0.2)){
                for(var i = 0; i < array.length; i++){
                    if(array[i]== '0'){
                        array[i] = '1'
                    }
                }
            }

            //TODO
            if(fuzzer.random.bool(.1)){
                // add random characters
                for(var i = 0; i < array.length; i++){
                    var randomString = fuzzer.random.string(1)
                    array = array.splice(i, 0, randomString)
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

function mutateFile() {
    fuzzer.seed(fuzzer.random.integer(0,999));
    var base_folder = 'iTrust4/iTrust2/src/main/java/edu/ncsu/csc/itrust2/';
    pickFile(base_folder);
    //console.log(fuzzer.mutate.string(fs.readFileSync(randFile,'utf-8')));
}

function pickFile(path) {
    var newProm = new Promise(function(resolve, reject) {
        fs.readdir(path, function(err, items) {
            var randI = fuzzer.random.integer(0, items.length - 1);
            let currItem = path + "/" + items[randI];
            fs.stat(currItem, function(err, stats) {
                if (stats.isDirectory(currItem))
                    pickFile(currItem);
                if (err) reject(err);
                if (stats.isFile(currItem)) {
                    resolve(currItem);
                }
                
            });
        });
    });
    newProm.then(function ok(response) {
        var mutatedfuzzer = fuzzer.mutate.string(fs.readFileSync(response, 'utf-8'));
        fs.writeFile(response, mutatedfuzzer, function(err) {
            if(err) console.log(err);
            console.log("Fuzzed random file.");
        });
        return response;
    }).catch(function notOk(response) {
        console.log("ERR: " + response);
    })
}

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
mutateFile();
