function Capital() {
  this.data = [50, 50, 50, 100, 100, 150, 1, 1, 0.5, 0.5]; // c, v, m, k, n, w, c', m', n', p'
  this.order = [[0, 1], [1, 2], [0, 4], [2, 3], [6, 7]];
  //set the first number to 0 for "three more left" or to 3 for "one more left" for testing
};
Capital.prototype = {
  constructor: Capital,
  /*
  There are 5 interlapping groups of variables, each group is defined by 2 equations (one for ratios).
  Each group contains 4 variables, each variable is in 2 groups.
  The information on which variable is in which group is stored
  in both groups and elements properties - sorted by group and variable, respectively.
  Each number reprsents an index in the data array.
  */
  labels: ['c', 'v', 'm', 'k', 'n', 'w', 'c\'', 'm\'', 'n\'', 'p\''],
  groups: [[0, 1, 3, 6], [1, 2, 4, 7], [0, 4, 5, 8], [2, 3, 5, 9], [6, 7, 8, 9]],
  elements: [[0, 2], [0, 1], [1, 3], [0, 3], [1, 2], [2, 3], [0, 4], [1, 4], [2, 4], [3, 4]],

  
  input: function(variable, value) {
    // first, we should find the independent variables in both groups
    //and update the .order array - and those will be the last 2 modified by the user
    console.log('=======================');
    for (const element of this.elements[variable]) {
      if (variable != this.order[element][1]) {
        this.order[element].push(variable);
        this.order[element].shift();
      };
    };
    console.table(this.order);
    /*
    Then we should update the data itself in a separate function
    for the cases when the update is not caused directly by user input.
    e.g. When we deal with multiple interconnected capitals
    the user only changes one, but all the capitals are updated.
    */
    if (this.data[variable] != value) {
      this.update(variable, value);
    };    
  },
  update: function(variable, value) {
    
    // has to be changed to work properly in cases when it is called directly
    //and not through the .input method
    
    this.data[variable] = value; //first, we update the input value
    const activeGroupOne = this.elements[variable][0];
    const activeGroupTwo = this.elements[variable][1];
    const indepVarOne = this.order[activeGroupOne][0];
    const indepVarTwo = this.order[activeGroupTwo][0];
    
    const updatedVariables = [];
    updatedVariables.push(variable);
    updatedVariables.push(indepVarOne);
    updatedVariables.push(indepVarTwo);
    console.log('the input var and 2 independent var-s');
    console.log(updatedVariables);
    
    // now we should find the 4 directly dependent variables
    //(input + 1 indep.var defines 2 directly dependent var-s)
    console.groupCollapsed("Calculation details");
    let indepVar = 0;
    for (const groupIndex of this.elements[variable]) {
      //this.elements[variable] is an array of indices of 2 active groups
      indepVar ++;
	  //indepVar takes the values of 1 or 2 depending on which group are we iterating in. updatedVariables[indepVar] gives us the indepVarOne and Two.
      for (const variableIndex of this.groups[groupIndex]) {
        if (updatedVariables.indexOf(variableIndex) == -1) {
          updatedVariables.push(variableIndex);
          this.calculate(variableIndex, variable, updatedVariables[indepVar]);
        };
      };
    };
    // now we find the last 3 variables
    const lastThreeVars = [];
    let findTheVars = (function () {
      for (let i = 0; i < 10; i++) {
        if (updatedVariables.indexOf(i) == -1) {
          lastThreeVars.push(i);
        };
      };
    })();
    //now we determine if we have to calculate one or three more variables
    let lastVar;
    if (this.comGroup(indepVarOne, indepVarTwo) >= 0) {
      console.log('one more left');
        //then we have only one element to calculate (which one to be determined)
      lastVar = lastThreeVars.find(element => this.groups[this.comGroup(indepVarOne, indepVarTwo)].indexOf(element) == -1);
    } else {
      console.log('three more left');
        //in this case all 3 remaining variables change. we calculate 2 and determine the third one.
      let lastArgs = [];
      let twoVars = [];
      for (const element of this.groups[this.elements[indepVarOne].find(group => group != activeGroupOne)]) {
        if (lastThreeVars.indexOf(element) == -1) {
          lastArgs.push(element);
        } else {
          twoVars.push(element);
        };
      };
      this.calculate(twoVars[0], lastArgs[0], lastArgs[1]);
      this.calculate(twoVars[1], lastArgs[0], lastArgs[1]);
      lastVar = lastThreeVars.find(element => twoVars.indexOf(element) == -1);
    };
    //now calculate the last remaining variable
    const lastArgs = [];
    const lastGroup = this.groups[this.elements[lastVar][0]];
    let findTheArgs = (function() {
      for (const arg of lastGroup) {
        if (arg != lastVar) {
          lastArgs.push(arg);
        };
      };
    })();
    this.calculate(lastVar, lastArgs[0], lastArgs[1]);
    console.groupEnd();
    console.dir(this.data);
  },
  calculate: function(a, b, c) {
    console.log(`${this.labels[a]} from ${this.labels[b]} and ${this.labels[c]}`);
    const activeGroup = this.comGroup(a, b);
    const argArray = [b, c];
    if (activeGroup != 4) { // that is, if we're not calculating ratios from ratios
      const resultArray = ['first', 'second', 'sum', 'ratio'];
      function determineRole(arg1, arg2) { //arg2 is the active group
        if (arg1 >= 6) { // ratios
          return 3;
        } else if (arg1 == 5) { // w is always the sum
          return 2;
        } else if (arg1 == 1) { // v is always the second variable
          return 1;
        } else if (arg1 <= 2) { // c and m are always the first variable
          return 0;
        } else if (arg2 <= 1) { // k and n are the sum in first two groups
          return 2;
        } else { // k and n are the second variable in second two groups
          return 1;
        };
      };
      resultArray.splice(determineRole(a, activeGroup), 1, 'x');
      argArray.forEach(element => {
        resultArray.splice(determineRole(element, activeGroup), 1, this.data[element]);
      });
      //now finally doing the math
      switch (resultArray.indexOf('x')) { //what variable are we calculating
        case 0: // first
          if (typeof resultArray[1] == 'string') { //from sum and ratio
            this.data[a] = resultArray[2] / (1 + 1 / resultArray[3]);
          } else if (typeof resultArray[2] == 'string') { //from second and ratio
            this.data[a] = resultArray[1] * resultArray[3];
          } else { //from second and sum
            this.data[a] = resultArray[2] - resultArray[1];
          };
          break;
        case 1: // second
          if (typeof resultArray[0] == 'string') { //from sum and ratio
            this.data[a] = resultArray[2] / (1 + resultArray[3])
          } else if (typeof resultArray[2] == 'string') { //from first and ratio
            this.data[a] = resultArray[0] / resultArray[3];
          } else { //from first and sum
            this.data[a] = resultArray[2] - resultArray[0];
          };
          break;
        case 2: // sum
          if (typeof resultArray[0] == 'string') { //from second and ratio
            this.data[a] = resultArray[1] * (1 + resultArray[3]);
          } else if (typeof resultArray[1] == 'string') { //from first and ratio
            this.data[a] = resultArray[0] * (1 + 1 / resultArray[3]);
          } else { //from first and second
            this.data[a] = resultArray[0] + resultArray[1];
          };
          break;
        case 3: // ratio
          if (typeof resultArray[0] == 'string') { //from second and sum
            this.data[a] = resultArray[2] / resultArray[1] - 1;
          } else if (typeof resultArray[1] == 'string') { //from first and sum
            this.data[a] = 1 / (resultArray[2] / resultArray[0] - 1);
          } else { //from first and second
            this.data[a] = resultArray[0] / resultArray[1];
          };
          break;
      };
    } else { //if active group == 4
      console.log('calculating ratios!!!');
      //determining roles
      let otherVar;
      let adjVar;
      let oppVar;
      const totalArray = [a, b, c];
      let ourCase;
      //maybe assign them to this.data[n] instead? it will
      //incorrectly assign the old value to the var we're calc-ing
      if (!totalArray.includes(9)) { //no p' among a, b, c
        otherVar = 8;
        adjVar = 6;
        oppVar = 7;
        ourCase = 1; //to determine if we have both n' and p' among abc
      } else if (!totalArray.includes(8)) { //no n' among a, b, c
        otherVar = 9;
        adjVar = 7;
        oppVar = 6;
        ourCase = 1;
      } else if (!totalArray.includes(7)) { //no m' among a, b, c
        otherVar = 6;
        adjVar = 8;
        oppVar = 9;
        ourCase = 2;
      } else if (!totalArray.includes(6)) { //no c' among a, b, c
        otherVar = 7;
        adjVar = 9;
        oppVar = 8;
        ourCase = 2;
      };
      switch (a) {
        case otherVar:
          console.log(`${this.labels[a]} from ${this.labels[adjVar]} and ${this.labels[oppVar]}`);
          if (ourCase == 1) {
            this.data[a] = this.data[adjVar] / (this.data[oppVar] + 1);
          } else {
            this.data[a] = (1 / this.data[oppVar] + 1) / (1 / (this.data[oppVar] * this.data[adjVar]) - 1);
          };
          break;
        case oppVar:
          console.log(`${this.labels[a]} from ${this.labels[adjVar]} and ${this.labels[otherVar]}`);
          if (ourCase == 1) {
            this.data[a] = this.data[adjVar] / this.data[otherVar] - 1;
          } else {
            this.data[a] = (this.data[otherVar] / this.data[adjVar] - 1) / (this.data[otherVar] + 1);
          };
          break;
        case adjVar:
          console.log(`${this.labels[a]} from ${this.labels[otherVar]} and ${this.labels[oppVar]}`);
          if (ourCase == 1) {
            this.data[a] = this.data[otherVar] * (this.data[oppVar] + 1);
          } else {
            this.data[a] = this.data[otherVar] / (this.data[oppVar] * (this.data[otherVar] + 1) + 1);
          };
          break;
      };
            
      /* OUTDATED CODE
      switch (a) { //what variable are we calculating
        case 6: // c'
          if (!argArray.includes(9)) { //from m' and n'
            this.data[a] = resultArray[2] / (1 + 1 / resultArray[3]);
          } else if (!argArray.includes(8)) { //from m' and p'
            this.data[a] = resultArray[1] * resultArray[3];
          } else { //from n' and p'
            this.data[a] = resultArray[2] - resultArray[1];
          };
          break;
        case 7: // m'
          if (!argArray.includes(9)) { //from c' and n'
            this.data[a] = resultArray[2] / (1 + resultArray[3])
          } else if (!argArray.includes(8)) { //from c' and p'
            this.data[a] = resultArray[0] / resultArray[3];
          } else { //from n' and p'
            this.data[a] = resultArray[2] - resultArray[0];
          };
          break;
        case 8: // n'
          if (!argArray.includes(9)) { //from c' and m'
            this.data[a] = this.data[6] / (1 + this.data[7]);
          } else if (!argArray.includes(7)) { //from c' and p'
            this.data[a] = resultArray[0] * (1 + 1 / resultArray[3]);
          } else { //from m' and p'
            this.data[a] = resultArray[0] + resultArray[1];
          };
          break;
        case 9: // p'
          if (!argArray.includes(8)) { //from c' and m'
            this.data[a] = resultArray[2] / resultArray[1] - 1;
          } else if (!argArray.includes(7)) { //from c' and n'
            this.data[a] = 1 / (resultArray[2] / resultArray[0] - 1);
          } else { //from m' and n'
            this.data[a] = resultArray[0] / resultArray[1];
          };
          break;
      };*/
    };
    console.log(`${this.labels[a]} is equal to ${this.data[a]}`);
  },
  comGroup: function(d, e) { //finds the common group of 2 variables
    return this.elements[d].find(group => this.elements[e].indexOf(group) != -1);
  }
};

let capital = new Capital();
capital.input(6, 2);


