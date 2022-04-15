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
3. Click 'Untitled Project' and rename your app _Gmail Hold_ (or something else if you want)
4. Delete all text in the code window (starts with `function myFunction() {` and ends with a `}`)
5. Paste the contents of _Code.gs_ file into the window
6. Save (disk icon)
7. Click the gear icon (Project Settings) at the bottom of the menu on the far left
8. Check the box next to _Show "appsscript.json" manifest file in editor_
9. Return to the Code Editor (< > icon 3 items above gear icon)
10. Click on _appsscript.json_
11. Delete all text in the code window (starts with `{ "timeZone": "America/New_York",` and ends with a `"runtimeVersion": "V8" }`)
12. Paste the contents of _appsscript.json_ file into the window
13. Save (disk icon)
14. Click on _Code.js_
15. Make sure the menu at the top reads Run - Debug - homepage; if it doesn't, click the third item and choose 'homepage'
16. Click _Run_
17. When the popup appears, click _Review Permissions_
18. Confirm your Google Account
19. Click _Allow_
20. Wait until the _Execution log_ window shows `Execution completed`
  - Sometimes it takes a while, and sometimes it times out
  - This shouldn't be an issue if you've already accepted the permissions
21. Click _Deploy_ in the upper right portion of the screen and choose _Test deployments_
22. Next to `Application(s): Gmail`, click _Install_
23. Go to your [Gmail](https://mail.google.com/mail/u/0/#inbox)
24. A new mail icon should appear on the right side of the screen (make sure you are showing the side panel)
25. gmail-hold is now installed; continue reading to set up the required filter

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
3. Open the app editor for Gmail Hold (created during installation) in [Google Apps Scripts](https://script.google.com/home)
4. Click _Deploy_ in the upper right portion of the screen and choose _Test deployments_
5. Next to `Application(s): Gmail`, click _Uninstall_
6. Remove the emailHold label

## Why didn't you just release this as an add-on that can be installed in Gmail?
Google has an unfortunate combination of not-very-granular permission scopes and increased requirements for permission scopes that require a lot of user data. So, even though gmail-hold does not collect any data, read any messages, send any messages, or really do anything but add and remove message labels, it requires a high level of permission scope, based on what scopes Google offers. The scopes required to change message labels are the same as those that give an app pretty much full access to all Gmail data. To get an app approved by Google with that level of access requires a lot of extra steps from a developer. This is normally a good thing for protecting users, but for gmail-hold, was a lot of extra effort. My concern was that I would go through all of that effort only to have Google reject the app anyways, as it doesn't improve Gmail's functionality or productivity, which are their primary use cases for add-ons. In fact, it _deliberately hinders_ Gmail functionality. This app is also not quite mainstream functionality, and I had concerns about larger numbers of the general public not understanding the app, installing it, and then complaining to me that they couldn't read their email. So, it's saved for those with the know-how necessary to manually install.

## What if I need to access my email from my phone?
First suggestion? Stop getting email on your phone (uninstall it if you're ready). You're out in the world; stay there and don't get sucked into messages that other people want you to read. If you have to have Gmail on your phone, you can release messages through the official Gmail apps or through the browser-based version of Gmail. However, in those apps, you cannot release email via the inbox, like you do in the desktop version. Instead, you'll need to open a message and scroll to the bottom to find the gmail-hold app icon (if you are at Inbox Zero, you'll have to search for a message to open or access one via the labels menu). Click the icon and you'll be able to release your email.

## Can I release my email through a non-Gmail app (Apple Mail, iPhone Mail App, etc.)?
No. gmail-hold only works with official Gmail apps and websites. You will be unable to release your email if use a different email program.

## What if I really need to access my email for a specific message I know is there (verification email, time-sensitive message, etc.)?
You can always release your email in order to see a time-sensitive email. If you are out of releases, or don't want to "waste" one, the easiest thing to do is to search for the message directly. All messages can appear in search results, even if they are in the hidden label. As an example, if you are expecting a verification email from a website, you can search for "verify" or "verification" to find your message. You can also search by email address or name to find messages from specific people. Note: there are ways to "cheat" Contented Email and get your email anyways. If you find yourself doing that a lot, maybe you should just uninstall the app. Otherwise, do your best to embrace the spirit of the app and see what it feels like to not be disrupted or distracted by every incoming email message.

# Contributing, Feature Requests, and Bug Reports

## Contributing
Honestly, I'm not a github or version control expert, so feel free to add a pull request, and I'll try to figure out how to implement if it makes sense to do so.

## Feature Requests
Use [Issues](https://github.com/sethleonard/gmail-hold/issues)

## Bug Reports
Use [Issues](https://github.com/sethleonard/gmail-hold/issues)

## Donate
If you like gmail-hold and want to show your appreciation, you can [pay for my next cup of tea](https://www.buymeacoffee.com/sethleonard)
