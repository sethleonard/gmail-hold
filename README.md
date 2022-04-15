# gmail-hold
Gmail add-on that allows you to hold your incoming email until you are ready to process it

# How it Works (installation details below)
- Files must be copied to Google Scripts and then installed as a test deployment by your Google user 
- You will also need to create a filter that automatically moves all incoming email to a hidden Gmail label
- This add-on then moves those messages out of the hidden Gmail label and into your inbox

# Settings and Features
- Choose how many times per day you would like to be able to release your email into your inbox (between 1-8)
- Optionally require that your inbox be empty (Inbox Zero) before you can release email (regardless of remaining release count)
- Optionally enable "Impulse Control" which limits your ability to change settings if limits have been reached

# Requirements
- A Gmail account
- Accept that gmail-hold only works if you exclusively use the official Gmail website or Gmail mobile apps (and the mobile apps require an extra step to release email). It will not work if you use any 3rd party apps or tools and you will not be able to access new email.
- Accept that you will not be able to receive incoming messages until you release them, and that the app is designed to limit how many times in a day you can release them.
- Accept that you can potentially run out of email releases in a day, leaving you unable to receive new messages until the next day (see FAQ for possible but not recommended work arounds).
- Read the [FAQ](#frequently-asked-questions).
- Use the app at your own risk.

# Installation, Configuration, and Use

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
10. Check the box next to `Apply the label` and choose _emailHold_
11. Click the _Create filter_
12. Your filter should now be functional

## Using gmail-hold
- Any time you want to release your email, click on the gmail-hold icon in the sidebar
- You will see a record of how many times you've released your email for the day
- Click _Release Email_ if it's available
- Wait for it to finish processing (it's moving messages from the hidden label to your inbox)
- You usually will need to click on the inbox icon again to refresh your inbox and reveal the new messages
- Click on _Settings_ at the bottom of the sidebar to change:
  - How many email releases you would like per day
  - Whether you would like to require Inbox Zero to release emails
  - Whether you would like to impose 'Impulse Control', which keeps you from changing the number of releases if you've already hit your limit, or from disabling the Inbox Zero requirement if you have messages in your inbox (it also doesn't allow you to change the Impulse Control setting in either case)

# Customizing
### Change app name
Change:
```
"addOns": {
    "common": {
      "name": "gmail hold",
```
to:
```
"addOns": {
    "common": {
      "name": "YOUR APP NAME HERE",
```
      
### Change app icon
Change:
```
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/email_black_48dp.png",
```
to:
```
      "logoUrl": "URL TO YOUR ICON HERE",
```
Make sure your icon is square or it will be stretched and look weird

# Frequently Asked Questions
## How can I uninstall gmail-hold?
You can uninstall by following these steps:
1. Remove the filter you created that moves all of your incoming mail to the emailHold label
2. Move all messages from the emailHold label to your inbox, either manually or by releasing them using the app button
3. Open the app editor in [Google Apps Scripts](https://script.google.com/home)
4. Click _Deploy_ in the upper right portion of the screen and choose _Test deployments_
5. Next to `Application(s): Gmail`, click _Uninstall_
6. Remove the emailHold label

## What if I need to access my email from my phone?
First suggestion? Stop getting email on your phone (uninstall it if you're ready). You're out in the world; stay there and don't get sucked into messages that other people want you to read. If you have to have Gmail on your phone, you can release messages through the official Gmail apps or through the browser-based version of Gmail. However, in those apps, you cannot release email via the inbox, like you do in the desktop version. Instead, you'll need to open a message and scroll to the bottom to find the gmail-hold app icon (if you are at Inbox Zero, you'll have to search for a message to open or access one via the labels menu). Click the icon and you'll be able to release your email.

## Can I release my email through a non-Gmail app (Apple Mail, iPhone Mail App, etc.)?
No. gmail-hold only works with official Gmail apps and websites. You will be unable to release your email if use a different email program.

## What if I really need to access my email for a specific message I know is there (verification email, time-sensitive message, etc.)?
You can always release your email in order to see a time-sensitive email. If you are out of releases, or don't want to "waste" one, the easiest thing to do is to search for the message directly. All messages can appear in search results, even if they are in the hidden label. As an example, if you are expecting a verification email from a website, you can search for "verify" or "verification" to find your message. You can also search by email address or name to find messages from specific people. Note: there are ways to "cheat" Contented Email and get your email anyways. If you find yourself doing that a lot, maybe you should just uninstall the app. Otherwise, do your best to embrace the spirit of the app and see what it feels like to not be disrupted or distracted by every incoming email message.

# Contributing, Feature Requests, and Bug Reports
See [CONTRIBUTING](CONTRIBUTING.md)
