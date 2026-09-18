# COPOL for Visual Studio Code

Recognizes `.cpl` / `.CPL` as COPOL and highlights the language using the supplied COBOP example as the reference. This extension provides editing support only; it does not execute prompts or enforce their requirements or token budgets.

The extension contains a TextMate grammar, language configuration, and an optional **COPOL Reference Light** theme. It has no executable extension code and makes no network requests.

The local setup adds rules scoped to `source.copol` to your current theme, so the reference colors apply to COPOL files. The optional theme also supplies the white editor background used in the reference.

| Text | Reference color |
| --- | --- |
| Division and section headings | Indigo |
| `PERMIT`, `DENY` | Purple |
| `PIC` declarations, `TOK(...)`, annotation names | Orange |
| `VALUE` | Blue |
| Numeric values and date strings | Green |
| Strings within `MSK(...)` | Red |
| `PERFORM`, `EVALUATE`, `WHEN`, `END-EVALUATE`, `STOP RUN` | Pink |
| Comments | Pale green, italic |
| Other text and ordinary quoted strings | Dark gray |
| Records and `**bold text**` | Bold dark gray |

Keywords are case insensitive. Keywords within quoted strings or comments remain part of that string or comment. Hyphenated names remain intact. Multiline quoted text and comments are supported. The legacy picture spelling `9(2)V92` from the reference and standard `9(2)V9(2)` are both highlighted.

## Install or move to another computer

1. In VS Code, run **Extensions: Install from VSIX…** and select the supplied `copol-language-0.1.0.vsix`.
2. Run **Preferences: Color Theme** and choose **COPOL Reference Light**, or merge the `textMateRules` in `reference-colors.json` into `editor.tokenColorCustomizations` in your settings to retain your current theme.
3. Open a `.cpl` file. The language indicator should show **COPOL**. If another association overrides it, choose **Change Language Mode → Configure File Association for '.cpl' → COPOL**.

Language configuration and token scopes follow the [VS Code syntax highlighting API](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide). Palette customization uses [VS Code token color settings](https://code.visualstudio.com/docs/configure/themes#_customizing-a-color-theme).
