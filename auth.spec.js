/*
* Contains E2E authoring tests for SCOM HTML Dashboard widgets
* Authored by sakhat on 18April2017
*/

/***** Global variables section starts *****/

let authoringDashboardName = "E2E Authoring Test Dashboard";
let authoringDashboardDescription = "E2E Authoring Test Dashboard Description";
let alertWidgetName = "Alert Widget";
let monitoringWidgetName = "Monitoring Widget";
let powershellWidgetName = "Powershell Widget";
let performanceWidgetName = "Performance Widget";
let createdAlertWidgetName = "E2E Authoring Test Alert Widget";
let createdAlertWidgetDescription = "E2E Authoring Test Alert Widget Description";
let createdMonitoringWidgetName = "E2E Authoring Test Monitoring Widget";
let createdMonitoringWidgetDescription = "E2E Authoring Test Monitoring Widget Description";
let createdPowershellWidgetName = "E2E Authoring Test Powershell Widget";
let createdPowershellWidgetDescription = "E2E Authoring Test Powershell Widget Description";
let createdPerformanceWidgetName = "E2E Authoring Test Performance Widget";
let createdPerformanceWidgetDescription = "E2E Authoring Test Performance Widget Description";

let powershellScript = "$class = Get-SCOMClass -Name Microsoft.Windows.Computer; $computers = Get-SCOMClassInstance -Class $class; $dataObject=$ScriptContext.CreateFromObject($computers,\"Id=Id,HealthState=HealthState,DisplayName=DisplayName\",$null) ;   $dataObject[\"CustomColumn\"]=1 ; $dataObject2=$ScriptContext.CreateFromObject($computers,\"Id=Id,HealthState=HealthState,DisplayName=DisplayName\",$null) ;   $dataObject2[\"CustomColumn\"]=2 ;  $ScriptContext.ReturnCollection.Add($dataObject); $ScriptContext.ReturnCollection.Add($dataObject2);"
let powershellScriptPlaceholder = "Enter powershell script here";

/***** Global variables section ends *****/

/***** Test suite starts *****/

describe('SCOM Web Console', function () {
    /*
    * Before running the tests we load the URL for Web Console
    */
    beforeEach(() => {
        // This if set true will load a non angular page. Since we have monitoring view iframe still in there so this is required
        browser.ignoreSynchronization = true;
        browser.get(protractor.helpers.browserBaseURL);
    });

    /*
    * Test 1: Enter incorrect username and password and validate that we aren't logged in
    * and that error is displayed
    */
    it('negative authentication test', function () {
        return invalidCredentialErrorMessage();
    });

    /*
    * Test 2: Enter username and password and authenticate
    */
    it('positive authentication test', function () {
        return protractor.helpers.authenticateUserAndWaitForHomepage();
    });

    /** 
 * Redirect the page to login page by signing out
 */
    function invalidCredentialErrorMessage() {
        browser.get(protractor.helpers.authenticationURL);
        // Will do nothing for 3 sec
        browser.driver.sleep(3000);

        browser.getCurrentUrl().then(function (actualUrl) {
            if (protractor.helpers.authenticationURL != actualUrl) {
                let signOutButton = element(by.id("signOutBtn"));

                signOutButton.isDisplayed().then(function () {
                    signOutButton.click().then(function () {
                        browser.driver.sleep(3000);
                        let signInButton = element(by.id('altCredentialBtn'));
                        signInButton.isDisplayed().then(function (signInButtonDisplayed) {
                            if (signInButtonDisplayed) {
                                signInButton.click().then(function () {
                                    protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=username]")), protractor.helpers.username);
                                    protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=password]")), protractor.helpers.password + "DummyValue");
                                    element(by.id("loginBtn")).click();
                                    let errorMessageElement = $(".error-msg");
                                    protractor.helpers.waitForElement(errorMessageElement, 120 * 1000);
                                });
                            }
                        });
                    });
                })
            }
        });
    }
});

/***** Test suite ends *****/