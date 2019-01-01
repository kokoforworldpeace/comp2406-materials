// Here I want to show you how you can create a class and use it in the other js files.
// This structure is similar as creating a class in other languages.
// I basically have a constructor and some functions to make some simple operations.

module.exports = class Cart
{
    constructor(oldCart)//take old state(as session) in
    {
        this.items = oldCart.items || {};//cart item arr
        this.totalQty = oldCart.totalQty || 0;
        this.totalPrice = oldCart.totalPrice || 0;
        this.discountPrice = oldCart.discountPrice || 0;
        this.userId = oldCart.userId || "";
    }

    add(item, id)
    {
        let storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    decreaseQty(id)
    {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price

        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    increaseQty(id)
    {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price

    }

    generateArray()//generate new state of cart
    {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id])
        }
        return arr;
    }
}
