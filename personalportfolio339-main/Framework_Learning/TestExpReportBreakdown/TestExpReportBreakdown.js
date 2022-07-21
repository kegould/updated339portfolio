const { Children } = require("react")

beforeEach(() => {
    cy.intercept('GET','**/understaff/**').as('understaff')
    cy.intercept('GET','https://idptest.aa.com/pf/JWKS').as('SSOReroute')
    cy.intercept('POST','**/exp/expenses/getExpFilterRange?page=0&size=100').as('waitingForFiltering')
    const baseUrl = Cypress.env('baseUrl')
    cy.visit(baseUrl, {timeout:50000})
    cy.wait('@SSOReroute',{timeout:80000})
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    cy.get('div').then(($loggedIn) => {
        if ($loggedIn.hasClass('user_label')){
            
            cy.fixture('data.json').then(usersData =>{
                cy.contains(usersData.displayName)
            })
        }
        else{
            cy.fixture('data.json').then(usersData =>{
                const username = usersData.username
                const password = usersData.password
                cy.login(username, password)
            })
        }
    })
    cy.title().should('eq', 'CrewComp')
    
})

Given('I navigate to Expense Report Dashboard', () => {
    
    cy.contains(' Expense Report ').click({force: true})
    
})

//--------------------------------------------------------------

When ("I open up Expense Breakdown modal for selected Expense from the list",function(){
    //get the values and store them in variables
    //employee ID, position code, sequence number, base.
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').invoke('text').invoke('trim').as('EmpNum')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(5)').invoke('text').invoke('trim').as('Pos')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(6)').invoke('text').invoke('trim').as('SeqNum')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(2)').invoke('text').invoke('trim').as('Base')

    //open the side panel by clicking the same row from the stored variables
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
 
} )

Then("I verify Respective side panel is visible",function(){
    //check that the side panel is visible
    cy.get('[cypresstag*="userAccountCircle"]').should('be.visible')
})

When("I grab one of the expense data from expense table",function(){
    //select data from the expense table and store into variables

    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').invoke('text').invoke('trim').as('EmpNum')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(5)').invoke('text').invoke('trim').as('Pos')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(6)').invoke('text').invoke('trim').as('SeqNum')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(2)').invoke('text').invoke('trim').as('Base')
})

And("I click on that specific expense on expense report to pull up side panel",function(){
    //click the cell in the expense table to open side panel

    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})

})

Then("I validate expense report table data and side panel data are matching",function(){
    //verify side panel data and main expense table data are equal

    cy.get('span[class*="empNumResult"]').invoke('text').invoke('trim').should('eq',this.EmpNum)    
    cy.get('span[cypresstag*="baseResultExpBD"]').invoke('text').invoke('trim').should('eq',this.Base)    
    cy.get('span[class*="posCodeResult"]').invoke('text').invoke('trim').should('eq',this.Pos)    
    cy.contains('h1[class*="slideTitle"]',this.SeqNum)
})

And("grab employee number from Expense Report List",function(){
    //save empnum variable from expense report page
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').invoke('text').invoke('trim').as('EmpNumForFilter')

})

When("I enter an employee number on column filter",function(){
    //filter by employee number and search
    cy.get('input[mainscreenfilter="empNum"]').type(this.EmpNumForFilter,{force:true})
    cy.get('button[class*="searchBtn"]').click({force:true})
})
When("I click on any of the expense on expense report to pull up side panel",function(){
    //click on cell to open side panel and validate side panel opens
    cy.get('tbody > tr:nth-child(2) > td:nth-child(3)').click({force:true})
    cy.contains(' Trip Information ')
    cy.wait(2000)
})
And("click close button to close side panel",function(){
    //click greyed area so side panel disappears
   // cy.get('mat-sidenav-content[class*="background"]').click({force:true})
    cy.get('div[class*="new-expense-report-page-title"]').click({force:true})
    cy.wait(3000)

})
Then("I validate filtered result still remain",function(){
    cy.get('tbody > tr:nth-child(1) > td:nth-child(3)').invoke('text').invoke('trim').should('eq',this.EmpNumForFilter)
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').invoke('text').invoke('trim').should('eq',this.EmpNumForFilter)

})   
And("I grab a POS CODE from the Expense Report",function(){
    cy.get('tbody > tr:nth-child(3) > td:nth-child(5)').invoke('text').invoke('trim').as('PosCodeFilter')
}) 
When("I enter the POS CODE on All filter modal window",function(){
    cy.get('button[btn*=allFilter]').click({force:true})
    cy.wait(2000)
    cy.get('form > div > div > div > div input[placeholder*="Position Code"]').type(this.PosCodeFilter,{force:true})
})
And("I click on Search button in the modal and wait for page to load",()=>{
    cy.get('span[class*=master-search]').click({force:true})
    cy.wait(3000)
})
When("I click on next button",()=>{
    cy.get('button[class*=mat-paginator-navigation-next]').click({force:true})
})
Then("I validate filtered POS CODE is still maintain for the main filter",function(){
    //cy.get('mat-sidenav-content > div:nth-child(2) >div:nth-child(3) > input[placeholder*="Position Code"]').should('have.value',this.PosCodeFilter)
    //.invoke('text').should('eq',this.PosCodeFilter)
    cy.document().then((doc)=>{
        const value = doc.querySelector('mat-sidenav-content>div:nth-child(2)>div:nth-child(3)>input[placeholder*="Position Code"]').value;

        cy.log(value);
        //cy.log(PosCodeFilter);
        expect(value).to.eq(this.PosCodeFilter);

    })
})
And("I search for a Base with lower case",function(){
    //type 'dfw' in main base input and search for it
    cy.get('mat-sidenav-content > div> div>input[placeholder*=Base]').type('dfw',{force:true})
    cy.get('button[class*=searchBtn]').click({force:true})
    cy.wait(2000)
})
Then("I validate Base filtered successfully",()=>{
    //check that all filtered rows have base DFW
    cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').invoke('text').invoke('trim').should('eq','DFW')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(2)').invoke('text').invoke('trim').should('eq','DFW')

})
When("I search for Base with Empty space at the front",()=>{
    //search for a base with empty space at the front and press search
    cy.get('mat-sidenav-content > div> div>input[placeholder*=Base]').type('  DFW  ',{force:true})
    cy.get('button[class*=searchBtn]').click({force:true})
    cy.wait(2000)
})
Then("I validate Base filtered successfully",()=>{
    cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').invoke('text').invoke('trim').should('eq','DFW')
    cy.get('tbody > tr:nth-child(3) > td:nth-child(2)').invoke('text').invoke('trim').should('eq','DFW')
})
//SMOKE TESTS
When("I filter all Stand By expenses",function(){
    //click STB filter in all-filter screen and search
    cy.get('button[btn*=allFilter]').click({force:true})
    cy.wait(2000)
    cy.get('input[id*="STB_false"]').click({force:true})
    cy.get('span[class*="master-search"]').click({force:true})
    cy.wait(20000)
})
Then("I validate Stand By tag exist on Expense Breakdown modal",function(){
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.wait(2000)
    cy.get('div[cypresstag*="Standby"]').should('exist')
})

When("I filter all Reserve expenses",()=>{
    cy.get('button[btn*=allFilter]').click({force:true})
    cy.wait(2000)
    cy.get('input[id*="RSV_false"]').click({force:true})
    cy.get('span[class*="master-search"]').click({force:true})
    cy.wait(20000)
})
Then("I validate Reserve tag exist on Expense Breakdown modal",()=>{
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.wait(2000)
    cy.get('div[cypresstag*="Reserve"]').should('exist')
})
When("I filter all Lineholder expenses",()=>{
  cy.get('button[btn*=allFilter]').click({force:true})
    cy.wait(2000)
    cy.get('input[id*="LH_false"]').click({force:true})
    cy.get('span[class*="master-search"]').click({force:true})
    cy.wait(20000)  
})
Then("I validate Lineholder tag exist on Expense Breakdown modal",()=>{
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.wait(2000)
    cy.get('div[cypresstag*="LineHolder"]').should('exist')
})
When("I filter all Diversion expenses",()=>{
    cy.get('button[btn*=allFilter]').click({force:true})
    cy.wait(2000)
    cy.get('input[id*="DIV_false"]').click({force:true})
    cy.get('span[class*="master-search"]').click({force:true})
    cy.wait(20000)
})
Then("I validate Diversion tag exist on Expense Breakdown modal",()=>{
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.wait(2000)
    cy.get('mat-chip[sidepanelchips*="Diversion"]').should('exist')
})
When("I open up Expense Breakdown modal for selected Expense from the list",()=>{
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.get('Trip Information').should('be.visible')
})
Then("I validate Manual Override button exist and enabled in Expense Breakdown side panel for authorized user",()=>{
    cy.get('button[class*="moButton"]').should('exist')
    cy.get('button[class*="moButton"]').click({force:true})
    cy.get('app-manual-override-dialog').should('be.visible')
})
When("I open up Expense Breakdown modal for selected Expense from the list",()=>{
    cy.get('tbody > tr:nth-child(3) > td:nth-child(3)').click({force:true})
    cy.get('Trip Information').should('be.visible')
})
Then("I validate Reprocess button is visible and enabled in Expense Breakdown side panel for authorized user",()=>{
    cy.get('button[class*="rpeButton"]').should('exist')
    //cy.get('button[class*="rpeButton"]').click({force:true})
})
Then("I validate Equipment type is exist and have one of the following value[787,320,737,777]",()=>{
    cy.get('[cypresstag*="EquipmentTypeHeaderExpBD"]').should('exist')
    cy.get('[cypresstag*="EquipmentTypeResultExpBD"]').invoke('text').should('be.oneOf',['787','320','737','777'])

})