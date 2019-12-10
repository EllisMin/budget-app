// Budget Controller; keeps track of all of income & expenses
var budgetController = (function() {
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
    }
  };

  return {
    // To be used outside the budgetController

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
    expContainer: ".expenses-list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(strDOM.inputType).value, // type is either inc or exp
        des: document.querySelector(strDOM.inputDes).value,
        val: document.querySelector(strDOM.inputVal).value
      };
    },
    // Add data to HTML item
    addToList: function(obj, type) {
      var html, newHtml, container;

      // create HTML string
      if (type === "inc") {
        container = strDOM.incContainer;
        html = `<div class="item" id="income-0">
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
        html = `<div class="item" id="expense-%id%">
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
    // To be used in controller
    getStrDom: function() {
      return strDOM;
    }
  };
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
  var setUp = function() {
    var DOM = UIController.getStrDom();
    document.querySelector(DOM.inputBtn).addEventListener("click", addItem);
    addEnterListener();
  };

  var addItem = function() {
    var input, newItem;
    // get field input data
    var input = UIController.getInput();

    // add item to the budget ctrl
    var newItem = budgetCtrl.addItem(input.type, input.des, input.val);

    // add item to UI
    UIController.addToList(newItem, input.type);
    // calc budget
    // display budget on UI
  };

  function addEnterListener() {
    var inputDes = document.querySelector(".input-description");
    var inputVal = document.querySelector(".input-value");

    inputDes.addEventListener("keypress", function(e) {
      // Enter pressed
      // e.which is for older browsers
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });
    inputVal.addEventListener("keypress", function(e) {
      // Enter pressed
      // e.which is for older browsers
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
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
