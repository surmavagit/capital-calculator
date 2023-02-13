class ValueGroup {
    constructor() {
        this.data = [60, 30, 90, 50];
        this.order = [2, 1];
        this.groupType = "values";
        this.lables = ["first", "second", "sum", "ratio"];
    }
    input(variable, value) {
        this.reorder(variable);
        this.update(variable, value);
    }
    reorder(x) {
        if (x !== this.order[0]) {
            this.order.unshift(x);
            this.order.pop();
        }
    }
    update(variable, value) {
        this.data[variable] = value;
        const guideArray = [];
        for (let i = 0; i < this.data.length; i++) {
            guideArray.push(true);
        }
        guideArray[this.order[0]] = false;
        guideArray[this.order[1]] = false;
        for (let i = 0; i < this.data.length; i++) {
            if (guideArray[i]) {
                this.calculate(i, guideArray);
            }
        }
    }
    calculate(variable, guide) {
        switch (variable) { //what variable are we calculating
            case 0: // first
              if (guide[1]) { //from sum and ratio
                this.data[variable] = this.data[2] / (1 + 1 / this.data[3]);
              } else if (guide[2]) { //from second and ratio
                this.data[variable] = this.data[1] * this.data[3];
              } else { //from second and sum
                this.data[variable] = this.data[2] - this.data[1];
              };
              break;
            case 1: // second
              if (guide[0]) { //from sum and ratio
                this.data[variable] = this.data[2] / (1 + this.data[3])
              } else if (guide[2]) { //from first and ratio
                this.data[variable] = this.data[0] / this.data[3];
              } else { //from first and sum
                this.data[variable] = this.data[2] - this.data[0];
              };
              break;
            case 2: // sum
              if (guide[0]) { //from second and ratio
                this.data[variable] = this.data[1] * (1 + this.data[3]);
              } else if (guide[1]) { //from first and ratio
                this.data[variable] = this.data[0] * (1 + 1 / this.data[3]);
              } else { //from first and second
                this.data[variable] = this.data[0] + this.data[1];
              };
              break;
            case 3: // ratio
              if (guide[0]) { //from second and sum
                this.data[variable] = this.data[2] / this.data[1] - 1;
              } else if (guide[1]) { //from first and sum
                this.data[variable] = 1 / (this.data[2] / this.data[0] - 1);
              } else { //from first and second
                this.data[variable] = this.data[0] / this.data[1];
              };
              this.data[variable] = Math.floor(this.data[variable]*100)/100;
              break;
          };
    }
};

class Table {
    constructor() {
        this.first = new ValueGroup;
        this.second = new ValueGroup;
        this.sum = new ValueGroup;
        this.order = [0, 1];
        this.reproduction = false;
    }
    input(department, variable, value) {
        this.reorder(department);
        this.update(department, variable, value);
    }
    reorder(x) {
        if (x !== this.order[0]) {
            this.order.unshift(x);
            this.order.pop();
        }
    }
}