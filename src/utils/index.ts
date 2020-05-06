export function buildTree(array:any,id:any,parent_id:any) {
    // 创建临时对象
    let temp = {};
    // 创建需要返回的树形对象
    let tree = {};
    // 先遍历数组，将数组的每一项添加到temp对象中
    for(let i in array) {
        // @ts-ignore
        temp[array[i][id]] = array[i];
    }
    // 遍历temp对象，将当前子节点与父节点建立连接
    for(let i in temp) {
        // 判断是否是根节点下的项
        // @ts-ignore
        if(temp[i][parent_id] !== 0) {
            // @ts-ignore
            if(!temp[temp[i][parent_id]].children) {
                // @ts-ignore
                temp[temp[i][parent_id]].children = new Array();
            }
            // @ts-ignore
            temp[temp[i][parent_id]].children.push(temp[i]);
        } else {
            // @ts-ignore
            tree[temp[i][id]] = temp[i];
        }
    }
    return tree;
}



// 将treeObj中的所有对象，放入一个数组中，要求某个对象在另一个对象的children时，其parent_id是对应的另一个对象的id
// 其原理实际上是数据结构中的广度优先遍历

export function tree2Array(treeObj:any, rootid:any) {
    const temp = [];  // 设置临时数组，用来存放队列
    const out = [];    // 设置输出数组，用来存放要输出的一维数组
    temp.push(treeObj);
    // 首先把根元素存放入out中
    let pid = rootid;
    const obj = deepCopy(treeObj);
    obj.pid = pid;
    delete obj['children'];
    out.push(obj)
    // 对树对象进行广度优先的遍历
    while(temp.length > 0) {
        // @ts-ignore
        const first = temp.shift();
        // @ts-ignore
        const children = first.children;
        if(children && children.length > 0) {
            pid = first.id;
            const len = first.children.length;
            for(let i=0;i<len;i++) {
                temp.push(children[i]);
                const obj = deepCopy(children[i]);
                obj.pid = pid;
                delete obj['children'];
                out.push(obj)
            }
        }
    }
    return out
}


// 深拷贝
export function deepCopy(obj:any):any{
    // 深度复制数组
    if(Object.prototype.toString.call(obj) === "[object Array]"){
        const object=[];
        for(let i=0;i<obj.length;i++){
            object.push(deepCopy(obj[i]))
        }
        return object
    }
    // 深度复制对象
    if(Object.prototype.toString.call(obj) === "[object Object]"){
        const object={};
        for(let p in obj){
            // @ts-ignore
            object[p]=obj[p]
        }
        return object
    }
}
