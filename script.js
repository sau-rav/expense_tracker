var date = new Date();
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var current_month = month[date.getMonth()];
month_element = document.querySelector('.budget__title--month');
month_element.textContent = current_month;

income_list_objects_buttons = [];
expense_list_objects_buttons = [];
// overall budget elements
total_budget_element = document.querySelector('.budget__value');
total_income_element = document.querySelector('.budget__income--value');
total_expense_element = document.querySelector('.budget__expenses--value');
total_expense_percent_element = document.querySelector('.budget__expenses--percentage');
// income list elements
income_list_element = document.querySelector('.income__list');
expense_list_element = document.querySelector('.expenses__list');
input_check_element = document.querySelector('.add__btn');
// item ids
var income_id = 1;
var expense_id = 1;

class InputItem {
    constructor(id) {
        this.id = id;  
        this.type = document.querySelector('.add__type').value;
        this.name = document.querySelector('.add__description').value;
        this.value = document.querySelector('.add__value').value;
    }
    isNull() {
        if(this.name === '') {
            alert('Please input name of expense/income');
            return true;
        }
        else if(this.value === '') {
            alert('Please input value of expense/income');
            return true;
        }
        else if(isNaN(this.value) || parseFloat(this.value) <= 0) {
            alert('Please input a valid natural number in value');
            return true;
        }
        return false;
    }
};

function updateExpenseListPer() {
    var total_income = parseFloat(total_income_element.textContent.split(' ')[1]);
    for(var i = 0; i < expense_list_objects_buttons.length; i++) {
        id_name = expense_list_objects_buttons[i][1];
        if(total_income == 0) document.querySelector(`#${id_name} .item__percentage`).textContent = '0 %';
        else document.querySelector(`#${id_name} .item__percentage`).textContent = (Math.trunc((parseFloat(document.querySelector(`#${id_name} .item__value`).textContent.split(' ')[1]) / total_income) * 100)).toString() + ' %';
    }
};

function updateBudget() {
    new_budget_value = parseFloat(total_income_element.textContent.split(' ')[1]) - parseFloat(total_expense_element.textContent.split(' ')[1]);
    if(new_budget_value >= 0) {
        total_budget_element.textContent = '+ ' + new_budget_value.toString();
    }
    else {
        total_budget_element.textContent = '- ' + Math.abs(new_budget_value).toString();
    }
    new_expense_per = 0, percent_item = 0;
    if(total_income_element.textContent.split(' ')[1] != '0') {
        new_expense_per = Math.trunc((parseFloat(total_expense_element.textContent.split(' ')[1]) / parseFloat(total_income_element.textContent.split(' ')[1])) * 100);
        percent_item = Math.trunc((parseFloat(input_item.value) / parseFloat(total_income_element.textContent.split(' ')[1])) * 100);
        // expense item list needs to be updated
        updateExpenseListPer();
    }
    total_expense_percent_element.textContent = `% ${new_expense_per}`;
};

input_check_element.addEventListener('click', function() {
    if(document.querySelector('.add__type').value === 'inc') {
        input_item = new InputItem(income_id);
        if(!input_item.isNull()){
            // first lets change the value to total budget so as to calculate percentage later
            total_income_element.textContent = '+ ' + (parseFloat(total_income_element.textContent.split(' ')[1]) + parseFloat(input_item.value)).toString();
            updateBudget();

            html = `<div class="item clearfix" id="income-${input_item.id}"> <div class="item__description">${input_item.name}</div> <div class="right clearfix"> <div class="item__value">+ ${input_item.value}</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>`;
            income_list_element.insertAdjacentHTML('beforeend', html);

            close_button = document.querySelector(`#income-${input_item.id} .item__delete--btn`);
            income_list_objects_buttons.push([close_button, `income-${input_item.id}`]);
            income_id += 1;
        }
    }
    else {
        input_item = new InputItem(expense_id);
        if(!input_item.isNull()){
            // first lets change the value to total budget so as to calculate percentage later
            total_expense_element.textContent = '- ' + (parseFloat(total_expense_element.textContent.split(' ')[1]) + parseFloat(input_item.value)).toString();
            updateBudget();

            html = `<div class="item clearfix" id="expense-${input_item.id}"> <div class="item__description">${input_item.name}</div> <div class="right clearfix"> <div class="item__value">- ${input_item.value}</div> <div class="item__percentage">${percent_item} %</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>`;
            expense_list_element.insertAdjacentHTML('beforeend', html);

            close_button = document.querySelector(`#expense-${input_item.id} .item__delete--btn`);
            expense_list_objects_buttons.push([close_button, `expense-${input_item.id}`]);
            expense_id += 1;
        }
    }
    document.querySelector('.add__description').value = '';
    document.querySelector('.add__description').focus();
    document.querySelector('.add__value').value = '';
});

function handleEnter(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        input_check_element.click();
    }
};

function deleteExpenseObject(deletion_id) {
    var amount = parseFloat(document.querySelector(`#${deletion_id} .item__value`).textContent.split(' ')[1]);
    total_expense_element.textContent = '- ' + (parseFloat(total_expense_element.textContent.split(' ')[1]) - amount).toString();
    for(var i = 0; i < expense_list_objects_buttons.length; i++) {
        if(expense_list_objects_buttons[i][1] == deletion_id) {
            expense_list_objects_buttons.splice(i, 1);
            break;
        }
    } 
    updateBudget();
};

function deleteIncomeObject(deletion_id) {
    var amount = parseFloat(document.querySelector(`#${deletion_id} .item__value`).textContent.split(' ')[1]);
    total_income_element.textContent = '+ ' + (parseFloat(total_income_element.textContent.split(' ')[1]) - amount).toString();
    for(var i = 0; i < income_list_objects_buttons.length; i++) {
        if(income_list_objects_buttons[i][1] == deletion_id) {
            income_list_objects_buttons.splice(i, 1);
            break;
        }
    } 
    updateBudget();    
};

document.addEventListener('click', function(event) {
    event = event || window.event;
    if(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode == document.querySelector('.income')) {
        deletion_id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        deleteIncomeObject(deletion_id);
        document.querySelector(`#${deletion_id}`).parentNode.removeChild(document.querySelector(`#${deletion_id}`));
    }
    else if(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode == document.querySelector('.expenses')) {
        deletion_id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        deleteExpenseObject(deletion_id);
        document.querySelector(`#${deletion_id}`).parentNode.removeChild(document.querySelector(`#${deletion_id}`));
    }
});
    