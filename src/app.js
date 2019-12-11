// Budget Controller; keeps track of all of income & expenses
var budgetController = (function() {
  // private data field
  var Expense = function(id, des, val) {
    this.id = id;
    this.des = des;
    this.val = val;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.val / totalInc) * 100);
    } else {
      this.percentage = -1;
    }
  };
  // Getter
  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
        // id = data.allItems[type][data.allItems[type].length - 1].id + 1;
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

    deleteItem: function(type, id) {
      var ids, index;
      //   map() returns a new array
      ids = data.allItems[type].map(function(cur) {
        return cur.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        // remove 1 item starting from index
        data.allItems[type].splice(index, 1);
      }
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

    calcPercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.total.inc);
      });
    },

    getPercentages: function() {
      var allPercentages = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPercentages;
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
    expensePercentage: ".expenses-percentage",
    panelContainer: "panel",
    itemPercentage: ".item-percentage"
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
        html = `<div class="item entry-appear" id="inc-%id%">
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
        html = `<div class="item entry-appear" id="exp-%id%">
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
    deleteFromList: function(id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
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

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(strDOM.itemPercentage);

      // custom for each
      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(cur, index) {
        if (percentages[index] > 0) {
          cur.innerHTML = percentages[index] + "%";
        } else {
          cur.innerHTML = "--";
        }
      });
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
    document
      .querySelector(strDOM.inputBtn)
      .addEventListener("click", ctrlAddItem);
    addListeners();
    UICtrl.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1
    });
    // listener to delete item
    document
      .getElementById(strDOM.panelContainer)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // calc budget
    budgetCtrl.calcBudget();
    // returned budget
    var budget = budgetCtrl.getBudget();
    // display budget on UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentage = function() {
    // calc percentages
    budgetCtrl.calcPercentages();
    // get percentages
    var percentages = budgetCtrl.getPercentages();
    console.log(percentages); ///

    // update the UI
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
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

      // update percentage of entry
      updatePercentage();
    } else {
      alert("please enter a valid entry");
    }
  };

  var ctrlDeleteItem = function(e) {
    // Useful to target which item we want to handle
    // console.log(e.target);
    // Getting parent node: DOM traversing
    // console.log(e.target.parentNode);

    var id, splitId, type, eachId;
    id = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (id.includes("inc") || id.includes("exp")) {
      splitId = id.split("-");
      type = splitId[0];
      eachId = parseInt(splitId[1]);
      // delete item from data structure
      budgetCtrl.deleteItem(type, eachId);
      // delete item from UI
      UICtrl.deleteFromList(id);
      // update
      updateBudget();
      // update percentage of entry
      updatePercentage();
    }
  };

  function addListeners() {
    var inputDes = document.querySelector(".input-description");
    var inputVal = document.querySelector(".input-value");

    // add item on pressing return key
    inputDes.addEventListener("keyup", function(e) {
      // e.which is for older browsers
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    inputVal.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    var inputType = document.querySelector(strDOM.inputType);

    inputType.addEventListener("change", function() {
      if (inputType.value === "inc") {
        document
          .querySelector(".input-container")
          .classList.remove("chg-focus-color");
      } else if (inputType.value === "exp") {
        document
          .querySelector(".input-container")
          .classList.add("chg-focus-color");
      } else {
        throw new Error("input type must be either inc or exp");
      }
    });

    // Toggles between +/- types by pressing ctrl
    document.addEventListener("keyup", function(e) {
      if (e.keyCode === 17 || e.which === 17) {
        if (inputType.value === "inc") {
          inputType.selectedIndex = "1";
          document
            .querySelector(".input-container")
            .classList.add("chg-focus-color");
        } else if (inputType.value === "exp") {
          inputType.selectedIndex = "0";
          document
            .querySelector(".input-container")
            .classList.remove("chg-focus-color");
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
