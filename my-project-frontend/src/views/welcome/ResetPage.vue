<script setup>
import {ref, reactive, computed} from "vue";
import {EditPen, Lock, Message} from "@element-plus/icons-vue";
import {get} from "@/net";
import {ElMessage} from "element-plus";
/*定义数据*/
const active = ref(0)
const codeTime = ref(0)
const formRef1 = ref()
const form = reactive({
  email:'',
  code:'',
  password:'',
  password_repeat:''
})

//验证重复密码
const validatePasswordRepeat = (rule,value,callback) =>{
  if(value === ''){
    callback(new Error('请再次输入密码'))
  }else if (value !== form.password){
    callback(new Error('两次输入的密码不一致'))
  }else {
    callback()
  }
}

const rule = {
  email:[
    {required:true,message:'请输入邮箱地址',trigger:'blur'},
    {type:'email',message:'请输入合法的邮箱地址',trigger:['blur','change']}
  ],
  code:[
    {required:true,message:'请输入验证码',trigger:'blur'},
  ],
  password:[
    {required:true,message:'请输入密码',trigger:'blur'},
    {min:6,max:20,message:'密码的长度必须在6-16之间',trigger:['blur','change']}
  ],
  password_repeat:[
    {validator: validatePasswordRepeat,trigger:['blur','change']}
  ]
}

/*函数*/
//获取验证码
function askCode(){
  if (determineIfEmailIsCorrect){
    codeTime.value = 60
    get(`/api/auth/ask-code?email=${form.email}&type=reset`,()=>{
      ElMessage.success(`验证码已发送到邮箱：${form.email}，请注意查收`)
      setInterval(()=> codeTime.value--,1000)
    },(message)=>{
      ElMessage.warning(message)
      codeTime.value = 0
    })
  }else {
    ElMessage.warning('请输入正确的邮箱格式')
  }
}
const determineIfEmailIsCorrect = computed(()=>/^[\w.-]+@[\w.-]+\.\w+$/.test(form.email))

//验证验证码是否正确
function verificationCode(){

}
//开始重置密码
function startReset() {
  formRef1.value.validate((valid)=>{
    if (valid && verificationCode){
      active.value++
    }else {
      ElMessage.warning('请完整填写表单内容')
    }
  })

}

</script>

<template>
  <div style="text-align: center">
    <div style="margin-top: 30px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="验证电子邮件"/>
        <el-step title="重新设置密码"/>
      </el-steps>
    </div>
    <div style="margin: 0 20px" v-if="active===0">
      <div style="margin-top: 80px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey;margin-top: 10px">请输入需要重置密码的邮箱地址</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rule" ref="formRef1">
          <el-form-item  prop="email">
            <el-input v-model="form.email" type="email" placeholder="电子邮箱地址">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10" style="width: 100%;">
              <el-col :span="17">
                <el-input v-model="form.code" maxlength="6" type="text" placeholder="请输入验证码">
                  <template #prefix>
                    <el-icon><EditPen /></el-icon>
                  </template>
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-button type="success" :disabled="! determineIfEmailIsCorrect || codeTime" @click="askCode">
                  {{codeTime > 0 ? `请稍后${codeTime}秒`:`获取验证码`}}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 80px">
        <el-button style="width: 270px" type="warning" plain @click="startReset">开始重置密码</el-button>
      </div>
    </div>
    <div style="margin: 0 20px" v-if="active===1">
      <div style="margin-top: 80px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey;margin-top: 10px">请输入新密码</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rule">
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" maxlength="20" placeholder="密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_repeat">
            <el-input v-model="form.password_repeat" type="password" maxlength="20" placeholder="重复密码">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 80px">
        <el-button style="width: 270px" type="danger" plain @click="">立即重置密码</el-button>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>