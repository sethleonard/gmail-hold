function homepage(e) {

  // make sure lable exists; if not, create it.
  alert = checkConfig();

  // pull user properties
  var userProperties = PropertiesService.getUserProperties();

  // see if user has indicated OK to GO
  var isActive = parseInt(userProperties.getProperty('isActive'));
  if(isActive == null || isNaN(isActive)) {
    isActive = 0;
  }

  // get all user settings, set defaults if empty

  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  if(inboxZero == null || isNaN(inboxZero)) {
    inboxZero = 0;
    userProperties.setProperty('inboxZero', inboxZero);
  }
  
  var allowedReleases = parseInt(userProperties.getProperty('allowedReleases'));
  if(allowedReleases == null || isNaN(allowedReleases)) {
    allowedReleases = 4;
    userProperties.setProperty('allowedReleases', allowedReleases);
  }

  var impulseControls = parseInt(userProperties.getProperty('impulseControls'));
  if(impulseControls == null || isNaN(impulseControls)) {
    impulseControls = 0;
    userProperties.setProperty('impulseControls', impulseControls);
  }

 // if(e !== null) {
 //   userProperties.setProperty('timeZone', e.userTimezone.id);
 // }

  var timeZone = e.userTimezone.id;
 // var timeZone = userProperties.getProperty('timeZone');
 // var timeZone = 'America/Los_Angeles';
 // var email = Session.getActiveUser().getEmail();
 // var date = Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd");
  var displayDate = Utilities.formatDate(new Date(), timeZone, "MMMM dd, yyyy");

  var inboxCount = getInboxCount();
  var releases = getReleaseCount(userProperties,timeZone);

  var timesText = 'times';

  if(releases == 1) {
    timesText = 'times'
  }

  var messageCountText = 'messages';
  var messageItThemText = 'them';

  if(inboxCount == 1) {
    messageCountText = 'message';
    messageItThemText = 'it';
  }

  var inactiveText = CardService.newTextParagraph()
    .setText("Contented Email is not yet active. In order to activate the app, you must read the installation instructions and manually create an email filter. Click the button below for instructions on creating your email filter:");
  var installLink = CardService.newAction().setFunctionName('pageInstall');
  var installButton = CardService.newTextButton().setText('How to Create Filter').setOnClickAction(installLink);

  var inactiveSection = CardService.newCardSection()
      .addWidget(inactiveText)
      .addWidget(installButton);

  var textParagraph = CardService.newTextParagraph()
    .setText(
      "You have released email\n<b>" + releases + " out of " + allowedReleases + " " + timesText + "</b>\ntoday, " + displayDate + "\n"
    );

  var inboxZeroText = CardService.newTextParagraph()
    .setText(
      "You have " + inboxCount + " " + messageCountText + " in your inbox. " +
      "You will not be able to release email until you clear " + messageItThemText + " out.\n" +
      "(Hint: use the 'Add to tasks' function)"
    );

  var releaseAction = CardService.newAction()
      .setFunctionName('processHidden');
  var refreshAction = CardService.newAction()
      .setFunctionName('refreshHomepage');
  var releaseButton = CardService.newTextButton()
      .setText('Release Email')
      .setOnClickAction(releaseAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var refreshButton = CardService.newTextButton()
      .setText('Refresh')
      .setOnClickAction(refreshAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(releaseButton);

  var section = CardService.newCardSection()
      .addWidget(textParagraph);

  if (releases < allowedReleases && (inboxCount == 0 || inboxZero == 0)) {
    section.addWidget(buttonSet);
  } else if (inboxZero == 1 && inboxCount > 0) {
    section.addWidget(inboxZeroText);
    section.addWidget(refreshButton);
  }

  var settingsText = CardService.newTextParagraph()
    .setText(
      "Impulse Control: " + impulseControls + "\n" +
      "Inbox Zero: " + inboxZero + "\n" +
      "Allowed Releases: " + allowedReleases + "\n" +
      "Timezone: " + timeZone + "\n" +
      "Is Active: " + isActive
    );
   // section.addWidget(settingsText);
   // section.addWidget(installButton);

  var fixedFooter = footer();

  var card = CardService.newCardBuilder();

  if(isActive == 1) {
    card.addSection(section);
  } else {
    card.addSection(inactiveSection);
  }

  card.setFixedFooter(fixedFooter);

  return card.build();
}

function getInboxCount() {
  var inboxThreads = GmailApp.getInboxThreads();
  return inboxThreads.length;
}

function getReleaseCount(userProperties,timeZone) {
//  var timeZone = 'America/Los_Angeles';
  var date = Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd");

  var releases = parseInt(userProperties.getProperty('releases'));
  if(releases == null || isNaN(releases)) {
    releases = 0;
  }

  var lastDate = userProperties.getProperty('currentDate');
  if (lastDate == null) {
    releases = 0;
  } else if (lastDate != date) {
    releases = 0;
  }

  userProperties.setProperty('releases', releases);
  userProperties.setProperty('currentDate', date);

  return releases;
}

function deleteLabel() {
  var ceLabel = GmailApp.getUserLabelByName("contentedEmail");
  ceLabel.deleteLabel();
}

function footer() {
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
        CardService.newTextButton()
            .setText("Settings")
            .setOnClickAction(
                CardService.newAction()
                    .setFunctionName("pageSettings")
            )
    )
    .setSecondaryButton(
        CardService.newTextButton()
            .setText("FAQ")
            .setOnClickAction(
                CardService.newAction()
                    .setFunctionName("pageFAQ")
            )
    );
  return fixedFooter;
}

function processHidden(e) {
  
  var userProperties = PropertiesService.getUserProperties();
  var releases = parseInt(userProperties.getProperty('releases')) + 1;
  userProperties.setProperty('releases', releases);

  var label = GmailApp.getUserLabelByName('contentedEmail');

  if (label) {
    var threads = label.getThreads();

    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i];
      thread.moveToInbox();
      thread.removeLabel(label);
    }
  }

  return refreshHomepage(e);

/*
  var nav = CardService.newNavigation()
    .popToRoot()
    .updateCard(homepage(e));
    
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build(); 
*/
}

function pageSettings() {

  var userProperties = PropertiesService.getUserProperties();
  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  var inboxSelected = false;
  if(inboxZero == 1) {
    inboxSelected = true;
  }
  var allowedReleases = parseInt(userProperties.getProperty('allowedReleases'));
  var impulseControls = parseInt(userProperties.getProperty('impulseControls'));
  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  var impulseSelected = false;
  if(impulseControls == 1) {
    impulseSelected = true;
  }

  var header = CardService.newCardHeader()
      .setTitle('Settings')
      .setImageUrl('https://sethleonard.github.io/ce-logo-orange.png')
      .setSubtitle('Find your contentment');

  var inboxCount = getInboxCount();
  var releases = getReleaseCount(userProperties);

  var impulseControlDisabled = CardService.newDecoratedText()
  .setTopLabel("Impulse Control")
  .setText("Impulse Control cannot be disabled if Inbox Zero is required and your inbox is not empty, " +
  "nor if you have already reached your allowed number of email releases for the day.")
  .setWrapText(true);

  var impulseControlSetting = CardService.newDecoratedText()
  .setTopLabel("Impulse Control")
  .setText("If enabled, Require Inbox Zero cannot be disabled when inbox is not empty, and number of releases cannot be changed if daily limit has already been reached")
  .setWrapText(true)
  .setSwitchControl(CardService.newSwitch()
      .setFieldName("impulseControls")
      .setValue('1')
      .setSelected(impulseSelected)
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("enableimpulseControls")));

  var inboxZeroDisabled  = CardService.newDecoratedText()
  .setTopLabel("Require Inbox Zero")
  .setText("Require Inbox Zero cannot be disabled when Impulse Control is enabled and inbox is not empty")
  .setWrapText(true);

  var inboxZeroSetting  = CardService.newDecoratedText()
  .setTopLabel("Require Inbox Zero")
  .setText("Will not release email unless inbox is empty, regardless of other settings")
  .setWrapText(true)
  .setSwitchControl(CardService.newSwitch()
      .setFieldName("inboxZero")
      .setValue("1")
      .setSelected(inboxSelected)
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("enableInboxZero")));

  var selected = [false, false, false, false, false, false, false, false, false];

  selected[allowedReleases] = true;

  var releasesDisabled  = CardService.newDecoratedText()
  .setTopLabel("Number of email releases allowed per day")
  .setText("The number of email releases cannot be changed when Impulse Control is enabled and the number allowed releases have already been used for the day")
  .setWrapText(true);

  var releasesSetting = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Number of email releases allowed per day")
    .setOnChangeAction(CardService.newAction()
          .setFunctionName("updateAllowedReleases"))
    .setFieldName("allowedReleases")
    .addItem("1", "1", selected[1])
    .addItem("2", "2", selected[2])
    .addItem("3", "3", selected[3])
    .addItem("4", "4", selected[4])
    .addItem("5", "5", selected[5])
    .addItem("6", "6", selected[6])
    .addItem("7", "7", selected[7])
    .addItem("8", "8", selected[8]);  

  var impulseControlSection;
  if(impulseControls == 1 && 
    (
      (inboxZero == 1 && inboxCount > 0) || 
      releases >= allowedReleases
    )) {
      impulseControlSection = impulseControlDisabled;
    } else {
      impulseControlSection = impulseControlSetting;
    }

  var inboxZeroSection;
  if(impulseControls == 1 && inboxZero == 1 && inboxCount > 0) {
      inboxZeroSection = inboxZeroDisabled;
    } else {
      inboxZeroSection = inboxZeroSetting;
    }

  var releasesSection;
  if(impulseControls == 1 && releases >= allowedReleases) {
      releasesSection = releasesDisabled;
    } else {
      releasesSection = releasesSetting;
    }

  var section = CardService.newCardSection()
      .addWidget(releasesSection)
      .addWidget(inboxZeroSection)
      .addWidget(impulseControlSection);    

  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);

  return card.build();

}

function enableimpulseControls(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs['impulseControls'];
    var alert;
    var impulseControls;

    if(setting == null) {
      impulseControls = 0;
      alert = "Impulse Control disabled";
    } else {
      impulseControls = 1;
      alert = "Impulse Control enabled";
    }

    userProperties.setProperty('impulseControls', impulseControls);

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

function enableInboxZero(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs['inboxZero'];
    var alert;
    var inboxZero;

    if(setting == null) {
      inboxZero = 0;
      alert = "Inbox Zero requirement disabled";
    } else {
      inboxZero = 1;
      alert = "Inbox Zero requirement enabled";
    }

    userProperties.setProperty('inboxZero', inboxZero);

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

function updateAllowedReleases(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs.allowedReleases[""].stringInputs.value[0];

    var alert = "Allowed releases set to " + setting;

    userProperties.setProperty('allowedReleases', setting);

    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

function pageFAQ() {

  var header = CardService.newCardHeader()
      .setTitle('Frequently Asked Questions')
      .setImageUrl('https://sethleonard.github.io/ce-logo-blue.png')
      .setSubtitle('Learn more about Contented Email');

  var installText = CardService.newTextParagraph()
    .setText(
      "<b>How do I configure my email filter?</b><br>Click the button below for instructions on configuring your email filter and activating Contented Email:"
    );

  var textParagraph = CardService.newTextParagraph()
    .setText(
      "<br><b>Why do I have to set up the email filter? Why can't the app do it?</b><br>There are three reasons: 1) The permissions required to allow an app to manage your filters are extensive, and it may scare off some users to give complete control of their Gmail account to third party app. 2) Re-checking the filter on every use of the app to make sure it wasn't changed by the user would slow the app down. 3) If you ever decide to remove Contented Email from Gmail, there is no way to automatically delete the filter when you do. As such, it is important that you understand how to manage that filter so that you can delete it yourself should you ever want to.<br><br>" +

      "<b>How can I uninstall Contented Email?</b><br>You can uninstall by following these steps:<br>" +
      "1) Remove the filter you created that moves all of your incoming mail to the contentedEmail label.<br>" +
      "2) Move all messages from the contentedEmail label to your inbox, either manually or by releasing them using the app button.<br>" +
      "3) Remove the Contented Email add-on.<br>" +
      "4) Remove the contentedEmail label.<br><br>" +

      "<b>What if I need to access my email from my phone?</b><br>First suggestion? Stop getting email on your phone (uninstall it if you're ready). You're out in the world; stay there and don't get sucked into messages that other people want you to read. If you have to have Gmail on your phone, you can release messages through the official Gmail apps or through the browser-based version of Gmail. However, in those apps, you cannot release email via the inbox, like you do in the desktop version. Instead, you'll need to open a message and scroll to the bottom to find the Contented Email app icon (if you are at Inbox Zero, you'll have to search for a message to open or access one via the labels menu). Click the icon and you'll be able to release your email.<br><br>" +
      
      "<b>Can I release my email through a non-Gmail app (Apple Mail, iPhone Mail App, etc.)?</b><br>No. Contented Email only works with official Gmail apps and websites. You will be unable to release your email if use a different email program.<br><br>" +

      "<b>What if I really need to access my email for a specific message I know is there (verification email, time-sensitive message, etc.)?</b><br>You can always release your email in order to see a time-sensitive email. If you are out of releases, or don't want to \"waste\" one, the easiest thing to do is to search for the message directly. All messages can appear in search results, even if they are in the hidden label. As an example, if you are expecting a verification email from a website, you can search for \"verify\" or \"verification\" to find your message. You can also search by email address or name to find messages from specific people. Note: there are ways to \"cheat\" Contented Email and get your email anyways. If you find yourself doing that a lot, maybe you should just uninstall the app. Otherwise, do your best to embrace the spirit of the app and see what it feels like to not be disrupted or distracted by every incoming email message."
    );

  var installLink = CardService.newAction().setFunctionName('pageInstall');
  var installButton = CardService.newTextButton().setText('How to Create Filter').setOnClickAction(installLink).setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var section = CardService.newCardSection();
  section.addWidget(installText);
  section.addWidget(installButton);
  section.addWidget(textParagraph);

  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);

  return card.build();

}

function pageInstall() {

  var header = CardService.newCardHeader()
      .setTitle('Creating Your Email Filter')
      .setImageUrl('https://sethleonard.github.io/ce-logo-blue.png')
      .setSubtitle('How to hide your email from your inbox');

  var textParagraph = CardService.newTextParagraph()
    .setText(
      "<b>Requirements for using Contented Email:</b><br>" +
      "- Accept that it only works if you exclusively use the official Gmail website or Gmail mobile apps (and the mobile apps require an extra step to release email). It will not work if you use any 3rd party apps or tools and you will not be able to access new email.<br>" +
      "- Accept that you will not be able to receive incoming messages until you release them, and that the app is designed to limit how many times in a day you can release them.<br>" +
      "- Accept that you can potentially run out of email releases in a day, leaving you unable to receive new messages until the next day (see FAQ for possible but not recommended work arounds).<br>" +
      "- Read the FAQ.<br>" +
      "- Use the app at your own risk.<br><br>" +
      "If you agree to all of that, follow the steps below to create your email filter to automatically move all incoming email out of your inbox before you are able to see it.<br><br>" +

      "<b>Creating Your Email Filter</b><br>" +
      "1) Click the gear icon at the top of Gmail, then click 'See all settings'<br>" +
      "2) Click on 'Filters and Blocked Addresses'<br>" +
      "3) Scroll to the bottom of your existing filters and click 'Create a new filter'<br>" +
      "4) Next to 'Doesn't have', enter a long string of random characters (one recommendation is 'contentedEmail123abc456def00000'); this will filter all messages that don't have this string, which should be all messages, as none should contain this string<br>" +
      "5) Click 'Create filter'<br>" +
      "6) Check the box next to 'Skip the inbox (Archive it)<br>" +
      "7) Check the box next to 'Apply the label' and choose 'contentedEmail'<br>" +
      "8) Click the 'Create filter' button<br><br>" +

      "If you have followed all of the above steps, click the button below to start using Contented Email:"
    );

  var activateLink = CardService.newAction().setFunctionName('activateCE');
  var activateButton = CardService.newTextButton().setText('Activate Contented Email').setOnClickAction(activateLink).setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var deactivateLink = CardService.newAction().setFunctionName('deactivateCE');
  var deactivateButton = CardService.newTextButton().setText('Deactivate Contented Email').setOnClickAction(deactivateLink).setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  var section = CardService.newCardSection().addWidget(textParagraph);
  section.addWidget(activateButton);
//  section.addWidget(deactivateButton);

  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);

  return card.build();

}

function activateCE(e) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('isActive', 1);

    return refreshHomepage(e);
}

function deactivateCE(e) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('isActive', 0);

    return refreshHomepage(e);
}

function refreshHomepage(e) {
    var nav = CardService.newNavigation()
    .popToRoot()
    .updateCard(homepage(e));
    
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}

function checkConfig() {
  var userProperties = PropertiesService.getUserProperties();
  var ceLabel = GmailApp.getUserLabelByName("contentedEmail");

  var noLabel;
  var alert;

  try {
    ceLabel.getName();
  } catch(err) {
    noLabel = err;
  } finally {
    if(noLabel != null) {
      ceLabel = Gmail.Users.Labels.create({
        'name':'contentedEmail',
        'labelListVisibility':'labelHide',
        'messageListVisibility':'hide'},
        'me');
      alert = 'contentedEmail label created for storing email outside of inbox.';
    }
  }

  /*
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
  */
  return alert;
}

//    "https://www.googleapis.com/auth/gmail.addons.current.action.compose",
//    "https://www.googleapis.com/auth/gmail.settings.basic",
