function cusCome(args){
    //客户进入指定位置的餐桌上时，指出如生成的历史订单ID
    let rst=Restaurant.getInstance()
    let cus=getCusByOrderID(args)
    let deskID=rst.torders[args].desk
    let timer=null //设置顾客上桌后，愿意等待的时间(s)

    $("#desk-"+deskID+">div").first().addClass("busy").attr("title",cus.name)

    //分配服务员
    new Promise((resolve, reject) => {
        getRestPersonIntime(Symbol(),timer,resolve, reject,"waiter")  //在指定时间内找到一个服务员，如果找不到，顾客可以直接走人
    }).then(function (wID) {
        //服务员到该顾客的餐桌位置
        rst.torders[args].waiter=wID
        goToDesk(wID,deskID)
        Observer.getInstance().publish("orderDish",{cus:cus.id,waiter:wID,torderID:args})
    }).catch(reason => {//在指定的时间内未获取到有空的服务员，通知顾客
        console.log("getRestWaiterIntime---出错")
        console.log(reason)
        Observer.getInstance().publish("timeoutBeforeOrder",{timer:timer,subject:cus})
    })
}

function orderRelease(torderID) {
    let costs=getCostCountByID(torderID,"tmp")
    let order=Restaurant.getInstance().torders[torderID]
    order.cost=costs.cost
    order.price=costs.price

    //删除临时清单
    Restaurant.getInstance().orders[Restaurant.getInstance().torders[torderID].id]=Restaurant.getInstance().torders[torderID]
    delete Restaurant.getInstance().torders[torderID]
    Observer.getInstance().publish("cookOrderRelease",torderID)

    //服务员闲置
    let wID=Restaurant.getInstance().orders[torderID].waiter
    waiterRest(wID)
}

function cookFinished(cookItem) {
    //Restaurant.getInstance().cookingList[dIndex])
    /*{id: 16, name: "青瓜拌豆干", state: true, desks: Array(1), orderIDs: Array(1), …}*/
    new Promise((resolve,reject) => {
        setTimeout(function () {
            getRestPersonIntime(Symbol(cookItem),timer=null,resolve,reject,role="waiter")
        },0)
    }).then(function (wID){
        goToKitchen(wID)
        new Promise((resolve,reject) => {
            let i=0;
            for(let dIndex in cookItem.desks){
                (function(i,dishID,dishName,wID,deskID,orderID){
                         let temp={dishID,dishName,wID,deskID,orderID}
                    setTimeout(resolve,i*1000,temp)
                })(i++,cookItem.id,cookItem.name,wID,cookItem.desks[dIndex],cookItem.orderIDs[dIndex])
            }
            setTimeout(function () {
                waiterRest(wID)
            },(i+1)*1000)
        }).then(function (temp) {
            goToDesk(temp.wID,temp.deskID)
            temp={id:temp.dishID,name:temp.dishName,desk:temp.deskID,order:temp.orderID}
            setTimeout(function (temp) {
                Observer.getInstance().publish("Eating",temp)
            },1000,temp)
        })
    })
}

function payBill(orderID) {
    console.log("payBill",orderID)

    let rst=Restaurant.getInstance()
    let ord=Restaurant.getInstance().orders[orderID]
    ord.state=true;
    let desk=ord.desk
    let cus=Restaurant.getInstance().cusWaitList[ord.cus]

    $("#desk-"+desk+">div").removeClass("busy").attr("title","")
    $("#dish-container-"+desk).empty()
    rst.desks[desk].state=false
    $("#payment").append('<li id="cus-'+cus.id+'">'+cus.name+'</li>')
    rst.cash+=ord.price+ord.cost
    setTimeout(function (id) {
        $("#payment #cus-"+id).remove()
    },2000,cus.id)
    $("#company-account").html("餐厅现金："+rst.cash+"元")
    Wellcome()
}



function getCostCountByID(orderID,type="normal") {
    let tmp;
    let cost=0;
    let price=0;
    if(type=="normal"){
        tmp=Restaurant.getInstance().orders[orderID].dishs
    }else{
        tmp=Restaurant.getInstance().torders[orderID].dishs
    }
    for(let dish of Object.values(tmp)){
        cost+=dish.cost
        price+=dish.price
    }
    return {
        cost:cost,
        price:price
    }

}


