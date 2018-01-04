var log = require( "./" );

log.debug(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.info(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.warn(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.error(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.highlight(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.success(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.wtf(`im sitting in a plane from basel to london, it's shaking as fuck but programming is still fun!`);
log.dir(1,2,3, new Map());
log.trace(new Error('not good!'));
log('a string', 1338, new Date());




const f = async () => {
    throw new Error(1);
}


f().then(log).catch(log);

