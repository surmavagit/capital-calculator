# Capital Calculator
This is a toy project of mine that I started immediately after learning the basics of JavaScript (in the summer of 2022, before I joined GitHub).
The idea was to recreate the economic tables and formula, used by Marx in Capital - that is, to create an interactive version of them, which would enable the user to enter any variables and the program would count the rest based on the input.

## First version: single Capital with 10 variables
[The first version of the calculator](https://github.com/surmavagit/capital-calculator/blob/main/legacy/singleCapitalTenVars.js) dealt with the formula `W = c + v + m`. It describes the total value of a commodity, produced by capitalist enterprise as the sum of constant capital and variable capital, embodied in the commodity, as well as the surplus value, added to it during production (see [the Wikipedia article](https://en.wikipedia.org/wiki/Constant_capital)).

### Maths
Let's take a simple formula: `a + b = c`. Any 2 variables here determine the third one. If we don't know which ones the user wants to specify, then our program will have 2 parts: determining which variables are defined by the user and applying the correct mathematical equation (there are 3 variables, so also 3 options, 3 equations).
Now, let's start making things a bit more interesting. Let's take 2 formulas: `a + b = c` and `a / b = d`. Now we have 4 variables, but any pair determines the rest of the variables, just like in the previous example. Now the user has more options and we have more cases to cover, more mathematical equations to pick from (6 cases and 12 equations, since in each case we have to calculate 2 variables).

In the case that I was working on I had 10 variables, that I wanted to calculate: c + v + m "at the bottom" of the pyramid, k = c + v, n = v + m and W, the sum of c + v + m. That's 6 - and there are also 4 ratios: m' = m / v (rate of surplus value), p' = m / k (rate of profit), k' = c / v (value composition of capital) and n' = c / v + n (value composition of the commodity).

These 10 variables split into 5 groups of 4 (with every variable being a part of 2 groups) - in each group any 2 variables determine the other 2. What's important for the program is that 4 groups out of 5 are absolutely identical from the mathematical point of view: they consist of element 1, element 2, their sum and their ratio. The fifth group consists of 4 ratios and the mathematical relations between them are different.

This division of the variables into groups would later allow me to take one group out and work with it separately.

### Storing data

It was clear from the start that the values of the variables would have to be persistent. I didn't know anything about closures at the time, so instead of creating a function, capable of remembering its own data, I created a data structure (object), that contained the updating functions as methods.

## Second version: Simplification and 


## Third version: Typescript and CLI



