'use strict';



const LogdLogger = require('logd-console-output');
const Callsite = require('./Callsite');
const instance = new LogdLogger();




module.exports = class Logger {

    constructor() {
        this.blacklist = [];
        this.callsite = new Callsite();
        this.options = {
            truncate: 100000
        };
    }

  
    debug(...values) {
        instance.log({
            values: values,
            color: 'grey',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    info(...values) {
        instance.log({
            values: values,
            color: 'white',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    warn(...values) {
        instance.log({
            values: values,
            color: 'yellow.bold',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    error(...values) {
        instance.log({
            values: values,
            color: 'red.bold',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    wtf(...values) {
        instance.log({
            values: values,
            color: 'magenta.bold.bgWhite',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
        });
    }

    success(...values) {
        instance.log({
            values: values,
            color: 'green.bold',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    highlight(...values) {
        instance.log({
            values: values,
            color: 'cyan.bold',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    trace(...values) {
        instance.log({
            values: values,
            color: 'red',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }


    dir(...values) {
         instance.log({
            values: values,
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }

    log(...values) {
         instance.log({
            values: values,
            color: 'white',
            callsite: this.callsite.convertStackFrame(this.callsite.getCaller(2,5)),
            options: this.options,
        });
    }
}