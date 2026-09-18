const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

// Use the same tokenizer shipped with the installed VS Code; no network or npm install.
const modules = process.env.VSCODE_NODE_MODULES;
assert(modules, 'Set VSCODE_NODE_MODULES to VS Code Contents/Resources/app/node_modules.');
const tm = require(path.join(modules, 'vscode-textmate'));
const onig = require(path.join(modules, 'vscode-oniguruma'));
const root = path.resolve(__dirname, '..');

(async () => {
  const wasm = fs.readFileSync(path.join(modules, 'vscode-oniguruma/release/onig.wasm'));
  await onig.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));
  const registry = new tm.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new onig.OnigScanner(patterns),
      createOnigString: value => new onig.OnigString(value)
    }),
    loadGrammar: async scope => scope === 'source.copol'
      ? JSON.parse(fs.readFileSync(path.join(root, 'syntaxes/copol.tmLanguage.json'), 'utf8')) : null
  });
  const grammar = await registry.loadGrammar('source.copol');
  let count = 0;
  function check(input, target, scope, occurrence = 0, forbidden = false) {
    let state = tm.INITIAL;
    let remaining = occurrence;
    for (const line of input.split('\n')) {
      const result = grammar.tokenizeLine(line, state);
      state = result.ruleStack;
      let offset = -1;
      while ((offset = line.indexOf(target, offset + 1)) >= 0) {
        if (remaining-- > 0) continue;
        const token = result.tokens.find(t => t.startIndex <= offset && t.endIndex > offset);
        assert(token, `No token for ${target}`);
        assert.equal(token.scopes.includes(scope), !forbidden,
          `${JSON.stringify(target)} in ${JSON.stringify(input)}: ${token.scopes.join(' ')}`);
        count++;
        return;
      }
    }
    assert.fail(`Missing target ${target}`);
  }
  check('# IDENTIFICATION DIVISION.', 'IDENTIFICATION', 'entity.name.section.copol');
  check('## PROGRAM-ID. **TIMECARD.**', 'PROGRAM-ID', 'entity.name.section.copol');
  check('## PROGRAM-ID. **TIMECARD.**', 'TIMECARD', 'markup.bold.copol');
  check('### INPUT-CONTEXT "PERFORM DENY".', 'PERFORM', 'string.quoted.double.copol');
  check('DATA DIVISION.', 'DATA', 'entity.name.section.copol');
  check('  ** 01 RECORD. **', 'RECORD', 'markup.bold.copol');
  check('  01 RECORD.', 'RECORD', 'markup.bold.record.copol');
  check('  05 FIELD PIC X.', '05', 'storage.type.level.copol');
  check('  05 FIELD PIC X(36) TOK(40) VALUE "UUID".', 'X(36)', 'storage.type.picture.copol');
  check('PIC 9(2)V92 VALUE 00.00.', '9(2)V92', 'storage.type.picture.copol');
  check('PIC 9(2)V9(2) VALUE 00.00.', '9(2)V9(2)', 'storage.type.picture.copol');
  check('PIC LIST VALUE [EN, ES].', 'LIST', 'storage.type.picture.copol');
  check('TOK(40) VALUE 15.', '40', 'support.function.budget.copol');
  check('VALUE 00.00.', 'VALUE', 'keyword.other.value.copol');
  check('VALUE 00.00.', '00.00', 'constant.numeric.copol');
  check('VALUE -12.50.', '-12.50', 'constant.numeric.copol');
  check('VALUE "XX/XX/2XXX".', 'XX/XX', 'string.quoted.date.copol');
  check('VALUE "OFF-DUTY".', 'OFF-DUTY', 'string.quoted.double.copol');
  check('MSK("PURPLE: icon_1").', 'PURPLE', 'string.quoted.placeholder.copol');
  check('MSK ("PURPLE: icon_1").', 'PURPLE', 'string.quoted.placeholder.copol');
  check('MSK("icon ) VALUE") VALUE "normal".', 'normal', 'string.quoted.double.copol');
  check('MAP(ICON-PUNCH-IN)', 'MAP', 'support.function.annotation.copol');
  check('REQ(VALID-UUID)', 'REQ', 'support.function.annotation.copol');
  check('ALT(OUTPUT "STATE")', 'ALT', 'support.function.annotation.copol');
  check('YLD(WAIT-FOR-USER-APPROVAL)', 'YLD', 'support.function.annotation.copol');
  check('PERMIT "Strict typing".', 'PERMIT', 'keyword.control.permission.copol');
  check('deny "Unsafe types".', 'deny', 'keyword.control.permission.copol');
  for (const keyword of ['PERFORM', 'EVALUATE', 'WHEN', 'END-EVALUATE', 'STOP RUN']) {
    check(`${keyword}.`, keyword, 'keyword.control.procedure.copol');
  }
  check('PERFORM 100-INITIALIZE-AUTH-SESSION.', '100', 'constant.numeric.copol', 0, true);
  check('USER-VALUE PERFORM-ACTION DENY-LIST', 'VALUE', 'keyword.other.value.copol', 0, true);
  check('USER-VALUE PERFORM-ACTION DENY-LIST', 'PERFORM', 'keyword.control.procedure.copol', 0, true);
  check('USER-VALUE PERFORM-ACTION DENY-LIST', 'DENY', 'keyword.control.permission.copol', 0, true);
  check('"PERFORM VALUE DENY PIC X TOK(1)"', 'VALUE', 'string.quoted.double.copol');
  check('"first line\nPERFORM VALUE"\nPERFORM FINISH.', 'VALUE', 'string.quoted.double.copol');
  check('"first line\nPERFORM VALUE"\nPERFORM FINISH.', 'PERFORM', 'keyword.control.procedure.copol', 1);
  check('"first \\" VALUE \\" last"', 'VALUE', 'string.quoted.double.copol');
  check('"first "" VALUE "" last"', 'VALUE', 'string.quoted.double.copol');
  check("'first '' VALUE '' last'", 'VALUE', 'string.quoted.single.copol');
  check('/* VALUE\nPERFORM DENY */ VALUE 15.', 'PERFORM', 'comment.block.copol');
  check('/* VALUE\nPERFORM DENY */ VALUE 15.', 'VALUE', 'keyword.other.value.copol', 1);
  check('*> PERFORM VALUE', 'PERFORM', 'comment.line.copol');
  const sample = fs.readFileSync(path.join(root, 'examples/COPOL-Example.cpl'), 'utf8');
  let state = tm.INITIAL;
  for (const line of sample.split('\n')) state = grammar.tokenizeLine(line, state).ruleStack;
  assert.equal(state.depth, 1, 'Example leaves a string or comment open');
  const theme = JSON.parse(fs.readFileSync(path.join(root, 'themes/copol-reference-light.json'), 'utf8'));
  const palette = JSON.parse(fs.readFileSync(path.join(root, 'reference-colors.json'), 'utf8'));
  assert.deepEqual(theme.tokenColors, palette.textMateRules);
  assert(theme.tokenColors.every(r => r.scope.every(s => s.startsWith('source.copol'))));
  // Resolve real theme metadata, not just scope names.
  registry.setTheme({ settings: theme.tokenColors });
  const colorCases = [
    ['# DATA DIVISION.', 'DATA', '#2E3192'],
    ['PERMIT "normal"', 'PERMIT', '#662D91'],
    ['05 F PIC 9(2)V92 TOK(10) VALUE 00.00.', '9(2)V92', '#FCB040'],
    ['05 F PIC X TOK(10) VALUE 00.00.', '10', '#FCB040'],
    ['VALUE 00.00.', 'VALUE', '#0F75BC'],
    ['VALUE 00.00.', '00.00', '#0B9444'],
    ['VALUE "XX/XX/2XXX".', 'XX/XX', '#0B9444'],
    ['MSK("PURPLE: icon_1")', 'PURPLE', '#BF1E2D'],
    ['PERFORM 100-ACTION.', 'PERFORM', '#ED217C'],
    ['PERFORM 100-ACTION.', '100', '#282828'],
    ['"PERFORM VALUE"', 'VALUE', '#282828'],
    ['/* OPTIONS: 15 */', 'OPTIONS', '#86CDA5']
  ];
  for (const [line, target, color] of colorCases) {
    const result = grammar.tokenizeLine2(line, tm.INITIAL);
    const offset = line.indexOf(target);
    for (let i = 0; i < result.tokens.length; i += 2) {
      if (result.tokens[i] <= offset && (i + 2 === result.tokens.length || result.tokens[i + 2] > offset)) {
        const foreground = (result.tokens[i + 1] >>> 15) & 0x1ff;
        assert.equal(registry.getColorMap()[foreground], color, `Wrong color for ${target}`);
      }
    }
  }
  console.log(`PASS: ${count} grammar assertions, ${colorCases.length} rendered-color checks, and the full example.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
