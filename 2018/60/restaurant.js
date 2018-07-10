// 开门营业
var timerInterval=[]

function rstOpen() {

    rstInit()
    Restaurant.getInstance().state=true
    renderToDOM()
    Wellcome()

}
// 关门
function rstClose() {
    
}
function rstInit() {

    //人员招聘
    hirePerson(role="waiter")
    hirePerson(role="cook")

    //购置餐桌
    purchaseDesk(1)

    //生成顾客
    getCus(8)

    //生成菜单
    genDisk()

}
function openLoop() {
    let rst=Restaurant.getInstance()
    let msg=""
    if(getCookNum()<1){
        msg="厨师数量不足1，"
    }
    if(getWaiterNum()<1){
        msg+="服务员数量不足1，"
    }
    if(rst.desks.length<1){
        msg+="餐桌数量不足1，"
    }
    if(rst.cash<1000){
        msg+="现金流小于1000，"
    }
    if(!rst.state){
        msg+="餐厅尚未开始营业"
    }
    if(msg!=""){
        clearInterval(rst.timer)
        throw Error(msg)
    }
}
function Wellcome() {
    let rst=Restaurant.getInstance()
    let restDesks=getRestDesks()   //返回的是未占用的餐桌id
    let waitCus=getWaitCus()
    let len=waitCus.length<restDesks.length?waitCus.length:restDesks.length
    if(len>0){
        for(let index=0;index<len;index++){
            //如果传入来的桌号处于繁忙状态，则直接中断本次循环
            let tmp=restDesks[index]
            if(rst.desks[tmp].state) continue;
            tmp=waitCus[index]
            if(rst.cusWaitList[tmp]["status"]!=0) continue
            rst.desks[restDesks[index]].state=true;
            rst.cusWaitList[waitCus[index]].status=1
            cusRemove(waitCus[index])

            let tempOrderID=genOrder({cus:waitCus[index],desk:restDesks[index]})
            Observer.getInstance().publish("cusCome",tempOrderID)
        }
    }
}
function hirePerson(role="waiter") {
    let person=null

    if(role=="cook"){
        person=new Cook(genName(),randomNumber(4000,5000))
    }else if(role=="waiter"){
        person=new Waiter(genName(),randomNumber(2500,3500))
    }
    return Restaurant.getInstance().hire(person)
}
function purchaseDesk(seats=1) {
    let dsk=new Desk(seats)

    Restaurant.getInstance().addDesk(dsk)

}
function getRoleNum(role) {
    let staffs=Restaurant.getInstance().staffs
    let num=0
    for(let staff of Object.values(staffs)){
        if(staff.role==role){
            num++
        }
    }
    return num
}
function getCookNum() {
    return getRoleNum("cook")
}
function getWaiterNum() {
    return getRoleNum("waiter")
}
function getRestDesks() {
    let desks=Restaurant.getInstance().desks
    let restDesks=[]

    for (let desk of Object.values(desks)){
        if(!desk.state){
            restDesks.push(desk.id)
        }
    }
    return restDesks
}
function getRestPersonIntime(uniqueID,timer=null,resolve,reject,role="waiter") {
    timerInterval[uniqueID] = setInterval(function () {
        let staffs = Object.values(Restaurant.getInstance().staffs)
        for (let staff of staffs) {
            if(staff.role==role && !staff.state){
                staff.state=true
                clearInterval(timerInterval[uniqueID])
                timerInterval[uniqueID]=undefined
                return resolve(staff.id)
            }
        }
        timer = timer == null ? null : timer - 1
        if (timer != null && timer < 0) {
            clearInterval(timerInterval[uniqueID])
            timerInterval[uniqueID]=undefined
            reject("在指定的时间内，为获取到有空闲的服务员！")
        }
    }, 1000)
}

function renderToDOM() {
    let rst=Restaurant.getInstance()

    rst.staffs.values
    for(let staff of Object.values(rst.staffs)){
        if(staff.role=="cook"){
            addCookToDom(staff)
        }else {
            addWaiterToDom(staff)
        }
    }
    for(let dsk of Object.values(rst.desks)){
        addDeskToDom(dsk)
    }
    renderCusToDOM(rst.cusWaitList)
}
function  genDisk() {
    let menu=[
        new Dish("笋瓜炒肉片",15,20,randomNumber(1,5)),
        new Dish("素炒芹菜",8,12,randomNumber(1,5)),
        new Dish("青椒炒鸡蛋",7,10,randomNumber(1,5)),
        new Dish("鸡蛋炒毛豆",7,11,randomNumber(1,5)),
        new Dish("孜然羊排",68,80,randomNumber(1,5)),
        new Dish("玫瑰糯米排骨",30,45,randomNumber(1,5)),
        new Dish("粒粒豆豆香",10,15,randomNumber(1,5)),
        new Dish("蕃茄鸡蛋炖粉条",15,20,randomNumber(1,5)),
        new Dish("烤排骨",25,30,randomNumber(1,5)),
        new Dish("腊肉炒香干蒜薹",12,15,randomNumber(1,5)),
        new Dish("香辣鸦片鱼",25,30,randomNumber(1,5)),
        new Dish("凉拌苦瓜",7,10,randomNumber(1,5)),
        new Dish("黄瓜拌花生米",6,10,randomNumber(1,5)),
        new Dish("脆拌黄瓜",5,9,randomNumber(1,5)),
        new Dish("芝麻酱拌苦瓜",8,12,randomNumber(1,5)),
        new Dish("青瓜拌豆干",6,10,randomNumber(1,5))
    ]
    let rst=Restaurant.getInstance()
    menu.forEach(function (item) {
        rst.menu[item.id]=item
    })
}
function genOrder(args,type="temp") {
    let temp=new Order()
    for(let index in args){
        temp[index]=args[index]
    }
    if(type=="temp"){
        Restaurant.getInstance().torders[temp.id]=temp
    }else {
        Restaurant.getInstance().orders[temp.id]=temp
    }
    return temp.id
}

function getCusByOrderID(id,type="temp") {
    let temp=null
    if(type=="temp"){
        temp=Restaurant.getInstance().torders[id].cus
    }else {
        temp=Restaurant.getInstance().orders[id].cus
    }
    return Restaurant.getInstance().cusWaitList[temp]
}
function getWaitCus() {
    let temp=[]
    for(let cus of Object.values(Restaurant.getInstance().cusWaitList)){
        if(cus.status==0) {
            temp.push(cus.id)
        }
    }
    return temp
}