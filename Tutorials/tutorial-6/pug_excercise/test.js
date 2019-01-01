// function Car(){
//     let that=this
//     this.set=function(k,v){
//        that[k]=v
//     }
//   }
//  let c = new Car()
//  let f = c.set
//  //f.call(c,'engine','v8')
//  f('engine','v8')
//  console.log(c)

// let x= function(){}
// let y = new x()
// x.prototype.color='red'
// // y.prototype=Object.create(x.prototype)
// console.log(y.__proto__);
// let x
(function(){ 
    setTimeout(() => {
        let x = 100
           
       }, 3000);
    var foo = function() {x *= 2} 
    
    foo()
    console.log(x)
    })()

// var shape = function () {};
// var p = {
//     a: function () {
//         console.log('aaa');
//     }
// };
// shape.prototype.__proto__ = p;

// var circle = new shape();

// console.log(shape.prototype)
// console.log(shape.__proto__)
// console.log(circle.prototype)

