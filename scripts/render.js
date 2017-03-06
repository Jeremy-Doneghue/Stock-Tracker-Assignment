//     _____                                             _       
//    / ____|                                           | |      
//   | |     ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ ___ 
//   | |    / _ \| '_ ` _ \| '_ \ / _ \| '_ \ / _ \ '_ \| __/ __|
//   | |___| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_\__ \
//    \_____\___/|_| |_| |_| .__/ \___/|_| |_|\___|_| |_|\__|___/
//                         | |                                   
//                         |_|                                   

/**
 * Renders a set of child nodes
 * @param {*} parentElement the id of the element that this latches onto, usually a div
 */
function dynamicElement(parentElement) {
    this.id = parentElement;
    this.head = document.getElementById(this.id),
    this.children = [],

    this.addChild = (elem) => {
        this.children.push(elem);
        this.render();
    }

    /**
     * Removes all children from the element
     */
    this.clear = () => {
        this.children = [];
        this.render;
    }

    this.render = () => {
        //Remove children
        while (this.head.firstChild) {
            this.head.removeChild(this.head.firstChild);
        }

        //Add children
        if (this.children.length > 0) {
            for (elem in this.children) {
                this.head.appendChild(this.children[elem]);
            }
        }
    }
}

/**
 * A dumb button
 * @param {*} text the text on the button
 * @param {*} props properties
 */
function Button(text, props) {
    const item = document.createElement("BUTTON");
    const textNode = document.createTextNode(text);
    item.appendChild(textNode);
    return Object.assign(item, props);
}

/**
 * A dumb input
 * @param {*} props properties
 */
function Input(props) {
    const item = document.createElement("INPUT");
    return Object.assign(item, props);
}

/**
 * A stock listing in an <li> element
 * @param {*} props properties
 */
function StockListItem(stock, props) {
    const item = document.createElement("LI");
    const textNode = document.createTextNode(stock.companyname);
    item.appendChild(textNode);
    return Object.assign(item, props);
}

/**
 * Displays the current stock price and its recent change
 * @param {*} stock the stock to display
 * @param {*} props properties
 */
function StockPriceDisplay(stock, props) {
    const container = document.createElement('span');

    const current = document.createElement('span');
    current.appendChild(document.createTextNode(stock.currentprice));
    current.className = 'stock-price-current';

    const change = document.createElement('span');

    if (stock.recentchangedirection == 'Up') {
        change.className = 'stock-change up';
        change.appendChild(document.createTextNode(`+ ${stock.recentchange}`));
    } 
    else {
        change.className = 'stock-change down';
        change.appendChild(document.createTextNode(`- ${stock.recentchange}`));
    }
        
    container.appendChild(current);
    container.appendChild(change);

    return Object.assign(container, props);
}

/**
 * 
 * @param Object user 
 * @param Object props 
 */
function WelcomeMessage(user, props) {
    const elem = document.createElement('span');
    elem.appendChild(document.createTextNode(`Welcome, ${user.name}`));
    return Object.assign(elem, props);
}

/**
 * A generic text element
 * @param {*} text 
 * @param {*} props 
 */
function Text(text, props) {
    const elem = document.createElement('span');
    elem.appendChild(document.createTextNode(text));
    return Object.assign(elem, props);
}


//   __      ___                _____            _             _ _               
//   \ \    / (_)              / ____|          | |           | | |              
//    \ \  / / _  _____      _| |     ___  _ __ | |_ _ __ ___ | | | ___ _ __ ___ 
//     \ \/ / | |/ _ \ \ /\ / / |    / _ \| '_ \| __| '__/ _ \| | |/ _ \ '__/ __|
//      \  /  | |  __/\ V  V /| |___| (_) | | | | |_| | | (_) | | |  __/ |  \__ \
//       \/   |_|\___| \_/\_/  \_____\___/|_| |_|\__|_|  \___/|_|_|\___|_|  |___/
//                                                                               
//**************===============**************\\                

var rvc = new RootViewController();
rvc.addChild(new stockListingsController());  
rvc.addChild(new loginViewController());

//**************===============**************//      
                                                           
/**
 * Triggers rendering for all the children
 */
function RootViewController() {

    this.childViewControllers = [];
    this.addChild = (child) => {
        this.childViewControllers.push(child);
        this.render();
    }

    this.render = () => {
        for (vc of this.childViewControllers) {
            vc.render();
        }
    }
}

function loginViewController() {

    this.element = new dynamicElement('login-form');

    this.render = function() {

        this.element.clear();
        
        // If the user is not logged in
        if (!userLoggedIn()) {

            //Log in message message
            const message = new Text('Please log in', { className: 'welcome-message'});

            //Username field
            const username = new Input({
                type: 'text', 
                placeholder: 'Username', 
                name: 'uname', 
                id: 'user', 
                required: true,
            });

            //Password field
            const password = new Input({
                type: 'password', 
                placeholder: 'Password', 
                name: 'psw', 
                id: 'pass', 
                required: true,
            });

            //Submit button
            const submitButton = new Button('Log in', { type: 'submit', className: 'login-button' });          
            submitButton.addEventListener("click", () => { login() });       

            //Add the components to the dynamic element
            this.element.addChild(message);
            this.element.addChild(username);
            this.element.addChild(password);
            this.element.addChild(submitButton);
        }
        //Display logout button
        else {
            const welcome = new WelcomeMessage(user, { className: 'welcome-message'});

            const logout = new Button('logout', { className: 'logout-button' });
            logout.addEventListener('click', () => { logOut() });  

            this.element.addChild(welcome);
            this.element.addChild(logout);
        }

        this.element.render();
    }
}

/**
 * Display the user's stock listings
 */
function stockListingsController() {

    this.stockList = new dynamicElement('stock-list');

    this.render = function () {

        this.stockList.clear();

        //If the user is logged in
        if (userLoggedIn()) {
            
            // For each of the users favourite stocks
            for (index in user.favStocks) {
                //Create a stockListItem
                //Alternate light and dark background
                const cssClass = (index % 2 == 0) ? 'stock-list-item odd' : 'stock-list-item even';             
                const sli = new StockListItem(user.favStocks[index], { className: cssClass });

                //Show a remove button on hover
                sli.addEventListener('mouseenter', (index) => {
                    //create a button
                    const removeButton = new Button('x', 
                    { 
                        onclick: () => {
                            alert('todo: remove elements');
                        },
                        id: 'rmb',
                    });
                    sli.appendChild(removeButton);
                });

                //remove the button when the mouse leaves
                sli.addEventListener('mouseleave', () => {                    
                    sli.removeChild(document.getElementById('rmb'));
                });
                        
                //Create stock price change indicator
                const changeDisplay = new StockPriceDisplay(user.favStocks[index], { className: 'change-display'});

                //Add the stock price change indicator to the list item 
                sli.appendChild(changeDisplay);                   

                this.stockList.addChild(sli);
            }
        }
        //if not logged in display somehting out
        this.stockList.render();
    }
}




