

r1 = new RegExp("G[^#]");
let str1 = "G#"
let str2 = "G..."

if (r1.test(str1)) console.log("1");
if (r1.test(str2)) console.log("2");