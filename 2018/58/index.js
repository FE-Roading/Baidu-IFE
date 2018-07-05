function inheritPrototype(subType, superType) {
    var prototype = new Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function Restaurant(config) {
    this.cash = config.cash || 0
    this.seats = config.seats || 0
    this.staff = config.staff || []

}

Restaurant.prototype.hire = function (person) {
    this.staff.push(person)
}
Restaurant.prototype.fire = function (person) {
    this.staff.splice(this.staff.indexOf(person), 1)
}

function Person(id, name, salary) {
    this.name = name
    this.salary = salary
    this.id = id
}
Person.prototype.work = function (thing) {
    console.log("dong something")
}

function Cook(name, salary) {
    this.name = name
    this.salary = salary

}
inheritPrototype(Cook, Person)
Cook.prototype.cook = function (dish) {
    console.log("做菜", dish)
}


function Waiter() {

}
inheritPrototype(Waiter, Person)
Waiter.prototype.work = function (thing) {
    if (Object.prototype.toString.call(this) == "[object Array]") {
        console.log("记录顾客的点餐")
    } else {
        console.log("进行上菜")
    }
}

function Customer() {

}
Customer.prototype.order = function (dish) {
    console.log("正在点菜：", dish)

}
Customer.prototype.eat = function (dish) {
    console.log("正在吃菜：", dish)

}

function Dish(name, cost, price) {
    this.name = name
    this.cost = cost
    this.price = price
}



