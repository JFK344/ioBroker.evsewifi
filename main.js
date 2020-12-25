'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.3
 */


const request = require('request');
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");

class Esvewifi extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'esvewifi',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        //this.main();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);
        this.log.info('ESVE IP: ' + this.config.ip);
        this.log.info('Refresh Interval ' + this.config.refreshInterval);
        //this.subscribeStates(*);
        const self = this;
        var updateInterval = setInterval(function() {self.getParameters();}, (self.config.refreshInterval*1000));

        await this.setObjectNotExistsAsync('MSG_Type', {
            type: 'state',
            common: {
                name: 'MSG_Type',
                type: 'string',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('vehicleState', {
            type: 'state',
            common: {
                name: 'vehicleState',
                type: 'string',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('evseState', {
            type: 'state',
            common: {
                name: 'evseState',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('maxCurrent', {
            type: 'state',
            common: {
                name: 'maxCurrent',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('actualCurrent', {
            type: 'state',
            common: {
                name: 'actualCurrent',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('actualPower', {
            type: 'state',
            common: {
                name: 'actualPower',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('duration', {
            type: 'state',
            common: {
                name: 'duration',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('alwaysActive', {
            type: 'state',
            common: {
                name: 'alwaysActive',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('lastActionUser', {
            type: 'state',
            common: {
                name: 'lastActionUser',
                type: 'string',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('lastActionUID', {
            type: 'state',
            common: {
                name: 'lastActionUID',
                type: 'string',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('energy', {
            type: 'state',
            common: {
                name: 'energy',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('mileage', {
            type: 'state',
            common: {
                name: 'milage',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('meterReading', {
            type: 'state',
            common: {
                name: 'meterReading',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('currentP1', {
            type: 'state',
            common: {
                name: 'currentP1',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('currentP2', {
            type: 'state',
            common: {
                name: 'currentP2',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('currentP3', {
            type: 'state',
            common: {
                name: 'currentP3',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('useMeter', {
            type: 'state',
            common: {
                name: 'useMeter',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });
        //while (i < 10) {
        //  this.log.info("Run: " + i);
        //  i++;
        //  this.getParameters();
        //}

    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            clearInterval(updateInterval);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.message" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }



    async getParameters() {
      try {
          const url = 'http://' + this.config.ip + '/getParameters';
          this.log.debug(url);
          const self = this;
          request({method: "GET", url}, function (error, response, result) {
              self.log.debug("Parameter Message: " + result);
              var parameterDataObj = JSON.parse(result)
              self.setState('MSG_Type', parameterDataObj.type, true)
              self.setState('vehicleState', parameterDataObj.list[0].vehicleState, true)
              self.setState('evseState', parameterDataObj.list[0].evseState, true)
              self.setState('maxCurrent', parameterDataObj.list[0].maxCurrent, true)
              self.setState('actualCurrent', parameterDataObj.list[0].actualCurrent, true)
              self.setState('actualPower', parameterDataObj.list[0].actualPower, true)
              self.setState('duration', parameterDataObj.list[0].duration, true)
              self.setState('alwaysActive', parameterDataObj.list[0].alwaysActive, true)
              self.setState('lastActionUser', parameterDataObj.list[0].lastActionUser, true)
              self.setState('lastActionUID', parameterDataObj.list[0].lastActionUID, true)
              self.setState('energy', parameterDataObj.list[0].energy, true)
              self.setState('mileage', parameterDataObj.list[0].mileage, true)
              self.setState('meterReading', parameterDataObj.list[0].meterReading, true)
              self.setState('currentP1', parameterDataObj.list[0].currentP1, true)
              self.setState('currentP2', parameterDataObj.list[0].currentP2, true)
              self.setState('currentP3', parameterDataObj.list[0].currentP3, true)
              self.setState('useMeter', parameterDataObj.list[0].useMeter, true)
              //self.stop();
          }).on("error", function (e) {
              self.log.info(e);
              self.stop();
          });
      } catch (e) {
          this.log.info("Catch Error");
          this.log.info(e);
      }
    }
//      this.setObjectNotExists('MSG_Type', {
//          type: 'state',
//          common: {
//              name: "msg type",
//              type: "string",
//          },
//          native: {}
//      });


}

if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */

    module.exports = (options) => new Esvewifi(options);
} else {
    // otherwise start the instance directly
    new Esvewifi();
}
