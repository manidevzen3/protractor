/*
* Helper file for protractor E2E tests.
* Authored by sakhat on 18April2017
*/

/***** Helper variables section starts *****/
let browserBaseURL = "http://scomwttomvm0120/OperationsManager/";
exports.browserBaseURL = browserBaseURL;

let authenticationURL = "http://scomwttomvm0120/OperationsManager/#/login";
exports.authenticationURL = authenticationURL;

let dashboardCreated = false;
exports.dashboardCreated = dashboardCreated;

let successText = "Success";
exports.successText = successText;

let addWidgetName = "Add Widget";
exports.addWidgetName = addWidgetName;

let scopeName = "Scope";
exports.scopeName = scopeName;

let selectGroupsName = "Select Groups and Objects";
exports.selectGroupsName = selectGroupsName;

let selectCountersName = "Select Counters";
exports.selectCountersName = selectCountersName;

let allWindowsComputerGroupName = "All Windows Computer";
exports.allWindowsComputerGroupName = allWindowsComputerGroupName;

let windowsComputerClassName = "Windows Computer";
exports.windowsComputerClassName = windowsComputerClassName;

let testCounterSearchString = "agent processor utilization";
exports.testCounterSearchString = testCounterSearchString;

let criteriaName = "Criteria";
exports.criteriaName = criteriaName;

let displayName = "Display";
exports.displayName = displayName;

let addGroupName = "Add";
exports.addGroupName = addGroupName;

let completionName = "Completion";
exports.completionName = completionName;

let saveWidgetButtonName = "Save Widget";
exports.saveWidgetButtonName = saveWidgetButtonName;

let expectedConditions = protractor.ExpectedConditions;
exports.expectedConditions = expectedConditions;

let isUserAuthenticated = false;
exports.isUserAuthenticated = isUserAuthenticated;

let isDashboardCreated = false;
exports.isDashboardCreated = isDashboardCreated;

let isAlertWidgetCreated = false;
exports.isAlertWidgetCreated = isAlertWidgetCreated;

let isStateWidgetCreated = false;
exports.isStateWidgetCreated = isStateWidgetCreated;

let dashboardName = "E2E Test Dashboard";
exports.dashboardName = dashboardName;

let dashboardDescription = "E2E Test Dashboard Description";
exports.dashboardDescription = dashboardDescription;

let alertViewDescription = "Displays all active alerts";
exports.alertViewDescription = alertViewDescription;

let alertViewMyWorkspaceTitle = "Active Alerts";
exports.alertViewMyWorkspaceTitle = alertViewMyWorkspaceTitle;

let dashboardId = undefined;
exports.dashboardId = dashboardId;

let username = "smx\\asttest";
exports.username = username;

let password = "Caelum#01";
exports.password = password;

/***** Helper variables section ends *****/


/***** Helper functions section starts *****/

/**
 * Authenticates user and sets the global authentication flag
 */
exports.authenticateUserAndWaitForHomepage = function () {
    // This if set true will load a non angular page
    browser.ignoreSynchronization = true;
    // Navigate to authentication page
    browser.get(authenticationURL);
    browser.sleep(3000);

    /**
     * This is added because browser is redirecting to monitoring page due to cache
     * So if the url is monitoring then we will sigonut and then do the sign in
     */
    browser.driver.getCurrentUrl().then(function (actualUrl) {
        if (authenticationURL != actualUrl) {
            let signOutButton = element(by.id("signOutBtn"));
            // checking if the signout button is displayed
            signOutButton.isDisplayed().then(function (signOutButtonDisplayed) {
                if (signOutButtonDisplayed) {
                    signOutButton.click().then(function () {
                        // rests for 3000 ms
                        browser.sleep(3000);
                        // checking the alternate cred button
                        let allCredButton = element(by.id('altCredentialBtn'));
                        // if button is displayed then clicking it and login the user else directly login the user
                        allCredButton.isDisplayed().then(function (isAllCredButtonDisplayed) {
                            if (isAllCredButtonDisplayed) {
                                allCredButton.click().then(function () {
                                    loginWithCredentials();
                                });
                            } else {
                                loginWithCredentials();
                            }
                        })

                    });
                }
            })
        }

        // Login takes some time, so we wait until it's done.
        // We are waiting for a 2 minutes max
        return browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                // If we login within 120 seconds then we should be routed to /monitoring/
                // and here we set the global variable as well for future tests 
                protractor.helpers.isUserAuthenticated = /monitoring/.test(url);
                return protractor.helpers.isUserAuthenticated;
            });
        }, 120 * 1000);
    });
}

/**
 * This function will enter the credentials and login in the user
 */
loginWithCredentials = function () {
    // clearing and entering user name field
    protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=username]")), protractor.helpers.username);
    // clearing and entering password field
    protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=password]")), protractor.helpers.password);
    // finding login button and firing click event
    element(by.id("loginBtn")).click();
}

/*
* Creates dashboard and verifies
*/
exports.createAndVerifyDashboard = function (managementPack) {
    // Wait for create new dashboard button to load
    let createNewDashboardElement = element(by.id("newDashboardButton"))
    protractor.helpers.waitForElement(createNewDashboardElement, 120 * 1000);

    // Find the create dashboard link
    element(by.id('newDashboardButton')).click().then(function () {
        // Wait for right panel to load
        browser.driver.sleep(3000);
        // Enter name and description
        protractor.helpers.clearAndEnterInput(element(by.id('inputNewDashboardName')), protractor.helpers.dashboardName);
        protractor.helpers.clearAndEnterInput(element(by.id('inputNewDashboardDescription')), protractor.helpers.dashboardDescription);

        if (managementPack) {
            element(by.id('newMPIconId')).click().then(function () {
                protractor.helpers.clearAndEnterInput(element(by.id('newMPName')), managementPack.name);
                protractor.helpers.clearAndEnterInput(element(by.id('inputNewMPVersion')), managementPack.version);

                saveReadyDashboard();
            });
        }
        else {
            saveReadyDashboard();
        }
    });
}


/**
 * Launches and waits for monitoring tree to load
 */
exports.launchAndWaitForMonitoringTree = function () {
    let monitoringViewBottomIcon = element.all(by.css(".bottom-pane-icons.ellipsis")).get(0);
    monitoringViewBottomIcon.click().then(
        function () {
            // Wait for monitoring tree to reload
            let treeNode = element(by.css('span[title="' + dashboardDescription + '"]'));
            protractor.helpers.waitForElement(treeNode, 120 * 1000);
        }
    )
}

/*
* Deletes dashboard and verifies
*/
exports.deleteAndVerifyDashboards = function () {
    // Wait for navigation tree to load the new dashboard
    let currentDashboardElementInTree = $("#" + protractor.helpers.dashboardId);
    protractor.helpers.waitForElement(currentDashboardElementInTree, 120 * 1000);

    let currentDashboardElement = element(by.id(protractor.helpers.dashboardId));
    currentDashboardElement.click().then(function () {
        // Wait for delete dashboard button to load
        let deleteDashboardLinkElement = element(by.id("linkDeleteDashboard"));
        protractor.helpers.waitForElement(deleteDashboardLinkElement, 120 * 1000);

        // Click the delete dashboard button
        deleteDashboardLinkElement.click().then(function () {
            let buttonOverlayPositive = element(by.id('buttonOverlayPositive'));

            buttonOverlayPositive.isPresent().then(function (isElmPresent) {
                if (isElmPresent) {
                    // Click yes in the popup
                    buttonOverlayPositive.click().then(function () {
                        // We wait for upto 2 minutes to allow dashboard to be deleted from tree
                        protractor.helpers.waitForElementToUnloadFromDOM(currentDashboardElementInTree, 120 * 1000);
                    });
                    protractor.helpers.dashboardId = undefined;
                }
            });
        });
    });
}

exports.deleteSingleWidgetAndVerify = function (widgetType) {
    let widgetActionsElement = element(by.css('.fa.fa-ellipsis-h.crown-icons'));
    protractor.helpers.waitForElement(widgetActionsElement, 30 * 1000);
    //Clicks widget action link
    widgetActionsElement.click().then(
        function () {
            let deleteElement = element(by.css('div[title="Delete widget"]'));
            protractor.helpers.waitForElement(deleteElement, 30 * 1000);

            deleteElement.click().then(
                function () {
                    // Click yes in the popup
                    element(by.id('buttonOverlayPositive')).click().then(function () {
                        // We wait for upto 2 minutes to allow widget to be deleted from tree
                        protractor.helpers.waitForElementToUnloadFromDOM(element(by.css(widgetType)), 120 * 1000);
                    });
                }
            )
        }
    );
}

/*
* Waits for a given element to be loaded in DOM and timesout in 'duration' milliseconds
*/
let waitForElement = function (element, duration) {
    browser.wait(protractor.helpers.expectedConditions.presenceOf(element), duration, 'Element ' + element + ' took too long to appear in the DOM')
}
exports.waitForElement = waitForElement;

/**
 * Waits for the element to be visible
 * @param {*} element 
 * @param {*} duration 
 */
let waitForElementVisibility = function (element, duration) {
    browser.wait(protractor.helpers.expectedConditions.visibilityOf(element), duration, 'Element ' + element + ' took too long to appear in the DOM')
}
exports.waitForElementVisibility = waitForElementVisibility;

/*
* Waits for a given element to be unloaded from and timesout in 'duration' milliseconds
*/
let waitForElementToUnloadFromDOM = function (element, duration) {
    browser.wait(protractor.helpers.expectedConditions.invisibilityOf(element), duration, 'Element ' + element + ' did not unload from DOM');
}
exports.waitForElementToUnloadFromDOM = waitForElementToUnloadFromDOM;

/*
* Selects the 'Groups and Objects' using the groupName specified
*/
exports.selectGroup = function (groupName) {
    let groupFilterElement = element.all(by.css('.filter-parent.col-xs-12 > input')).get(0);
    // Focusing on the filter and providing the groupName as search string
    groupFilterElement.sendKeys(groupName).then(function () {
        groupFilterElement.sendKeys(protractor.Key.ENTER).then(function () {
            let searchResults = element(by.css('.col-xs-12.singleAutocompleteRow'));
            // Give upto 1 min for search to return result
            protractor.helpers.waitForElement(searchResults, 60 * 1000);
            // Selecting the group
            searchResults.click();
        });
    });
}

/**
 * Selects the class based on the className specified
 */
exports.selectClass = function (className) {
    let classFilterElement = element.all(by.css('.filter-parent.col-xs-12 > input')).get(1);
    // Focusing on the filter and providing the className as search string
    classFilterElement.sendKeys(className).then(function () {
        classFilterElement.sendKeys(protractor.Key.ENTER).then(function () {
            let searchResults = element.all(by.css('.col-xs-12.singleAutocompleteRow')).get(2);
            // Give upto 1 min for search to return result
            protractor.helpers.waitForElement(searchResults, 60 * 1000);
            // Selecting the class
            searchResults.click();
        });
    });
}

/*
* Selects the counters using the counterName specified as a search string. Quite similar to selectGroup function
*/
exports.selectCounters = function (counterName) {
    element(by.cssContainingText('a', selectCountersName)).click().then(function () {
        let filterElement = element(by.css('.task-section-results-list scom-shared-table div .filter-input'));
        waitForElement(filterElement, 30000);
        filterElement.sendKeys(counterName).then(function () {
            filterElement.sendKeys(protractor.Key.ENTER).then(function () {
                element(by.cssContainingText('.content', counterName)).click().then(function () {
                    element(by.cssContainingText('button', addGroupName)).click();
                });
            });
        });
    });
}

/*
* Selects the widget from the dropdown list during authoring
*/
exports.selectWidget = function (widgetTypeText) {
    let widgetDropdownElement = element(by.css('p-dropdown'));
    protractor.helpers.waitForElement(widgetDropdownElement, 30 * 1000);

    widgetDropdownElement.click().then(function () {
        element(by.cssContainingText('li', widgetTypeText)).click();
    });
}

/**
 * Authors and verifies the creation of a widget
 */
exports.authorAndVerifyWidget = function (dropdownWidgetName, widgetHtmlSelector, createdWidgetName, createdWidgetDescription, groupName, className, script = undefined) {
    let addWidgetElement = element(by.id('linkAddWidget'));
    protractor.helpers.waitForElement(addWidgetElement, 30 * 1000);
    //Clicks add widget button
    addWidgetElement.click().then(
        function () {
            // Selecting the widget from the widgets list
            protractor.helpers.selectWidget(dropdownWidgetName);

            if (groupName) {
                protractor.helpers.selectGroup(groupName);
            }

            if (className) {
                protractor.helpers.selectClass(className);
                protractor.helpers.enterDisplayColumns();
            }

            if (script) {
                // Enter html script
                let textAreaElement = element(by.css(".ui-accordion-content.ui-widget-content > textarea"));
                protractor.helpers.waitForElementVisibility(textAreaElement, 30 * 1000);

                textAreaElement.sendKeys(script);
            }

            protractor.helpers.enterCompletion(createdWidgetName, createdWidgetDescription);
            // We allow upto 2 minutes for the widget to get created
            protractor.helpers.waitForElement(element(by.css(widgetHtmlSelector)), 120000);
        }
    );
}

/**
 * Select all display columns while authoring
 */
exports.enterDisplayColumns = function () {
    element(by.cssContainingText('a', displayName)).click().then(function () {
        browser.sleep(5 * 1000);

        let displayDropdownElement = element(by.css('#pMultiselectDisplay > div'));
        protractor.helpers.waitForElementVisibility(displayDropdownElement, 30 * 1000);

        // Select display
        displayDropdownElement.click().then(function () {
            let selectAllCheckboxElement = element.all(by.css('.ui-chkbox-box.ui-widget.ui-corner-all.ui-state-default')).get(0);
            protractor.helpers.waitForElementVisibility(selectAllCheckboxElement, 30 * 1000);

            selectAllCheckboxElement.click().then(function () {
                // Re-click multiselect to close it
                displayDropdownElement.click().then(function () {
                });
            });
        });
    });
}

/*
* Enters the completion related data like the widgetName and widgetDescription and then saves the widget
*/
exports.enterCompletion = function (widgetName, widgetDescription) {
    // Select completion
    element(by.cssContainingText('a', completionName)).click().then(function () {
        let widgetNameElement = element(by.id('inputWidgetName'));
        let widgetDescriptionElement = element(by.id('inputWidgetDescription'));

        protractor.helpers.waitForElementVisibility(widgetNameElement, 30 * 1000);

        widgetNameElement.sendKeys(widgetName).then(function () {
            widgetDescriptionElement.sendKeys(widgetDescription).then(function () {
                element(by.id('buttonSaveWidget')).click();
            });
        });
    });
}

exports.clearAndEnterInput = function (element, inputString) {
    element.clear().then(function () {
        element.sendKeys(inputString);
    })
}

/***** Helper functions section ends *****/

/***** Private helper function starts *****/
function saveReadyDashboard() {
    // Click save
    element(by.id('buttonSaveDashboard')).click().then(function () {
        // Wait for dashboard to come up and be selected
        let dashboardNameElement = $(".title.dashboard-name.ellipsis.flex-child");
        protractor.helpers.waitForElement(dashboardNameElement, 120 * 1000);

        browser.driver.getCurrentUrl().then(function (url) {
            // Storing the dashboard id for future tests
            let urlParts = url.split("/");
            protractor.helpers.dashboardId = "node_" + urlParts[urlParts.length - 1];
        });
    });
}

/***** Private helper function ends *****/