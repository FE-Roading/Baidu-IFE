//队列数据随机选择
function randomChooseFromObject(list){
    let int=Math.floor(Math.random()*Object.values(list).length)
    let index=Object.keys(list)[int]
    return list[index]
}
function randomChooseFromArray(list){
    let int=Math.floor(Math.random()*list.length)
    let index=Object.keys(list)[int]
    return list[index]
}
//随机数选择
function randomNumber(min=1000,max=5000){
    return Math.ceil(Math.random()*(max-min)+min)
}
// 对象的原型判断
function classconfirm(obj,base) {
    if(obj && base){
        return obj instanceof base
    }
    return false
}
function genName() {
    let normalXing=["谬", "从", "姜", "庄", "涂", "驹", "晏", "栾", "郸", "仉", "别", "红", "隐", "昔", "云", "盈", "蛮", "郦", "瑞", "任", "洋", "节", "庹", "力", "稽", "窦", "六", "载", "枝", "米", "史", "考", "堂", "萧", "蚁", "段", "百", "屈", "资", "局", "少", "茆", "植", "遇", "苟", "么", "钞", "范", "呼", "匡", "崇", "水", "菅", "龚", "巧", "席", "皇", "用", "凌", "延", "冯", "白", "高", "郯", "登", "闭", "芒", "常", "靳", "斯", "宰", "钟", "池", "夏", "顿", "斐", "碧", "库", "达", "奈", "綦", "冀", "诗", "廖", "梁", "楼", "万", "罕", "皇", "顾", "初", "桐", "乌", "裘", "袁", "栋", "旗", "进", "泣", "海"]
    let normalMing=["听筠", "含蕊", "向南", "友易", "涵育", "思淼", "辰锟", "幼安", "恬静", "良骏", "飞兰", "淑雅", "忆安", "访梦", "雅楠", "长运", "千风", "寄文", "和韵", "嘉言", "凝蝶", "韵诗", "浩波", "睿范", "晴虹", "宏硕", "妙双", "嘉颖", "雅素", "初柔", "晗昱", "若山", "采绿", "彩萱", "今瑶", "干易槐", "语燕", "浩丽", "沛珊", "叶芳", "鸿福", "嘉祥", "文茵", "笑笑", "莹玉", "尔冬", "典雅", "阳夏", "延妙芙", "宏博", "庆生", "宏深", "夏之", "曦之", "梓倩", "星光", "梓珊", "辰骏", "夜蓉", "恨真", "痴海", "痴瑶", "秋春", "浩初", "涵蕾", "安双", "昆皓", "青烟", "晗蕾", "浩歌", "父思柔", "离英华", "迎海", "天睿", "霞辉", "敏智", "鲁亦玉", "从灵", "语蝶", "维运", "若云", "昊穹", "子晋", "晨涛", "丘敏叡", "碧萱", "欣可", "若兰", "甫冰香", "智志", "寻桃", "绿海", "雅萍韵", "千风", "晴岚", "余妍", "恬默", "冰夏", "雅诗", "丹秋"]
    return randomChooseFromArray(normalXing)+randomChooseFromArray(normalMing)
}