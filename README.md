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

## Requirements
- A Gmail account
- Accept that gmail-hold only works if you exclusively use the official Gmail website or Gmail mobile apps (and the mobile apps require an extra step to release email). It will not work if you use any 3rd party apps or tools and you will not be able to access new email.
- Accept that you will not be able to receive incoming messages until you release them, and that the app is designed to limit how many times in a day you can release them.
- Accept that you can potentially run out of email releases in a day, leaving you unable to receive new messages until the next day (see FAQ for possible but not recommended work arounds).
- Read the FAQ.
- Use the app at your own risk.

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
24. gmail-hold is now installed; continue reading to set up the required filter

## Configuring the gmail-hold Filter
1. The filter is required to "hide" incoming email messages so you can later release them on your schedule
2. Click the gmail-hold icon in the Gmail sidebar; this should open the app and show you some info an a _Release Email_ button
3. Don't click anything; you can now close the sidebar
  - This step was needed to create the label for you
4. Click the gear icon at the top of Gmail, then click _See all settings_
5. Click on _Filters and Blocked Addresses_
6. Scroll to the bottom of your existing filters and click _Create a new filter_
7. Next to `Doesn't have`, enter a long string of random characters (one recommendation is 'gmailHold123abc456def00000'); this will filter all messages that don't have this string, which should be _all_ messages, as none should contain this string
8. Click _Create filter_
9. Check the box next to `Skip the inbox (Archive it)`
10. Check the box next to `Apply the label'` and choose _gmailHold_
11. Click the _Create filter_
12. Your filter should now be functional

## Using gmail-hold

## Customizing
