<template>
    <div class="container" @mouseup="sliderUp" @mousemove="sliderMove">
        <div class="form-block">
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
                <FormItem label="滑动验证" style="margin-bottom: 5px;">
                    <picValidation ref="picValidation" :dragDistance="sliderDragDistance"></picValidation>
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
    import picValidation from '../../components/login/picValidation.vue';
    import axios from 'axios';
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
                },
                picBlockShow: false,
                sliderDragDistance: 0,
                sliderFocus: false
            }
        },
        created(){
            // console.log("created");
            // console.log(axios);
            // axios({
            //     method: 'post',
            //     url: 'http://47.107.143.99:8085/Login/GetRsaPublicKey',
            // }).then(function(response){
            //     console.log(response.data);
            // });
            console.log(this.$children);
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
            sliderUp(){
                this.$store.commit('sliderDragable', false);
                this.sliderDragDistance = 0;
                this.sliderFocus = false;
                this.$store.commit('sliderDragDistance', 0);
                this.$refs.picValidation.picDraw();
            },
            sliderMove(event){
                if(this.$store.state.sliderDragable){
                    this.$store.commit('sliderDragDistance', event.pageX);
                    let distance = this.$store.state.sliderDragDistance;
                    this.sliderDragDistance = distance < 0 ? 0 : distance > 208 ?  208 : distance;
                    this.$refs.picValidation.moveJigsaw(distance > 204 - 7 * 1.8 ? 204 - 7 * 1.8 : distance);
                }
            }
        },
        components: {
            picValidation
        }
    }
</script>

<style scoped>
    .container{
        width: 100%;
        height: 100%;
        background: #E9EEF3;
        padding-top: 120px;
        position: relative;
    }

    .form-block{
        width: 380px;
        height: 360px;
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
        margin-top: -190px;
        margin-left: -180px;
        position: absolute;
        top: 50%;
        left: 50%;
    }

    form{
        width: 300px;
        margin: 30px 20px 0 10px;
    }

    .pic-validate-container{
        position: absolute;
        bottom: -32px;
        left: 0px;
        z-index: 999;
    }



</style>

