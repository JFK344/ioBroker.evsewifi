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
        //this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
        //this.main();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.log.info('ESVE Wifi Adapter Started!')
        this.log.info('ESVE IP: ' + this.config.ip);
        this.log.info('Refresh Interval: ' + this.config.refreshInterval);
        this.subscribeStates('*');
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
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            clearInterval(updateInterval);
            callback();
        } catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            this.log.debug(`state ${id} deleted`);
        }
    }

    async getParameters() {
      //try {
          const url = 'http://' + this.config.ip + '/getParameters';
          this.log.debug(url);
          const self = this;
          request({method: "GET", url}, function (error, response, result) {
              //self.log.info("Response: " + response.statusCode)
              if(!error && response.statusCode == 200){
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
              }
              else {
                self.log.error("Check IP!")
                self.stop();
                //self.callback({ error: 1, message: {} });
              }

              //self.stop();
          })
    }
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
