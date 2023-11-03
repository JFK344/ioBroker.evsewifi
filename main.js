'use strict';

/*
 * Created with @iobroker/create-adapter v1.26.3
 */


const request = require('request');
const utils = require('@iobroker/adapter-core');

const logAttributes = ['uid', 'username', 'timestamp', 'duration', 'energy', 'price', 'reading', 'rEnd'];

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 1)) {s = "0" + s;}
    return s;
}

class Evsewifi extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'evsewifi',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
        //this.main();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.log.info('ESVE Wifi Adapter Started! Instance Number: ' + this.instance)
        this.log.info('ESVE IP: ' + this.config.ip);
        this.log.info('Refresh Interval: ' + this.config.refreshInterval);
        this.subscribeStates('*');
        const self = this;
        var updateInterval = setInterval(function() {self.getParameters(); self.getLog();}, (self.config.refreshInterval*1000));
        var paramtersFolderName = 'parameters.'
        var logsFolderName = 'logs.'

        await this.setObjectNotExistsAsync(paramtersFolderName+'MSG_Type', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'vehicleState', {
            type: 'state',
            common: {
                name: 'vehicleState',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync(paramtersFolderName+'evseState', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'maxCurrent', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'actualCurrent', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'actualPower', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'duration', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'alwaysActive', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'lastActionUser', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'lastActionUID', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'energy', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'mileage', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'meterReading', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'currentP1', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'currentP2', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'currentP3', {
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

        await this.setObjectNotExistsAsync(paramtersFolderName+'useMeter', {
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

        for(var c=0; c < this.config.noLogsToShow; c++){
            const cString = (c).pad(String(this.config.noLogsToShow-1).length);
            for(const a of logAttributes.slice(0,2)) {
                await this.setObjectNotExistsAsync(logsFolderName+'log_'+cString+'.'+a, {
                    type: 'state',
                    common: {
                        name: a,
                        type: 'string',
                        role: 'string',
                        read: true,
                        write: false,
                    },
                    native: {},
                });    
            }
            for(const a of logAttributes.slice(2)) {
                await this.setObjectNotExistsAsync(logsFolderName+'log_'+cString+'.'+a, {
                    type: 'state',
                    common: {
                        name: a,
                        type: 'number',
                        role: 'number',
                        read: true,
                        write: false,
                    },
                    native: {},
                });    
            }
        }

        await this.setObjectNotExistsAsync('setCurrent', {
            type: 'state',
            common: {
                name: 'setCurrent',
                type: 'number',
                role: 'number',
                read: true,
                write: true,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('interruptCp', {
            type: 'state',
            common: {
                name: 'interruptCp',
                type: 'number',
                role: 'number',
                read: true,
                write: true,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('setStatus', {
            type: 'state',
            common: {
                name: 'setStatus',
                type: 'string',
                role: 'string',
                read: true,
                write: true,
            },
            native: {},
        });

        await this.setObjectNotExistsAsync('doReboot', {
            type: 'state',
            common: {
                name: 'doReboot',
                type: 'boolean',
                role: 'button',
                read: false,
                write: true,
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
            if(id == 'evsewifi.'+this.instance+'.doReboot' && state.val == true){
                this.doReboot();
            }
            if(id == 'evsewifi.'+this.instance+'.setCurrent'){
              this.setCurrent(state.val);
            }
            if(id == 'evsewifi.'+this.instance+'.interruptCp' && state.val == true){
                this.interruptCp(state.val?state.val:3000);
            }
            if(id == 'evsewifi.'+this.instance+'.setStatus'){
              if(state.val == 'true' || state.val == 'false'){
                this.setStatus(state.val);
              } else {
                this.log.debug('For "SetStatus" provide -> "true" or "false"')
              }
            }
        } else {
            this.log.debug(`state ${id} deleted`);
        }
    }

    async doReboot(){
      const url = 'http://' + this.config.ip + '/doReboot?reboot=true';
      const self = this;
      request({method: "GET", url}, function (error, response, result) {
          if(!error && response.statusCode == 200){
            if(response == 'S0_EVSE-WiFi is going to reboot now...'){
              self.log.info("Rebooted ESVE-Wifi Module")
            } else {
              self.log.info("Could not performe doReboot()")
            }
          } else {
            self.log.debug("Check IP!")
            //self.stop();
          }
      })
    }

    async setStatus(status){
      const url = 'http://' + this.config.ip + '/setStatus?active='+status;
      const self = this;
      request({method: "GET", url}, function (error, response, result) {
          if(!error && response.statusCode == 200){
            if(result == 'E2_could not process - wrong parameter or EVSE-WiFi runs in always active mode'){
              self.log.info("ESVE Running in Always Active Mode");
            } else {
              self.log.info('Could not perform setStatus()')
            }
          }
          else {
            self.log.info("Check IP!")
            //self.stop();
          }
      })
    }

    async setCurrent(current){
      const url = 'http://' + this.config.ip + '/setCurrent?current='+current;
      const self = this;
      request({method: "GET", url}, function (error, response, result) {
          if(!error && response.statusCode == 200){
            if(result == 'S0_set current to given value'){
            } else {
              self.log.info('Could not perform setCurrent()')
            }
          } else {
            self.log.info("Check IP!")
            //self.stop();
          }
      })
    }

    async interruptCp(duration){
        const url = 'http://' + this.config.ip + '/interruptCp?duration='+duration;
        const self = this;
        request({method: "GET", url}, function (error, response, result) {
            if(!error && response.statusCode == 200){
              if(result == 'S0_set current to given value'){
              } else {
                self.log.info("Could not perform interruptCp(): `result`")
              }
            } else {
              self.log.info("Check IP!")
              //self.stop();
            }
        })
      }
  
    async getLog(){
      var logsFolderName = 'logs.'
      const url = 'http://' + this.config.ip + '/getLog';
      const self = this;
      if (this.config.noLogsToShow != 0){
        request({method: "GET", url}, function (error, response, result) {
            if(!error && response.statusCode == 200){
              var logObj = JSON.parse(result);
              const l = Object.keys(logObj.list).length;
              for(let c=0; c < l && c < self.config.noLogsToShow; c++){
                const cString = (c).pad(String(self.config.noLogsToShow-1).length);
                for(const a of logAttributes) {
                  self.setState(logsFolderName+'log_'+cString+'.'+a, logObj.list[l-1-c][a], true); // latest entry first
                }
              }
              self.log.debug('getLog returned: ' + result)
            } else {
              self.log.error("Check IP!")
              //self.stop();
            }
        })
      }
    }

    async getParameters() {
          const url = 'http://' + this.config.ip + '/getParameters';
          this.log.debug(url);
          const self = this;
          request({method: "GET", url}, function (error, response, result) {
              //self.log.info("Response: " + response.statusCode)
              if(!error && response.statusCode == 200){
                self.log.debug("Parameter Message: " + result);
                var parameterDataObj = JSON.parse(result)
                var paramtersFolderName = 'parameters.'
                self.setState(paramtersFolderName+'MSG_Type', parameterDataObj.type, true)
                self.setState(paramtersFolderName+'vehicleState', parameterDataObj.list[0].vehicleState, true)
                self.setState(paramtersFolderName+'evseState', parameterDataObj.list[0].evseState, true)
                self.setState(paramtersFolderName+'maxCurrent', parameterDataObj.list[0].maxCurrent, true)
                self.setState(paramtersFolderName+'actualCurrent', parameterDataObj.list[0].actualCurrent, true)
                self.setState(paramtersFolderName+'actualPower', parameterDataObj.list[0].actualPower, true)
                self.setState(paramtersFolderName+'duration', parameterDataObj.list[0].duration, true)
                self.setState(paramtersFolderName+'alwaysActive', parameterDataObj.list[0].alwaysActive, true)
                self.setState(paramtersFolderName+'lastActionUser', parameterDataObj.list[0].lastActionUser, true)
                self.setState(paramtersFolderName+'lastActionUID', parameterDataObj.list[0].lastActionUID, true)
                self.setState(paramtersFolderName+'energy', parameterDataObj.list[0].energy, true)
                self.setState(paramtersFolderName+'mileage', parameterDataObj.list[0].mileage, true)
                self.setState(paramtersFolderName+'meterReading', parameterDataObj.list[0].meterReading, true)
                self.setState(paramtersFolderName+'currentP1', parameterDataObj.list[0].currentP1, true)
                self.setState(paramtersFolderName+'currentP2', parameterDataObj.list[0].currentP2, true)
                self.setState(paramtersFolderName+'currentP3', parameterDataObj.list[0].currentP3, true)
                self.setState(paramtersFolderName+'useMeter', parameterDataObj.list[0].useMeter, true)
              }
              else {
                self.log.info("Check IP!")
                //self.stop();
              }
          })
    }
}


if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */

    module.exports = (options) => new Evsewifi(options);
} else {
    // otherwise start the instance directly
    new Evsewifi();
}
