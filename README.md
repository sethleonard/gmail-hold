# gmail-hold
Gmail add-on that allows you to hold your incoming email until you are ready to process it

## How it Works (installation details below)
- Files must be copied to Google Scripts and then installed as a test deployment by your Google user 
- You will also need to create a filter that automatically moves all incoming email to a hidden Gmail label
- This add-on then moves those messages out of the hidden Gmail label and into your inbox

## Settings and Features
- Choose how many times per day you would like to be able to release your email into your inbox (between 1-8)
- Optionally require that your inbox be empty (Inbox Zero) before you can release email (regardless of remaining release count)
- Optionally enable "Impulse Control" which limits your ability to change settings if limits have been reached

## Installation
1. Go to [Google Apps Scripts](https://script.google.com/home)
2. Click 'New project'
3. Delete all text in the code window (starts with `function myFunction() {` and ends with a `}`)
4. Paste the contents of _Code.gs_ file into the window
5. Save (disk icon)
6. Click the gear icon (Project Settings) at the bottom of the menu on the far left
7. Check the box next to _Show "appsscript.json" manifest file in editor_
8. Return to the Code Editor (< > icon 3 items above gear icon)
9. Click on _appsscript.json_
10. Delete all text in the code window (starts with `{ "timeZone": "America/New_York",` and ends with a `"runtimeVersion": "V8" }`)
11. Paste the contents of _appsscript.json_ file into the window
12. Save (disk icon)
13. Click on _Code.js_
14. Make sure the menu at the top reads Run - Debug - homepage; if it doesn't, click the third item and choose 'homepage'
15. Click _Run_
16. When the popup appears, click _Review Permissions_
17. Confirm your Google Account
18. Click _Allow_
19. Wait until the _Execution log_ window shows `Execution completed`
  - Sometimes it takes a while, and sometimes it times out
  - This shouldn't be an issue if you've already accepted the permissions
20. Click _Deploy_ in the upper right portion of the screen and choose _Test deployments_
21. Next to `Application(s): Gmail`, click _Install_
22. Go to your [Gmail](https://mail.google.com/mail/u/0/#inbox)
23. A new mail icon should appear on the right side of the screen (make sure you are showing the side panel)

## Using gmail-hold

## Customizing
