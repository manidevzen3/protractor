describe("SCOM web console",function(){
    beforeEach(function(){
        browser.get(protractor.helpers.browserBaseURL);
    })
    it('should have a title',function(){
        expect(browser.getTitle()).toEqual("Operations Manager Web Console");
    })
    it('should authenticate', function(){
        browser.get(protractor.helpers.authenticationURL);
        browser.sleep(3000);
        // clearing and entering user name field
        protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=username]")), protractor.helpers.username);
        // clearing and entering password field
        protractor.helpers.clearAndEnterInput(element(by.css("input[formControlName=password]")), protractor.helpers.password);
        // finding login button and firing click event
        element(by.id("loginBtn")).click();
    })
})