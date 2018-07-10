function orderDish(args) {
    /*
    * {cus:cus.id,waiter:wID,torderID:args}
    * */
    let  thinkTime=30  //点餐倒计时3s(30*100)
    let dom=getDeskDomByID(Restaurant.getInstance().torders[args.torderID].desk)
    let cus=dom.find(".busy")
    new Promise((resolve, reject) => {
        cus.html(thinkTime/10)
        let timer=setInterval(function(){
            thinkTime-=1
            if(thinkTime<=0){
                cus.html("点")
                clearInterval(timer)
                return resolve()   //进行选菜
            }else {
                cus.html(thinkTime/10)
            }
        },100)
    }).then(function () {
        let num=randomNumber(1,5);
        let dishs={};
        let tmp=null;
        let menu=Restaurant.getInstance().menu;
        for(let i=0;i<num;i++){
            tmp=randomChooseFromObject(menu);
            dishs[tmp.id]=tmp;
        }
        renderDishToTable(Restaurant.getInstance().torders[args.torderID].desk,dishs);
        Restaurant.getInstance().torders[args.torderID].dishs=dishs
        cus.html("")
        Observer.getInstance().publish("orderRelease",args.torderID)

    })
}
function Eating(args) {
    // temp={id:temp.dishID,name:temp.dishName,desk:temp.deskID,order:temp.orderID}
    console.log(args)
    //将该菜的上菜进度设置为已上
    let order=Restaurant.getInstance().orders[args.order]
    console.log(order)
    order.dishs[args.id].state=true
    $("#dish-container-"+args.desk+" .dish-"+args.id).addClass("eating")

    let  thinkTime=30  //点餐倒计时3s(30*100)
    let cus=$("#dish-container-"+args.desk+" .dish-"+args.id)
    cus.html(thinkTime/10)
    new Promise(resolve => {
        let timer=setInterval(function(orderID){
            thinkTime-=1
            if(thinkTime<=0){
                cus.removeClass("eating")
                cus.addClass("eated")
                cus.html("")
                clearInterval(timer)
                return resolve(orderID)   //进行选菜
            }else {
                cus.html(thinkTime/10)
            }
        },100,args.order)
    }).then(function (orderID) {
        //检测才是否已经上完
        let dishs=Restaurant.getInstance().orders[orderID].dishs
        let result=true
        for(let dish of Object.values(dishs)){
            if(!dish.state) {
                result=false
                break
            }
        }
        if(result && !Restaurant.getInstance().orders[orderID].state){
            Observer.getInstance().publish("payBill",orderID)
        }
    })
}


function getCus(len=5) {
    for(let i=0;i<len;i++){
        let cus=new Customer()
        Restaurant.getInstance().cusWaitList[cus.id]=cus
    }
}
function getDeskDomByID(deskID){
    let doms=$("#dining-area>li")
    for(let dom of doms){
        if (deskID==parseInt(dom.id.split("-")[1])){
            return $(dom)
        }
    }
}
function getWaitCuNum() {
    let cus=Restaurant.getInstance().cusWaitList
    let tmp=0
    for(let i of Object.values(cus)){
        if(i.status==0) tmp++
    }
    return tmp
}