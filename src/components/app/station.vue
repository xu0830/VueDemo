<template>
    <div class="component-content">
        <Row>
            <Collapse simple v-model="ticketInfoSelect" class="collapse-ticketInfo">
                <Panel hide-arrow name="1" :style="{width: '1200px;'}">
                    <span class="collapse-header-span">
                        订票助手
                        <Icon type="ios-arrow-dropdown" size="18" />
                    </span>
                    <div slot="content" class="collapse-content-div">
                        <Row>
                            <Col span="2">
                                <!--<Button type="primary" @click="loginModalClick">-->
                                    <!--登录12306-->
                                <!--</Button>-->
                            </Col>
                        </Row>

                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">乘车人: </span>
                                <div class="collapse-content-item" v-show="isPassengerSelect">
                                    <Button type="dashed" size="small" @click="loginModalClick">
                                        请选择
                                    </Button>
                                </div>
                                <div class="collapse-content-item" v-show="!isPassengerSelect">
                                    <span class="collapse-content-span">{{currentPassenger.name}}</span>
                                    <Button type="default" size="small" @click="loginModalClick">
                                        重新选择
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span="6">
                                <span class="collapse-content-title">出发车站: </span>
                                <Poptip placement="right" width="500" v-model="citySelectPoptip">
                                    <Button type="dashed" size="small">
                                        请选择
                                    </Button>
                                    <div class="api" slot="content">
                                        <Input placeholder="请输入出发地" style="width:40%"/>
                                        <Button type="info" style="margin-left: 15px;">确定</Button>
                                        <Tabs :animated="false" size="small" @on-click="stationTabClick" style="width: 100%;">
                                            <TabPane label="热门">
                                                <div class="select-station-div">
                                                    <Button type="text" v-for="item in favorite_station"
                                                            @click="citySelectEvent(item)" :key="item.Index">
                                                        {{item.CNName}}
                                                    </Button>
                                                </div>
                                            </TabPane>
                                            <TabPane v-for="item in letterSortStation" :label="item.title">
                                                <div class="letter-station-div" v-for="stations in item.stationClass">
                                                    <span style="color: #e96900; display: inline-block; padding-top: 12px; vertical-align: top;">{{stations.stations.slice((stationsPageIndex-1)*12, 12*stationsPageIndex).length>0 ? stations.title : ''}}</span>
                                                    <div style="width: 95%; display: inline-block;">
                                                        <Button v-for="station in stations.stations.slice((stationsPageIndex-1)*12, 12*stationsPageIndex)" type="text">
                                                            {{station.CNName}}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div style="width: 100%; position: relative;">
                                                    <Page size="small" :total="item.count" :page-size="12" @on-change="stationPageChange"></Page>
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </Poptip>
                            </Col>
                            <Col span="6">
                                <span class="collapse-content-title">到达车站: </span>

                            </Col>
                        </Row>



                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">优先车次: </span>
                                <Button type="dashed" size="small">
                                    请选择
                                </Button>
                            </Col>
                        </Row>

                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">优先席别: </span>
                                <Button type="dashed" size="small">
                                    请选择
                                </Button>
                            </Col>
                        </Row>

                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">备选日期: </span>
                                <Button type="dashed" size="small">
                                    请选择
                                </Button>
                            </Col>
                        </Row>

                        <Row>

                            <Col span="8">
                                <Button type="success">
                                    <Icon type="ios-train" size="20"/>
                                    订票
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
        </Row>

        <!-- 车票查询条件 -->
        <Row class="content-row-header">
            <Col span="6">
                <span class="col-title">出发地</span>
                <AutoComplete
                        v-model="departurePlace.CNName"
                        :data="departurePlaceData"
                        @on-search="departurePlaceSearch"
                        placeholder="请输入出发地" style="width:70%"></AutoComplete>
            </Col>
            <Col span="6">
                <span class="col-title">目的地</span>
                <AutoComplete
                        v-model="destination.CNName"
                        :data="destinationData"
                        @on-search="destinationSearch"
                        placeholder="请输入目的地"
                        style="width:70%"></AutoComplete>
            </Col>
            <Col span="6">
                <span class="col-title">出发日期</span>
                <DatePicker type="date" :options="departureDateOption" placeholder="请选择出发日期"
                            @on-change="departureDateSelect" style="width:70%" :editable="false">
                </DatePicker>
            </Col>
            <Col span="3">
                <Button type="primary" class="row-btn" :loading="ticketLoading" @click="TicketQuery">查询</Button>
            </Col>
        </Row>
        <!-- 车票信息 -->
        <Row class="content-row-table">
            <Table :loading="ticketLoading" :columns="ticketColumn" :data="ticketTableData"
                   :border="false" width="1393"></Table>
            <Page :total="ticketDataCount"  prev-text="上一页" next-text="下一页" @on-change="ticketTablePageChange" />
        </Row>

        <!-- 登录对话框 -->
        <Modal v-model="loginModal"
                title="登录你的12306账户"
                :closable="false"
                >
            <div style="padding: 0 50px;">
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="userName" label="账号">
                        <Input type="text" v-model="formInline.userName" placeholder="请输入你的账号" style="width: 63%;"/>
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </FormItem>
                    <FormItem prop="password" label="密码">
                        <Input type="password" v-model="formInline.password" placeholder="请输入你的账号"
                               style="width: 63%;"/>
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </FormItem>
                    <FormItem prop="picValidate">
                        <Badge v-for="(item, index) in picPointData" :count="index+1"
                               @click.native="pointDataRemove(item)"
                               :style="{position: 'absolute!important', display: 'inline-block', left: item.x + 'px', top: item.y + 'px', zIndex: '3'}"></Badge>
                        <!--<Badge :count="5" type="primary" :style="{position: 'absolute!important',left: '10px;', top: '10px'}"></Badge>-->
                        <img :src="validatePicUrl" @click="picClickEvent">
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" size="large" @click="modalCancel">取消</Button>
                <Button type="primary" size="large" @click="loginEvent">登录</Button>
            </div>
            <Spin size="large" fix v-if="loginLoading"></Spin>
        </Modal>

    </div>
</template>

<script>
    import stations from '../../lib/station.json'
    import favoriteStation from '../../lib/favoritestation.json'
    import ajax from '../../lib/ajax';
    import _ from 'lodash';
    export default {
        name: "station",
        data () {
            let _this = this;
            const validatePic = (rule, value, callback) => {
                if (_this.picPointData.length <= 0) {
                    callback(new Error('请完成图片验证'));
                } else {
                    callback();
                }
            };
            return {
                citySelectPoptip: false,
                loginLoading: false,
                ticketInfoSelect: '0',
                loginModal: false,
                departurePlace: {
                    CNAbbr: '',
                    CNName: '',
                    Code: ''
                },
                departurePlaceData: [],
                destination: {
                    CNAbbr: '',
                    CNName: '',
                    Code: ''
                },
                destinationData: [],
                departureDate: "",
                departureDateOption: {
                    disabledDate (date) {
                        return date
                            && (date.valueOf() < Date.now() - 86400000
                                || date.valueOf() > Date.now() + 29 * 86400000);
                    }
                },
                ticketLoading: false,
                ticketDetailmodal: false,
                validatePicUrl: '',
                //  表头
                ticketColumn:[
                    {
                        title: '车次',
                        key: 'station_train_code',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log("dddd");
                                        }
                                    }
                                }, params.row.station_train_code)
                            ])
                        }
                    },
                    {
                        title: '出发站',
                        key: 'from_station_name',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.from_station_telecode === params.row.start_station_telecode){
                                return h('div', [
                                    h('span', {
                                        style: {
                                            color: '#fff',
                                            background: "rgb(135, 208, 104)",
                                            display: "inline-block",
                                            width: '18px',
                                            height: '18px',
                                            verticalAlign: 'middle',
                                            textAlign: 'center'
                                        }
                                    }, "始" ),
                                    h('span', {
                                    }, params.row.from_station_name)
                                ])
                            }
                            else{
                                return h('div', [
                                    h('span', {
                                        style: {
                                            color: '#fff',
                                            background: "rgb(45, 183, 245)",
                                            display: "inline-block",
                                            width: '18px',
                                            height: '18px',
                                            verticalAlign: 'middle',
                                            textAlign: 'center'
                                        }
                                    }, "过" ),
                                    h('span', {
                                    }, params.row.from_station_name)
                                ])
                            }
                        }
                    },
                    {
                        title: '到达站',
                        key: 'to_station_name',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.to_station_telecode === params.row.end_station_telecode){
                                return h('div', [
                                    h('span', {
                                        style: {
                                            color: '#fff',
                                            background: "rgb(241, 137, 52)",
                                            display: "inline-block",
                                            width: '18px',
                                            height: '18px',
                                            verticalAlign: 'middle',
                                            textAlign: 'center'
                                        }
                                    }, "终" ),
                                    h('span', {
                                    }, params.row.to_station_name)
                                ])
                            }else{
                                return h('div', [
                                    h('span', {
                                        style: {
                                            color: '#fff',
                                            background: "rgb(45, 183, 245)",
                                            display: "inline-block",
                                            width: '18px',
                                            height: '18px',
                                            verticalAlign: 'middle',
                                            textAlign: 'center'
                                        }
                                    }, "过" ),
                                    h('span', {
                                    }, params.row.to_station_name)
                                ])
                            }
                        }
                    },
                    {
                        title: '出发时间',
                        key: 'start_time',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '到达时间',
                        key: 'arrive_time',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '历时',
                        key: 'lishi',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '商务座',
                        key: 'swz_num',
                        width: 75,
                        align: 'center'
                    },
                    {
                        title: '一等座',
                        key: 'zy_num',
                        width: 75,
                        align: 'center'
                    },
                    {
                        title: '二等座',
                        key: 'ze_num',
                        width: 75,
                        align: 'center'
                    },
                    {
                        title: '高级软卧',
                        key: 'gr_num',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '软卧一等座',
                        key: 'rw_num',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '动卧',
                        key: 'srrb_num',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '硬卧二等卧',
                        key: 'yw_num',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '软座',
                        key: 'rz_num',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '硬座',
                        key: 'yz_num',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '无座',
                        key: 'wz_num',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'canWebBuy',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.canWebBuy === 'Y'){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                console.log("预订");
                                                // this.show(params.index)
                                            }
                                        }
                                    }, '预订')
                                ])
                            }
                            else if(params.row.canWebBuy === 'N'){
                                return h('div', [
                                    h('span', {

                                    }, '预订')
                                ])
                            }else if(params.row.canWebBuy === 'IS_TIME_NOT_BUY'){
                                return h('div', [
                                    h('span', {
                                        style:{
                                            textAlign: 'center',
                                            display: 'inline-block'
                                        }
                                    }, '列车运行图调整,暂停发售')
                                ])
                            }
                        }
                    }
                ],
                ticketTablePageIndex: 0,
                stationTabIndex: 0,
                stationsPageIndex: 1,
                orderAutoSubmitForm: {
                    passenger:{
                        name: ''
                    },
                    leftStation: {},
                    ArriveStation:{},
                    stationCode: {},
                    seatType:{},
                    leftDate:{}
                },
                formInline: {
                    userName: '',
                    password: ''
                },
                ruleInline: {
                    userName: [
                        {  required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    picValidate: [
                        { validator: validatePic, trigger: 'blur' }
                    ]
                },
                picPointData:[],
                ticketData: [],
                userToken: '',
                letterSortStation: [],
            }
        },
        computed: {
            ticketTableData(){
                return this.ticketData.slice(this.ticketTablePageIndex*10, 10*this.ticketTablePageIndex+10);
            },
            stationTabData(){


            },
            ticketDataCount(){
                return this.ticketData.length;
            },
            isPassengerSelect(){
                return this.$store.state.home.passenger.name == '';
            },
            favorite_station(){
                return favoriteStation.Stations;
            },
            currentPassenger(){
                return this.$store.state.home.passenger;
            }
        },
        created(){
            console.log(favoriteStation);

            let _this = this;

            let sortStationTitle = ["ABCDE", "FGHIJ", "KLMNO", "PQRST", "UVWXYZ"];

            for(let i=0; i<sortStationTitle.length; i++){
                var obj = {
                    title: sortStationTitle[i],
                    stationClass: [],
                    count: 0
                };
                for(let j=0; j<sortStationTitle[i].length; j++){
                    obj.stationClass.push({
                        title: sortStationTitle[i][j],
                        stations: []
                    });
                }
                this.letterSortStation.push(obj);
            }

            stations.Stations.map(function(item, index){
                var firstChar = item.CNAbbr[0].toUpperCase();

                var sortIndex = -1;
                sortStationTitle.map(function(str, num){
                    if(str.indexOf(firstChar) > -1){
                        sortIndex = num;
                        return false;
                    }
                });
                // console.log(_this.letterSortStation[sortIndex][firstChar]);
                _this.letterSortStation[sortIndex].stationClass.map(function(stationClass){
                    if(stationClass.title === firstChar){
                        stationClass.stations.push(item);
                    }
                });
            });
            _this.letterSortStation.map(function(item){
                item.stationClass.map(function(stationClass){
                    item.count = item.count < stationClass.stations.length ? stationClass.stations.length : item.count;
                });
            });
            console.log(this.letterSortStation);
        },
        methods: {
            departurePlaceSearch (value) {
                let matchArr = [];
                stations.Stations.map(function(item){
                    if(item.CNName.startsWith(value)){
                        matchArr.push(item.CNName);
                    }
                });
                this.departurePlaceData = !value ? [] : matchArr.slice(0, 8);
            },
            destinationSearch (value) {
                let matchArr = [];
                stations.Stations.map(function(item){
                    if(item.CNName.startsWith(value)){
                        matchArr.push(item.CNName);
                    }
                });
                this.destinationData = !value ? [] : matchArr.slice(0, 8);
            },
            departureDateSelect(date){
                this.departureDate = date;
            },
            ticketTablePageChange(page){// 页码
                this.ticketTablePageIndex = page-1;
            },
            stationPageChange(page){// 页码
                this.stationsPageIndex = page;
            },
            TicketQuery(){
                let _this = this;
                stations.Stations.map(function(item){
                    if(item.CNName === _this.departurePlace.CNName){
                        _this.departurePlace = item;
                    }
                    if(item.CNName === _this.destination.CNName){
                        _this.destination = item;
                    }
                });

                if(_this.departurePlace.Code === ""){
                    _this.$Message.config({
                        top: 200
                    });
                    _this.$Message.warning('找不到该出发车站');
                    return;
                }

                if(_this.destination.Code === ""){
                    _this.$Message.config({
                        top: 200
                    });
                    _this.$Message.warning('找不到该目的地车站');
                    return;
                }

                if(_this.departureDate === ""){
                    _this.$Message.config({
                        top: 200
                    });
                    _this.$Message.warning('请选择出发日期');
                    return;
                }
                _this.ticketLoading = true;
                ajax.post('api/Station/ticketQuery', {
                    Train_date: _this.departureDate,
                    from_station_code: _this.departurePlace.Code,
                    to_station_code: _this.destination.Code,
                }).then(function(response){
                     _this.ticketData = response.data.data;
                    _this.ticketLoading = false;
                });
            },
            loginModalClick(){
                let _this = this;
                this.loginModal = true;
                ajax.post('api/Station/getValidateImage', {
                }).then(function(response){
                    _this.validatePicUrl = response.data.data.imgUrl;
                    _this.userToken = response.data.data.token;
                });
            },
            modalCancel(){
                this.loginModal = false;
            },
            loginEvent(name){
                let pointsData = [];
                let _this = this;
                this.picPointData.map(function(item){
                    pointsData.push(item.x);
                    pointsData.push(item.y);
                });
                this.$refs["formInline"].validate((valid) => {
                    if (valid) {
                        if(_this.picPointData.length <= 0){
                            this.$Message.error("请完成图片验证");
                        }else{
                            this.loginLoading = true;
                            ajax.post('api/Station/validateLogin', {
                                UserName: _this.formInline.userName,
                                Password: _this.formInline.password,
                                pointsData: pointsData,
                                token: _this.userToken
                            }).then(function(response){
                                _this.picPointData = [];
                                _this.loginLoading = false;
                                if(response.data.code != 200){
                                    _this.$Message.error({
                                        content: "登录失败！" +　response.data.result,
                                        duration: 3
                                    });
                                    ajax.post('api/Station/getValidateImage', {
                                    }).then(function(response){
                                        _this.validatePicUrl = response.data.data.imgUrl;
                                        _this.userToken = response.data.data.token;
                                    });
                                }else{
                                    _this.loginModal = false;
                                    _this.$store.commit('home/setPassenger', response.data.data);
                                    _this.$Message.success({
                                        content: "登录成功",
                                        duration: 3
                                    });

                                }
                            });

                        }
                    }
                });


            },
            picClickEvent(event){
                console.log("picClick");
                this.picPointData.push({
                    x: event.offsetX,
                    y: event.offsetY
                });
                console.log(this.picPointData);
            },
            pointDataRemove(obj){
                _.remove(this.picPointData, obj);

                //解决lodash.remove非响应式问题
                this.picPointData.sort();
            },
            userDtoBtn(){
                ajax.post('api/Station/GetPassengerDto', {
                }).then(function(response){
                    console.log(response);
                });
            },
            citySelectEvent(item){
                this.citySelectPoptip = false;
                console.log(item);
            },
            stationTabClick(name){
                this.stationsPageIndex = 1;
            }
        }
    }
</script>

<style scoped>
    .component-content{
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    }
    .ivu-row{
        margin: 10px 0;
    }
    .content-row-header{
        min-width: 800px;
        max-width: 800px;
    }


    .ivu-page{
        margin-top: 10px;
    }

    .col-title{
        margin: 10px 10px 10px 0;
    }

    .collapse-ticketInfo{
        cursor: default;
        border: none;
        width: 110px;
    }

    .collapse-header-span{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        background: #f90;
        color: #fff;
        border-radius: 4px;
        border: 1px solid transparent;
    }

    .collapse-content-div{
        width: 1300px;
    }

    .collapse-content-div .collapse-content-title{
        margin-right: 20px;
        display: inline-block;
        width: 80px;
        text-align: right;
    }

    .collapse-content-div .collapse-content-item{
        display: inline-block;

    }

    .collapse-content-div .collapse-content-span{
        /*padding: 1px 7px 2px;*/
        font-size: 12px;
        border-radius: 3px;
        /*margin-right: 10px;*/
    }

    .select-station-div{
        white-space:normal;
        margin-top: 0px;
    }

    .ivu-tabs-bar{
        margin: 0px;
    }

    .select-station-div button{
        margin: 3px 3px;
        width: 60px;
        text-align: left;
    }
    .letter-station-div{
        white-space:normal;
    }

    .letter-station-div button{
        width: 60px;
        margin: 3px 3px;
    }

</style>