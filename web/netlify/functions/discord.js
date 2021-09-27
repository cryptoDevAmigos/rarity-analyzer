var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// ../common-node/lib/bot/discord-types.js
var require_discord_types = __commonJS({
  "../common-node/lib/bot/discord-types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.discordCommands = exports.discordRootCommand = exports.DiscordApplicationCommandOptionType = exports.DiscordApplicationCommandType = void 0;
    var DiscordApplicationCommandType;
    (function(DiscordApplicationCommandType2) {
      DiscordApplicationCommandType2[DiscordApplicationCommandType2["ChatInput"] = 1] = "ChatInput";
      DiscordApplicationCommandType2[DiscordApplicationCommandType2["User"] = 2] = "User";
      DiscordApplicationCommandType2[DiscordApplicationCommandType2["Message"] = 3] = "Message";
    })(DiscordApplicationCommandType = exports.DiscordApplicationCommandType || (exports.DiscordApplicationCommandType = {}));
    var DiscordApplicationCommandOptionType;
    (function(DiscordApplicationCommandOptionType2) {
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Subcommand"] = 1] = "Subcommand";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["SubcommandGroup"] = 2] = "SubcommandGroup";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["String"] = 3] = "String";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Integer"] = 4] = "Integer";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Boolean"] = 5] = "Boolean";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["User"] = 6] = "User";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Channel"] = 7] = "Channel";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Role"] = 8] = "Role";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Mentionable"] = 9] = "Mentionable";
      DiscordApplicationCommandOptionType2[DiscordApplicationCommandOptionType2["Number"] = 10] = "Number";
    })(DiscordApplicationCommandOptionType = exports.DiscordApplicationCommandOptionType || (exports.DiscordApplicationCommandOptionType = {}));
    exports.discordRootCommand = {
      name: "openrarity",
      description: "Explorer NFT attribute rarity"
    };
    exports.discordCommands = [
      {
        command: "projects",
        description: "List the NFT projects",
        example: "/openrarity projects"
      },
      {
        command: "project",
        description: "Get a project by projectKey",
        example: "/openrarity project example",
        options: [
          {
            name: "project-key",
            type: DiscordApplicationCommandOptionType.String,
            description: "The projectKey of a project (listed by the list command)",
            required: true
          }
        ]
      },
      {
        command: "nft",
        description: "Get an nft by tokenId (will use the default projectKey if not previded)",
        example: "/openrarity nft 42\n/openrarity nft example 42",
        options: [
          {
            name: "project-key",
            type: DiscordApplicationCommandOptionType.String,
            description: "The projectKey of a project (listed by the list command)",
            required: true
          },
          {
            name: "token-id",
            type: DiscordApplicationCommandOptionType.String,
            description: "The tokenId of the nft",
            required: true
          }
        ]
      }
    ];
    var _check = exports.discordCommands;
  }
});

// ../common-node/lib/bot/discord-bot.js
var require_discord_bot = __commonJS({
  "../common-node/lib/bot/discord-bot.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __read = exports && exports.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m)
        return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error };
      } finally {
        try {
          if (r && !r.done && (m = i["return"]))
            m.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleDiscordCommand = void 0;
    var node_fetch_1 = __importDefault(require("node-fetch"));
    var discord_types_1 = require_discord_types();
    var getProjectSummary = function(_a) {
      var baseWebUrl = _a.baseWebUrl, projectKey = _a.projectKey, projectMetadata = _a.projectMetadata;
      return projectKey + ":\n" + baseWebUrl + "/" + projectKey + "/\n" + projectMetadata.description + "\n";
    };
    var getNftSummary = function(_a) {
      var baseWebUrl = _a.baseWebUrl, projectKey = _a.projectKey, tokenId = _a.tokenId, nft = _a.nft;
      return projectKey + ": #" + nft.nft.id + "\n" + baseWebUrl + "/" + projectKey + "/" + tokenId + "/\n\n- Rank: " + nft.rank + "\n- Score: " + nft.rarityScore.toFixed(2) + "\n\n### Attributes\n\n```\nCommonality\n" + nft.attributeRarities.map(function(x) {
        return "- [" + __spreadArray([], __read(new Array(Math.floor(x.ratio * 10))), false).map(function(x2) {
          return "%";
        }).join("").padStart(10, ".") + "]" + (100 * x.ratio).toFixed(1).padStart(5, " ") + "% - " + x.trait_type + ":" + x.value;
      }).join("\n") + "\n```\n\n### Description\n\n" + nft.nft.description + "\n";
    };
    var handleDiscordCommand2 = function(_a) {
      var config2 = _a.config, command = _a.command;
      return __awaiter(void 0, void 0, void 0, function() {
        var baseDataUrl, baseWebUrl, kind, projectKey, tokenId, result, projects, result, project, _b, result, nft, _c;
        return __generator(this, function(_d) {
          switch (_d.label) {
            case 0:
              console.log("#handleDiscordCommand", { command });
              baseDataUrl = config2.baseDataUrl.replace(/\/?$/, "");
              baseWebUrl = config2.baseWebUrl.replace(/\/?$/, "");
              kind = command.kind, projectKey = command.projectKey, tokenId = command.tokenId;
              if (!(kind === "projects"))
                return [3, 3];
              return [4, (0, node_fetch_1.default)(baseDataUrl + "/projects.json")];
            case 1:
              result = _d.sent();
              return [4, result.json()];
            case 2:
              projects = _d.sent();
              return [2, {
                kind,
                message: "OpenRarity\n" + baseWebUrl + "\n\n" + projects.projects.map(function(x) {
                  return getProjectSummary(__assign({ baseWebUrl }, x));
                }).join("\n\n")
              }];
            case 3:
              if (!(kind === "project"))
                return [3, 8];
              if (!projectKey) {
                return [2, {
                  kind,
                  error: "You must enter a projectKey",
                  _raw: command
                }];
              }
              _d.label = 4;
            case 4:
              _d.trys.push([4, 7, , 8]);
              return [4, (0, node_fetch_1.default)(baseDataUrl + "/" + projectKey + "/project.json")];
            case 5:
              result = _d.sent();
              return [4, result.json()];
            case 6:
              project = _d.sent();
              return [2, {
                kind,
                message: "" + getProjectSummary({ baseWebUrl, projectKey, projectMetadata: project.project })
              }];
            case 7:
              _b = _d.sent();
              return [2, {
                kind,
                error: "Could not find project: " + projectKey,
                _raw: command
              }];
            case 8:
              if (!(kind === "nft"))
                return [3, 13];
              if (!projectKey) {
                return [2, {
                  kind,
                  error: "You must enter a projectKey",
                  _raw: command
                }];
              }
              if (!tokenId) {
                return [2, {
                  kind,
                  error: "You must enter a tokenId",
                  _raw: command
                }];
              }
              _d.label = 9;
            case 9:
              _d.trys.push([9, 12, , 13]);
              return [4, (0, node_fetch_1.default)(baseDataUrl + "/" + projectKey + "/" + tokenId + ".json")];
            case 10:
              result = _d.sent();
              return [4, result.json()];
            case 11:
              nft = _d.sent();
              return [2, {
                kind,
                message: "" + getNftSummary({ baseWebUrl, projectKey, tokenId, nft })
              }];
            case 12:
              _c = _d.sent();
              return [2, {
                kind,
                error: "Could not find nft: " + projectKey + "/" + tokenId,
                _raw: command
              }];
            case 13:
              return [2, {
                kind: "help",
                message: discord_types_1.discordCommands.map(function(x) {
                  return x.command + ": " + x.description + "\n";
                }).join("") + "\n        \n        "
              }];
          }
        });
      });
    };
    exports.handleDiscordCommand = handleDiscordCommand2;
  }
});

// ../common-node/lib/bot/discord-request.js
var require_discord_request = __commonJS({
  "../common-node/lib/bot/discord-request.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handleDiscordRequest = exports.authenticateDiscordRequest = exports.DiscordRequestError = void 0;
    var discord_bot_1 = require_discord_bot();
    var tweetnacl_1 = __importDefault(require("tweetnacl"));
    var DiscordRequestError2 = function(_super) {
      __extends(DiscordRequestError3, _super);
      function DiscordRequestError3(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
      }
      return DiscordRequestError3;
    }(Error);
    exports.DiscordRequestError = DiscordRequestError2;
    var authenticateDiscordRequest = function(_a) {
      var config2 = _a.config, rawBody = _a.rawBody, getHeader = _a.getHeader;
      return __awaiter(void 0, void 0, void 0, function() {
        var PUBLIC_KEY, signature, timestamp, isVerified;
        return __generator(this, function(_b) {
          PUBLIC_KEY = config2.discordPublicKey;
          signature = getHeader("x-signature-ed25519");
          timestamp = getHeader("x-signature-timestamp");
          if (!signature || !timestamp) {
            console.error("Discord Auth FAILURE - missing headers");
            throw new DiscordRequestError2({
              statusCode: 401,
              textResponse: "invalid request signature"
            });
          }
          console.log("authenticateDiscordRequest", { signature, timestamp, rawBody });
          isVerified = tweetnacl_1.default.sign.detached.verify(Buffer.from(timestamp + rawBody), Buffer.from(signature, "hex"), Buffer.from(PUBLIC_KEY, "hex"));
          if (!isVerified) {
            console.error("Discord Auth FAILURE");
            throw new DiscordRequestError2({
              statusCode: 401,
              textResponse: "invalid request signature"
            });
          }
          console.log("Discord Auth Success");
          return [2];
        });
      });
    };
    exports.authenticateDiscordRequest = authenticateDiscordRequest;
    var handleDiscordRequest2 = function(_a) {
      var config2 = _a.config, body = _a.body, rawBody = _a.rawBody, getHeader = _a.getHeader;
      return __awaiter(void 0, void 0, void 0, function() {
        var command, kind, projectKey, tokenId, result, response;
        var _b, _c, _d, _e, _f, _g;
        return __generator(this, function(_h) {
          switch (_h.label) {
            case 0:
              console.log("\n\n\n# handleDiscordRequest: Start", { body, rawBody });
              return [4, (0, exports.authenticateDiscordRequest)({ config: config2, rawBody, getHeader })];
            case 1:
              _h.sent();
              if (body.type === 1) {
                console.log("handleDiscordRequest: PING-PONG");
                return [2, {
                  type: 1
                }];
              }
              command = (_c = (_b = body.data) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c[0];
              if (!command)
                return [3, 3];
              kind = command.name;
              projectKey = (_e = (_d = command.options) === null || _d === void 0 ? void 0 : _d.find(function(x) {
                return x.name === "project-key";
              })) === null || _e === void 0 ? void 0 : _e.value;
              tokenId = (_g = (_f = command.options) === null || _f === void 0 ? void 0 : _f.find(function(x) {
                return x.name === "token-id";
              })) === null || _g === void 0 ? void 0 : _g.value;
              console.log("command", { kind, projectKey, tokenId, command });
              return [4, (0, discord_bot_1.handleDiscordCommand)({ config: config2, command: { kind, projectKey, tokenId } })];
            case 2:
              result = _h.sent();
              response = {
                type: 4,
                data: {
                  tts: false,
                  content: result.message
                }
              };
              console.log("command response", { data: response.data });
              return [2, response];
            case 3:
              console.error("handleDiscordRequest: UNKNOWN", { data: body.data });
              return [2, {}];
          }
        });
      });
    };
    exports.handleDiscordRequest = handleDiscordRequest2;
  }
});

// ../common-node/lib/bot/discord-register-commands.js
var require_discord_register_commands = __commonJS({
  "../common-node/lib/bot/discord-register-commands.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f)
          throw new TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerDiscordSlashCommands = void 0;
    var node_fetch_1 = __importStar(require("node-fetch"));
    var discord_types_1 = require_discord_types();
    var registerDiscordSlashCommands = function(_a) {
      var config2 = _a.config, guild = _a.guild;
      return __awaiter(void 0, void 0, void 0, function() {
        var globalDiscordUrl, guildDiscordUrl, registrationUrl, data, body, headers, result, resultJson;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              globalDiscordUrl = "https://discord.com/api/v8/applications/" + config2.applicationId + "/commands";
              guildDiscordUrl = "https://discord.com/api/v8/applications/" + config2.applicationId + "/guilds/" + (guild === null || guild === void 0 ? void 0 : guild.guildId) + "/commands";
              registrationUrl = guild ? guildDiscordUrl : globalDiscordUrl;
              data = __assign(__assign({}, discord_types_1.discordRootCommand), { options: discord_types_1.discordCommands.map(function(c) {
                return {
                  type: discord_types_1.DiscordApplicationCommandOptionType.Subcommand,
                  name: c.command,
                  description: c.description,
                  options: c.options
                };
              }) });
              body = JSON.stringify(data);
              headers = new node_fetch_1.Headers();
              headers.set("Authorization", "Bot " + config2.botToken);
              headers.set("Content-Type", "application/json");
              return [4, (0, node_fetch_1.default)(registrationUrl, {
                body,
                method: "POST",
                headers
              })];
            case 1:
              result = _b.sent();
              return [4, result.json()];
            case 2:
              resultJson = _b.sent();
              console.log("registerDiscordSlashCommands", {
                status: result.status,
                body: JSON.stringify(resultJson, null, 2),
                guild,
                data,
                result
              });
              return [2, {
                message: guild ? "Registered in " + guild.guildId + " with " + guild.defaultProjectKey : "Registered Globally"
              }];
          }
        });
      });
    };
    exports.registerDiscordSlashCommands = registerDiscordSlashCommands;
  }
});

// ../common-node/lib/index.js
var require_lib = __commonJS({
  "../common-node/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_discord_types(), exports);
    __exportStar(require_discord_request(), exports);
    __exportStar(require_discord_bot(), exports);
    __exportStar(require_discord_register_commands(), exports);
  }
});

// src/index.ts
__export(exports, {
  handler: () => handler
});

// src/handler.ts
var import_common_node = __toModule(require_lib());
var config = {
  baseDataUrl: "https://openrarity.xyz/data/",
  baseWebUrl: "https://openrarity.xyz/",
  applicationId: process.env.DISCORD_APPLICATION_ID,
  discordPublicKey: process.env.DISCORD_PUBLIC_KEY,
  botToken: process.env.DISCORD_BOT_TOKEN
};
var logError = (message, event, error) => {
  console.error(`


 # ERROR '${message}''`, {
    path: event.path,
    error
  });
};
var handleDiscordRoute = async (event, context) => {
  var _a, _b;
  try {
    const result = await (0, import_common_node.handleDiscordRequest)({
      config,
      body: JSON.parse((_a = event.body) != null ? _a : ""),
      rawBody: (_b = event.body) != null ? _b : "",
      getHeader: (name) => event.headers[name]
    });
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    };
  } catch (err) {
    logError("handleDiscordRoute", event, err);
    try {
      const error = err;
      if (error.data) {
        if (error.data.textResponse) {
          return {
            statusCode: error.data.statusCode,
            body: error.data.textResponse
          };
        }
        if (error.data.jsonResponse) {
          return {
            statusCode: error.data.statusCode,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(error.data.jsonResponse)
          };
        }
        return {
          statusCode: error.data.statusCode,
          body: "Error"
        };
      }
    } catch (e) {
    }
    logError("\u2757\u2757\u2757 handleDiscordRoute UNHANDLED", event, err);
    return {
      statusCode: 500,
      body: "Oops! Something broke!"
    };
  }
};

// src/index.ts
var handler = async (event, context) => {
  if (event.body && event.path.endsWith("/discord")) {
    return await handleDiscordRoute(event, context);
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ message: "What's up?" })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=discord.js.map
