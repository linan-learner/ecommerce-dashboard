"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _config = await jitiImport("eslint/config");
var _eslintConfigTypescript = await jitiImport("@vue/eslint-config-typescript");
var _eslintPluginVue = _interopRequireDefault(await jitiImport("eslint-plugin-vue"));
var _eslintPluginOxlint = _interopRequireDefault(await jitiImport("eslint-plugin-oxlint"));
var _flat = _interopRequireDefault(await jitiImport("eslint-config-prettier/flat"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup
var _default = exports.default =
(0, _eslintConfigTypescript.defineConfigWithVueTs)(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },

  (0, _config.globalIgnores)(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ..._eslintPluginVue.default.configs['flat/essential'],
  _eslintConfigTypescript.vueTsConfigs.recommended,

  ..._eslintPluginOxlint.default.buildFromOxlintConfigFile('.oxlintrc.json'),

  _flat.default
); /* v9-cef1a0b9b691ca2b */
