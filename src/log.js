{
    'use strict';


    const Logger        = require( "./Logger" );
    const type          = require( "ee-types" );



    const logger = new Logger();


    const log = function(...items) {
        for (let i = 0, l = items.length; i <l; i++) {
            let item = items[i];

            if (type.error(item)) logger.trace(item, true);
            else if (type.string(item)) {
                let occurences = item.split(/\%s/gi).length - 1;
                let list = items.slice(i+1, i+occurences+1);

                list.unshift(item);
                logger.log(list, 'white');

                i += occurences;
            }
            else logger.log([item], 'white');
        }
    };



    ['trace', 'dir', 'wtf', 'info', 'debug', 'warn', 'error', 'highlight', 'success'].forEach((key) => {
        if (!log[key]) log[key] = logger[key].bind(logger);
        else throw new Error('Failed to map property «'+key+'» of logger to log :(');
    });




    module.exports = log;
}