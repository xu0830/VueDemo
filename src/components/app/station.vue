<template>
    <div class="component-content">
        <Row class="content-row-header">
            <Col span="6">
                <span class="col-title">出发地</span>
                <AutoComplete
                v-model="departurePlace"
                :data="departurePlaceData"
                @on-search="departurePlaceSearch"
                placeholder="请输入出发地" style="width:70%"></AutoComplete>
            </Col>
            <Col span="6">
                <span class="col-title">目的地</span>
                <AutoComplete
                        v-model="destination"
                        :data="destinationData"
                        @on-search="destinationSearch"
                        placeholder="请输入目的地"
                        style="width:70%"></AutoComplete>
            </Col>
            <Col span="6">
                <span class="col-title">出发日期</span>
                <DatePicker type="date" :options="departureDate" placeholder="请选择出发日期" style="width:70%"></DatePicker>
            </Col>
            <Col span="3">
                <Button type="primary" class="row-btn" @click="TicketQuery">查询</Button>
            </Col>
        </Row>
        <Row class="content-row-table">
            <Table border :columns="ticketColumn" :data="ticketVmData" :border="false" width="1263"></Table>
            <Page :total="100" prev-text="上一页" next-text="下一页" @on-change="pageChage" />
        </Row>
    </div>
</template>

<script>
    import stations from '../../lib/station.json'
    import ajax from '../../lib/ajax';
    export default {
        name: "station",
        data () {
            return {
                departurePlace: '',
                departurePlaceData: [],
                destination: '',
                destinationData: [],
                departureDate: {
                    disabledDate (date) {
                        return date
                            && (date.valueOf() < Date.now() - 86400000
                                || date.valueOf() > Date.now() + 29 * 86400000);
                    }
                },
                //  表头
                ticketColumn:[
                    {
                        title: '车次',
                        key: 'station_train_code',
                        width: 70,
                        render: (h, params) => {
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
                                            console.log("ddd");
                                            // this.show(params.index)
                                        }
                                    }
                                }, params.row.station_train_code)
                            ]);
                        }
                    },
                    {
                        title: '出发站',
                        key: 'from_station_name',
                        width: 75,
                    },
                    {
                        title: '到达站',
                        key: 'to_station_name',
                        width: 75
                    },
                    {
                        title: '出发时间',
                        key: 'start_time',
                        width: 85
                    },
                    {
                        title: '到达时间',
                        key: 'arrive_time',
                        width: 85
                    },
                    {
                        title: '历时',
                        key: 'lishi',
                        width: 60
                    },{
                        title: '商务座',
                        key: 'swz_num',
                        width: 75
                    },
                    {
                        title: '一等座',
                        key: 'zy_num',
                        width: 75
                    },
                    {
                        title: '二等座',
                        key: 'ze_num',
                        width: 75
                    },
                    {
                        title: '高级软卧',
                        key: 'gr_num',
                        width: 85
                    },
                    {
                        title: '软卧一等座',
                        key: 'rw_num',
                        width: 100
                    },
                    {
                        title: '动卧',
                        key: 'srrb_num',
                        width: 60
                    },
                    {
                        title: '硬卧二等卧',
                        key: 'yw_num',
                        width: 100
                    },
                    {
                        title: '软座',
                        key: 'rz_num',
                        width: 60
                    },
                    {
                        title: '硬座',
                        key: 'yz_num',
                        width: 60
                    },
                    {
                        title: '无座',
                        key: 'wz_num',
                        width: 60
                    },
                    {
                        title: '操作',
                        key: 'canWebBuy',
                        width: 60
                    }
                ],
                // ticketData:[
                //     {
                //         Station_train_code: 'D7432',
                //         age: 18,
                //         address: '01:28',
                //         date: '01:28'
                //     },
                //     {
                //         Station_train_code: 'D7432',
                //         age: 24,
                //         address: '01:28',
                //         date: '2016-10-01'
                //     },
                //     {
                //         Station_train_code: 'D7432',
                //         age: 30,
                //         address: '01:28',
                //         date: '2016-10-02'
                //     },
                //     {
                //         Station_train_code: 'D7432',
                //         age: 26,
                //         address: 'Ottawa No. 2 Lake Park',
                //         date: '2016-10-04'
                //     }
                // ]
                ticketData:[]
            }
        },
        computed: {
            ticketVmData(){
                return this.ticketData.slice(0, 10);
            }
        },
        created(){
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
            pageChage(page){// 页码
                console.log("page Change");
                console.log(page);
            },
            TicketQuery(){
                console.log("ticketQuery");
                let _this = this;
                ajax.post('api/Station/ticketQuery', {
                }).then(function(response){
                    console.log(response.data.data);
                     _this.ticketData = response.data.data.slice(0, 10);
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
        margin: 20px 0;
    }

    .content-row-header{
        min-width: 800px;
        max-width: 800px;
    }
    .content-row-table{
    }

    .ivu-page{
        margin-top: 10px;
    }

    .col-title{
        margin: 10px 10px 10px 0;
    }

    .row-btn{
        margin: 0 20px;
    }
</style>