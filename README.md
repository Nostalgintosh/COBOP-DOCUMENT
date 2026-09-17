# COBOP-DOCUMENT
### COmmon Business Oriented Prompting

This is design for optimizing prompt writing to make it more clear and professional.

Here is an example of COBOP in action.
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

```
#   IDENTIFICATION DIVISION.
##  PROGRAM-ID.               **TIMECARD-UI-REDESIGN.**
### AUTHOR-INTENT.             "跨平台实时薪资与打卡追踪引擎".
### SYSTEM-ROLE.               "SENIOR BACK-END ARCHITECT & ENGINEER".


#   ENVIRONMENT DIVISION.
##  INPUT-CONTEXT               "用于 iOS/Android 通用发布的 TypeScript/React Native 后端".
### TONE-CONFIGURATION.          FORMAL, TECHNICAL, NON-CONVERSATIONAL.
    OUTPUT-LIMITS.               ONLY USE: json, firebase-auth, typescript.
    RESTRICTIONS.              **DO NOT RENDER PURPLE LABELS IN COMPILED SOURCE CODE.**

#   DATA DIVISION.
##  WORKING-STORAGE
** 01 USER-PROFILE-RECORD. **
        05 USER-ID               PIC X(36)      TOK(40) VALUE "UUID-GENERIC".
        05 DISPLAY-NAME          PIC X          TOK(30) VALUE "USER-PROFILE".
        05 AUTH-PROVIDER         PIC X          TOK(15) VALUE "FIREBASE".
        05 HOURLY-RATE           PIC 9(2)V92    VALUE 00.00.

 ** 01 TIME-CARD-RECORD. **
        05 EMPLOYEE-ID           PIC X          TOK(10) VALUE EMPLOYEE.
        05 CLOCK-IN-TIMESTAMP    PIC X(19).     TOK(20).
        05 CLOCK-OUT-TIMESTAMP   PIC X(19).     TOK(20).
        05 CURRENT-HOUR          PIC 9(3)V92    TOK(10) VALUE 00.00.
        05 CURRENT-EARNINGS      PIC 9(5)V92    TOK(10) VALUE 00.00.
        05 PAY-PERIOD-START      PIC X(10)      TOK(10) VALUE 00.00.

** 01 ACTIVE-SHIFT-RECORD. **
        05 SHIFT-STATUS          PIC X          TOK(10) VALUE "OFF-DUTY".
        05 CLOCK-IN-TIME         PIC X(19)      TOK(20).
        05 ACCUMULATED-HOURS     PIC 9(3)V92    VALUE 00.00.
        05 GROSS-EARNINGS        PIC 9(5)V92    VALUE 00.00.

** 10 CONFIGURATION-FLAGS. **
        05 APP-LOCK-STATE        PIC X          VALUE "ACTIVE".
        05 THEME-MODE            PIC X          VALUE "CLASSIC-PAPER".
        05 SCAN-TO-PUNCH-EN      PIC X          VALUE "TRUE".
        05 UNPAID-BREAK-EN       PIC X          VALUE "TRUE".

 ** 10 BREAK-CONFIG. **
        05 BREAK-DURATION        PIC 9          VALUE 15. /*OPTIONS: 15, 30, 60 mins*/
        05 BREAK-STATUS          PIC X          VALUE "UNPAID".

 ** 10 SCAN-TO-PUNCH-CONFIG. **
        05 OCR-ENGINE            PIC X          VALUE "Google-Vision".
        05 TARGET-ACTION         PIC X          VALUE "PUNCH-OUT".

#   PROCEDURE DIVISION.
        PERFORM 100-INITIALIZE-AUTH-SESSION.
        
        PERFORM 200-SYNC-HOTSCHEDULES-CALENDAR.
        
        PERFORM 300-PROCESS-OCR-SCAN-TO-PUNCH
            WHEN CAMERA-TRIGGER = ACTIVE.
            
        PERFORM 400-VALIDATE-MISSED-CLOCK-OUT.
        
        PERFORM 500-EVALUATE-AND-CALCULATE-PAY
            EVALUATE SHIFT-STATUS
                WHEN "ON-DUTY"
                    COMPUTE GROSS-EARNINGS = ACCUMULATED-HOURS * HOURLY-RATE
                WHEN OTHER
                    CONTINUE
            END-EVALUATE.
            
        PERFORM 600-GENERATE-TYPESCRIPT-MODULES.
        
        STOP RUN.
```
**NOTE** YOU DO NOT NEED TO USE CHINESE TO WRITE COBOP IN ORDER TO USE THIS MARKDOWN-LIKE LANGUAGE.
