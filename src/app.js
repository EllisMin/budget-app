// Budget Controller
var budgetController = (function() {
  //
})();

// UI Controller
var UIController = (function() {
  var strDom = {
    inputType: ".input-add",
    inputDes: ".input-description",
    inputVal: ".input-value",
    inputBtn: ".btn-add"
  };

  return {
    getInput: function() {
      return {
        // type is either inc or exp
        type: document.querySelector(strDom.inputType).value,
        des: document.querySelector(strDom.inputDes).value,
        val: document.querySelector(strDom.inputVal).value
      };
    },
    // To be used in controller
    getStrDom: function() {
      return strDom;
    }
  };
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
  var DOM = UIController.getStrDom();
  var addItem = function() {
    // get field input data
    var input = UIController.getInput();
    console.log(input);
    console.log(input.type);

    // add item to the budget ctrl
    // add item to UI
    // calc budget
    // display budget on UI
  };

  document.querySelector(DOM.inputBtn).addEventListener("click", addItem);
  addEnterListener();

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
})(budgetController, UIController);
