import core from "mathjs/core";

const math = core.create();

//math.import(require("mathjs/lib"));
math.import(require("mathjs/lib/function/arithmetic/add"));
math.import(require("mathjs/lib/function/arithmetic/subtract"));
math.import(require("mathjs/lib/function/arithmetic/multiply"));
math.import(require("mathjs/lib/function/arithmetic/divide"));
math.import(require("mathjs/lib/function/string/format"));
math.import(require("mathjs/lib/type/chain"));
math.import(require("mathjs/lib/type/bignumber"));
math.import(require("mathjs/lib/function/arithmetic/pow"));
// math.import(
//   require("mathjs/lib/expression/embeddedDocs/function/arithmetic/round")
// );

math.config({ number: "BigNumber" });

// //window.console.log(
//   math
//     .chain(math.bignumber("0.011"))
//     .subtract(math.bignumber("0.0099"))
//     .format({ notation: "fixed" })
//     .done()
// );

export default math;
