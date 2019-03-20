<template>
    <div class="component-content">
        <Row>
            <Col span="5">
                出发地
                <AutoComplete
                        v-model="departurePlace"
                        :data="departurePlaceData"
                        @on-search="departurePlaceSearch"
                        placeholder="请输入出发地"
                        style="width:200px"></AutoComplete>

            </Col>
            <Col span="5">
                目的地
                <AutoComplete
                        v-model="destination"
                        :data="destinationData"
                        @on-search="destinationSearch"
                        placeholder="请输入目的地"
                        style="width:200px"></AutoComplete>
            </Col>
            <Col span="4">
                出发日期
                <DatePicker type="date" :options="departureDate" placeholder="Select date" style="width: 200px"></DatePicker>
            </Col>
            <Col span="2">
                <Button size="large" type="primary">查询</Button>
            </Col>
        </Row>
        <Row>
            <Table border :columns="ticketColumn" :data="ticketData"></Table>
            <Page :total="100" prev-text="上一页" next-text="下一页" @on-change="pageChage" />
        </Row>
    </div>
</template>

<script>
    import stations from '../../lib/station.json'
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
                        key: 'Station_train_code',
                        width: 75
                    },
                    {
                        title: '出发站',
                        key: 'From_station_name',
                        width: 75
                    },
                    {
                        title: '到达站',
                        key: 'To_station_name',
                        width: 75
                    },
                    {
                        title: '出发时间',
                        key: 'Start_time',
                        width: 90
                    },
                    {
                        title: '到达时间',
                        key: 'Arrive_time',
                        width: 90
                    },
                    {
                        title: '历时',
                        key: 'Lishi',
                        width: 70
                    },{
                        title: '商务座',
                        key: 'Swz_num',
                        width: 75
                    },
                    {
                        title: '一等座',
                        key: 'Zy_num',
                        width: 75
                    },
                    {
                        title: '二等座',
                        key: 'Ze_num',
                        width: 75
                    },
                    {
                        title: '高级软卧',
                        key: 'Gr_num',
                        width: 75
                    },
                    {
                        title: '软卧一等座',
                        key: 'Rw_num',
                        width: 75
                    },
                    {
                        title: '动卧',
                        key: 'Srrb_num',
                        width: 75
                    },
                    {
                        title: '硬卧二等卧',
                        key: 'Yw_num',
                        width: 75
                    },
                    {
                        title: '软座',
                        key: 'Rz_num',
                        width: 75
                    },
                    {
                        title: '硬座',
                        key: 'Yz_num',
                        width: 75
                    },
                    {
                        title: '无座',
                        key: 'Wz_num',
                        width: 75
                    },
                    {
                        title: '操作',
                        key: 'CanWebBuy',
                        width: 70
                    }
                ],
                ticketData:[
                    {
                        name: 'D7432',
                        age: 18,
                        address: '01:28',
                        date: '01:28'
                    },
                    {
                        name: 'D7432',
                        age: 24,
                        address: '01:28',
                        date: '2016-10-01'
                    },
                    {
                        name: 'D7432',
                        age: 30,
                        address: '01:28',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
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
            }
        }
    }
</script>

<style scoped>
    .component-content{
        width: 100%;
        height: ;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    }
    .ivu-row{
        margin-bottom: 20px;
    }
    .ivu-page{
        margin-top: 10px;
    }
</style>