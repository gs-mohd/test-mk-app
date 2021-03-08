const ruleProcessor = require('../src/rule-engine/processor');
console.log(
    ruleProcessor({'User.Birthday': '2/17/2021','User.City':'"Dallas"', 'Active':true} )
);

console.log(
    ruleProcessor({'User.Birthday': '3/17/2021','User.City':'"Dallas"', 'Active':true} )
);




