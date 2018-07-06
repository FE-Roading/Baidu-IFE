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
    info("dong something")
}

function Cook(name, salary) {
    var instance=null
    this.name = name
    this.salary = salary
    this.cooking=true
    this.curdish=null

    instance=this
    Cook=function(){
        return instance
    }


}
inheritPrototype(Cook, Person)
Cook.prototype.cook = function () {
    var temp=cookingList.pop()
    info(this.name+"[厨师]："+temp.name+"正在cooking..., 请稍后!")
    this.cooking=true
    this.curdish=temp
    setTimeout(function(cook){
        cook.cooking=false
    },randomBetween(),this)
}


function Waiter(name,salary) {
    var instance=null
    this.name = name
    this.salary = salary

    instance=this
    Waiter=function(){
        return instance
    }

}
inheritPrototype(Waiter, Person)
Waiter.prototype.work = function (thing) {
    if (Object.prototype.toString.call(thing) == "[object Array]") {
        info(this.name+"[服务员]："+thing[0].cus.name+"的点菜["+thing[0].name+"]")
        cookingList.push(thing[0])
    } else {        
        info(this.name+"[服务员]："+thing.cus.name+"的点菜["+thing.name+"]已做好，正在上菜...")
        thing.cus.eat()
    }
}



function Customer(name) {
    this.name=name
    this.finished=false
}
Customer.prototype.order = function () {
    var dish=randomChoose(menu)
    this.dish=dish    
}
Customer.prototype.eat = function () {
    info("顾客["+this.name+"]：正在用餐["+ this.dish.name+"]")
    setTimeout(function(cus){
        cus.finished=true
    },randomBetween(),this)

}

function Dish(name, cost, price) {
    this.name = name
    this.cost = cost
    this.price = price
}

function randomChoose(list){
    var integer=Math.ceil(Math.random()*(list.length-1))
   return list[integer]
}
function randomBetween(min=1000,max=5000){
    return Math.ceil(Math.random()*(max-min)+min)
}


var menu=[new Dish("笋瓜炒肉片",15,20),new Dish("素炒芹菜",8,12),new Dish("青椒炒鸡蛋",7,10),new Dish("鸡蛋炒毛豆",7,11),new Dish("孜然羊排",68,80),new Dish("玫瑰糯米排骨",30,45),new Dish("粒粒豆豆香",10,15),new Dish("蕃茄鸡蛋炖粉条",15,20),new Dish("烤排骨",25,30),new Dish("腊肉炒香干蒜薹",12,15),new Dish("香辣鸦片鱼",25,30),new Dish("凉拌苦瓜",7,10),new Dish("黄瓜拌花生米",6,10),new Dish("脆拌黄瓜",5,9),new Dish("芝麻酱拌苦瓜",8,12),new Dish("青瓜拌豆干",6,10)]

var cusWaitList=[]
var cookingList=[]


