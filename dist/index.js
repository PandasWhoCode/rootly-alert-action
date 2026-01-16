import require$$0 from 'os';
import require$$0$1 from 'crypto';
import require$$1 from 'fs';
import require$$1$2 from 'path';
import require$$2 from 'http';
import require$$3 from 'https';
import 'net';
import require$$1$1 from 'tls';
import require$$4 from 'events';
import require$$5 from 'assert';
import require$$6 from 'util';
import require$$0$2 from 'string_decoder';
import require$$2$1 from 'child_process';
import require$$6$1 from 'timers';

var core = {};

var command = {};

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	// We use any as a valid input type
	/* eslint-disable @typescript-eslint/no-explicit-any */
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.toCommandProperties = utils.toCommandValue = void 0;
	/**
	 * Sanitizes an input into a string so it can be passed into issueCommand safely
	 * @param input input to sanitize into a string
	 */
	function toCommandValue(input) {
	    if (input === null || input === undefined) {
	        return '';
	    }
	    else if (typeof input === 'string' || input instanceof String) {
	        return input;
	    }
	    return JSON.stringify(input);
	}
	utils.toCommandValue = toCommandValue;
	/**
	 *
	 * @param annotationProperties
	 * @returns The command properties to send with the actual annotation command
	 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
	 */
	function toCommandProperties(annotationProperties) {
	    if (!Object.keys(annotationProperties).length) {
	        return {};
	    }
	    return {
	        title: annotationProperties.title,
	        file: annotationProperties.file,
	        line: annotationProperties.startLine,
	        endLine: annotationProperties.endLine,
	        col: annotationProperties.startColumn,
	        endColumn: annotationProperties.endColumn
	    };
	}
	utils.toCommandProperties = toCommandProperties;
	
	return utils;
}

var hasRequiredCommand;

function requireCommand () {
	if (hasRequiredCommand) return command;
	hasRequiredCommand = 1;
	var __createBinding = (command && command.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (command && command.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (command && command.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(command, "__esModule", { value: true });
	command.issue = command.issueCommand = void 0;
	const os = __importStar(require$$0);
	const utils_1 = requireUtils();
	/**
	 * Commands
	 *
	 * Command Format:
	 *   ::name key=value,key=value::message
	 *
	 * Examples:
	 *   ::warning::This is the message
	 *   ::set-env name=MY_VAR::some value
	 */
	function issueCommand(command, properties, message) {
	    const cmd = new Command(command, properties, message);
	    process.stdout.write(cmd.toString() + os.EOL);
	}
	command.issueCommand = issueCommand;
	function issue(name, message = '') {
	    issueCommand(name, {}, message);
	}
	command.issue = issue;
	const CMD_STRING = '::';
	class Command {
	    constructor(command, properties, message) {
	        if (!command) {
	            command = 'missing.command';
	        }
	        this.command = command;
	        this.properties = properties;
	        this.message = message;
	    }
	    toString() {
	        let cmdStr = CMD_STRING + this.command;
	        if (this.properties && Object.keys(this.properties).length > 0) {
	            cmdStr += ' ';
	            let first = true;
	            for (const key in this.properties) {
	                if (this.properties.hasOwnProperty(key)) {
	                    const val = this.properties[key];
	                    if (val) {
	                        if (first) {
	                            first = false;
	                        }
	                        else {
	                            cmdStr += ',';
	                        }
	                        cmdStr += `${key}=${escapeProperty(val)}`;
	                    }
	                }
	            }
	        }
	        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
	        return cmdStr;
	    }
	}
	function escapeData(s) {
	    return (0, utils_1.toCommandValue)(s)
	        .replace(/%/g, '%25')
	        .replace(/\r/g, '%0D')
	        .replace(/\n/g, '%0A');
	}
	function escapeProperty(s) {
	    return (0, utils_1.toCommandValue)(s)
	        .replace(/%/g, '%25')
	        .replace(/\r/g, '%0D')
	        .replace(/\n/g, '%0A')
	        .replace(/:/g, '%3A')
	        .replace(/,/g, '%2C');
	}
	
	return command;
}

var fileCommand = {};

var hasRequiredFileCommand;

function requireFileCommand () {
	if (hasRequiredFileCommand) return fileCommand;
	hasRequiredFileCommand = 1;
	// For internal use, subject to change.
	var __createBinding = (fileCommand && fileCommand.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (fileCommand && fileCommand.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (fileCommand && fileCommand.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(fileCommand, "__esModule", { value: true });
	fileCommand.prepareKeyValueMessage = fileCommand.issueFileCommand = void 0;
	// We use any as a valid input type
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const crypto = __importStar(require$$0$1);
	const fs = __importStar(require$$1);
	const os = __importStar(require$$0);
	const utils_1 = requireUtils();
	function issueFileCommand(command, message) {
	    const filePath = process.env[`GITHUB_${command}`];
	    if (!filePath) {
	        throw new Error(`Unable to find environment variable for file command ${command}`);
	    }
	    if (!fs.existsSync(filePath)) {
	        throw new Error(`Missing file at path: ${filePath}`);
	    }
	    fs.appendFileSync(filePath, `${(0, utils_1.toCommandValue)(message)}${os.EOL}`, {
	        encoding: 'utf8'
	    });
	}
	fileCommand.issueFileCommand = issueFileCommand;
	function prepareKeyValueMessage(key, value) {
	    const delimiter = `ghadelimiter_${crypto.randomUUID()}`;
	    const convertedValue = (0, utils_1.toCommandValue)(value);
	    // These should realistically never happen, but just in case someone finds a
	    // way to exploit uuid generation let's not allow keys or values that contain
	    // the delimiter.
	    if (key.includes(delimiter)) {
	        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
	    }
	    if (convertedValue.includes(delimiter)) {
	        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
	    }
	    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
	}
	fileCommand.prepareKeyValueMessage = prepareKeyValueMessage;
	
	return fileCommand;
}

var oidcUtils = {};

var lib = {};

var proxy = {};

var hasRequiredProxy;

function requireProxy () {
	if (hasRequiredProxy) return proxy;
	hasRequiredProxy = 1;
	Object.defineProperty(proxy, "__esModule", { value: true });
	proxy.checkBypass = proxy.getProxyUrl = void 0;
	function getProxyUrl(reqUrl) {
	    const usingSsl = reqUrl.protocol === 'https:';
	    if (checkBypass(reqUrl)) {
	        return undefined;
	    }
	    const proxyVar = (() => {
	        if (usingSsl) {
	            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
	        }
	        else {
	            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
	        }
	    })();
	    if (proxyVar) {
	        try {
	            return new URL(proxyVar);
	        }
	        catch (_a) {
	            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
	                return new URL(`http://${proxyVar}`);
	        }
	    }
	    else {
	        return undefined;
	    }
	}
	proxy.getProxyUrl = getProxyUrl;
	function checkBypass(reqUrl) {
	    if (!reqUrl.hostname) {
	        return false;
	    }
	    const reqHost = reqUrl.hostname;
	    if (isLoopbackAddress(reqHost)) {
	        return true;
	    }
	    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
	    if (!noProxy) {
	        return false;
	    }
	    // Determine the request port
	    let reqPort;
	    if (reqUrl.port) {
	        reqPort = Number(reqUrl.port);
	    }
	    else if (reqUrl.protocol === 'http:') {
	        reqPort = 80;
	    }
	    else if (reqUrl.protocol === 'https:') {
	        reqPort = 443;
	    }
	    // Format the request hostname and hostname with port
	    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
	    if (typeof reqPort === 'number') {
	        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
	    }
	    // Compare request host against noproxy
	    for (const upperNoProxyItem of noProxy
	        .split(',')
	        .map(x => x.trim().toUpperCase())
	        .filter(x => x)) {
	        if (upperNoProxyItem === '*' ||
	            upperReqHosts.some(x => x === upperNoProxyItem ||
	                x.endsWith(`.${upperNoProxyItem}`) ||
	                (upperNoProxyItem.startsWith('.') &&
	                    x.endsWith(`${upperNoProxyItem}`)))) {
	            return true;
	        }
	    }
	    return false;
	}
	proxy.checkBypass = checkBypass;
	function isLoopbackAddress(host) {
	    const hostLower = host.toLowerCase();
	    return (hostLower === 'localhost' ||
	        hostLower.startsWith('127.') ||
	        hostLower.startsWith('[::1]') ||
	        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
	}
	
	return proxy;
}

var tunnel$1 = {};

var hasRequiredTunnel$1;

function requireTunnel$1 () {
	if (hasRequiredTunnel$1) return tunnel$1;
	hasRequiredTunnel$1 = 1;
	var tls = require$$1$1;
	var http = require$$2;
	var https = require$$3;
	var events = require$$4;
	var util = require$$6;


	tunnel$1.httpOverHttp = httpOverHttp;
	tunnel$1.httpsOverHttp = httpsOverHttp;
	tunnel$1.httpOverHttps = httpOverHttps;
	tunnel$1.httpsOverHttps = httpsOverHttps;


	function httpOverHttp(options) {
	  var agent = new TunnelingAgent(options);
	  agent.request = http.request;
	  return agent;
	}

	function httpsOverHttp(options) {
	  var agent = new TunnelingAgent(options);
	  agent.request = http.request;
	  agent.createSocket = createSecureSocket;
	  agent.defaultPort = 443;
	  return agent;
	}

	function httpOverHttps(options) {
	  var agent = new TunnelingAgent(options);
	  agent.request = https.request;
	  return agent;
	}

	function httpsOverHttps(options) {
	  var agent = new TunnelingAgent(options);
	  agent.request = https.request;
	  agent.createSocket = createSecureSocket;
	  agent.defaultPort = 443;
	  return agent;
	}


	function TunnelingAgent(options) {
	  var self = this;
	  self.options = options || {};
	  self.proxyOptions = self.options.proxy || {};
	  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
	  self.requests = [];
	  self.sockets = [];

	  self.on('free', function onFree(socket, host, port, localAddress) {
	    var options = toOptions(host, port, localAddress);
	    for (var i = 0, len = self.requests.length; i < len; ++i) {
	      var pending = self.requests[i];
	      if (pending.host === options.host && pending.port === options.port) {
	        // Detect the request to connect same origin server,
	        // reuse the connection.
	        self.requests.splice(i, 1);
	        pending.request.onSocket(socket);
	        return;
	      }
	    }
	    socket.destroy();
	    self.removeSocket(socket);
	  });
	}
	util.inherits(TunnelingAgent, events.EventEmitter);

	TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
	  var self = this;
	  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

	  if (self.sockets.length >= this.maxSockets) {
	    // We are over limit so we'll add it to the queue.
	    self.requests.push(options);
	    return;
	  }

	  // If we are under maxSockets create a new one.
	  self.createSocket(options, function(socket) {
	    socket.on('free', onFree);
	    socket.on('close', onCloseOrRemove);
	    socket.on('agentRemove', onCloseOrRemove);
	    req.onSocket(socket);

	    function onFree() {
	      self.emit('free', socket, options);
	    }

	    function onCloseOrRemove(err) {
	      self.removeSocket(socket);
	      socket.removeListener('free', onFree);
	      socket.removeListener('close', onCloseOrRemove);
	      socket.removeListener('agentRemove', onCloseOrRemove);
	    }
	  });
	};

	TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
	  var self = this;
	  var placeholder = {};
	  self.sockets.push(placeholder);

	  var connectOptions = mergeOptions({}, self.proxyOptions, {
	    method: 'CONNECT',
	    path: options.host + ':' + options.port,
	    agent: false,
	    headers: {
	      host: options.host + ':' + options.port
	    }
	  });
	  if (options.localAddress) {
	    connectOptions.localAddress = options.localAddress;
	  }
	  if (connectOptions.proxyAuth) {
	    connectOptions.headers = connectOptions.headers || {};
	    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
	        new Buffer(connectOptions.proxyAuth).toString('base64');
	  }

	  debug('making CONNECT request');
	  var connectReq = self.request(connectOptions);
	  connectReq.useChunkedEncodingByDefault = false; // for v0.6
	  connectReq.once('response', onResponse); // for v0.6
	  connectReq.once('upgrade', onUpgrade);   // for v0.6
	  connectReq.once('connect', onConnect);   // for v0.7 or later
	  connectReq.once('error', onError);
	  connectReq.end();

	  function onResponse(res) {
	    // Very hacky. This is necessary to avoid http-parser leaks.
	    res.upgrade = true;
	  }

	  function onUpgrade(res, socket, head) {
	    // Hacky.
	    process.nextTick(function() {
	      onConnect(res, socket, head);
	    });
	  }

	  function onConnect(res, socket, head) {
	    connectReq.removeAllListeners();
	    socket.removeAllListeners();

	    if (res.statusCode !== 200) {
	      debug('tunneling socket could not be established, statusCode=%d',
	        res.statusCode);
	      socket.destroy();
	      var error = new Error('tunneling socket could not be established, ' +
	        'statusCode=' + res.statusCode);
	      error.code = 'ECONNRESET';
	      options.request.emit('error', error);
	      self.removeSocket(placeholder);
	      return;
	    }
	    if (head.length > 0) {
	      debug('got illegal response body from proxy');
	      socket.destroy();
	      var error = new Error('got illegal response body from proxy');
	      error.code = 'ECONNRESET';
	      options.request.emit('error', error);
	      self.removeSocket(placeholder);
	      return;
	    }
	    debug('tunneling connection has established');
	    self.sockets[self.sockets.indexOf(placeholder)] = socket;
	    return cb(socket);
	  }

	  function onError(cause) {
	    connectReq.removeAllListeners();

	    debug('tunneling socket could not be established, cause=%s\n',
	          cause.message, cause.stack);
	    var error = new Error('tunneling socket could not be established, ' +
	                          'cause=' + cause.message);
	    error.code = 'ECONNRESET';
	    options.request.emit('error', error);
	    self.removeSocket(placeholder);
	  }
	};

	TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
	  var pos = this.sockets.indexOf(socket);
	  if (pos === -1) {
	    return;
	  }
	  this.sockets.splice(pos, 1);

	  var pending = this.requests.shift();
	  if (pending) {
	    // If we have pending requests and a socket gets closed a new one
	    // needs to be created to take over in the pool for the one that closed.
	    this.createSocket(pending, function(socket) {
	      pending.request.onSocket(socket);
	    });
	  }
	};

	function createSecureSocket(options, cb) {
	  var self = this;
	  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
	    var hostHeader = options.request.getHeader('host');
	    var tlsOptions = mergeOptions({}, self.options, {
	      socket: socket,
	      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
	    });

	    // 0 is dummy port for v0.6
	    var secureSocket = tls.connect(0, tlsOptions);
	    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
	    cb(secureSocket);
	  });
	}


	function toOptions(host, port, localAddress) {
	  if (typeof host === 'string') { // since v0.10
	    return {
	      host: host,
	      port: port,
	      localAddress: localAddress
	    };
	  }
	  return host; // for v0.11 or later
	}

	function mergeOptions(target) {
	  for (var i = 1, len = arguments.length; i < len; ++i) {
	    var overrides = arguments[i];
	    if (typeof overrides === 'object') {
	      var keys = Object.keys(overrides);
	      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
	        var k = keys[j];
	        if (overrides[k] !== undefined) {
	          target[k] = overrides[k];
	        }
	      }
	    }
	  }
	  return target;
	}


	var debug;
	if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
	  debug = function() {
	    var args = Array.prototype.slice.call(arguments);
	    if (typeof args[0] === 'string') {
	      args[0] = 'TUNNEL: ' + args[0];
	    } else {
	      args.unshift('TUNNEL:');
	    }
	    console.error.apply(console, args);
	  };
	} else {
	  debug = function() {};
	}
	tunnel$1.debug = debug; // for test
	return tunnel$1;
}

var tunnel;
var hasRequiredTunnel;

function requireTunnel () {
	if (hasRequiredTunnel) return tunnel;
	hasRequiredTunnel = 1;
	tunnel = requireTunnel$1();
	return tunnel;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	(function (exports$1) {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		var __createBinding = (lib && lib.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (lib && lib.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (lib && lib.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __awaiter = (lib && lib.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.HttpClient = exports$1.isHttps = exports$1.HttpClientResponse = exports$1.HttpClientError = exports$1.getProxyUrl = exports$1.MediaTypes = exports$1.Headers = exports$1.HttpCodes = void 0;
		const http = __importStar(require$$2);
		const https = __importStar(require$$3);
		const pm = __importStar(requireProxy());
		const tunnel = __importStar(requireTunnel());
		var HttpCodes;
		(function (HttpCodes) {
		    HttpCodes[HttpCodes["OK"] = 200] = "OK";
		    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
		    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
		    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
		    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
		    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
		    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
		    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
		    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
		    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
		    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
		    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
		    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
		    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
		    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
		    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
		    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
		    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
		    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
		    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
		    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
		    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
		    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
		    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
		    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
		    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
		    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
		})(HttpCodes = exports$1.HttpCodes || (exports$1.HttpCodes = {}));
		var Headers;
		(function (Headers) {
		    Headers["Accept"] = "accept";
		    Headers["ContentType"] = "content-type";
		})(Headers = exports$1.Headers || (exports$1.Headers = {}));
		var MediaTypes;
		(function (MediaTypes) {
		    MediaTypes["ApplicationJson"] = "application/json";
		})(MediaTypes = exports$1.MediaTypes || (exports$1.MediaTypes = {}));
		/**
		 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
		 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
		 */
		function getProxyUrl(serverUrl) {
		    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
		    return proxyUrl ? proxyUrl.href : '';
		}
		exports$1.getProxyUrl = getProxyUrl;
		const HttpRedirectCodes = [
		    HttpCodes.MovedPermanently,
		    HttpCodes.ResourceMoved,
		    HttpCodes.SeeOther,
		    HttpCodes.TemporaryRedirect,
		    HttpCodes.PermanentRedirect
		];
		const HttpResponseRetryCodes = [
		    HttpCodes.BadGateway,
		    HttpCodes.ServiceUnavailable,
		    HttpCodes.GatewayTimeout
		];
		const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
		const ExponentialBackoffCeiling = 10;
		const ExponentialBackoffTimeSlice = 5;
		class HttpClientError extends Error {
		    constructor(message, statusCode) {
		        super(message);
		        this.name = 'HttpClientError';
		        this.statusCode = statusCode;
		        Object.setPrototypeOf(this, HttpClientError.prototype);
		    }
		}
		exports$1.HttpClientError = HttpClientError;
		class HttpClientResponse {
		    constructor(message) {
		        this.message = message;
		    }
		    readBody() {
		        return __awaiter(this, void 0, void 0, function* () {
		            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
		                let output = Buffer.alloc(0);
		                this.message.on('data', (chunk) => {
		                    output = Buffer.concat([output, chunk]);
		                });
		                this.message.on('end', () => {
		                    resolve(output.toString());
		                });
		            }));
		        });
		    }
		    readBodyBuffer() {
		        return __awaiter(this, void 0, void 0, function* () {
		            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
		                const chunks = [];
		                this.message.on('data', (chunk) => {
		                    chunks.push(chunk);
		                });
		                this.message.on('end', () => {
		                    resolve(Buffer.concat(chunks));
		                });
		            }));
		        });
		    }
		}
		exports$1.HttpClientResponse = HttpClientResponse;
		function isHttps(requestUrl) {
		    const parsedUrl = new URL(requestUrl);
		    return parsedUrl.protocol === 'https:';
		}
		exports$1.isHttps = isHttps;
		class HttpClient {
		    constructor(userAgent, handlers, requestOptions) {
		        this._ignoreSslError = false;
		        this._allowRedirects = true;
		        this._allowRedirectDowngrade = false;
		        this._maxRedirects = 50;
		        this._allowRetries = false;
		        this._maxRetries = 1;
		        this._keepAlive = false;
		        this._disposed = false;
		        this.userAgent = userAgent;
		        this.handlers = handlers || [];
		        this.requestOptions = requestOptions;
		        if (requestOptions) {
		            if (requestOptions.ignoreSslError != null) {
		                this._ignoreSslError = requestOptions.ignoreSslError;
		            }
		            this._socketTimeout = requestOptions.socketTimeout;
		            if (requestOptions.allowRedirects != null) {
		                this._allowRedirects = requestOptions.allowRedirects;
		            }
		            if (requestOptions.allowRedirectDowngrade != null) {
		                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
		            }
		            if (requestOptions.maxRedirects != null) {
		                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
		            }
		            if (requestOptions.keepAlive != null) {
		                this._keepAlive = requestOptions.keepAlive;
		            }
		            if (requestOptions.allowRetries != null) {
		                this._allowRetries = requestOptions.allowRetries;
		            }
		            if (requestOptions.maxRetries != null) {
		                this._maxRetries = requestOptions.maxRetries;
		            }
		        }
		    }
		    options(requestUrl, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
		        });
		    }
		    get(requestUrl, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('GET', requestUrl, null, additionalHeaders || {});
		        });
		    }
		    del(requestUrl, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
		        });
		    }
		    post(requestUrl, data, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('POST', requestUrl, data, additionalHeaders || {});
		        });
		    }
		    patch(requestUrl, data, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
		        });
		    }
		    put(requestUrl, data, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('PUT', requestUrl, data, additionalHeaders || {});
		        });
		    }
		    head(requestUrl, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
		        });
		    }
		    sendStream(verb, requestUrl, stream, additionalHeaders) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.request(verb, requestUrl, stream, additionalHeaders);
		        });
		    }
		    /**
		     * Gets a typed object from an endpoint
		     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
		     */
		    getJson(requestUrl, additionalHeaders = {}) {
		        return __awaiter(this, void 0, void 0, function* () {
		            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
		            const res = yield this.get(requestUrl, additionalHeaders);
		            return this._processResponse(res, this.requestOptions);
		        });
		    }
		    postJson(requestUrl, obj, additionalHeaders = {}) {
		        return __awaiter(this, void 0, void 0, function* () {
		            const data = JSON.stringify(obj, null, 2);
		            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
		            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
		            const res = yield this.post(requestUrl, data, additionalHeaders);
		            return this._processResponse(res, this.requestOptions);
		        });
		    }
		    putJson(requestUrl, obj, additionalHeaders = {}) {
		        return __awaiter(this, void 0, void 0, function* () {
		            const data = JSON.stringify(obj, null, 2);
		            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
		            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
		            const res = yield this.put(requestUrl, data, additionalHeaders);
		            return this._processResponse(res, this.requestOptions);
		        });
		    }
		    patchJson(requestUrl, obj, additionalHeaders = {}) {
		        return __awaiter(this, void 0, void 0, function* () {
		            const data = JSON.stringify(obj, null, 2);
		            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
		            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
		            const res = yield this.patch(requestUrl, data, additionalHeaders);
		            return this._processResponse(res, this.requestOptions);
		        });
		    }
		    /**
		     * Makes a raw http request.
		     * All other methods such as get, post, patch, and request ultimately call this.
		     * Prefer get, del, post and patch
		     */
		    request(verb, requestUrl, data, headers) {
		        return __awaiter(this, void 0, void 0, function* () {
		            if (this._disposed) {
		                throw new Error('Client has already been disposed.');
		            }
		            const parsedUrl = new URL(requestUrl);
		            let info = this._prepareRequest(verb, parsedUrl, headers);
		            // Only perform retries on reads since writes may not be idempotent.
		            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
		                ? this._maxRetries + 1
		                : 1;
		            let numTries = 0;
		            let response;
		            do {
		                response = yield this.requestRaw(info, data);
		                // Check if it's an authentication challenge
		                if (response &&
		                    response.message &&
		                    response.message.statusCode === HttpCodes.Unauthorized) {
		                    let authenticationHandler;
		                    for (const handler of this.handlers) {
		                        if (handler.canHandleAuthentication(response)) {
		                            authenticationHandler = handler;
		                            break;
		                        }
		                    }
		                    if (authenticationHandler) {
		                        return authenticationHandler.handleAuthentication(this, info, data);
		                    }
		                    else {
		                        // We have received an unauthorized response but have no handlers to handle it.
		                        // Let the response return to the caller.
		                        return response;
		                    }
		                }
		                let redirectsRemaining = this._maxRedirects;
		                while (response.message.statusCode &&
		                    HttpRedirectCodes.includes(response.message.statusCode) &&
		                    this._allowRedirects &&
		                    redirectsRemaining > 0) {
		                    const redirectUrl = response.message.headers['location'];
		                    if (!redirectUrl) {
		                        // if there's no location to redirect to, we won't
		                        break;
		                    }
		                    const parsedRedirectUrl = new URL(redirectUrl);
		                    if (parsedUrl.protocol === 'https:' &&
		                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
		                        !this._allowRedirectDowngrade) {
		                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
		                    }
		                    // we need to finish reading the response before reassigning response
		                    // which will leak the open socket.
		                    yield response.readBody();
		                    // strip authorization header if redirected to a different hostname
		                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
		                        for (const header in headers) {
		                            // header names are case insensitive
		                            if (header.toLowerCase() === 'authorization') {
		                                delete headers[header];
		                            }
		                        }
		                    }
		                    // let's make the request with the new redirectUrl
		                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
		                    response = yield this.requestRaw(info, data);
		                    redirectsRemaining--;
		                }
		                if (!response.message.statusCode ||
		                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
		                    // If not a retry code, return immediately instead of retrying
		                    return response;
		                }
		                numTries += 1;
		                if (numTries < maxTries) {
		                    yield response.readBody();
		                    yield this._performExponentialBackoff(numTries);
		                }
		            } while (numTries < maxTries);
		            return response;
		        });
		    }
		    /**
		     * Needs to be called if keepAlive is set to true in request options.
		     */
		    dispose() {
		        if (this._agent) {
		            this._agent.destroy();
		        }
		        this._disposed = true;
		    }
		    /**
		     * Raw request.
		     * @param info
		     * @param data
		     */
		    requestRaw(info, data) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return new Promise((resolve, reject) => {
		                function callbackForResult(err, res) {
		                    if (err) {
		                        reject(err);
		                    }
		                    else if (!res) {
		                        // If `err` is not passed, then `res` must be passed.
		                        reject(new Error('Unknown error'));
		                    }
		                    else {
		                        resolve(res);
		                    }
		                }
		                this.requestRawWithCallback(info, data, callbackForResult);
		            });
		        });
		    }
		    /**
		     * Raw request with callback.
		     * @param info
		     * @param data
		     * @param onResult
		     */
		    requestRawWithCallback(info, data, onResult) {
		        if (typeof data === 'string') {
		            if (!info.options.headers) {
		                info.options.headers = {};
		            }
		            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
		        }
		        let callbackCalled = false;
		        function handleResult(err, res) {
		            if (!callbackCalled) {
		                callbackCalled = true;
		                onResult(err, res);
		            }
		        }
		        const req = info.httpModule.request(info.options, (msg) => {
		            const res = new HttpClientResponse(msg);
		            handleResult(undefined, res);
		        });
		        let socket;
		        req.on('socket', sock => {
		            socket = sock;
		        });
		        // If we ever get disconnected, we want the socket to timeout eventually
		        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
		            if (socket) {
		                socket.end();
		            }
		            handleResult(new Error(`Request timeout: ${info.options.path}`));
		        });
		        req.on('error', function (err) {
		            // err has statusCode property
		            // res should have headers
		            handleResult(err);
		        });
		        if (data && typeof data === 'string') {
		            req.write(data, 'utf8');
		        }
		        if (data && typeof data !== 'string') {
		            data.on('close', function () {
		                req.end();
		            });
		            data.pipe(req);
		        }
		        else {
		            req.end();
		        }
		    }
		    /**
		     * Gets an http agent. This function is useful when you need an http agent that handles
		     * routing through a proxy server - depending upon the url and proxy environment variables.
		     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
		     */
		    getAgent(serverUrl) {
		        const parsedUrl = new URL(serverUrl);
		        return this._getAgent(parsedUrl);
		    }
		    _prepareRequest(method, requestUrl, headers) {
		        const info = {};
		        info.parsedUrl = requestUrl;
		        const usingSsl = info.parsedUrl.protocol === 'https:';
		        info.httpModule = usingSsl ? https : http;
		        const defaultPort = usingSsl ? 443 : 80;
		        info.options = {};
		        info.options.host = info.parsedUrl.hostname;
		        info.options.port = info.parsedUrl.port
		            ? parseInt(info.parsedUrl.port)
		            : defaultPort;
		        info.options.path =
		            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
		        info.options.method = method;
		        info.options.headers = this._mergeHeaders(headers);
		        if (this.userAgent != null) {
		            info.options.headers['user-agent'] = this.userAgent;
		        }
		        info.options.agent = this._getAgent(info.parsedUrl);
		        // gives handlers an opportunity to participate
		        if (this.handlers) {
		            for (const handler of this.handlers) {
		                handler.prepareRequest(info.options);
		            }
		        }
		        return info;
		    }
		    _mergeHeaders(headers) {
		        if (this.requestOptions && this.requestOptions.headers) {
		            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
		        }
		        return lowercaseKeys(headers || {});
		    }
		    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
		        let clientHeader;
		        if (this.requestOptions && this.requestOptions.headers) {
		            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
		        }
		        return additionalHeaders[header] || clientHeader || _default;
		    }
		    _getAgent(parsedUrl) {
		        let agent;
		        const proxyUrl = pm.getProxyUrl(parsedUrl);
		        const useProxy = proxyUrl && proxyUrl.hostname;
		        if (this._keepAlive && useProxy) {
		            agent = this._proxyAgent;
		        }
		        if (this._keepAlive && !useProxy) {
		            agent = this._agent;
		        }
		        // if agent is already assigned use that agent.
		        if (agent) {
		            return agent;
		        }
		        const usingSsl = parsedUrl.protocol === 'https:';
		        let maxSockets = 100;
		        if (this.requestOptions) {
		            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
		        }
		        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
		        if (proxyUrl && proxyUrl.hostname) {
		            const agentOptions = {
		                maxSockets,
		                keepAlive: this._keepAlive,
		                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
		                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
		                })), { host: proxyUrl.hostname, port: proxyUrl.port })
		            };
		            let tunnelAgent;
		            const overHttps = proxyUrl.protocol === 'https:';
		            if (usingSsl) {
		                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
		            }
		            else {
		                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
		            }
		            agent = tunnelAgent(agentOptions);
		            this._proxyAgent = agent;
		        }
		        // if reusing agent across request and tunneling agent isn't assigned create a new agent
		        if (this._keepAlive && !agent) {
		            const options = { keepAlive: this._keepAlive, maxSockets };
		            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
		            this._agent = agent;
		        }
		        // if not using private agent and tunnel agent isn't setup then use global agent
		        if (!agent) {
		            agent = usingSsl ? https.globalAgent : http.globalAgent;
		        }
		        if (usingSsl && this._ignoreSslError) {
		            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
		            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
		            // we have to cast it to any and change it directly
		            agent.options = Object.assign(agent.options || {}, {
		                rejectUnauthorized: false
		            });
		        }
		        return agent;
		    }
		    _performExponentialBackoff(retryNumber) {
		        return __awaiter(this, void 0, void 0, function* () {
		            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
		            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
		            return new Promise(resolve => setTimeout(() => resolve(), ms));
		        });
		    }
		    _processResponse(res, options) {
		        return __awaiter(this, void 0, void 0, function* () {
		            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
		                const statusCode = res.message.statusCode || 0;
		                const response = {
		                    statusCode,
		                    result: null,
		                    headers: {}
		                };
		                // not found leads to null obj returned
		                if (statusCode === HttpCodes.NotFound) {
		                    resolve(response);
		                }
		                // get the result from the body
		                function dateTimeDeserializer(key, value) {
		                    if (typeof value === 'string') {
		                        const a = new Date(value);
		                        if (!isNaN(a.valueOf())) {
		                            return a;
		                        }
		                    }
		                    return value;
		                }
		                let obj;
		                let contents;
		                try {
		                    contents = yield res.readBody();
		                    if (contents && contents.length > 0) {
		                        if (options && options.deserializeDates) {
		                            obj = JSON.parse(contents, dateTimeDeserializer);
		                        }
		                        else {
		                            obj = JSON.parse(contents);
		                        }
		                        response.result = obj;
		                    }
		                    response.headers = res.message.headers;
		                }
		                catch (err) {
		                    // Invalid resource (contents not json);  leaving result obj null
		                }
		                // note that 3xx redirects are handled by the http layer.
		                if (statusCode > 299) {
		                    let msg;
		                    // if exception/error in body, attempt to get better error
		                    if (obj && obj.message) {
		                        msg = obj.message;
		                    }
		                    else if (contents && contents.length > 0) {
		                        // it may be the case that the exception is in the body message as string
		                        msg = contents;
		                    }
		                    else {
		                        msg = `Failed request: (${statusCode})`;
		                    }
		                    const err = new HttpClientError(msg, statusCode);
		                    err.result = response.result;
		                    reject(err);
		                }
		                else {
		                    resolve(response);
		                }
		            }));
		        });
		    }
		}
		exports$1.HttpClient = HttpClient;
		const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
		
	} (lib));
	return lib;
}

var auth = {};

var hasRequiredAuth;

function requireAuth () {
	if (hasRequiredAuth) return auth;
	hasRequiredAuth = 1;
	var __awaiter = (auth && auth.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(auth, "__esModule", { value: true });
	auth.PersonalAccessTokenCredentialHandler = auth.BearerCredentialHandler = auth.BasicCredentialHandler = void 0;
	class BasicCredentialHandler {
	    constructor(username, password) {
	        this.username = username;
	        this.password = password;
	    }
	    prepareRequest(options) {
	        if (!options.headers) {
	            throw Error('The request has no headers');
	        }
	        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
	    }
	    // This handler cannot handle 401
	    canHandleAuthentication() {
	        return false;
	    }
	    handleAuthentication() {
	        return __awaiter(this, void 0, void 0, function* () {
	            throw new Error('not implemented');
	        });
	    }
	}
	auth.BasicCredentialHandler = BasicCredentialHandler;
	class BearerCredentialHandler {
	    constructor(token) {
	        this.token = token;
	    }
	    // currently implements pre-authorization
	    // TODO: support preAuth = false where it hooks on 401
	    prepareRequest(options) {
	        if (!options.headers) {
	            throw Error('The request has no headers');
	        }
	        options.headers['Authorization'] = `Bearer ${this.token}`;
	    }
	    // This handler cannot handle 401
	    canHandleAuthentication() {
	        return false;
	    }
	    handleAuthentication() {
	        return __awaiter(this, void 0, void 0, function* () {
	            throw new Error('not implemented');
	        });
	    }
	}
	auth.BearerCredentialHandler = BearerCredentialHandler;
	class PersonalAccessTokenCredentialHandler {
	    constructor(token) {
	        this.token = token;
	    }
	    // currently implements pre-authorization
	    // TODO: support preAuth = false where it hooks on 401
	    prepareRequest(options) {
	        if (!options.headers) {
	            throw Error('The request has no headers');
	        }
	        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
	    }
	    // This handler cannot handle 401
	    canHandleAuthentication() {
	        return false;
	    }
	    handleAuthentication() {
	        return __awaiter(this, void 0, void 0, function* () {
	            throw new Error('not implemented');
	        });
	    }
	}
	auth.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
	
	return auth;
}

var hasRequiredOidcUtils;

function requireOidcUtils () {
	if (hasRequiredOidcUtils) return oidcUtils;
	hasRequiredOidcUtils = 1;
	var __awaiter = (oidcUtils && oidcUtils.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(oidcUtils, "__esModule", { value: true });
	oidcUtils.OidcClient = void 0;
	const http_client_1 = requireLib();
	const auth_1 = requireAuth();
	const core_1 = requireCore();
	class OidcClient {
	    static createHttpClient(allowRetry = true, maxRetry = 10) {
	        const requestOptions = {
	            allowRetries: allowRetry,
	            maxRetries: maxRetry
	        };
	        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
	    }
	    static getRequestToken() {
	        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
	        if (!token) {
	            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
	        }
	        return token;
	    }
	    static getIDTokenUrl() {
	        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
	        if (!runtimeUrl) {
	            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
	        }
	        return runtimeUrl;
	    }
	    static getCall(id_token_url) {
	        var _a;
	        return __awaiter(this, void 0, void 0, function* () {
	            const httpclient = OidcClient.createHttpClient();
	            const res = yield httpclient
	                .getJson(id_token_url)
	                .catch(error => {
	                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
	            });
	            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
	            if (!id_token) {
	                throw new Error('Response json body do not have ID Token field');
	            }
	            return id_token;
	        });
	    }
	    static getIDToken(audience) {
	        return __awaiter(this, void 0, void 0, function* () {
	            try {
	                // New ID Token is requested from action service
	                let id_token_url = OidcClient.getIDTokenUrl();
	                if (audience) {
	                    const encodedAudience = encodeURIComponent(audience);
	                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
	                }
	                (0, core_1.debug)(`ID token url is ${id_token_url}`);
	                const id_token = yield OidcClient.getCall(id_token_url);
	                (0, core_1.setSecret)(id_token);
	                return id_token;
	            }
	            catch (error) {
	                throw new Error(`Error message: ${error.message}`);
	            }
	        });
	    }
	}
	oidcUtils.OidcClient = OidcClient;
	
	return oidcUtils;
}

var summary = {};

var hasRequiredSummary;

function requireSummary () {
	if (hasRequiredSummary) return summary;
	hasRequiredSummary = 1;
	(function (exports$1) {
		var __awaiter = (summary && summary.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.summary = exports$1.markdownSummary = exports$1.SUMMARY_DOCS_URL = exports$1.SUMMARY_ENV_VAR = void 0;
		const os_1 = require$$0;
		const fs_1 = require$$1;
		const { access, appendFile, writeFile } = fs_1.promises;
		exports$1.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
		exports$1.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
		class Summary {
		    constructor() {
		        this._buffer = '';
		    }
		    /**
		     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
		     * Also checks r/w permissions.
		     *
		     * @returns step summary file path
		     */
		    filePath() {
		        return __awaiter(this, void 0, void 0, function* () {
		            if (this._filePath) {
		                return this._filePath;
		            }
		            const pathFromEnv = process.env[exports$1.SUMMARY_ENV_VAR];
		            if (!pathFromEnv) {
		                throw new Error(`Unable to find environment variable for $${exports$1.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
		            }
		            try {
		                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
		            }
		            catch (_a) {
		                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
		            }
		            this._filePath = pathFromEnv;
		            return this._filePath;
		        });
		    }
		    /**
		     * Wraps content in an HTML tag, adding any HTML attributes
		     *
		     * @param {string} tag HTML tag to wrap
		     * @param {string | null} content content within the tag
		     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
		     *
		     * @returns {string} content wrapped in HTML element
		     */
		    wrap(tag, content, attrs = {}) {
		        const htmlAttrs = Object.entries(attrs)
		            .map(([key, value]) => ` ${key}="${value}"`)
		            .join('');
		        if (!content) {
		            return `<${tag}${htmlAttrs}>`;
		        }
		        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
		    }
		    /**
		     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
		     *
		     * @param {SummaryWriteOptions} [options] (optional) options for write operation
		     *
		     * @returns {Promise<Summary>} summary instance
		     */
		    write(options) {
		        return __awaiter(this, void 0, void 0, function* () {
		            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
		            const filePath = yield this.filePath();
		            const writeFunc = overwrite ? writeFile : appendFile;
		            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
		            return this.emptyBuffer();
		        });
		    }
		    /**
		     * Clears the summary buffer and wipes the summary file
		     *
		     * @returns {Summary} summary instance
		     */
		    clear() {
		        return __awaiter(this, void 0, void 0, function* () {
		            return this.emptyBuffer().write({ overwrite: true });
		        });
		    }
		    /**
		     * Returns the current summary buffer as a string
		     *
		     * @returns {string} string of summary buffer
		     */
		    stringify() {
		        return this._buffer;
		    }
		    /**
		     * If the summary buffer is empty
		     *
		     * @returns {boolen} true if the buffer is empty
		     */
		    isEmptyBuffer() {
		        return this._buffer.length === 0;
		    }
		    /**
		     * Resets the summary buffer without writing to summary file
		     *
		     * @returns {Summary} summary instance
		     */
		    emptyBuffer() {
		        this._buffer = '';
		        return this;
		    }
		    /**
		     * Adds raw text to the summary buffer
		     *
		     * @param {string} text content to add
		     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
		     *
		     * @returns {Summary} summary instance
		     */
		    addRaw(text, addEOL = false) {
		        this._buffer += text;
		        return addEOL ? this.addEOL() : this;
		    }
		    /**
		     * Adds the operating system-specific end-of-line marker to the buffer
		     *
		     * @returns {Summary} summary instance
		     */
		    addEOL() {
		        return this.addRaw(os_1.EOL);
		    }
		    /**
		     * Adds an HTML codeblock to the summary buffer
		     *
		     * @param {string} code content to render within fenced code block
		     * @param {string} lang (optional) language to syntax highlight code
		     *
		     * @returns {Summary} summary instance
		     */
		    addCodeBlock(code, lang) {
		        const attrs = Object.assign({}, (lang && { lang }));
		        const element = this.wrap('pre', this.wrap('code', code), attrs);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML list to the summary buffer
		     *
		     * @param {string[]} items list of items to render
		     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
		     *
		     * @returns {Summary} summary instance
		     */
		    addList(items, ordered = false) {
		        const tag = ordered ? 'ol' : 'ul';
		        const listItems = items.map(item => this.wrap('li', item)).join('');
		        const element = this.wrap(tag, listItems);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML table to the summary buffer
		     *
		     * @param {SummaryTableCell[]} rows table rows
		     *
		     * @returns {Summary} summary instance
		     */
		    addTable(rows) {
		        const tableBody = rows
		            .map(row => {
		            const cells = row
		                .map(cell => {
		                if (typeof cell === 'string') {
		                    return this.wrap('td', cell);
		                }
		                const { header, data, colspan, rowspan } = cell;
		                const tag = header ? 'th' : 'td';
		                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
		                return this.wrap(tag, data, attrs);
		            })
		                .join('');
		            return this.wrap('tr', cells);
		        })
		            .join('');
		        const element = this.wrap('table', tableBody);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds a collapsable HTML details element to the summary buffer
		     *
		     * @param {string} label text for the closed state
		     * @param {string} content collapsable content
		     *
		     * @returns {Summary} summary instance
		     */
		    addDetails(label, content) {
		        const element = this.wrap('details', this.wrap('summary', label) + content);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML image tag to the summary buffer
		     *
		     * @param {string} src path to the image you to embed
		     * @param {string} alt text description of the image
		     * @param {SummaryImageOptions} options (optional) addition image attributes
		     *
		     * @returns {Summary} summary instance
		     */
		    addImage(src, alt, options) {
		        const { width, height } = options || {};
		        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
		        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML section heading element
		     *
		     * @param {string} text heading text
		     * @param {number | string} [level=1] (optional) the heading level, default: 1
		     *
		     * @returns {Summary} summary instance
		     */
		    addHeading(text, level) {
		        const tag = `h${level}`;
		        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
		            ? tag
		            : 'h1';
		        const element = this.wrap(allowedTag, text);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML thematic break (<hr>) to the summary buffer
		     *
		     * @returns {Summary} summary instance
		     */
		    addSeparator() {
		        const element = this.wrap('hr', null);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML line break (<br>) to the summary buffer
		     *
		     * @returns {Summary} summary instance
		     */
		    addBreak() {
		        const element = this.wrap('br', null);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML blockquote to the summary buffer
		     *
		     * @param {string} text quote text
		     * @param {string} cite (optional) citation url
		     *
		     * @returns {Summary} summary instance
		     */
		    addQuote(text, cite) {
		        const attrs = Object.assign({}, (cite && { cite }));
		        const element = this.wrap('blockquote', text, attrs);
		        return this.addRaw(element).addEOL();
		    }
		    /**
		     * Adds an HTML anchor tag to the summary buffer
		     *
		     * @param {string} text link text/content
		     * @param {string} href hyperlink
		     *
		     * @returns {Summary} summary instance
		     */
		    addLink(text, href) {
		        const element = this.wrap('a', text, { href });
		        return this.addRaw(element).addEOL();
		    }
		}
		const _summary = new Summary();
		/**
		 * @deprecated use `core.summary`
		 */
		exports$1.markdownSummary = _summary;
		exports$1.summary = _summary;
		
	} (summary));
	return summary;
}

var pathUtils = {};

var hasRequiredPathUtils;

function requirePathUtils () {
	if (hasRequiredPathUtils) return pathUtils;
	hasRequiredPathUtils = 1;
	var __createBinding = (pathUtils && pathUtils.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (pathUtils && pathUtils.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (pathUtils && pathUtils.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(pathUtils, "__esModule", { value: true });
	pathUtils.toPlatformPath = pathUtils.toWin32Path = pathUtils.toPosixPath = void 0;
	const path = __importStar(require$$1$2);
	/**
	 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
	 * replaced with /.
	 *
	 * @param pth. Path to transform.
	 * @return string Posix path.
	 */
	function toPosixPath(pth) {
	    return pth.replace(/[\\]/g, '/');
	}
	pathUtils.toPosixPath = toPosixPath;
	/**
	 * toWin32Path converts the given path to the win32 form. On Linux, / will be
	 * replaced with \\.
	 *
	 * @param pth. Path to transform.
	 * @return string Win32 path.
	 */
	function toWin32Path(pth) {
	    return pth.replace(/[/]/g, '\\');
	}
	pathUtils.toWin32Path = toWin32Path;
	/**
	 * toPlatformPath converts the given path to a platform-specific path. It does
	 * this by replacing instances of / and \ with the platform-specific path
	 * separator.
	 *
	 * @param pth The path to platformize.
	 * @return string The platform-specific path.
	 */
	function toPlatformPath(pth) {
	    return pth.replace(/[/\\]/g, path.sep);
	}
	pathUtils.toPlatformPath = toPlatformPath;
	
	return pathUtils;
}

var platform = {};

var exec = {};

var toolrunner = {};

var io = {};

var ioUtil = {};

var hasRequiredIoUtil;

function requireIoUtil () {
	if (hasRequiredIoUtil) return ioUtil;
	hasRequiredIoUtil = 1;
	(function (exports$1) {
		var __createBinding = (ioUtil && ioUtil.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (ioUtil && ioUtil.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (ioUtil && ioUtil.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __awaiter = (ioUtil && ioUtil.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		var _a;
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.getCmdPath = exports$1.tryGetExecutablePath = exports$1.isRooted = exports$1.isDirectory = exports$1.exists = exports$1.READONLY = exports$1.UV_FS_O_EXLOCK = exports$1.IS_WINDOWS = exports$1.unlink = exports$1.symlink = exports$1.stat = exports$1.rmdir = exports$1.rm = exports$1.rename = exports$1.readlink = exports$1.readdir = exports$1.open = exports$1.mkdir = exports$1.lstat = exports$1.copyFile = exports$1.chmod = void 0;
		const fs = __importStar(require$$1);
		const path = __importStar(require$$1$2);
		_a = fs.promises
		// export const {open} = 'fs'
		, exports$1.chmod = _a.chmod, exports$1.copyFile = _a.copyFile, exports$1.lstat = _a.lstat, exports$1.mkdir = _a.mkdir, exports$1.open = _a.open, exports$1.readdir = _a.readdir, exports$1.readlink = _a.readlink, exports$1.rename = _a.rename, exports$1.rm = _a.rm, exports$1.rmdir = _a.rmdir, exports$1.stat = _a.stat, exports$1.symlink = _a.symlink, exports$1.unlink = _a.unlink;
		// export const {open} = 'fs'
		exports$1.IS_WINDOWS = process.platform === 'win32';
		// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
		exports$1.UV_FS_O_EXLOCK = 0x10000000;
		exports$1.READONLY = fs.constants.O_RDONLY;
		function exists(fsPath) {
		    return __awaiter(this, void 0, void 0, function* () {
		        try {
		            yield exports$1.stat(fsPath);
		        }
		        catch (err) {
		            if (err.code === 'ENOENT') {
		                return false;
		            }
		            throw err;
		        }
		        return true;
		    });
		}
		exports$1.exists = exists;
		function isDirectory(fsPath, useStat = false) {
		    return __awaiter(this, void 0, void 0, function* () {
		        const stats = useStat ? yield exports$1.stat(fsPath) : yield exports$1.lstat(fsPath);
		        return stats.isDirectory();
		    });
		}
		exports$1.isDirectory = isDirectory;
		/**
		 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
		 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
		 */
		function isRooted(p) {
		    p = normalizeSeparators(p);
		    if (!p) {
		        throw new Error('isRooted() parameter "p" cannot be empty');
		    }
		    if (exports$1.IS_WINDOWS) {
		        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
		        ); // e.g. C: or C:\hello
		    }
		    return p.startsWith('/');
		}
		exports$1.isRooted = isRooted;
		/**
		 * Best effort attempt to determine whether a file exists and is executable.
		 * @param filePath    file path to check
		 * @param extensions  additional file extensions to try
		 * @return if file exists and is executable, returns the file path. otherwise empty string.
		 */
		function tryGetExecutablePath(filePath, extensions) {
		    return __awaiter(this, void 0, void 0, function* () {
		        let stats = undefined;
		        try {
		            // test file exists
		            stats = yield exports$1.stat(filePath);
		        }
		        catch (err) {
		            if (err.code !== 'ENOENT') {
		                // eslint-disable-next-line no-console
		                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
		            }
		        }
		        if (stats && stats.isFile()) {
		            if (exports$1.IS_WINDOWS) {
		                // on Windows, test for valid extension
		                const upperExt = path.extname(filePath).toUpperCase();
		                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
		                    return filePath;
		                }
		            }
		            else {
		                if (isUnixExecutable(stats)) {
		                    return filePath;
		                }
		            }
		        }
		        // try each extension
		        const originalFilePath = filePath;
		        for (const extension of extensions) {
		            filePath = originalFilePath + extension;
		            stats = undefined;
		            try {
		                stats = yield exports$1.stat(filePath);
		            }
		            catch (err) {
		                if (err.code !== 'ENOENT') {
		                    // eslint-disable-next-line no-console
		                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
		                }
		            }
		            if (stats && stats.isFile()) {
		                if (exports$1.IS_WINDOWS) {
		                    // preserve the case of the actual file (since an extension was appended)
		                    try {
		                        const directory = path.dirname(filePath);
		                        const upperName = path.basename(filePath).toUpperCase();
		                        for (const actualName of yield exports$1.readdir(directory)) {
		                            if (upperName === actualName.toUpperCase()) {
		                                filePath = path.join(directory, actualName);
		                                break;
		                            }
		                        }
		                    }
		                    catch (err) {
		                        // eslint-disable-next-line no-console
		                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
		                    }
		                    return filePath;
		                }
		                else {
		                    if (isUnixExecutable(stats)) {
		                        return filePath;
		                    }
		                }
		            }
		        }
		        return '';
		    });
		}
		exports$1.tryGetExecutablePath = tryGetExecutablePath;
		function normalizeSeparators(p) {
		    p = p || '';
		    if (exports$1.IS_WINDOWS) {
		        // convert slashes on Windows
		        p = p.replace(/\//g, '\\');
		        // remove redundant slashes
		        return p.replace(/\\\\+/g, '\\');
		    }
		    // remove redundant slashes
		    return p.replace(/\/\/+/g, '/');
		}
		// on Mac/Linux, test the execute bit
		//     R   W  X  R  W X R W X
		//   256 128 64 32 16 8 4 2 1
		function isUnixExecutable(stats) {
		    return ((stats.mode & 1) > 0 ||
		        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
		        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
		}
		// Get the path of cmd.exe in windows
		function getCmdPath() {
		    var _a;
		    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
		}
		exports$1.getCmdPath = getCmdPath;
		
	} (ioUtil));
	return ioUtil;
}

var hasRequiredIo;

function requireIo () {
	if (hasRequiredIo) return io;
	hasRequiredIo = 1;
	var __createBinding = (io && io.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (io && io.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (io && io.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __awaiter = (io && io.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(io, "__esModule", { value: true });
	io.findInPath = io.which = io.mkdirP = io.rmRF = io.mv = io.cp = void 0;
	const assert_1 = require$$5;
	const path = __importStar(require$$1$2);
	const ioUtil = __importStar(requireIoUtil());
	/**
	 * Copies a file or folder.
	 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
	 *
	 * @param     source    source path
	 * @param     dest      destination path
	 * @param     options   optional. See CopyOptions.
	 */
	function cp(source, dest, options = {}) {
	    return __awaiter(this, void 0, void 0, function* () {
	        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
	        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
	        // Dest is an existing file, but not forcing
	        if (destStat && destStat.isFile() && !force) {
	            return;
	        }
	        // If dest is an existing directory, should copy inside.
	        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
	            ? path.join(dest, path.basename(source))
	            : dest;
	        if (!(yield ioUtil.exists(source))) {
	            throw new Error(`no such file or directory: ${source}`);
	        }
	        const sourceStat = yield ioUtil.stat(source);
	        if (sourceStat.isDirectory()) {
	            if (!recursive) {
	                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
	            }
	            else {
	                yield cpDirRecursive(source, newDest, 0, force);
	            }
	        }
	        else {
	            if (path.relative(source, newDest) === '') {
	                // a file cannot be copied to itself
	                throw new Error(`'${newDest}' and '${source}' are the same file`);
	            }
	            yield copyFile(source, newDest, force);
	        }
	    });
	}
	io.cp = cp;
	/**
	 * Moves a path.
	 *
	 * @param     source    source path
	 * @param     dest      destination path
	 * @param     options   optional. See MoveOptions.
	 */
	function mv(source, dest, options = {}) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (yield ioUtil.exists(dest)) {
	            let destExists = true;
	            if (yield ioUtil.isDirectory(dest)) {
	                // If dest is directory copy src into dest
	                dest = path.join(dest, path.basename(source));
	                destExists = yield ioUtil.exists(dest);
	            }
	            if (destExists) {
	                if (options.force == null || options.force) {
	                    yield rmRF(dest);
	                }
	                else {
	                    throw new Error('Destination already exists');
	                }
	            }
	        }
	        yield mkdirP(path.dirname(dest));
	        yield ioUtil.rename(source, dest);
	    });
	}
	io.mv = mv;
	/**
	 * Remove a path recursively with force
	 *
	 * @param inputPath path to remove
	 */
	function rmRF(inputPath) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (ioUtil.IS_WINDOWS) {
	            // Check for invalid characters
	            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
	            if (/[*"<>|]/.test(inputPath)) {
	                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
	            }
	        }
	        try {
	            // note if path does not exist, error is silent
	            yield ioUtil.rm(inputPath, {
	                force: true,
	                maxRetries: 3,
	                recursive: true,
	                retryDelay: 300
	            });
	        }
	        catch (err) {
	            throw new Error(`File was unable to be removed ${err}`);
	        }
	    });
	}
	io.rmRF = rmRF;
	/**
	 * Make a directory.  Creates the full path with folders in between
	 * Will throw if it fails
	 *
	 * @param   fsPath        path to create
	 * @returns Promise<void>
	 */
	function mkdirP(fsPath) {
	    return __awaiter(this, void 0, void 0, function* () {
	        assert_1.ok(fsPath, 'a path argument must be provided');
	        yield ioUtil.mkdir(fsPath, { recursive: true });
	    });
	}
	io.mkdirP = mkdirP;
	/**
	 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
	 * If you check and the tool does not exist, it will throw.
	 *
	 * @param     tool              name of the tool
	 * @param     check             whether to check if tool exists
	 * @returns   Promise<string>   path to tool
	 */
	function which(tool, check) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!tool) {
	            throw new Error("parameter 'tool' is required");
	        }
	        // recursive when check=true
	        if (check) {
	            const result = yield which(tool, false);
	            if (!result) {
	                if (ioUtil.IS_WINDOWS) {
	                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
	                }
	                else {
	                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
	                }
	            }
	            return result;
	        }
	        const matches = yield findInPath(tool);
	        if (matches && matches.length > 0) {
	            return matches[0];
	        }
	        return '';
	    });
	}
	io.which = which;
	/**
	 * Returns a list of all occurrences of the given tool on the system path.
	 *
	 * @returns   Promise<string[]>  the paths of the tool
	 */
	function findInPath(tool) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!tool) {
	            throw new Error("parameter 'tool' is required");
	        }
	        // build the list of extensions to try
	        const extensions = [];
	        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
	            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
	                if (extension) {
	                    extensions.push(extension);
	                }
	            }
	        }
	        // if it's rooted, return it if exists. otherwise return empty.
	        if (ioUtil.isRooted(tool)) {
	            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
	            if (filePath) {
	                return [filePath];
	            }
	            return [];
	        }
	        // if any path separators, return empty
	        if (tool.includes(path.sep)) {
	            return [];
	        }
	        // build the list of directories
	        //
	        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
	        // it feels like we should not do this. Checking the current directory seems like more of a use
	        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
	        // across platforms.
	        const directories = [];
	        if (process.env.PATH) {
	            for (const p of process.env.PATH.split(path.delimiter)) {
	                if (p) {
	                    directories.push(p);
	                }
	            }
	        }
	        // find all matches
	        const matches = [];
	        for (const directory of directories) {
	            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
	            if (filePath) {
	                matches.push(filePath);
	            }
	        }
	        return matches;
	    });
	}
	io.findInPath = findInPath;
	function readCopyOptions(options) {
	    const force = options.force == null ? true : options.force;
	    const recursive = Boolean(options.recursive);
	    const copySourceDirectory = options.copySourceDirectory == null
	        ? true
	        : Boolean(options.copySourceDirectory);
	    return { force, recursive, copySourceDirectory };
	}
	function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
	    return __awaiter(this, void 0, void 0, function* () {
	        // Ensure there is not a run away recursive copy
	        if (currentDepth >= 255)
	            return;
	        currentDepth++;
	        yield mkdirP(destDir);
	        const files = yield ioUtil.readdir(sourceDir);
	        for (const fileName of files) {
	            const srcFile = `${sourceDir}/${fileName}`;
	            const destFile = `${destDir}/${fileName}`;
	            const srcFileStat = yield ioUtil.lstat(srcFile);
	            if (srcFileStat.isDirectory()) {
	                // Recurse
	                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
	            }
	            else {
	                yield copyFile(srcFile, destFile, force);
	            }
	        }
	        // Change the mode for the newly created directory
	        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
	    });
	}
	// Buffered file copy
	function copyFile(srcFile, destFile, force) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
	            // unlink/re-link it
	            try {
	                yield ioUtil.lstat(destFile);
	                yield ioUtil.unlink(destFile);
	            }
	            catch (e) {
	                // Try to override file permission
	                if (e.code === 'EPERM') {
	                    yield ioUtil.chmod(destFile, '0666');
	                    yield ioUtil.unlink(destFile);
	                }
	                // other errors = it doesn't exist, no work to do
	            }
	            // Copy over symlink
	            const symlinkFull = yield ioUtil.readlink(srcFile);
	            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
	        }
	        else if (!(yield ioUtil.exists(destFile)) || force) {
	            yield ioUtil.copyFile(srcFile, destFile);
	        }
	    });
	}
	
	return io;
}

var hasRequiredToolrunner;

function requireToolrunner () {
	if (hasRequiredToolrunner) return toolrunner;
	hasRequiredToolrunner = 1;
	var __createBinding = (toolrunner && toolrunner.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (toolrunner && toolrunner.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (toolrunner && toolrunner.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __awaiter = (toolrunner && toolrunner.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(toolrunner, "__esModule", { value: true });
	toolrunner.argStringToArray = toolrunner.ToolRunner = void 0;
	const os = __importStar(require$$0);
	const events = __importStar(require$$4);
	const child = __importStar(require$$2$1);
	const path = __importStar(require$$1$2);
	const io = __importStar(requireIo());
	const ioUtil = __importStar(requireIoUtil());
	const timers_1 = require$$6$1;
	/* eslint-disable @typescript-eslint/unbound-method */
	const IS_WINDOWS = process.platform === 'win32';
	/*
	 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
	 */
	class ToolRunner extends events.EventEmitter {
	    constructor(toolPath, args, options) {
	        super();
	        if (!toolPath) {
	            throw new Error("Parameter 'toolPath' cannot be null or empty.");
	        }
	        this.toolPath = toolPath;
	        this.args = args || [];
	        this.options = options || {};
	    }
	    _debug(message) {
	        if (this.options.listeners && this.options.listeners.debug) {
	            this.options.listeners.debug(message);
	        }
	    }
	    _getCommandString(options, noPrefix) {
	        const toolPath = this._getSpawnFileName();
	        const args = this._getSpawnArgs(options);
	        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
	        if (IS_WINDOWS) {
	            // Windows + cmd file
	            if (this._isCmdFile()) {
	                cmd += toolPath;
	                for (const a of args) {
	                    cmd += ` ${a}`;
	                }
	            }
	            // Windows + verbatim
	            else if (options.windowsVerbatimArguments) {
	                cmd += `"${toolPath}"`;
	                for (const a of args) {
	                    cmd += ` ${a}`;
	                }
	            }
	            // Windows (regular)
	            else {
	                cmd += this._windowsQuoteCmdArg(toolPath);
	                for (const a of args) {
	                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
	                }
	            }
	        }
	        else {
	            // OSX/Linux - this can likely be improved with some form of quoting.
	            // creating processes on Unix is fundamentally different than Windows.
	            // on Unix, execvp() takes an arg array.
	            cmd += toolPath;
	            for (const a of args) {
	                cmd += ` ${a}`;
	            }
	        }
	        return cmd;
	    }
	    _processLineBuffer(data, strBuffer, onLine) {
	        try {
	            let s = strBuffer + data.toString();
	            let n = s.indexOf(os.EOL);
	            while (n > -1) {
	                const line = s.substring(0, n);
	                onLine(line);
	                // the rest of the string ...
	                s = s.substring(n + os.EOL.length);
	                n = s.indexOf(os.EOL);
	            }
	            return s;
	        }
	        catch (err) {
	            // streaming lines to console is best effort.  Don't fail a build.
	            this._debug(`error processing line. Failed with error ${err}`);
	            return '';
	        }
	    }
	    _getSpawnFileName() {
	        if (IS_WINDOWS) {
	            if (this._isCmdFile()) {
	                return process.env['COMSPEC'] || 'cmd.exe';
	            }
	        }
	        return this.toolPath;
	    }
	    _getSpawnArgs(options) {
	        if (IS_WINDOWS) {
	            if (this._isCmdFile()) {
	                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
	                for (const a of this.args) {
	                    argline += ' ';
	                    argline += options.windowsVerbatimArguments
	                        ? a
	                        : this._windowsQuoteCmdArg(a);
	                }
	                argline += '"';
	                return [argline];
	            }
	        }
	        return this.args;
	    }
	    _endsWith(str, end) {
	        return str.endsWith(end);
	    }
	    _isCmdFile() {
	        const upperToolPath = this.toolPath.toUpperCase();
	        return (this._endsWith(upperToolPath, '.CMD') ||
	            this._endsWith(upperToolPath, '.BAT'));
	    }
	    _windowsQuoteCmdArg(arg) {
	        // for .exe, apply the normal quoting rules that libuv applies
	        if (!this._isCmdFile()) {
	            return this._uvQuoteCmdArg(arg);
	        }
	        // otherwise apply quoting rules specific to the cmd.exe command line parser.
	        // the libuv rules are generic and are not designed specifically for cmd.exe
	        // command line parser.
	        //
	        // for a detailed description of the cmd.exe command line parser, refer to
	        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
	        // need quotes for empty arg
	        if (!arg) {
	            return '""';
	        }
	        // determine whether the arg needs to be quoted
	        const cmdSpecialChars = [
	            ' ',
	            '\t',
	            '&',
	            '(',
	            ')',
	            '[',
	            ']',
	            '{',
	            '}',
	            '^',
	            '=',
	            ';',
	            '!',
	            "'",
	            '+',
	            ',',
	            '`',
	            '~',
	            '|',
	            '<',
	            '>',
	            '"'
	        ];
	        let needsQuotes = false;
	        for (const char of arg) {
	            if (cmdSpecialChars.some(x => x === char)) {
	                needsQuotes = true;
	                break;
	            }
	        }
	        // short-circuit if quotes not needed
	        if (!needsQuotes) {
	            return arg;
	        }
	        // the following quoting rules are very similar to the rules that by libuv applies.
	        //
	        // 1) wrap the string in quotes
	        //
	        // 2) double-up quotes - i.e. " => ""
	        //
	        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
	        //    doesn't work well with a cmd.exe command line.
	        //
	        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
	        //    for example, the command line:
	        //          foo.exe "myarg:""my val"""
	        //    is parsed by a .NET console app into an arg array:
	        //          [ "myarg:\"my val\"" ]
	        //    which is the same end result when applying libuv quoting rules. although the actual
	        //    command line from libuv quoting rules would look like:
	        //          foo.exe "myarg:\"my val\""
	        //
	        // 3) double-up slashes that precede a quote,
	        //    e.g.  hello \world    => "hello \world"
	        //          hello\"world    => "hello\\""world"
	        //          hello\\"world   => "hello\\\\""world"
	        //          hello world\    => "hello world\\"
	        //
	        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
	        //    the reasons for including this as a .cmd quoting rule are:
	        //
	        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
	        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
	        //
	        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
	        //       haven't heard any complaints about that aspect.
	        //
	        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
	        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
	        // by using %%.
	        //
	        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
	        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
	        //
	        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
	        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
	        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
	        // to an external program.
	        //
	        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
	        // % can be escaped within a .cmd file.
	        let reverse = '"';
	        let quoteHit = true;
	        for (let i = arg.length; i > 0; i--) {
	            // walk the string in reverse
	            reverse += arg[i - 1];
	            if (quoteHit && arg[i - 1] === '\\') {
	                reverse += '\\'; // double the slash
	            }
	            else if (arg[i - 1] === '"') {
	                quoteHit = true;
	                reverse += '"'; // double the quote
	            }
	            else {
	                quoteHit = false;
	            }
	        }
	        reverse += '"';
	        return reverse
	            .split('')
	            .reverse()
	            .join('');
	    }
	    _uvQuoteCmdArg(arg) {
	        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
	        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
	        // is used.
	        //
	        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
	        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
	        // pasting copyright notice from Node within this function:
	        //
	        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
	        //
	        //      Permission is hereby granted, free of charge, to any person obtaining a copy
	        //      of this software and associated documentation files (the "Software"), to
	        //      deal in the Software without restriction, including without limitation the
	        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	        //      sell copies of the Software, and to permit persons to whom the Software is
	        //      furnished to do so, subject to the following conditions:
	        //
	        //      The above copyright notice and this permission notice shall be included in
	        //      all copies or substantial portions of the Software.
	        //
	        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	        //      IN THE SOFTWARE.
	        if (!arg) {
	            // Need double quotation for empty argument
	            return '""';
	        }
	        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
	            // No quotation needed
	            return arg;
	        }
	        if (!arg.includes('"') && !arg.includes('\\')) {
	            // No embedded double quotes or backslashes, so I can just wrap
	            // quote marks around the whole thing.
	            return `"${arg}"`;
	        }
	        // Expected input/output:
	        //   input : hello"world
	        //   output: "hello\"world"
	        //   input : hello""world
	        //   output: "hello\"\"world"
	        //   input : hello\world
	        //   output: hello\world
	        //   input : hello\\world
	        //   output: hello\\world
	        //   input : hello\"world
	        //   output: "hello\\\"world"
	        //   input : hello\\"world
	        //   output: "hello\\\\\"world"
	        //   input : hello world\
	        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
	        //                             but it appears the comment is wrong, it should be "hello world\\"
	        let reverse = '"';
	        let quoteHit = true;
	        for (let i = arg.length; i > 0; i--) {
	            // walk the string in reverse
	            reverse += arg[i - 1];
	            if (quoteHit && arg[i - 1] === '\\') {
	                reverse += '\\';
	            }
	            else if (arg[i - 1] === '"') {
	                quoteHit = true;
	                reverse += '\\';
	            }
	            else {
	                quoteHit = false;
	            }
	        }
	        reverse += '"';
	        return reverse
	            .split('')
	            .reverse()
	            .join('');
	    }
	    _cloneExecOptions(options) {
	        options = options || {};
	        const result = {
	            cwd: options.cwd || process.cwd(),
	            env: options.env || process.env,
	            silent: options.silent || false,
	            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
	            failOnStdErr: options.failOnStdErr || false,
	            ignoreReturnCode: options.ignoreReturnCode || false,
	            delay: options.delay || 10000
	        };
	        result.outStream = options.outStream || process.stdout;
	        result.errStream = options.errStream || process.stderr;
	        return result;
	    }
	    _getSpawnOptions(options, toolPath) {
	        options = options || {};
	        const result = {};
	        result.cwd = options.cwd;
	        result.env = options.env;
	        result['windowsVerbatimArguments'] =
	            options.windowsVerbatimArguments || this._isCmdFile();
	        if (options.windowsVerbatimArguments) {
	            result.argv0 = `"${toolPath}"`;
	        }
	        return result;
	    }
	    /**
	     * Exec a tool.
	     * Output will be streamed to the live console.
	     * Returns promise with return code
	     *
	     * @param     tool     path to tool to exec
	     * @param     options  optional exec options.  See ExecOptions
	     * @returns   number
	     */
	    exec() {
	        return __awaiter(this, void 0, void 0, function* () {
	            // root the tool path if it is unrooted and contains relative pathing
	            if (!ioUtil.isRooted(this.toolPath) &&
	                (this.toolPath.includes('/') ||
	                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
	                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
	                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
	            }
	            // if the tool is only a file name, then resolve it from the PATH
	            // otherwise verify it exists (add extension on Windows if necessary)
	            this.toolPath = yield io.which(this.toolPath, true);
	            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
	                this._debug(`exec tool: ${this.toolPath}`);
	                this._debug('arguments:');
	                for (const arg of this.args) {
	                    this._debug(`   ${arg}`);
	                }
	                const optionsNonNull = this._cloneExecOptions(this.options);
	                if (!optionsNonNull.silent && optionsNonNull.outStream) {
	                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
	                }
	                const state = new ExecState(optionsNonNull, this.toolPath);
	                state.on('debug', (message) => {
	                    this._debug(message);
	                });
	                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
	                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
	                }
	                const fileName = this._getSpawnFileName();
	                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
	                let stdbuffer = '';
	                if (cp.stdout) {
	                    cp.stdout.on('data', (data) => {
	                        if (this.options.listeners && this.options.listeners.stdout) {
	                            this.options.listeners.stdout(data);
	                        }
	                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
	                            optionsNonNull.outStream.write(data);
	                        }
	                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
	                            if (this.options.listeners && this.options.listeners.stdline) {
	                                this.options.listeners.stdline(line);
	                            }
	                        });
	                    });
	                }
	                let errbuffer = '';
	                if (cp.stderr) {
	                    cp.stderr.on('data', (data) => {
	                        state.processStderr = true;
	                        if (this.options.listeners && this.options.listeners.stderr) {
	                            this.options.listeners.stderr(data);
	                        }
	                        if (!optionsNonNull.silent &&
	                            optionsNonNull.errStream &&
	                            optionsNonNull.outStream) {
	                            const s = optionsNonNull.failOnStdErr
	                                ? optionsNonNull.errStream
	                                : optionsNonNull.outStream;
	                            s.write(data);
	                        }
	                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
	                            if (this.options.listeners && this.options.listeners.errline) {
	                                this.options.listeners.errline(line);
	                            }
	                        });
	                    });
	                }
	                cp.on('error', (err) => {
	                    state.processError = err.message;
	                    state.processExited = true;
	                    state.processClosed = true;
	                    state.CheckComplete();
	                });
	                cp.on('exit', (code) => {
	                    state.processExitCode = code;
	                    state.processExited = true;
	                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
	                    state.CheckComplete();
	                });
	                cp.on('close', (code) => {
	                    state.processExitCode = code;
	                    state.processExited = true;
	                    state.processClosed = true;
	                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
	                    state.CheckComplete();
	                });
	                state.on('done', (error, exitCode) => {
	                    if (stdbuffer.length > 0) {
	                        this.emit('stdline', stdbuffer);
	                    }
	                    if (errbuffer.length > 0) {
	                        this.emit('errline', errbuffer);
	                    }
	                    cp.removeAllListeners();
	                    if (error) {
	                        reject(error);
	                    }
	                    else {
	                        resolve(exitCode);
	                    }
	                });
	                if (this.options.input) {
	                    if (!cp.stdin) {
	                        throw new Error('child process missing stdin');
	                    }
	                    cp.stdin.end(this.options.input);
	                }
	            }));
	        });
	    }
	}
	toolrunner.ToolRunner = ToolRunner;
	/**
	 * Convert an arg string to an array of args. Handles escaping
	 *
	 * @param    argString   string of arguments
	 * @returns  string[]    array of arguments
	 */
	function argStringToArray(argString) {
	    const args = [];
	    let inQuotes = false;
	    let escaped = false;
	    let arg = '';
	    function append(c) {
	        // we only escape double quotes.
	        if (escaped && c !== '"') {
	            arg += '\\';
	        }
	        arg += c;
	        escaped = false;
	    }
	    for (let i = 0; i < argString.length; i++) {
	        const c = argString.charAt(i);
	        if (c === '"') {
	            if (!escaped) {
	                inQuotes = !inQuotes;
	            }
	            else {
	                append(c);
	            }
	            continue;
	        }
	        if (c === '\\' && escaped) {
	            append(c);
	            continue;
	        }
	        if (c === '\\' && inQuotes) {
	            escaped = true;
	            continue;
	        }
	        if (c === ' ' && !inQuotes) {
	            if (arg.length > 0) {
	                args.push(arg);
	                arg = '';
	            }
	            continue;
	        }
	        append(c);
	    }
	    if (arg.length > 0) {
	        args.push(arg.trim());
	    }
	    return args;
	}
	toolrunner.argStringToArray = argStringToArray;
	class ExecState extends events.EventEmitter {
	    constructor(options, toolPath) {
	        super();
	        this.processClosed = false; // tracks whether the process has exited and stdio is closed
	        this.processError = '';
	        this.processExitCode = 0;
	        this.processExited = false; // tracks whether the process has exited
	        this.processStderr = false; // tracks whether stderr was written to
	        this.delay = 10000; // 10 seconds
	        this.done = false;
	        this.timeout = null;
	        if (!toolPath) {
	            throw new Error('toolPath must not be empty');
	        }
	        this.options = options;
	        this.toolPath = toolPath;
	        if (options.delay) {
	            this.delay = options.delay;
	        }
	    }
	    CheckComplete() {
	        if (this.done) {
	            return;
	        }
	        if (this.processClosed) {
	            this._setResult();
	        }
	        else if (this.processExited) {
	            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
	        }
	    }
	    _debug(message) {
	        this.emit('debug', message);
	    }
	    _setResult() {
	        // determine whether there is an error
	        let error;
	        if (this.processExited) {
	            if (this.processError) {
	                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
	            }
	            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
	                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
	            }
	            else if (this.processStderr && this.options.failOnStdErr) {
	                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
	            }
	        }
	        // clear the timeout
	        if (this.timeout) {
	            clearTimeout(this.timeout);
	            this.timeout = null;
	        }
	        this.done = true;
	        this.emit('done', error, this.processExitCode);
	    }
	    static HandleTimeout(state) {
	        if (state.done) {
	            return;
	        }
	        if (!state.processClosed && state.processExited) {
	            const message = `The STDIO streams did not close within ${state.delay /
	                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
	            state._debug(message);
	        }
	        state._setResult();
	    }
	}
	
	return toolrunner;
}

var hasRequiredExec;

function requireExec () {
	if (hasRequiredExec) return exec;
	hasRequiredExec = 1;
	var __createBinding = (exec && exec.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (exec && exec.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (exec && exec.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __awaiter = (exec && exec.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(exec, "__esModule", { value: true });
	exec.getExecOutput = exec.exec = void 0;
	const string_decoder_1 = require$$0$2;
	const tr = __importStar(requireToolrunner());
	/**
	 * Exec a command.
	 * Output will be streamed to the live console.
	 * Returns promise with return code
	 *
	 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
	 * @param     args               optional arguments for tool. Escaping is handled by the lib.
	 * @param     options            optional exec options.  See ExecOptions
	 * @returns   Promise<number>    exit code
	 */
	function exec$1(commandLine, args, options) {
	    return __awaiter(this, void 0, void 0, function* () {
	        const commandArgs = tr.argStringToArray(commandLine);
	        if (commandArgs.length === 0) {
	            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
	        }
	        // Path to tool to execute should be first arg
	        const toolPath = commandArgs[0];
	        args = commandArgs.slice(1).concat(args || []);
	        const runner = new tr.ToolRunner(toolPath, args, options);
	        return runner.exec();
	    });
	}
	exec.exec = exec$1;
	/**
	 * Exec a command and get the output.
	 * Output will be streamed to the live console.
	 * Returns promise with the exit code and collected stdout and stderr
	 *
	 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
	 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
	 * @param     options               optional exec options.  See ExecOptions
	 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
	 */
	function getExecOutput(commandLine, args, options) {
	    var _a, _b;
	    return __awaiter(this, void 0, void 0, function* () {
	        let stdout = '';
	        let stderr = '';
	        //Using string decoder covers the case where a mult-byte character is split
	        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
	        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
	        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
	        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
	        const stdErrListener = (data) => {
	            stderr += stderrDecoder.write(data);
	            if (originalStdErrListener) {
	                originalStdErrListener(data);
	            }
	        };
	        const stdOutListener = (data) => {
	            stdout += stdoutDecoder.write(data);
	            if (originalStdoutListener) {
	                originalStdoutListener(data);
	            }
	        };
	        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
	        const exitCode = yield exec$1(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
	        //flush any remaining characters
	        stdout += stdoutDecoder.end();
	        stderr += stderrDecoder.end();
	        return {
	            exitCode,
	            stdout,
	            stderr
	        };
	    });
	}
	exec.getExecOutput = getExecOutput;
	
	return exec;
}

var hasRequiredPlatform;

function requirePlatform () {
	if (hasRequiredPlatform) return platform;
	hasRequiredPlatform = 1;
	(function (exports$1) {
		var __createBinding = (platform && platform.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (platform && platform.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (platform && platform.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __awaiter = (platform && platform.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		var __importDefault = (platform && platform.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.getDetails = exports$1.isLinux = exports$1.isMacOS = exports$1.isWindows = exports$1.arch = exports$1.platform = void 0;
		const os_1 = __importDefault(require$$0);
		const exec = __importStar(requireExec());
		const getWindowsInfo = () => __awaiter(void 0, void 0, void 0, function* () {
		    const { stdout: version } = yield exec.getExecOutput('powershell -command "(Get-CimInstance -ClassName Win32_OperatingSystem).Version"', undefined, {
		        silent: true
		    });
		    const { stdout: name } = yield exec.getExecOutput('powershell -command "(Get-CimInstance -ClassName Win32_OperatingSystem).Caption"', undefined, {
		        silent: true
		    });
		    return {
		        name: name.trim(),
		        version: version.trim()
		    };
		});
		const getMacOsInfo = () => __awaiter(void 0, void 0, void 0, function* () {
		    var _a, _b, _c, _d;
		    const { stdout } = yield exec.getExecOutput('sw_vers', undefined, {
		        silent: true
		    });
		    const version = (_b = (_a = stdout.match(/ProductVersion:\s*(.+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
		    const name = (_d = (_c = stdout.match(/ProductName:\s*(.+)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '';
		    return {
		        name,
		        version
		    };
		});
		const getLinuxInfo = () => __awaiter(void 0, void 0, void 0, function* () {
		    const { stdout } = yield exec.getExecOutput('lsb_release', ['-i', '-r', '-s'], {
		        silent: true
		    });
		    const [name, version] = stdout.trim().split('\n');
		    return {
		        name,
		        version
		    };
		});
		exports$1.platform = os_1.default.platform();
		exports$1.arch = os_1.default.arch();
		exports$1.isWindows = exports$1.platform === 'win32';
		exports$1.isMacOS = exports$1.platform === 'darwin';
		exports$1.isLinux = exports$1.platform === 'linux';
		function getDetails() {
		    return __awaiter(this, void 0, void 0, function* () {
		        return Object.assign(Object.assign({}, (yield (exports$1.isWindows
		            ? getWindowsInfo()
		            : exports$1.isMacOS
		                ? getMacOsInfo()
		                : getLinuxInfo()))), { platform: exports$1.platform,
		            arch: exports$1.arch,
		            isWindows: exports$1.isWindows,
		            isMacOS: exports$1.isMacOS,
		            isLinux: exports$1.isLinux });
		    });
		}
		exports$1.getDetails = getDetails;
		
	} (platform));
	return platform;
}

var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return core;
	hasRequiredCore = 1;
	(function (exports$1) {
		var __createBinding = (core && core.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (core && core.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (core && core.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __awaiter = (core && core.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.platform = exports$1.toPlatformPath = exports$1.toWin32Path = exports$1.toPosixPath = exports$1.markdownSummary = exports$1.summary = exports$1.getIDToken = exports$1.getState = exports$1.saveState = exports$1.group = exports$1.endGroup = exports$1.startGroup = exports$1.info = exports$1.notice = exports$1.warning = exports$1.error = exports$1.debug = exports$1.isDebug = exports$1.setFailed = exports$1.setCommandEcho = exports$1.setOutput = exports$1.getBooleanInput = exports$1.getMultilineInput = exports$1.getInput = exports$1.addPath = exports$1.setSecret = exports$1.exportVariable = exports$1.ExitCode = void 0;
		const command_1 = requireCommand();
		const file_command_1 = requireFileCommand();
		const utils_1 = requireUtils();
		const os = __importStar(require$$0);
		const path = __importStar(require$$1$2);
		const oidc_utils_1 = requireOidcUtils();
		/**
		 * The code to exit an action
		 */
		var ExitCode;
		(function (ExitCode) {
		    /**
		     * A code indicating that the action was successful
		     */
		    ExitCode[ExitCode["Success"] = 0] = "Success";
		    /**
		     * A code indicating that the action was a failure
		     */
		    ExitCode[ExitCode["Failure"] = 1] = "Failure";
		})(ExitCode || (exports$1.ExitCode = ExitCode = {}));
		//-----------------------------------------------------------------------
		// Variables
		//-----------------------------------------------------------------------
		/**
		 * Sets env variable for this action and future actions in the job
		 * @param name the name of the variable to set
		 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function exportVariable(name, val) {
		    const convertedVal = (0, utils_1.toCommandValue)(val);
		    process.env[name] = convertedVal;
		    const filePath = process.env['GITHUB_ENV'] || '';
		    if (filePath) {
		        return (0, file_command_1.issueFileCommand)('ENV', (0, file_command_1.prepareKeyValueMessage)(name, val));
		    }
		    (0, command_1.issueCommand)('set-env', { name }, convertedVal);
		}
		exports$1.exportVariable = exportVariable;
		/**
		 * Registers a secret which will get masked from logs
		 * @param secret value of the secret
		 */
		function setSecret(secret) {
		    (0, command_1.issueCommand)('add-mask', {}, secret);
		}
		exports$1.setSecret = setSecret;
		/**
		 * Prepends inputPath to the PATH (for this action and future actions)
		 * @param inputPath
		 */
		function addPath(inputPath) {
		    const filePath = process.env['GITHUB_PATH'] || '';
		    if (filePath) {
		        (0, file_command_1.issueFileCommand)('PATH', inputPath);
		    }
		    else {
		        (0, command_1.issueCommand)('add-path', {}, inputPath);
		    }
		    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
		}
		exports$1.addPath = addPath;
		/**
		 * Gets the value of an input.
		 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
		 * Returns an empty string if the value is not defined.
		 *
		 * @param     name     name of the input to get
		 * @param     options  optional. See InputOptions.
		 * @returns   string
		 */
		function getInput(name, options) {
		    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
		    if (options && options.required && !val) {
		        throw new Error(`Input required and not supplied: ${name}`);
		    }
		    if (options && options.trimWhitespace === false) {
		        return val;
		    }
		    return val.trim();
		}
		exports$1.getInput = getInput;
		/**
		 * Gets the values of an multiline input.  Each value is also trimmed.
		 *
		 * @param     name     name of the input to get
		 * @param     options  optional. See InputOptions.
		 * @returns   string[]
		 *
		 */
		function getMultilineInput(name, options) {
		    const inputs = getInput(name, options)
		        .split('\n')
		        .filter(x => x !== '');
		    if (options && options.trimWhitespace === false) {
		        return inputs;
		    }
		    return inputs.map(input => input.trim());
		}
		exports$1.getMultilineInput = getMultilineInput;
		/**
		 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
		 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
		 * The return value is also in boolean type.
		 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
		 *
		 * @param     name     name of the input to get
		 * @param     options  optional. See InputOptions.
		 * @returns   boolean
		 */
		function getBooleanInput(name, options) {
		    const trueValue = ['true', 'True', 'TRUE'];
		    const falseValue = ['false', 'False', 'FALSE'];
		    const val = getInput(name, options);
		    if (trueValue.includes(val))
		        return true;
		    if (falseValue.includes(val))
		        return false;
		    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
		        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
		}
		exports$1.getBooleanInput = getBooleanInput;
		/**
		 * Sets the value of an output.
		 *
		 * @param     name     name of the output to set
		 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function setOutput(name, value) {
		    const filePath = process.env['GITHUB_OUTPUT'] || '';
		    if (filePath) {
		        return (0, file_command_1.issueFileCommand)('OUTPUT', (0, file_command_1.prepareKeyValueMessage)(name, value));
		    }
		    process.stdout.write(os.EOL);
		    (0, command_1.issueCommand)('set-output', { name }, (0, utils_1.toCommandValue)(value));
		}
		exports$1.setOutput = setOutput;
		/**
		 * Enables or disables the echoing of commands into stdout for the rest of the step.
		 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
		 *
		 */
		function setCommandEcho(enabled) {
		    (0, command_1.issue)('echo', enabled ? 'on' : 'off');
		}
		exports$1.setCommandEcho = setCommandEcho;
		//-----------------------------------------------------------------------
		// Results
		//-----------------------------------------------------------------------
		/**
		 * Sets the action status to failed.
		 * When the action exits it will be with an exit code of 1
		 * @param message add error issue message
		 */
		function setFailed(message) {
		    process.exitCode = ExitCode.Failure;
		    error(message);
		}
		exports$1.setFailed = setFailed;
		//-----------------------------------------------------------------------
		// Logging Commands
		//-----------------------------------------------------------------------
		/**
		 * Gets whether Actions Step Debug is on or not
		 */
		function isDebug() {
		    return process.env['RUNNER_DEBUG'] === '1';
		}
		exports$1.isDebug = isDebug;
		/**
		 * Writes debug message to user log
		 * @param message debug message
		 */
		function debug(message) {
		    (0, command_1.issueCommand)('debug', {}, message);
		}
		exports$1.debug = debug;
		/**
		 * Adds an error issue
		 * @param message error issue message. Errors will be converted to string via toString()
		 * @param properties optional properties to add to the annotation.
		 */
		function error(message, properties = {}) {
		    (0, command_1.issueCommand)('error', (0, utils_1.toCommandProperties)(properties), message instanceof Error ? message.toString() : message);
		}
		exports$1.error = error;
		/**
		 * Adds a warning issue
		 * @param message warning issue message. Errors will be converted to string via toString()
		 * @param properties optional properties to add to the annotation.
		 */
		function warning(message, properties = {}) {
		    (0, command_1.issueCommand)('warning', (0, utils_1.toCommandProperties)(properties), message instanceof Error ? message.toString() : message);
		}
		exports$1.warning = warning;
		/**
		 * Adds a notice issue
		 * @param message notice issue message. Errors will be converted to string via toString()
		 * @param properties optional properties to add to the annotation.
		 */
		function notice(message, properties = {}) {
		    (0, command_1.issueCommand)('notice', (0, utils_1.toCommandProperties)(properties), message instanceof Error ? message.toString() : message);
		}
		exports$1.notice = notice;
		/**
		 * Writes info to log with console.log.
		 * @param message info message
		 */
		function info(message) {
		    process.stdout.write(message + os.EOL);
		}
		exports$1.info = info;
		/**
		 * Begin an output group.
		 *
		 * Output until the next `groupEnd` will be foldable in this group
		 *
		 * @param name The name of the output group
		 */
		function startGroup(name) {
		    (0, command_1.issue)('group', name);
		}
		exports$1.startGroup = startGroup;
		/**
		 * End an output group.
		 */
		function endGroup() {
		    (0, command_1.issue)('endgroup');
		}
		exports$1.endGroup = endGroup;
		/**
		 * Wrap an asynchronous function call in a group.
		 *
		 * Returns the same type as the function itself.
		 *
		 * @param name The name of the group
		 * @param fn The function to wrap in the group
		 */
		function group(name, fn) {
		    return __awaiter(this, void 0, void 0, function* () {
		        startGroup(name);
		        let result;
		        try {
		            result = yield fn();
		        }
		        finally {
		            endGroup();
		        }
		        return result;
		    });
		}
		exports$1.group = group;
		//-----------------------------------------------------------------------
		// Wrapper action state
		//-----------------------------------------------------------------------
		/**
		 * Saves state for current action, the state can only be retrieved by this action's post job execution.
		 *
		 * @param     name     name of the state to store
		 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function saveState(name, value) {
		    const filePath = process.env['GITHUB_STATE'] || '';
		    if (filePath) {
		        return (0, file_command_1.issueFileCommand)('STATE', (0, file_command_1.prepareKeyValueMessage)(name, value));
		    }
		    (0, command_1.issueCommand)('save-state', { name }, (0, utils_1.toCommandValue)(value));
		}
		exports$1.saveState = saveState;
		/**
		 * Gets the value of an state set by this action's main execution.
		 *
		 * @param     name     name of the state to get
		 * @returns   string
		 */
		function getState(name) {
		    return process.env[`STATE_${name}`] || '';
		}
		exports$1.getState = getState;
		function getIDToken(aud) {
		    return __awaiter(this, void 0, void 0, function* () {
		        return yield oidc_utils_1.OidcClient.getIDToken(aud);
		    });
		}
		exports$1.getIDToken = getIDToken;
		/**
		 * Summary exports
		 */
		var summary_1 = requireSummary();
		Object.defineProperty(exports$1, "summary", { enumerable: true, get: function () { return summary_1.summary; } });
		/**
		 * @deprecated use core.summary
		 */
		var summary_2 = requireSummary();
		Object.defineProperty(exports$1, "markdownSummary", { enumerable: true, get: function () { return summary_2.markdownSummary; } });
		/**
		 * Path exports
		 */
		var path_utils_1 = requirePathUtils();
		Object.defineProperty(exports$1, "toPosixPath", { enumerable: true, get: function () { return path_utils_1.toPosixPath; } });
		Object.defineProperty(exports$1, "toWin32Path", { enumerable: true, get: function () { return path_utils_1.toWin32Path; } });
		Object.defineProperty(exports$1, "toPlatformPath", { enumerable: true, get: function () { return path_utils_1.toPlatformPath; } });
		/**
		 * Platform utilities exports
		 */
		exports$1.platform = __importStar(requirePlatform());
		
	} (core));
	return core;
}

var coreExports = requireCore();

/**
 * Safely adds an array to attributes if it contains non-empty strings or valid Label objects.
 * @param arr - The array to filter and add
 * @param attributeKey - The key to add to attributes
 * @param attributes - The attributes object to modify
 */
function addNonEmptyArray(arr, attributeKey, attributes) {
    if (arr !== undefined && arr.length > 0) {
        if (attributeKey === 'labels') {
            // Handle Label[] objects - filter out labels with empty keys or values
            const labelArray = arr;
            const filtered = labelArray.filter((label) => label.key.trim().length > 0 && label.value.trim().length > 0);
            if (filtered.length > 0) {
                attributes[attributeKey] = filtered;
            }
        }
        else {
            // Handle string[] arrays
            const stringArray = arr;
            const filtered = stringArray.filter((str) => str.trim().length > 0);
            if (filtered.length > 0) {
                attributes[attributeKey] = filtered;
            }
        }
    }
}

/**
 * Create an alert using the Rootly REST API.
 *
 * @param {string} apiKey - The API key to use for authentication.
 * @param {string} summary - The summary of the alert.
 * @param {string} description - The details of the alert.
 * @param {boolean} setAsNoise - A boolean to determine if the alert is noise (default is false).
 * @param {NotificationTarget} notificationTarget - The type of notification target for the alert.
 * @param {'low' | 'medium' | 'high'} alertUrgency - The urgency of the alert (default is 'high').
 * @param {string} externalId - The external ID of the alert (optional).
 * @param {string} externalUrl - The external URL of the alert (optional).
 * @param {string[]} serviceIds - The IDs of the services to create the alert for.
 * @param {string[]} groupIds - The IDs of the groups to create the alert for.
 * @param {Label[]} labels - The labels to create the alert for.
 * @param {string[]} environmentIds - The IDs of the environments to create the alert for.
 * @param {string} dedupKey - The deduplication key for the alert (optional).
 * @returns {string} The ID of the alert.
 *
 */
async function createAlert(apiKey, // apiKey is required, this is the bearer token for authentication
summary, // summary is required, this is a brief summary of the alert
description, // details is required, this is a detailed description of the alert
setAsNoise, // noise is optional, this is a boolean to determine if the alert is noise
notificationTarget, // notificationTarget is required, this is the type of notification target for the alert
alertUrgency, // alertUrgency is required, this is the urgency of the alert, default is 'high'
externalId, // externalId is optional, this is the external ID field for the alert
externalUrl, // externalUrl is optional, this is the external URL field for the alert
serviceIds, // serviceIds is optional, this is an array of service IDs associated with the alert
groupIds, // groupIds is optional, this is an array of Alert Group IDs associated with the alert
labels, // labels is optional, this is an array of labels associated with the alert
environmentIds, // environmentIds is optional, this is an array of environment IDs associated with the alert
dedupKey) {
    const url = 'https://api.rootly.com/v1/alerts';
    const attributes = {
        source: 'api',
        summary: summary,
        description: description,
        noise: setAsNoise ? 'noise' : 'not_noise',
        status: 'triggered',
        notification_target_type: notificationTarget.type,
        notification_target_id: notificationTarget.id,
        alert_urgency_id: alertUrgency
    };
    // Only add externalId and externalUrl if they are provided and not empty
    if (externalId && externalId !== '') {
        attributes['external_id'] = externalId;
    }
    if (externalUrl && externalUrl !== '') {
        attributes['external_url'] = externalUrl;
    }
    addNonEmptyArray(serviceIds, 'service_ids', attributes);
    addNonEmptyArray(groupIds, 'group_ids', attributes);
    addNonEmptyArray(labels, 'labels', attributes);
    addNonEmptyArray(environmentIds, 'environment_ids', attributes);
    // Add deduplication key if provided
    if (dedupKey && dedupKey !== '') {
        attributes['deduplication_key'] = dedupKey;
    }
    const alertBody = JSON.stringify({
        data: {
            type: 'alerts',
            attributes
        }
    });
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/vnd.api+json'
        },
        body: alertBody
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.data.id;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        coreExports.error(errorMessage);
        coreExports.debug(`Alert Body:\n${alertBody}`);
        return '';
    }
}

/**
 * Retrieve the alert urgency ID using the Rootly REST API.
 *
 * @param {string} alertUrgency - The name of the alert urgency.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the alert urgency.
 */
async function getAlertUrgencyId(alertUrgency, apiKey) {
    const apiAlertUrgencyName = encodeURIComponent(alertUrgency);
    const url = 'https://api.rootly.com/v1/alert_urgencies?filter%5Bname%5D=' +
        apiAlertUrgencyName;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

/**
 * Get the service ID using the Rootly REST API.
 *
 * @param {string} service - The name of the service.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the service.
 */
async function getServiceId(service, apiKey) {
    const apiServiceName = encodeURIComponent(service);
    const url = 'https://api.rootly.com/v1/services?filter%5Bname%5D=' + apiServiceName;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        if (!data.data || data.data.length === 0) {
            coreExports.warning(`Service '${service}' not found`);
            return '';
        }
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

/**
 * Get the group ID using the Rootly REST API.
 *
 * @param {string} group - The name of the group.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the group.
 */
async function getGroupId(group, apiKey) {
    const apiGroupName = encodeURIComponent(group);
    const url = 'https://api.rootly.com/v1/alert_groups?include=' + apiGroupName;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

/**
 * Retrieve the environment ID using the Rootly REST API.
 *
 * @param {string} environment - The name of the environment.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the environment.
 */
async function getEnvironmentId(environment, apiKey) {
    const apiEnvironmentName = encodeURIComponent(environment);
    const url = 'https://api.rootly.com/v1/environments?filter%5Bname%5D=' +
        apiEnvironmentName;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

// Expect labels to be passed in as
// key1:value1,key2:value2,key3:value3,etc.
function createLabelsFromString(labelString) {
    const labels = [];
    if (!labelString.trim()) {
        return labels;
    }
    const labelPairs = labelString.split(',');
    for (const labelPair of labelPairs) {
        const [key, value] = labelPair.split(':');
        labels.push({
            key: key ? key.trim() : '',
            value: value ? value.trim() : ''
        });
    }
    return labels;
}

/**
 * Get the Escalation Policy ID using the Rootly REST API.
 *
 * @param {string} policy - The name of the escalation policy.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the policy.
 */
async function getEscalationPolicyId(policy, apiKey) {
    const apiPolicyName = encodeURIComponent(policy);
    const url = 'https://api.rootly.com/v1/escalation_policies?filter%5Bname%5D=' +
        apiPolicyName;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        if (!data.data || data.data.length === 0) {
            coreExports.warning(`Escalation policy '${policy}' not found`);
            return '';
        }
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

/**
 * Get the Usery ID using the Rootly REST API.
 *
 * @param {string} email - The name of the escalation policy.
 * @param {string} apiKey - The API key to use for authentication.
 * @returns {string} The ID of the user.
 */
async function getUserId(email, apiKey) {
    const apiUserEmail = encodeURIComponent(email);
    const url = 'https://api.rootly.com/v1/users?filter%5Bemail%5D=' + apiUserEmail;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        if (!data.data || data.data.length === 0) {
            coreExports.warning(`User '${email}' not found`);
            return '';
        }
        return data.data[0].id;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

/**
 * Create a notification target using the Rootly REST API.
 *
 * @param {'User' | 'Service' | 'EscalationPolicy' | 'Group'} type - The type of notification target to create.
 * @param {string} targetName - The name of the notification target to create.
 * @returns {NotificationTarget} The created notification target.
 */
async function createNotificationTarget(type, targetName, apiKey) {
    if (type.toLowerCase() === 'user') {
        return { id: await getUserId(targetName, apiKey), type: 'User' };
    }
    else if (type.toLowerCase() === 'service') {
        return { id: await getServiceId(targetName, apiKey), type: 'Service' };
    }
    else if (type.toLowerCase() === 'escalationpolicy') {
        return {
            id: await getEscalationPolicyId(targetName, apiKey),
            type: 'EscalationPolicy'
        };
    }
    else if (type.toLowerCase() === 'group') {
        return { id: await getGroupId(targetName, apiKey), type: 'Group' };
    }
    else {
        throw new Error('Invalid notification target type');
    }
}

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
async function run() {
    try {
        // Get the action's inputs
        const apiKey = coreExports.getInput('api_key'); // apiKey is required, never logged.
        const summary = coreExports.getInput('summary');
        const details = coreExports.getInput('details');
        const setAsNoise = coreExports.getInput('set_as_noise') === 'true';
        const notificationTargetType = coreExports.getInput('notification_target_type');
        const notificationTargetVal = coreExports.getInput('notification_target');
        const alertUrgency = coreExports.getInput('alert_urgency');
        const externalId = coreExports.getInput('external_id');
        const externalUrl = coreExports.getInput('external_url');
        const services = coreExports.getInput('services').split(',');
        const groups = coreExports.getInput('groups').split(',');
        const labels = createLabelsFromString(coreExports.getInput('labels'));
        const environments = coreExports.getInput('environments').split(',');
        const dedupKey = coreExports.getInput('deduplication_key');
        // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
        coreExports.debug(`Api Key Length: ${apiKey.length}`); // Do not log the actual API key
        coreExports.debug(`Summary: ${summary}`);
        coreExports.debug(`Details: ${details}`);
        coreExports.debug(`Set as noise: ${setAsNoise}`);
        coreExports.debug(`Notification target type: ${notificationTargetType}`);
        coreExports.debug(`Notification target: ${notificationTargetVal}`);
        coreExports.debug(`Alert urgency: ${alertUrgency}`);
        coreExports.debug(`External ID: ${externalId}`);
        coreExports.debug(`External URL: ${externalUrl}`);
        coreExports.debug(`Services: ${services}`);
        coreExports.debug(`Groups: ${groups}`);
        coreExports.debug(`Labels: ${labels}`);
        coreExports.debug(`Environments: ${environments}`);
        coreExports.debug(`Deduplication Key: ${dedupKey}`);
        // Set up service IDs
        const serviceIds = [];
        for (const service of services) {
            if (service !== '') {
                const serviceId = await getServiceId(service, apiKey);
                serviceIds.push(serviceId);
            }
        }
        // Grab the alert urgency ID
        let alertUrgencyId = '';
        if (alertUrgency !== '') {
            alertUrgencyId = await getAlertUrgencyId(alertUrgency, apiKey);
        }
        else {
            // Default to 'high' if not provided
            alertUrgencyId = await getAlertUrgencyId('High', apiKey);
        }
        // Set up group IDs (used for alert groups)
        // check if groups are provided, if not, use an empty array
        const alertGroupIds = [];
        for (const group of groups) {
            if (group !== '') {
                const groupId = await getGroupId(group, apiKey);
                alertGroupIds.push(groupId);
            }
        }
        // Set up environment IDs
        const environmentIds = [];
        for (const environment of environments) {
            if (environment !== '') {
                const environmentId = await getEnvironmentId(environment, apiKey);
                environmentIds.push(environmentId);
            }
        }
        // Create notificationTarget
        const notificationTarget = await createNotificationTarget(notificationTargetType, notificationTargetVal, apiKey);
        // Create the alert
        const alertId = await createAlert(apiKey, summary, details, setAsNoise, notificationTarget, alertUrgencyId, externalId, externalUrl, serviceIds, alertGroupIds, labels, environmentIds, dedupKey);
        // Debug log the created alert ID
        coreExports.debug(`Created Alert ID: ${alertId}`);
        // Set outputs for other workflow steps to use
        coreExports.setOutput('alert-id', alertId);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            coreExports.setFailed(error.message);
    }
}

/**
 * The entrypoint for the action. This file simply imports and runs the action's
 * main logic.
 */
/* istanbul ignore next */
run();
//# sourceMappingURL=index.js.map
