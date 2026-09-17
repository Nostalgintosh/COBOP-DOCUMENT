# COBOP-DOCUMENT
### COmmon Business Oriented Prompting

This is design for optimizing prompt writing to make it more clear and professional.

When prompts are written in natural conversational English, models default to probability and predictive guessing. That is where scope creep starts—the AI assumes you want extra features, conversational introductions, or alternative approaches you never asked for. In mainframe systems, an unallocated variable or an undefined routine halts execution immediately. By forcing that exact discipline onto an LLM, you establish strict bounds on scope and compute.

This type of **prompt language** is design for building and organizing prompt without any AI drift e.g. *scope creep* or Token Overspending e.g. *Budget Leaks* to show-up within the organization.

1. The TOK(n) Governor at the Variable Level:

   * Instead of vague instructions like "Keep it brief", COBOP uses hard limits: `EMAIL-SUBJECT PIC X TOK(15)` or `BODY-COPY PIC MD TOK(150)`.

   * This forces the generation engine to truncate output before it inflates context-window costs.

2. Modular Prompting with COPYBOOKS:

   * Re-typing system prompts, brand guidelines, or role definitions across multiple files burns prompt tokens repeatedly.

   * By leveraging `COPY "FILE.CPY" REPLACING ==A== BY "B"`, standard rules stay in lightweight, pre-tested external modules and are only compiled when needed.

3. Chunked Generation via `YLD` (Yield):

   * Generating 1,000 lines of code at once invites errors midway through, forcing you to discard the run and spend double the tokens regenerating the whole module.

   * Using PERFORM ... YLD(WAIT-FOR-APPROVAL) forces the model to pause at discrete milestones, letting you verify the output before paying tokens for the next phase.

4. Eliminating Filler with `STOP RUN.`:

   * Conversational boilerplate—"Sure! I would be happy to help you build that React Native module..."—wastes input and output tokens across every turn in a thread.

   * STOP RUN strips out conversational fluff completely, ensuring you only pay for usable lines of code or data.

**Here is an example of COBOP in action.**
```
# IDENTIFICATION DIVISION
## PROGRAM-ID. **TIMECARD-UI-DUO-CORE**
### AUTHOR-INTENT. "Responsive UI for foldables (iPhone Duo/Galaxy Fold) and standard phones."
### SYSTEM-ROLE. "SENIOR REACT NATIVE UX ENGINEER"

# ENVIRONMENT DIVISION
## INPUT-CONTEXT "React Native using Flexbox and Dimensions API for dynamic folding screens."
### TONE-CONFIGURATION. FORMAL, TECHNICAL, NON-CONVERSATIONAL.
    OUTPUT-LIMITS. ONLY USE: react-native, typescript, tailwindcss.
    RESTRICTIONS. DO NOT RENDER PURPLE LABELS IN COMPILED SOURCE CODE.

# DATA DIVISION
## WORKING-STORAGE
    ** 01 DEVICE-STATE. **
        05 SCREEN-MODE         PIC X       VALUE "AUTO". /* FOLDED (5.4") or UNFOLDED (7.6") */
        
    ** 01 UI-THEME-CONFIG. **
        05 AESTHETIC           PIC X       TOK(15) VALUE "Corporate Printer-Paper".
        05 COLOR-SCHEME        PIC X       TOK(10) VALUE "DARK-MODE".

    ** 01 NAVIGATION-TOGGLES. **
        05 TAB-1               PIC X       MSK("PURPLE: nav_punching") VALUE "PUNCHING".
        05 TAB-2               PIC X       MSK("PURPLE: nav_history")  VALUE "HISTORY".
        05 TAB-3               PIC X       MSK("PURPLE: nav_settings") VALUE "SETTING".

    ** 01 LOCALIZATION-PACK. **
        05 LANG-SUPPORT        PIC LIST    VALUE [EN, ES, HT, LC, PD].

# PROCEDURE DIVISION.
    PERFORM 100-SETUP-RESPONSIVE-LAYOUT
        REQ(USE-DIMENSIONS-API).

    PERFORM 200-RENDER-NAVIGATION-BAR
        EVALUATE SCREEN-MODE
            WHEN "UNFOLDED"
                COMPUTE DOCK-POSITION = "LEFT-SIDE"
            WHEN OTHER
                COMPUTE DOCK-POSITION = "BOTTOM".
                
    PERFORM 300-DRAFT-MAIN-CARDS
        YLD(WAIT-FOR-USER-APPROVAL).

    PERFORM 400-RESOLVE-ASSET-MAPPINGS.
        INSPECT DRAFT-CODE REPLACING ALL "PURPLE:" BY SPACES.

    PERFORM 500-GENERATE-TYPESCRIPT-MODULES.
    STOP RUN.
```
**NOTE** YOU DO NOT NEED TO USE CHINESE TO WRITE COBOP IN ORDER TO USE THIS MARKDOWN-LIKE LANGUAGE.
