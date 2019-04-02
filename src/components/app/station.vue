<template>
    <div class="component-content">
        <Row>
            <Collapse simple accordion v-model="ticketInfoSelect" class="collapse-ticketInfo">
                <Panel hide-arrow name="1" :style="{width: '1200px;'}">
                    <span class="collapse-header-span">
                        订票助手
                        <Icon  v-if="ticketInfoSelect[0] != '1'" type="ios-arrow-dropdown" size="18" />
                        <Icon v-if="ticketInfoSelect[0] == '1'" type="ios-arrow-dropup" size="18" />
                    </span>
                    <div slot="content" class="collapse-content-div">
                        <!-- 乘车人 -->
                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">乘车人: </span>
                                <div class="collapse-content-item">
                                    <span v-if="currentPassenger.name != ''" class="collapse-content-span">
                                        {{currentPassenger.name}}
                                    </span>
                                    <Button type="dashed" size="small" @click="loginModalClick">
                                        {{ currentPassenger.name != ''? "重新选择" : "请选择" }}
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                        <!-- 出发车站 & 到达车站 -->
                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">出发车站: </span>
                                <div class="collapse-content-item">
                                    <span class="collapse-content-span"  v-if="orderAutoSubmitForm.leftStation.CNName != ''">
                                        {{orderAutoSubmitForm.leftStation.CNName}}
                                    </span>
                                    <Poptip placement="right" width="490" v-model="poptipModels.leftStation"
                                            @on-popper-show="orderAutoSubmitForm.ruleInline.leftStationRequireError=false">
                                        <Button type="dashed" size="small">
                                            {{ orderAutoSubmitForm.leftStation.CNName != ''? "重新选择" : "请选择" }}
                                        </Button>
                                        <div class="api select-content-div " slot="content"
                                             :class="{'ivu-form-item-error': orderAutoSubmitForm.leftStationSearch.leftStationInputError}">
                                            <Input placeholder="请输入出发地" style="width:40%;" @on-focus="leftStationInputFocus"
                                                   v-model="orderAutoSubmitForm.leftStationSearch.leftStationInput"/>
                                            <Button type="info" style="margin-left: 15px;" @click="leftStationSearchBtn">
                                                确定
                                            </Button>
                                            <span v-if="orderAutoSubmitForm.leftStationSearch.leftStationInputError"
                                                  style="color: red;">
                                                出发车站不能为空！
                                            </span>
                                            <Tabs v-if="!orderAutoSubmitForm.leftStationSearch.leftStationInput"
                                                  :animated="false" size="small" @on-click="stationTabClick">
                                                <TabPane label="热门">
                                                    <div>
                                                        <Button type="text" size="small" v-for="item in favorite_station"
                                                                @click="stationSelectEvent(item, 1)" :key="item.Index">
                                                            {{item.CNName}}
                                                        </Button>
                                                    </div>
                                                </TabPane>
                                                <TabPane v-for="item in letterSortStation" :label="item.title">
                                                    <div v-for="stations in item.stationClass">
                                                        <span v-if="stations.stations.slice((orderAutoSubmitForm.leftStationPageIndex-1)*12, 12*orderAutoSubmitForm.leftStationPageIndex).length>0"
                                                              style="color: #e96900; display: inline-block; margin-top: 7px; vertical-align: top;">
                                                            {{stations.stations.slice((orderAutoSubmitForm.leftStationPageIndex-1)*12, 12*orderAutoSubmitForm.leftStationPageIndex).length>0 ? stations.title : ''}}
                                                        </span>
                                                        <div v-if="stations.stations.slice((orderAutoSubmitForm.leftStationPageIndex-1)*12, 12*orderAutoSubmitForm.leftStationPageIndex).length>0"
                                                             style="width: 96%; display: inline-block;">
                                                            <Button  @click="stationSelectEvent(station, 1)" size="small" type="text"
                                                                     v-for="station in stations.stations.slice((orderAutoSubmitForm.leftStationPageIndex-1)*12, 12*orderAutoSubmitForm.leftStationPageIndex)">
                                                                {{station.CNName}}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Page size="small" :current="orderAutoSubmitForm.leftStationPageIndex" :total="item.count" :page-size="12" @on-change="leftStationPageChange"></Page>
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                            <div v-if="orderAutoSubmitForm.leftStationSearch.leftStationInput" class="search-station-div" style="">
                                                <div v-if="leftStationSearchData.length > 0">
                                                    <Button v-for="item in leftStationSearchData.slice((orderAutoSubmitForm.leftStationSearch.pageIndex-1)*36, orderAutoSubmitForm.leftStationSearch.pageIndex*36)"
                                                            @click="stationSelectEvent(item, 1)" type="text" size="small">
                                                        {{item.CNName}}
                                                    </Button>
                                                    <Page :total="leftStationSearchData.length" :page-size="36" size="small"
                                                          @on-change="leftStationSearchPageChange"></Page>
                                                </div>
                                                <div v-if="!leftStationSearchData.length > 0">
                                                    未找到相似的车站
                                                </div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                                <span v-if="orderAutoSubmitForm.ruleInline.leftStationRequireError" class="collapsse-content-error">请选择出发车站</span>
                            </Col>
                            <Col span="8">
                                <span class="collapse-content-title">到达车站: </span>
                                <div class="collapse-content-item">
                                    <span class="collapse-content-span" v-if="orderAutoSubmitForm.arriveStation.CNName != ''">{{orderAutoSubmitForm.arriveStation.CNName}}</span>
                                    <Poptip placement="right" width="480" v-model="poptipModels.arriveStation"
                                            @on-popper-show="orderAutoSubmitForm.ruleInline.arriveStationRequireError=false">
                                        <Button type="dashed" size="small">
                                            {{ orderAutoSubmitForm.arriveStation.CNName != ''? "重新选择" : "请选择" }}
                                        </Button>
                                        <div class="api select-content-div"  slot="content"
                                             :class="{'ivu-form-item-error': orderAutoSubmitForm.arriveStationSearch.leftStationInputError}">
                                            <Input placeholder="请输入到达地" style="width:40%;" v-model="orderAutoSubmitForm.arriveStationSearch.arriveStationInput"
                                                   @on-focus="arriveStationInputFocus"/>
                                            <Button type="info" style="margin-left: 15px;" @click="arriveStationSearchBtn">确定</Button>
                                            <span v-if="orderAutoSubmitForm.arriveStationSearch.arriveStationInputError" style="color: red;">
                                                出发车站不能为空！
                                            </span>
                                            <Tabs v-if="!orderAutoSubmitForm.arriveStationSearch.arriveStationInput" :animated="false" size="small"
                                                  @on-click="stationTabClick">
                                                <TabPane label="热门">
                                                    <div>
                                                        <Button type="text" size="small" v-for="item in favorite_station"
                                                                @click="stationSelectEvent(item, 2)" :key="item.Index">
                                                            {{item.CNName}}
                                                        </Button>
                                                    </div>
                                                </TabPane>
                                                <TabPane v-for="item in letterSortStation" :label="item.title">
                                                    <div v-for="stations in item.stationClass">
                                                        <span v-if="stations.stations.slice((orderAutoSubmitForm.arriveStationPageIndex-1)*12, 12*orderAutoSubmitForm.arriveStationPageIndex).length>0"
                                                              style="color: #e96900; display: inline-block; margin-top: 7px; vertical-align: top;">
                                                            {{stations.stations.slice((orderAutoSubmitForm.arriveStationPageIndex-1)*12, 12*orderAutoSubmitForm.arriveStationPageIndex).length>0 ? stations.title : ''}}
                                                        </span>
                                                        <div v-if="stations.stations.slice((orderAutoSubmitForm.arriveStationPageIndex-1)*12, 12*orderAutoSubmitForm.arriveStationPageIndex).length>0"
                                                             style="width: 96%; display: inline-block;">
                                                            <Button  @click="stationSelectEvent(station, 2)" size="small" type="text"
                                                                     v-for="station in stations.stations.slice((orderAutoSubmitForm.arriveStationPageIndex-1)*12, 12*orderAutoSubmitForm.arriveStationPageIndex)">
                                                                {{station.CNName}}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Page size="small" :current="orderAutoSubmitForm.arriveStationPageIndex" :total="item.count" :page-size="12" @on-change="arriveStationPageChange"></Page>
                                                    </div>
                                                </TabPane>
                                            </Tabs>
                                            <div v-if="orderAutoSubmitForm.arriveStationSearch.arriveStationInput" class="search-station-div" style="">
                                                <div v-if="arriveStationSearchData.length > 0">
                                                    <Button v-for="item in arriveStationSearchData.slice((orderAutoSubmitForm.arriveStationSearch.pageIndex-1)*36, orderAutoSubmitForm.arriveStationSearch.pageIndex*36)"
                                                            type="text" size="small"  @click="stationSelectEvent(item, 2)">
                                                        {{item.CNName}}
                                                    </Button>
                                                    <Page :total="arriveStationSearchData.length" :page-size="36" size="small" @on-change="arriveStationSearchPageChange"></Page>
                                                </div>
                                                <div v-if="!arriveStationSearchData.length > 0">
                                                    未找到相似的车站
                                                </div>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                                <span v-if="orderAutoSubmitForm.ruleInline.arriveStationRequireError" class="collapsse-content-error">请选择到达车站</span>
                            </Col>
                        </Row>

                         <!--出发日期-->
                        <Row>
                            <Col span="24">
                                <span class="collapse-content-title">出发日期: </span>
                                <div class="collapse-content-item">
                                    <span class="collapse-content-span" v-if="orderAutoSubmitForm.leftDate.date != ''">
                                        {{orderAutoSubmitForm.leftDate.date}}
                                    </span>
                                    <Poptip placement="right" width="275" word-wrap v-model="poptipModels.leftDate"
                                            @on-popper-show="orderAutoSubmitForm.ruleInline.leftDateRequireError=false">
                                        <Button type="dashed" size="small">
                                            {{orderAutoSubmitForm.leftDate.date == '' ? '请选择': '重新选择'}}
                                        </Button>
                                        <div class="api select-content-div" slot="content" >
                                            <span class="collapse-content-title" style="width: 60px;">
                                                出发日期
                                            </span>
                                            <DatePicker class="left-date-picker"  type="date" style="width: 150px;"
                                                        placement="bottom-start" @on-change="leftDateChangeEvent" :editable="false"
                                                        :transfer="false" :options="departureDateOption" placeholder="点击选择出发日期">
                                            </DatePicker>
                                        </div>
                                    </Poptip>
                                    <span v-if="orderAutoSubmitForm.ruleInline.leftDateRequireError" class="collapsse-content-error">请选择出发日期</span>
                                </div>
                            </Col>
                        </Row>

                        <!-- 车次 -->
                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">车次: </span>
                                <div class="collapse-content-item">
                                    <Button type="dashed" size="small" @click="trainCodeSelectError" v-if="!trainCodeSelectEnable">
                                        请选择
                                    </Button>
                                    <span class="collapse-content-span" v-if="orderAutoSubmitForm.trainCode.train.station_train_code">{{orderAutoSubmitForm.trainCode.train.station_train_code}}</span>
                                    <Poptip v-if="trainCodeSelectEnable" placement="right" width="500" word-wrap
                                            v-model="poptipModels.trainCode" @on-popper-show="trainCodeSelectShow">
                                        <Button type="dashed" size="small">
                                            {{orderAutoSubmitForm.trainCode.train.station_train_code? "重新选择" : "请选择"}}
                                        </Button>
                                        <div class="api select-content-div" slot="content" >
                                            <Input placeholder="请选择车次" style="width:40%;"/>
                                            <Button type="info" style="margin-left: 15px;">确定</Button>
                                            <div style="position: relative">
                                                <div class="select-train-div">
                                                    <Button v-for="item in trainCodeDataPageData" type="text" size="small" @click="trainCodeSelectEvent(item)">
                                                        <span style="font-size: 14px; font-weight: bold;">{{item.station_train_code}}</span>({{item.start_time}}-{{item.arrive_time}})
                                                    </Button>
                                                    <span v-if="!trainCodeDataPageData.length > 0" style="margin-top: 20px;">
                                                        未找到任何车次
                                                    </span>
                                                    <Page :total="orderAutoSubmitForm.trainCode.trainCodeData.length" :page-size="12" size="small" onchange="trainCodeDataPageChange"></Page>
                                                </div>
                                                <Spin fix v-if="orderAutoSubmitForm.trainCode.trainCodeDataLoading">加载中...</Spin>
                                                <span fix v-if="orderAutoSubmitForm.trainCode.trainCodeDataLoadError">异常错误，请重试!</span>
                                            </div>
                                        </div>
                                    </Poptip>
                                </div>
                            </Col>
                        </Row>

                        <!-- 席别 -->
                        <Row>
                            <Col span="8">
                                <span class="collapse-content-title">席别: </span>
                                <div class="collapse-content-item">
                                    <span class="collapse-content-span" v-if="orderAutoSubmitForm.seatType.seatOption.name != ''">
                                        {{orderAutoSubmitForm.seatType.seatOption.name}}
                                    </span>
                                    <Poptip placement="right" width="300" word-wrap v-model="poptipModels.seatType">
                                        <Button type="dashed" size="small">
                                            {{orderAutoSubmitForm.seatType.seatOption.name == ''? "请选择": "重新选择"}}
                                        </Button>
                                        <div slot="content" class="api select-content-div">
                                            <Button v-for="item in orderAutoSubmitForm.seatType.seatData" type="text" size="small" @click="seatTypeSelectEvent(item)">
                                                {{item.name}}
                                            </Button>
                                        </div>
                                    </Poptip>
                                </div>
                            </Col>
                        </Row>

                        <!--提交-->
                        <Row>
                            <Col span="8">
                                <Button icon="ios-train" type="success" @click="submitOrder">
                                    提交订票
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Panel>
            </Collapse>
        </Row>

        <!-- 车票查询条件 -->
        <Row class="content-row-header" style="margin-top: 30px;">
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
                <Button type="primary" style="margin-left: 20px;" class="row-btn" :loading="ticketLoading" @click="TicketQuery">查询</Button>
            </Col>
        </Row>
        <!-- 车票信息 -->
        <Row class="content-row-table">
            <Table :loading="ticketLoading" :columns="ticketColumn" :data="ticketTableData"
                   :border="false" width="1393"></Table>
            <Page :total="ticketDataCount"  prev-text="上一页" next-text="下一页" @on-change="ticketTablePageChange" />
        </Row>
        <!-- 登录对话框 -->
        <Modal v-model="loginModal" title="登录你的12306账户" :closable="false" width="340">
            <div style="padding: 0 10px;">
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="userName" label="账号">
                        <Input type="text" v-model="formInline.userName" placeholder="请输入你的账号" style="width: 70%;"/>
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </FormItem>
                    <FormItem prop="password" label="密码">
                        <Input type="password" v-model="formInline.password" placeholder="请输入你的密码"
                               style="width: 70%;"/>
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </FormItem>
                    <FormItem prop="picValidate">
                        <div style="width: 300px; position: relative;">
                            <Badge v-for="(item, index) in validatePicPointData" :count="index+1"
                                   @click.native="pointDataRemove(item)"
                                   :style="{position: 'absolute!important', display: 'inline-block', left: item.x + 'px', top: item.y + 'px', zIndex: '3'}"></Badge>
                            <span v-if="validateImgLoadError" class="validate-img-load-error" style="">
                                图片加载异常,请重试
                            </span>
                            <img :src="validatePicUrl" @click="picClickEvent">
                            <Icon type="md-refresh" class="pic-validate-img-refresh" @click="getValidateImg"/>
                            <Spin fix v-if="validateImgLoading">
                                <Icon type="ios-loading" size=18 class="validate-image-load"></Icon>
                                <div>图片加载中...</div>
                            </Spin>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" size="large" @click="loginModalCancel">取消</Button>
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
                if (_this.validatePicPointData.length <= 0) {
                    callback(new Error('请完成图片验证'));
                } else {
                    callback();
                }
            };
            return {
                poptipModels:{
                    leftStation: false,
                    arriveStation: false,
                    leftDate: false,
                    trainCode: false,
                    seatType: false,
                },
                validateImgLoading: false,
                validateImgLoadError: false,
                loginLoading: false,
                ticketInfoSelect: ['0'],
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
                orderAutoSubmitForm: {
                    passenger:{
                        name: '',
                        account: ''
                    },
                    leftStation: {
                        CNName: ''
                    },
                    leftStationPageIndex: 1,
                    arriveStationPageIndex: 1,
                    arriveStation: {
                        CNName: ''
                    },
                    leftDate: {

                        date: ''
                    },
                    leftStationSearch: {
                        leftStationInputError: false,
                        leftStationInput: '',
                        pageIndex: 1,
                    },
                    arriveStationSearch: {
                        arriveStationInputError: false,
                        arriveStationInput: '',
                        pageIndex: 1,
                    },
                    trainCode: {
                        train: {},
                        trainCodeData: [],
                        trainCodeDataLoading: false,
                        trainCodeDataLoadError: false,
                        pageIndex: 1,
                    },
                    seatType:{
                        seatData: [{
                            type: 'M',
                            name: '一等座'
                        },
                        {
                            type: 'O',
                            name: '二等座',
                        },
                        {
                            type: 'O',
                            name: '无座'
                        }],
                        seatOption: {
                            name: '',
                            type: ''
                        }
                    },
                    ruleInline: {
                        leftStationRequireError: false,
                        arriveStationRequireError: false,
                        leftDateRequireError: false,
                    },
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
                validatePicPointData:[],
                ticketData: [],
                passengerToken: '',

            }
        },
        computed: {
            ticketTableData(){
                return this.ticketData.slice(this.ticketTablePageIndex*10, 10*this.ticketTablePageIndex+10);
            },
            letterSortStation(){
                let sortStation = [];
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
                    sortStation.push(obj);
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
                    sortStation[sortIndex].stationClass.map(function(stationClass){
                        if(stationClass.title === firstChar){
                            stationClass.stations.push(item);
                        }
                    });
                });
                sortStation.map(function(item){
                    item.stationClass.map(function(stationClass){
                        item.count = item.count < stationClass.stations.length ? stationClass.stations.length : item.count;
                    });
                });

                return sortStation;
            },
            leftStationSearchData(){
                let stationArr = [];
                let _this = this;
                stations.Stations.map(function(item){
                    if(item.CNName.indexOf(_this.orderAutoSubmitForm.leftStationSearch.leftStationInput) > -1){
                        stationArr.push(item);
                    }
                });
                return stationArr;
            },
            arriveStationSearchData(){
                let stationArr = [];
                let _this = this;
                stations.Stations.map(function(item){
                    if(item.CNName.indexOf(_this.orderAutoSubmitForm.arriveStationSearch.arriveStationInput) > -1){
                        stationArr.push(item);
                    }
                });
                return stationArr;
            },
            ticketDataCount(){
                return this.ticketData.length;
            },
            favorite_station(){
                return favoriteStation.Stations;
            },
            currentPassenger(){
                return this.$store.state.home.passenger;
            },
            trainCodeSelectEnable(){
                return this.orderAutoSubmitForm.arriveStation.CNName != ''
                    && this.orderAutoSubmitForm.leftStation.CNName != ''
                    && this.orderAutoSubmitForm.leftDate.date != ''
            },
            trainCodeDataPageData(){
                return this.orderAutoSubmitForm.trainCode.trainCodeData.slice((this.orderAutoSubmitForm.trainCode.pageIndex-1)*12, this.orderAutoSubmitForm.trainCode.pageIndex*12);
            }
        },
        created(){

        },

        methods: {
            getValidateImg(){
                let _this = this;
                _this.validateImgLoading = true;
                _this.validateImgLoadError = false;
                _this.validatePicPointData = [];
                ajax.post('api/Station/getValidateImage', {
                }).then(function(response){
                    _this.validateImgLoading = false;
                    if(response.data.code == 200){
                        _this.validatePicUrl = response.data.data.imgUrl;
                        _this.passengerToken = response.data.data.token;
                    }else if(response.data.code == 204){
                        _this.validateImgLoadError = true;
                        _this.validatePicUrl = "";
                    }
                }).catch(function(error){
                    _this.validateImgLoading = false;
                    _this.validateImgLoadError = true;
                    _this.validatePicUrl = "";
                });
            },
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
            ticketTablePageChange(page){
                this.ticketTablePageIndex = page-1;
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
                this.loginModal = true;
                this.getValidateImg();
            },
            loginModalCancel(){
                this.loginModal = false;
            },
            loginEvent(name){
                let pointsData = [];
                let _this = this;
                this.validatePicPointData.map(function(item){
                    pointsData.push(item.x);
                    pointsData.push(item.y);
                });
                this.$refs["formInline"].validate((valid) => {
                    if (valid) {
                        if(_this.validatePicPointData.length <= 0){
                            this.$Message.error("请完成图片验证");
                        }
                        else{
                            this.loginLoading = true;
                            ajax.post('api/Station/validateLogin', {
                                UserName: _this.formInline.userName,
                                Password: _this.formInline.password,
                                pointsData: pointsData,
                                token: _this.passengerToken
                            }).then(function(response){
                                _this.validatePicPointData = [];
                                _this.loginLoading = false;
                                if(response.data.code != 200){
                                    _this.$Message.error({
                                        content: "登录失败！" +　response.data.result,
                                        duration: 3
                                    });
                                    _this.validateImgLoading = true;
                                    _this.getValidateImg();
                                }
                                else{
                                    _this.$store.commit('home/setPassenger', response.data.data);
                                    _this.loginModal = false;
                                    _this.orderAutoSubmitForm.passenger.name = response.data.data.name;
                                    _this.orderAutoSubmitForm.passenger.account = response.data.data.account;
                                    console.log(response.data.data);
                                    _this.$Message.success({
                                        content: "登录成功",
                                        duration: 1.5
                                    });
                                }
                            }).catch(function(error){
                                _this.loginLoading = false;
                                _this.$Message.error({
                                    content: '登录异常',
                                    duration:1.5
                                });
                            });
                        }
                    }
                });
            },
            picClickEvent(event){
                this.validatePicPointData.push({
                    x: event.offsetX,
                    y: event.offsetY
                });
            },
            pointDataRemove(obj){
                _.remove(this.validatePicPointData, obj);

                //解决lodash.remove函数非响应式问题
                this.validatePicPointData.sort();
            },
            userDtoBtn(){
                ajax.post('api/Station/GetPassengerDto', {
                }).then(function(response){
                    console.log(response);
                });
            },
            stationSelectEvent(item, type){
                if(type == 1){
                    //  出发车站
                    this.poptipModels.leftStation = false;
                    this.orderAutoSubmitForm.leftStation = item;
                }
                else if(type == 2){
                    //  到达车站
                    this.poptipModels.arriveStation = false;
                    this.orderAutoSubmitForm.arriveStation = item;
                }

            },
            stationTabClick(){
                this.orderAutoSubmitForm.leftStationPageIndex = 1;
                this.orderAutoSubmitForm.arriveStationPageIndex = 1;
            },

            leftStationInputFocus(){
                this.orderAutoSubmitForm.arriveStationSearch.arriveStationInputError = false;
            },

            arriveStationInputFocus(){
                this.orderAutoSubmitForm.arriveStationSearch.arriveStationInputError = false;
            },

            leftStationSearchBtn(){
                if(!this.orderAutoSubmitForm.leftStationSearch.leftStationInput){
                    this.orderAutoSubmitForm.leftStationSearch.leftStationInputError = true;
                }else{
                    let _this = this;
                    let flag = false;
                    stations.Stations.map(function(item){
                        if(item.CNName == _this.orderAutoSubmitForm.leftStationSearch.leftStationInput){
                            _this.orderAutoSubmitForm.leftStation = item;
                            flag = true;
                        }
                    });
                    if(!flag){
                        _this.$Message.error({
                            content: '未找到该车站，请重试',
                            duration: 1.5
                        });
                    }else{
                        _this.poptipModels.leftStation = false;
                    }
                }
            },
            arriveStationSearchBtn(){
                if(!this.orderAutoSubmitForm.arriveStationSearch.arriveStationInput){
                    this.orderAutoSubmitForm.arriveStationSearch.arriveStationInputError = true;
                }else{
                    let _this = this;
                    let flag = false;
                    stations.Stations.map(function(item){
                        if(item.CNName == _this.orderAutoSubmitForm.arriveStationSearch.arriveStationInput){
                            _this.orderAutoSubmitForm.arriveStation = item;
                            flag = true;
                        }
                    });
                    if(!flag){
                        _this.$Message.error({
                            content: '未找到该车站，请重试',
                            duration: 1.5
                        });
                    }else{
                        _this.poptipModels.arriveStation = false;
                    }
                }
            },
            leftStationPageChange(page){
                this.orderAutoSubmitForm.leftStationPageIndex = page
            },
            arriveStationPageChange(page){
                this.orderAutoSubmitForm.arriveStationPageIndex = page;
            },
            leftStationSearchPageChange(page){
                console.log("leftStationSearchPageChange");
                this.orderAutoSubmitForm.leftStationSearch.pageIndex = page;
            },
            arriveStationSearchPageChange(page){
                console.log("arriveStationSearchPageChange");
                this.orderAutoSubmitForm.arriveStationSearch.pageIndex = page;
            },

            leftDateChangeEvent(date){
                this.poptipModels.leftDate = false;
                this.orderAutoSubmitForm.leftDate.date = date;
            },
            trainCodeSelectError(){
                console.log("trainCodeSelectError");
                if(this.orderAutoSubmitForm.leftStation.CNName == ''){
                    this.orderAutoSubmitForm.ruleInline.leftStationRequireError = true;
                }
                if(this.orderAutoSubmitForm.arriveStation.CNName == ''){
                    this.orderAutoSubmitForm.ruleInline.arriveStationRequireError = true;
                }
                if(this.orderAutoSubmitForm.leftDate.date == ''){
                    this.orderAutoSubmitForm.ruleInline.leftDateRequireError = true;
                }
            },
            trainCodeSelectShow(){
                let _this = this;
                this.orderAutoSubmitForm.trainCode.trainCodeDataLoading = true;
                ajax.post('api/Station/ticketQuery', {
                    Train_date: _this.orderAutoSubmitForm.leftDate.date,
                    from_station_code: _this.orderAutoSubmitForm.leftStation.Code,
                    to_station_code: _this.orderAutoSubmitForm.arriveStation.Code,
                }).then(function(response){
                    _this.orderAutoSubmitForm.trainCode.trainCodeDataLoading = false;
                    _this.orderAutoSubmitForm.trainCode.trainCodeData = response.data.data;
                }).catch(function(error){
                    _this.orderAutoSubmitForm.trainCode.trainCodeDataLoading = false;
                    _this.orderAutoSubmitForm.trainCode.trainCodeDataLoadError = false;
                });
            },
            trainCodeDataPageChange(page){
                this.orderAutoSubmitForm.trainCode.pageIndex = page;
            },
            trainCodeSelectEvent(item){
                this.poptipModels.trainCode = false;
                this.orderAutoSubmitForm.trainCode.train = item;
            },
            seatTypeSelectEvent(item){
                this.orderAutoSubmitForm.seatType.seatOption = item;
                this.poptipModels.seatType = false;
            },
            submitOrder(){
                ajax.post('api/Station/submitOrder', {
                    userName: this.orderAutoSubmitForm.passenger.account,
                    leftStation: {
                        name: this.orderAutoSubmitForm.leftStation.CNName,
                        code: this.orderAutoSubmitForm.leftStation.Code
                    },
                    arriveStation:{
                        name:  this.orderAutoSubmitForm.arriveStation.CNName,
                        code:  this.orderAutoSubmitForm.arriveStation.Code,
                    },
                    leftDate: this.orderAutoSubmitForm.leftDate.date,
                    leftDateJs: new Date(this.orderAutoSubmitForm.leftDate.date+" 00:00:00").toString(),
                    trainCode: this.orderAutoSubmitForm.trainCode.train.station_train_code,
                    seatType: this.orderAutoSubmitForm.seatType.seatOption.type,
                    token: this.passengerToken
                }).then(function(response){
                    console.log(response)
                }).catch(function(error){

                });
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
        width: 95px;
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        background: #f90;
        color: #fff;
        border-radius: 4px;
        border: 1px solid transparent;
    }

    .collapse-content-div{
        width: 1000px;
        border-bottom: 1.5px solid #dcdee2;
    }

    .collapse-content-div .collapse-content-title{
        margin-right: 15px;
        display: inline-block;
        width: 80px;
        text-align: right;
        color: #464c5b;
        font-weight: bold;
        font-family: "Sitka Small";
    }

    .collapse-content-div .collapsse-content-error{
        margin-left: 20px;
        color: red;
    }

    .collapse-content-div .collapse-content-item{
        display: inline-block;
    }

    .collapse-content-div .collapse-content-span{
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
        width: 70px;
        text-align: center;
    }

    .select-content-div{
        white-space: normal;
    }

    .select-content-div button{
        margin: 3px 3px;
        width: 60px;
    }

    .search-station-div {
        padding: 10px;

    }

    .select-train-div{
        padding: 10px;
    }

    .select-train-div button{
        width: 120px;
        margin-right: 20px;
    }

    /* 验证图片加载动画 */
    .validate-image-load{
        animation: ani-spin 1s linear infinite;
    }

    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    /* 验证图片加载动画结束 */
    .pic-validate-img-refresh{
        position: absolute;
        right: 8px;
        top: 5px;
        font-size: 20px;
        cursor: pointer;
    }

    .validate-img-load-error{
        font-size: 14px;
        position: absolute;
        color: #ed4014;
        width: 100%;
        border-bottom: 1px solid #dcdee2;
    }

</style>