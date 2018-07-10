// 餐桌类
class  Desk{
    constructor(seats=1){
        this.seats=seats
        this.id=++Desk.id  //餐桌的出厂编码
        this.state=false
        this.cus-null  //当前使用的用户
    }
}
Desk.id=0

//厨师，服务员基类
class Person{
    constructor(role,name,salary){
        this.role=role
        this.name = name
        this.salary = salary
        this.id = ++Person.id
    }
    work(thing){
        console.log("doing something!")
    }
}
Person.id=0
//厨师类
class Cook extends Person{
    constructor(name,salary){
        super("cook",name,salary)
        this.state=false  //表示当前是否繁忙
        this.cooking=null  //放置当前正在做的菜
    }
}
//服务员类
class Waiter extends Person{
    constructor(name,salary){
        super("waiter",name,salary)
        this.state=false  //表示当前是否繁忙
        this.cooking=null  //放置当前正在做的菜
    }
}
// 顾客类
class Customer{
    constructor(){
        this.id=++Customer.id
        this.name=genName()
        this.status=0   //用于表示顾客当前的状态，0为排队，1为等待点餐，2为等待上菜，3为正在吃饭，4为待付款，5为完成交易
    }

}
Customer.id=0
//餐厅类，单例模式
class Restaurant{
    constructor(config){
        if(Restaurant.instance){
            return Restaurant.instance
        }
        this.cash = config.cash || 10000;
        //餐厅绝大部分的属性采用对象存储，以id为索引来提高索引效率
        this.desks = config.desks ||{};
        this.staffs = config.staffs || {};
        this.menu={};
        this.id=++Restaurant.id;
        this.state=false; //是否开门营业
        this.orders={};  //保存最终的成单记录以及
        this.torders={};  //从顾客进店开始，生成临时订单，一旦顾客离开就销毁，如果成交则将该记录移入成单记录中
        this.cusWaitList={}; //顾客排队队列
        this.cookingList={}; //厨师做菜清单，{以时间戳作为唯一ID:{dishID,dishName,state,desks[],orders[]}}

        Restaurant.instance=this
    }
    static getInstance(){
        return Restaurant.instance?Restaurant.instance:new Restaurant({});
    }
    hire(person){
        let rtnMsg={
            code:0,
            msg:"雇佣失败，请传入正确的员工信息!"
        }
        if(classconfirm(person,Person)){
            this.staffs[person.id]=person
            rtnMsg.code=1
            rtnMsg.msg=`成功添加一名${person.role}-${person.name}[${person.id}],您现在一共有${this.staffs.length}名员工`
        }
        return rtnMsg
    }
    fire(id,reason="不想说"){
        let rtnMsg={
            code:0,
            msg:`编号为${id}的员工尚未找到，请确认是否填写正确！`
        }
        try{
            for(let index in this.staffs){
                if(this.staffs[index].id===id){
                    let staff=this.staffs[index]
                    //只有在员工处于空闲状态时，才能进行炒鱿鱼
                    if(!staff.state){
                        this.staffs.splice(index, 1)
                        rtnMsg.code=1
                        rtnMsg.msg=`${staff.role}：${staff.name}[${staff.id}]已被成功解雇，解雇原因为：${reason}`
                    }else {
                        rtnMsg.code=0
                        rtnMsg.msg=`${staff.role}：${staff.name}[${staff.id}]正忙于工作，暂不能解雇。[好员工要尽量留存哦]`
                    }
                    break
                }
            }
        } catch (e) {
            rtnMsg.code=-1
            rtnMsg.msg=`出现未知错误，错误原因为：${e}`
        } finally {
            return rtnMsg
        }
    }
    addDesk(desk){
        let rtnMsg={
            code:0,
            msg:"添加餐桌失败，请传入正确的餐桌信息!"
        }
        if(classconfirm(desk,Desk)){
            rtnMsg.code=1
            rtnMsg.msg="成功添加一套餐桌"
            this.desks[desk.id]=desk
        }
        return rtnMsg
    }
}
Restaurant.id=0


// 菜品类
class Dish{
    constructor(name,cost,price,time){
        this.name = name;
        this.cost = cost;
        this.price = price;
        this.time = time;
        this.id=++Dish.id
        this.state=false
    }
}
Dish.id=0

class Order {

    constructor(){
        //定义只是为方便后续生成订单而未传入参数，正常情况下，至少要传入顾客ID
        this.id=++Order.id;
        this.waiter=null;   //cusCom阶段更新
        this.cus=null;    //cusCom阶段之前更新
        this.disks={};   //orderDish阶段更新
        this.price=0;    //orderRelease阶段更新
        this.cost=0;    //orderRelease阶段更新
        this.desk=0    //cusCom阶段之前更新
        this.cook=null;  //
    }
}
Order.id=0

//事件发布、订阅基类，单例模式
class Observer{
    constructor(){
        if(Observer.instance) return Observer.instance
        this.eventList=[]
        Observer.instance=this
        /*
            eventList结构如下：
            {
                id:"用于事件取消",
                type:"订阅的事件类型",
                callback:"回调函数"
            }

        */
    }
    static getInstance(){
        return Observer.instance?Observer.instance:new Observer();
    }

    subscribe(type,callback){
        if(type && typeof callback=="function"){
            var tooken=++Observer.eventID
            this.eventList.push({
                id:tooken,
                type:type,
                callback:callback
            })
            return tooken
        }
        return  "传入相关参数"
    }
    unsubscribe(tooken){
        if(tooken){
            for(var item of this.eventList){
                if(item.id===tooken){
                    this.eventList.splice(index,1)
                    return "删除成功"
                }
            }
            return "未找到相关订阅，请传入正确的订阅tooken！"

        }
        return "请传入参数：订阅的tooken"
    }
    publish(type,args){
        if(type){
            for(var item of this.eventList){
                if(item.type===type){
                    item.callback(args)
                }
            }
        }
    }
    clearAll(){
        this.eventList=[]
    }
}
Observer.eventID=0
Observer.id=0
