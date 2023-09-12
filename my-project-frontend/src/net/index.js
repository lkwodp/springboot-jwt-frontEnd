import axios from "axios";
import {ElMessage} from "element-plus";
/*定义数据*/
const authItemName = "access_token"

/*定义函数*/

//默认失败函数
const defaultFailure = (message,code,url) =>{
    console.warn(`请求地址：${url},状态码：${code},错误信息：${message}`)
    ElMessage.warning(message)
}

//默认错误函数
const defaultError = (err) =>{
    console.error(err)
    ElMessage.warning('发送了一些错误，联系管理员')
}
//取出Token函数
function takenAccessToken(){
    //将Token数据取出来
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName)
    //判断是否为null
    if(!str) return null;
    //将String类型的Token数据转为JSON格式
    const authObj = JSON.parse(str)
    //判断Token是否已经过期
    if (authObj.expire <= new Date()){
        deleteAccessToken()
        ElMessage.warning('登录状态已过期，请重新登录')
        return null
    }
    return authObj.token
}
//存入Token函数
function storeAccessToken(token,remember,expire){
    //创建对象实例---JSON格式
    const authObj = {
        //Token数据
        token: token,
        //有效时间
        expire: expire
    }
    //将JSON格式转化为String类型
    const str = JSON.stringify(authObj)
    //判断是否勾选记住我功能
    if (remember){
        //勾选记住我，将Token数据存入localStorage内存中
        localStorage.setItem(authItemName,str)
    }else {
        //没有勾选记住我，将Token数据存入sessionStorage即是Session中，只在当前会话起作用
        sessionStorage.setItem(authItemName,str)
    }
}
//删除Token函数
function deleteAccessToken(){
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}
//获取请求头
function accessHeader(){
    const token = takenAccessToken();

    return token ?{
        'Authorization': `Bearer ${takenAccessToken()}`
    } : {}
}

//封装Post请求函数
function internalPost(url,data,header,success,failure,error=defaultError){
    axios.post(url,data,{
        headers: header
    }).then(({data})=>{
        if(data.code === 200){
            success(data.data)
        }else {
            failure(data.message,data.code,url)
        }
    }).catch(err=>error(err))
}
//封装Get请求函数
function internalGet(url,header,success,failure,error=defaultError){
    axios.get(url,{
        headers: header
    }).then(({data})=>{
        if(data.code === 200){
            success(data.data)
        }else {
            failure(data.message,data.code,url)
        }
    }).catch(err=>error(err))
}
//内部使用的Get函数
function get(url,success,failure=defaultFailure){
    internalGet(url,accessHeader(),success,failure)
}
//post
function post(url,data,success,failure = defaultFailure,error = defaultError){
    internalPost(url,data,accessHeader(),success,failure,error)
}

//封装登录Login函数
function login(username,password,remember,success,failure=defaultFailure){
    internalPost('/api/auth/login',{
        username: username,
        password: password
    },{
        'Content-type': 'application/x-www-form-urlencoded'
    },(data)=>{
        storeAccessToken(data.token,remember,data.expire)
        ElMessage.success(`登录成功，欢迎${data.username}`)
        success(data)
    },failure)
}
//退出登录
function logout(success,failure = defaultFailure){
    get('/api/auth/logout',()=>{
        deleteAccessToken()
        ElMessage.success('退出登录成功，欢迎再次使用')
        success()
    },failure)
}
//判断是否已经登录 true:没有登录 false：已经登录
function unauthorized(){
    return !takenAccessToken();
}

export {login,logout,get,post,unauthorized}