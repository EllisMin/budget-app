// Budget Controller; keeps track of all of income & expenses
var budgetController = (function() {
  // private data field
  var Expense = function(id, des, val) {
    this.id = id;
    this.des = des;
    this.val = val;
  };
  var Income = function(id, des, val) {
    this.id = id;
    this.des = des;
    this.val = val;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },

    total: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  var calcTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.val;
    });
    data.total[type] = sum;
  };

  return {
    // To be used outside the budgetController or to public
    addItem: function(type, des, val) {
      var newItem, id;
      // Created new id
      if (data.allItems[type].length === 0) {
        id = 0;
      } else {
        id = data.allItems[type].length;
      }

      // Create new item based on type
      if (type === "inc") {
        newItem = new Income(id, des, val);
      } else if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else {
        throw new Error("input type has to be either inc or exp");
      }
      // push into data structure
      data.allItems[type].push(newItem);

      return newItem;
    },

    calcBudget: function() {
      // calc total inc and exp
      calcTotal("inc");
      calcTotal("exp");
      // calc budget: inc - exp
      data.budget = data.total.inc - data.total.exp;
      // calc percentage of income spent
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        budget: data.budget,
        percentage: data.percentage
      };
    },
    test: function() {
      ///
      console.log(data); ///
    }
  };
})();

// UI Controller
var UIController = (function() {
  var strDOM = {
    inputType: ".input-add",
    inputDes: ".input-description",
    inputVal: ".input-value",
    inputBtn: ".btn-add",
    incContainer: ".income-list",
    expContainer: ".expenses-list",
    budgetLabel: ".balance",
    incomeLabel: ".income-val",
    expenseLabel: ".expenses-val",
    incomePercentage: ".income-percentage",
    expensePercentage: ".expenses-percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(strDOM.inputType).value, // type is either inc or exp
        des: document.querySelector(strDOM.inputDes).value,
        val: parseFloat(document.querySelector(strDOM.inputVal).value) // convert to num
      };
    },
    // Add JS data to HTML item
    addToList: function(obj, type) {
      var html, newHtml, container;

      // create HTML string
      if (type === "inc") {
        container = strDOM.incContainer;
        html = `<div class="item entry-appear" id="income-0">
            <div class="item-description">
            %des%
          </div>
          <div class="item-right">
            <div class="item-value">+ %val%</div>
            <div class="item-delete">
              <button class="btn btn-delete fa-xs">
                <i class="far fa-times-circle fa-lg"></i>
              </button>
            </div>
          </div>
        </div>`;
      } else if (type === "exp") {
        container = strDOM.expContainer;
        html = `<div class="item entry-appear" id="expense-%id%">
        <div class="item-description">
          %des%
        </div>
        <div class="item-right">
          <div class="item-value">- %val%</div>
          <div class="item-percentage">11%</div>
          <div class="item-delete">
            <button class="btn btn-delete fa-xs">
              <i class="far fa-times-circle fa-lg"></i>
            </button>
          </div>
        </div>
      </div>`;
      } else {
        throw new Error("type has to be either inc or exp");
      }

      // replace the placeholder text with data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%des%", obj.des);
      newHtml = newHtml.replace("%val%", obj.val);

      // insert html into DOM; use beforeend to be inserted as a child of .income-list/.expenses-list
      document
        .querySelector(container)
        .insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function() {
      // querySelectorAll returns a Node list
      var fields = document.querySelectorAll(
        strDOM.inputDes + ", " + strDOM.inputVal
      );
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(cur, i, arr) {
        // clear field
        cur.value = "";
        // select description field
        fieldsArr[0].focus();
        fieldsArr[0].select();
      });
    },
    displayBudget: function(obj) {
      document.querySelector(strDOM.budgetLabel).innerHTML = obj.budget;
      document.querySelector(strDOM.incomeLabel).innerHTML = obj.totalInc;
      document.querySelector(strDOM.expenseLabel).innerHTML = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(strDOM.expensePercentage).innerHTML =
          obj.percentage + "%";
      } else {
        document.querySelector(strDOM.expensePercentage).innerHTML = "--";
      }
    },
    // To be used in controller
    getStrDom: function() {
      return strDOM;
    }
  };
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
  var strDOM = UIController.getStrDom();
  var setUp = function() {
    document.querySelector(strDOM.inputBtn).addEventListener("click", addItem);
    addKeyListeners();
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    });
  };

  var updateBudget = function() {
    // calc budget
    budgetCtrl.calcBudget();
    // returned budget
    var budget = budgetCtrl.getBudget();
    // display budget on UI
    UICtrl.displayBudget(budget);
  };

  var addItem = function() {
    var input, newItem;
    // get field input data
    var input = UIController.getInput();

    // user input check
    if (input.des !== "" && !isNaN(input.val) && input.val > 0) {
      // add item to the budget ctrl
      var newItem = budgetCtrl.addItem(input.type, input.des, input.val);

      // add item to UI
      UIController.addToList(newItem, input.type);

      // clear field
      UIController.clearFields();

      // calculate and update budget
      updateBudget();
    } else {
      alert("please enter a valid entry");
    }
  };

  function addKeyListeners() {
    var inputDes = document.querySelector(".input-description");
    var inputVal = document.querySelector(".input-value");

    // add item on pressing return key
    inputDes.addEventListener("keyup", function(e) {
      // e.which is for older browsers
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });
    inputVal.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });

    // Toggles between +/- types by pressing ctrl
    document.addEventListener("keyup", function(e) {
      if (e.keyCode === 17 || e.which === 17) {
        var inputType = document.querySelector(strDOM.inputType);
        if (inputType.value === "inc") {
          inputType.selectedIndex = "1";
        } else if (inputType.value === "exp") {
          inputType.selectedIndex = "0";
        } else {
          throw new Error("input type must be either inc or exp");
        }
      }
    });
  }
  return {
    init: function() {
      setUp();
    }
  };
})(budgetController, UIController);

controller.init();
