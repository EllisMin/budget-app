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
    itemPercentage: ".item-percentage",
    dateLabel: ".date-label"
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec;
    num = Math.abs(num); // removes sign
    num = num.toFixed(2); // rounds up to 2 decimal
    // Separate integer & decimal
    numSplit = num.split(".");
    int = numSplit[0];
    dec = numSplit[1];
    if (int.length > 3) {
      // Insert commas
      // 1,234
      // 12,345
      // 123,456
      // 1,234,567
      var leftDig = int % 3;
      var cnt = 0;

      for (var i = int.length - 1; i >= leftDig; i--) {
        cnt++;
        if (cnt % 3 === 0 && i !== 0) {
          int = int.substr(0, i) + "," + int.substr(i, int.length - 1);
        }
      }
    }
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  // returns true when browsed by mobile device
  window.mobileCheck = function() {
    var check = false;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
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
            <div class="item-value">%val%</div>
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
          <div class="item-value">%val%</div>
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
      newHtml = newHtml.replace("%val%", formatNumber(obj.val, type));

      // insert html into DOM; use beforeend to be inserted as a child of .income-list/.expenses-list
      document
        .querySelector(container)
        .insertAdjacentHTML("beforeend", newHtml);
    },

    deleteFromList: function(id) {
      var el = document.getElementById(id);
      if (id.includes("inc")) el.classList.add("entry-disappear-left");
      else el.classList.add("entry-disappear-right");

      setTimeout(function() {
        el.parentNode.removeChild(el);
      }, 300);
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
        if (!window.mobileCheck()) {
          fieldsArr[0].focus();
          fieldsArr[0].select();
        }
      });
    },

    displayBudget: function(obj) {
      var type;
      obj.budget >= 0 ? (type = "inc") : (type = "exp");
      document.querySelector(strDOM.budgetLabel).innerHTML = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(strDOM.incomeLabel).innerHTML = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(strDOM.expenseLabel).innerHTML = formatNumber(
        obj.totalExp,
        "exp"
      );
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
    displayMonth: function() {
      var now = new Date();
      //   var christmas = new Date(2019, 11, 25); // returns date obj of 2019/12/25
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      var year = now.getFullYear();
      var month = months[now.getMonth()];
      document.querySelector(strDOM.dateLabel).innerHTML = month + " " + year;
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
    // Display date
    UIController.displayMonth();
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
    if (id && (id.includes("inc") || id.includes("exp"))) {
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
