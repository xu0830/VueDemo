<template>
    <div class="container">
        <div class="formBlock">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="60">
                <FormItem label="账户" prop="user">
                    <Input type="text" v-model="formInline.user" placeholder="请输入用户名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem label="滑动验证" >
                    <div class="sliderBlock" @mouseover="sliderOver" @mouseout="sliderOut">
                        <div class="slider">
                            <span></span>
                        </div>
                    </div>
                </FormItem>
                <FormItem style="margin-bottom: 5px;">
                    <Row>
                        <Col span="18">
                            <FormItem>
                                <CheckboxGroup >
                                    <Checkbox label="记住密码"></Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <a href="javascript:void(0)">忘记密码？</a>
                        </Col>
                    </Row>

                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')" long size="large">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: '',
                    rememberMe: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    rememberMe:[]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            sliderOver(){
                console.log("mouse over");
            },
            sliderOut(){
                console.log("mouse out");
            }
        }
    }
</script>

<style scoped>
    .container{
        width: 100%;
        height: 100%;
        background: #E9EEF3;
        padding-top: 120px;
    }
    .formBlock{
        width: 380px;
        height: 360px;
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
        margin: 0 auto ;
        position: relative;
    }
    form{
        width: 300px;
        margin: 30px 20px 0 10px;
    }
    .sliderBlock{
        width: 100%;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #dcdee2;
    }
    .slider{
        width: 32px;
        height: 32px;
        border: 1px solid #dcdee2;
        /*background: #1991fa;*/
        position: relative;
    }
    .slider span{
        width: 16px;
        height: 12px;
        background: url('../../assets/icons.png') 0px -13px no-repeat;
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -6px;
        margin-left: -8px;
    }
    .sliderActive span{
        background: url('../../assets/icons.png') 0px 0px no-repeat;
    }
</style>

