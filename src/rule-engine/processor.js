const rules = require("./rules");

/**
 * @description : logicalOperator parser
 * @type {{
 *      parse: (function(*): *),
 *      logical: {OR: string, AND: string, LT: string, GTE: string, LTE: string, "=": string, GT: string}
 *      }}
 */
const logicalOperator = (function() {
    return {
        logical: {
            'AND': '&&',
            'OR': '||',
            '=':'==',
            'GT': '>',
            'LT': '<',
            'GTE': '>=',
            'LTE': '<='
        },
        parse: function (rule) {
            Object.keys(this.logical).forEach(key => {
                rule = rule.split(key).join(this.logical[key]);
            });
            return rule;
        }
    };
})();

/**
 * @description :
 * @type {{
 *      regex: RegExp, getDates: (function(*): (null|*)),
 *      exists: (function(*): boolean),
 *      parse: (function(*=): (*)),
 *      getDateMap: (function(*): {})
 *      }}
 */
const date = (function(){
        return{
            // supports : m-dd-yyyy, mm-dd-yyyy, mm-d-yyyy, m-d-yyyy
            regex : /\d{1}([-/.])\d{2}([-/.])\d{4}|\d{2}([\-/.])\d{2}([-/.])\d{4}|\d{2}([\-/.])\d{1}([-/.])\d{4}|\d{1}([\-/.])\d{1}([-/.])\d{4}/g,

            getDateMap : function(dates){
                let res = {};
                for(let date of dates){
                    res[date] = new Date(date);
                }
                return res;
            },

            exists : function(str){
                return str.match(this.regex) != null;
            },

            getDates: function(str){
                let datesArray = str.match(this.regex);
                if(datesArray == null ) {
                    return null;
                }
                return this.getDateMap(datesArray);
            },

            parse : function (rule){

                let dateMap = this.exists(rule)
                    ? this.getDates(rule)
                    : null ;

                if(dateMap == null){
                    return rule;
                }

                let conditions = rule.split('&&');
                let conditionMap = {};

                for(let condition of conditions){
                    let element = condition.trim().split(' ');
                    if(element.length !== 3 || dateMap[element[0]] == null || dateMap[element[2]] == null ){
                        continue ;
                    }

                    conditionMap[condition] = eval(dateMap[element[0]].getTime()+' '+element[1]+' '+dateMap[element[2]].getTime());
                }

                Object.keys(conditionMap).forEach(key=>{
                    rule = rule.replace(key,conditionMap[key]);
                })
                return rule;
            }
        };
    })();


/**
 * @description :
 * @type {{
 *      item: string,
 *      exists: (function(*): *),
 *      parse: (function(*=): (*))
 *      }}
 */
const betweenOperator = (function(){
    return {
        operatorKey : 'BETWEEN',

        exists: function(rule){
            return rule.includes(this.operatorKey);
        },

        parse : function(rule){
          if(!this.exists(rule)){
              return rule;
          }

          let elements = rule.split(' ');
          let itemIndex = elements.indexOf(this.operatorKey);
          let newRule='';

          if(itemIndex-1>0){
              newRule = elements.slice(0,itemIndex-2).join(' ');
              newRule +=' ';
          }

          newRule += [
              elements[itemIndex-1],'>',elements[itemIndex+1],
              elements[itemIndex+2],
              elements[itemIndex-1],'<',elements[itemIndex+3]
          ].join(' ');

          return newRule;
        }
    }
})();

/**
 * @description :
 * @type {{parse: (function(*, *): *)}}
 */
const variables = (function(){
    return {

        parse: function(obj, rule){
            for(let element of rule.split(' ')){
                if(obj[element] == null){ continue; }
                rule = rule.replace(element,obj[element]);
            }
            return rule;
        }

    };
})();

/**
 * @description :
 * @param obj
 * @param rule
 * @returns {any}
 */
function processor( obj, rule ){
    rule = variables.parse(obj, rule );
    rule = betweenOperator.parse(rule);
    rule = logicalOperator.parse(rule);
    rule = date.parse(rule);
    return eval(rule);
}

module.exports  = function( obj ) {
        let res = [];

        if(obj==null || obj === {}){
            return null;
        }

        for(let rule of rules){
            if(rule.criteria ==='...' || !rule.active || !processor(obj, rule.criteria)){
                continue;
            }
            res.push({
                'Name': rule.Name,
                'Message':rule.Message
            });
        }
        return res;
}




