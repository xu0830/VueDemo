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
            <Table :loading="ticketLoading" :columns="ticketColumn" :data="ticketVmData"
                   :border="false" width="1393"></Table>
            <Page :total="ticketDataCount" prev-text="上一页" next-text="下一页" @on-change="pageChage" />
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
                ticketLoading: false,
                ticketDetailmodal: false,
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
                                        type: 'primary',
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
                pageIndex: 0,
             // ticketData: []
                ticketData:[{"secretStr":"JIyQVvOk2AiGEeSRbfBinRQYn7Fp89%2BmntbWst%2FGg1ZjR9i4ja9QNPzQyu944GyhGpQNSe45pYAW%0ATQ3%2B0uqw9OByCINvewjmBAUEkMt5%2FueNM43xaTHtYdY2h9MAaSGN1pjbo4fmBpHfK%2FYx6F%2BUAMEh%0A9pKc0tyripahagupa%2B2eGcIwdNG2d13MCMbT66KqHq%2Fyo%2B7VXr1X3ACjMMxspFFNhAggnmsa8saw%0AYL8gooy1JV7qJJ30X4qasBOyQ9WZgrhQ7hqoj%2BTh4229rnewFb%2FUgMIjv1ixiJAw0PTcAJE%3D","buttonTextInfo":"预订","train_no":"6i0000D68206","station_train_code":"D682","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"06:40","arrive_time":"08:08","lishi":"01:28","canWebBuy":"Y","yp_info":"qaWaQIES%2BhskE5Qw%2F1F8xXE9uaAfP%2B%2BgE6LckHK6jN%2B2JEer","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"02","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"9Tyyc1%2FHfjLsxOhfNtBZQ258BBsxAQqZYLvr7d0pmMw6tLo%2Bpn3ulbp5PXbmji%2FM5fhTv%2BM7oNtn%0Ag%2FiEVK1%2BRnEb3XMgbcMnXP1O%2FsWaMChIgS8FrEFWXyrP3XfwCPlMpUErtaXu4fxtiIF5rVuBzTMf%0Avvriw0uO67A0ERDgt%2FRzDBvGXsdyefPnx1EVpYqZ01lhLtC5kQ959xp16m310HN9gB2Oiva1eTEK%0A%2BIoC3PbonxIGmL3BB0t1lfoKtdARB%2BVnGNXAruXm7F%2FKTXpoUn9ePfjS2vCvQNuDpcTy38M%3D","buttonTextInfo":"预订","train_no":"6i000D743210","station_train_code":"D7432","start_station_telecode":"IOQ","end_station_telecode":"OTQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"06:45","arrive_time":"08:19","lishi":"01:34","canWebBuy":"Y","yp_info":"TzX21wchnQenI45GQstTREzZ%2BEIUZ7KYw6IvLyrSHwszCQtM","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"kl0NNTu9nC3HRZ%2B0SA9l6SCBPIardnPo4Q%2FjA77VRlV25%2BW0qsuY9YM0WuTu%2FLp6hswOiibD1ZZo%0AcgVasDFWM6TdmDNCJBO8yQzF8c4SQmy7m3BlPiK%2FZgRHKyWH7RBNAN9UTPGGOXjQBhfyGK2H4Gkc%0Af7KKvCwJ6gIXsY%2FqNVVIBJphInpYuVY%2Fs55WbPOINXTKOEEUOTAK5YorQfsrtmHvW5mMi%2F0swStG%0AtTFxgigKEMsWUjO5VlxQRTEwxnI5I5VOTsb2%2BZj42Zikt4lGIOTTrWS5upc6NXhzCz3hpmg%3D","buttonTextInfo":"预订","train_no":"6i000D23520C","station_train_code":"D2352","start_station_telecode":"IOQ","end_station_telecode":"WCS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"07:25","arrive_time":"09:05","lishi":"01:40","canWebBuy":"Y","yp_info":"%2BgM05%2B6T4JGNXNaMIkLdKRmCjn08%2B9I2y3rfMy2vCUDvpXvw","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"N6gFUurQds2BOwe3MTwIqNilJSkwxOGbQsMxNKHfBfObPp4mn2SX5vymfh%2Bf30d08YmjEHpaNUET%0AUyayEahdbp1fIEd50F65f2UGU7hbvZb7ji1IXhrVS00y4hyodnArNC26UwIlct%2Bb88xngRTEam0t%0A3PxY%2BR5709ng5llGu2nKm5yVyI35xllm%2BDvenzB6wjGiYMf6r9SIO2JinvYzcwVb7VCXJS61GR9f%0AxGlrU%2FSTfxFunUaZ4%2BEDlaCSCiyU%2Bk1VAG6xoyPi6T5dg0EyUnR0HzE%2FQ4jg","buttonTextInfo":"预订","train_no":"6i000D235005","station_train_code":"D2350","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"07:36","arrive_time":"08:59","lishi":"01:23","canWebBuy":"Y","yp_info":"OX6xdl5VKlzLIP0l%2BKyyw%2B%2Fx2rZogQ5M","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"","swz_num":"","srrb_num":"","yp_ex":"O0O0","seat_types":"OO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"vunK22PN5n%2BpKTwmXtQr14Azx3xvz62GNisAEnjBfTXg%2FeTJNh0RMGM%2Fzf3G9iq6j2B9yZF5MqP2%0AcT3mOK6YcAjWyTRUV%2FDMtmCbHa5Zq%2FWUX2GEk3qGi4Nn6%2B%2FLJXvkBFrmWZoNL3Ek7CaWyvMh%2F0Nr%0AUZiprD5PkyTOxritcQo3DWDXDZ8E0oth8AWznYdTaOikQ%2F4HrpUNH6Dc8i%2BqMZOu%2FRZH7idxw8r4%0AHED3G31Dp53uj0d%2Fj33C6DZmeXHzh6FG4fmd6MekV%2F%2FVQHkez%2FDo9RxZGmd5","buttonTextInfo":"预订","train_no":"6i000D23440C","station_train_code":"D2344","start_station_telecode":"IOQ","end_station_telecode":"QYS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"08:13","arrive_time":"09:47","lishi":"01:34","canWebBuy":"Y","yp_info":"%2FeD13Ss6rLFj0l90Cj9Tfq13%2F7Gm2O3g","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"","swz_num":"","srrb_num":"","yp_ex":"O0O0","seat_types":"OO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"tj4Ie919YGHcY%2F%2FIdaVpwYkPLARXmAzr1Xsb9ZCx9iyWr5v7yQVkuJhNrI70WQVO4OIJu893dPYz%0ABPcgrkkc6Wf4fIjx%2F3KVC1FKwu5ciIgD6h1m4lPnt5lgDO7G59Ik0mc52NOMRfghxAhRw2jjbCgb%0AJuOCPnE8uvn7tHj3V%2F%2F7gFUG7nHH%2FPhYPDFfl4nDTvWuobBqxkbBRmIkVluDjHwL2HMaRw2wp9hI%0AnY9CRAoQxeFLKS%2FfOittqhq7P4tcHChITCMet45pmi2A9fkAZ%2FhchhVJHyDcIWrlngYLyqs%3D","buttonTextInfo":"预订","train_no":"6i000D31080C","station_train_code":"D3108","start_station_telecode":"IOQ","end_station_telecode":"AOH","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"08:24","arrive_time":"09:41","lishi":"01:17","canWebBuy":"Y","yp_info":"YXBoUYQztPUF1NWktj53woR8acOWX1mWb4Phd%2B8l535m5AmL","start_train_data":"20190408","train_seat_feature":"3","location_code":"QY","from_station_no":"01","to_station_no":"02","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"5","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"3Xp%2F3RWyI8MwYG3AI0iSBJJ4ZpTqs2oBA0P4uqe8bCP6JsZqkTx4R%2BSMyaF00UMrybgeBrLC%2FY%2FO%0Ahnbg9tuewCVKv0DXlqyNmBVb0nE%2F5%2Fo%2BDQDLzZyFnW57QpdxlDDd9FNGNetuxBcMEDX%2BARvi81un%0ArSetJe8RH2EKYlR2izFtySskz2jpT%2FI70ihN%2BOsjYYKFAIw09G53RDbLjuRwKx86CugXPoBumj6q%0AdZnlh42U%2FtXwoGdrULSzWM%2FxV74goh1zNYcYgbHAi05Wc7zcxJu542iCZeK7SHEq5rzJ2po%3D","buttonTextInfo":"预订","train_no":"6i000D23080B","station_train_code":"D2308","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"08:39","arrive_time":"10:08","lishi":"01:29","canWebBuy":"Y","yp_info":"QfvKtOresxwrPkE7rPSAAiD0akaASHx84bTX6J7cZoHSvWBH","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"2ks9nt90%2FzCJ%2F1ua9yHVmPCoKE4Vvh07hzkfGO9Fz17qYsTKUlyI%2FobLQy7%2FxVyajeO0gg3cg4IZ%0AySgJUiXy7udivjxgcoGMlVWJHpLhjK%2FCAFg%2F7Zm7Ku61%2F6LpV%2BJRoypqafr6bpqzSGoMkueE2DbN%0AMjPPhCuiNApWJ%2BFfBJo0%2FxwiplnP%2BJH%2FVS28318UbCeuoOFKBGUKXlTLecVVDdWynM3tVJoRyQ9R%0AJO75Z0Wiy2TRmPDZNyGvBN%2BEezRSDbLYl0dTifYMqvAv0Nsg89yehWkGuv9o5PuD6ZnXTF4%3D","buttonTextInfo":"预订","train_no":"6i000G160205","station_train_code":"G1602","start_station_telecode":"IOQ","end_station_telecode":"ENH","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"08:54","arrive_time":"10:40","lishi":"01:46","canWebBuy":"Y","yp_info":"ge3YgGJof1ixHFTS9OngRvYTWJV9v74ApyIkiVu6gxuqeBqM","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"12","zy_num":"无","swz_num":"无","srrb_num":"","yp_ex":"O0M090","seat_types":"OM9","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"3jVpWdyhXbJ7uYVhKxTYkpmBvjpsv%2Fje4zNE0YMrHDGULk%2FUw%2FDI0wPCbOUMJj8yhDYhIRGp3mPD%0Ar33i8x5mdEC7sJEyeoZ2jBspCpNUSzL6m8YF5GbvpQ0u66D2oIoRwj0Jw7I6Ts1sbEZk4FRTT1s1%0AOAcb7PYxevZKXFD7UHEfvYBtkjqE7%2B4IsJ1W%2FvJJe%2B%2B%2BJ%2Ft2e%2FqlAxe1Na0J1n2%2BOaj8jPtHG7Ge%0Ar9F2ACLS%2BQiMToqSYMq9Dyk3Qdp%2BpR7q76P7rfNIkFpbRX0jEHPKDk1XtPjc87kkZx3QYYc%3D","buttonTextInfo":"预订","train_no":"6i000D74220E","station_train_code":"D7422","start_station_telecode":"IOQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"08:59","arrive_time":"10:34","lishi":"01:35","canWebBuy":"Y","yp_info":"J9w%2BKNH343KJMvGs4eyThHMxexULVmd4j39bBjqoFVXOXH2j","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"E4Ly4YB7uoOuyMdBUHwWFTEqF29DiY%2BX8JddyO40ifYhwvSkmZeCaP%2Fv7FxuZcXS1UUc1iROh3%2FX%0AN4C7OyGp%2FH7IN75tLpYWa43RcVAil5gEkyr0mhw3aQ6qDolADvGx6oVJi5eBZwXx2giD32m%2FnE4M%0AlmZGi361UXXgLyvD4p5l0qQ8xpJqQoI1y7UdygBfHYVqoVnmphM1a5e2AqSFTqmAEc2G3Pjyz1wt%0Ab11PA%2BbJ1C4ym4tt%2BCHt1WbOdYwQykPVZvG0Ryz2AUUkpJQGe8uzHlmdhuHhWDT066skDp1jVi26%0AbvstJfo5dF0%3D","buttonTextInfo":"预订","train_no":"6c000G630509","station_train_code":"G6308","start_station_telecode":"IZQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"09:38","arrive_time":"11:18","lishi":"01:40","canWebBuy":"Y","yp_info":"vtyV1KjGaG%2BRQqY1jZ4GgkCN0cB97vdI%2FsBuGAcHKbJVFZ8pnN22LcUiLmQ%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"02","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"5","srrb_num":"","yp_ex":"O090O0M0","seat_types":"O9OM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"3vhqK07GyAe%2BHtc5U%2BC83k%2B5iNUJbORYCTSdlNZMKGfGkPTbCg82aCD4y1y7dptz7CC1TvcURe4p%0AbJbbSbBGwkdloNKj6SFOqALvaWAvcbihaQEbViEWl%2FJRAq6VP8GetdsDEh5CAGEzyTnkCrI%2FGfVo%0A9pTO5gVM0YBEQwX%2FuqG9Tsh87V8V2lHYaiU6ckuecB3tbc29dUND%2ByQIs453gMtrtu4ajtWsnLX2%0A9OrQmweMojaGiJGwB15jyQAkwrf4ayCUifBmfqOSaKH1x1A56chAH1OH4RYvRw8hiOR5CrM%3D","buttonTextInfo":"预订","train_no":"6i0000D68801","station_train_code":"D688","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"09:43","arrive_time":"11:12","lishi":"01:29","canWebBuy":"Y","yp_info":"f7uTSaPpbgFaNsWXBvI5CGI0Np5uTP5bDdZUgHjPuoycAyKV","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"D0JRH2nYOd%2Bxl2iOP8%2B8WY7oaP5QUyR4gJGGQeH5HbjFunF%2Fg0deRcgYS8UytSC%2BW3ASK5HbufdG%0AnnKCwq5uCBm%2BhS9%2BDSjKBbChK5Zj0syQZnTZjtoCPJkLJGqw5BjpafXaOqBGQkO%2BHIOe1zsJFa7w%0AxI2D54idC%2BCFbUMievbCqaXkLzInUQiIrrA4A8nklFnDeTqa%2BD2jMNovmBGC5OPTeRAtWvQRkNYr%0A0JmfZTANh7lyImYPnEmKejo9F62YXRlqgPLaiBBDitUrWQMbkF6NNUSSPWEM","buttonTextInfo":"预订","train_no":"6x000G638601","station_train_code":"G6386","start_station_telecode":"XJA","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"10:04","arrive_time":"11:39","lishi":"01:35","canWebBuy":"Y","yp_info":"Ef5OUswc30bzAAARXdtQ7pcfJlEq0Rd6","start_train_data":"20190408","train_seat_feature":"3","location_code":"X1","from_station_no":"03","to_station_no":"07","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0M0","seat_types":"OM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"SbC6%2FW3Bk6d4Uc1eUULicHlomEdID%2FRaLrVmVfinhWP2iD4u72K1KjE%2B8uE2IQOSizRFz3aQoDWG%0AMlteSepoDWTKRhIl3ck005zAYBgm6FFHz9kW41umCotwJjYxyi83%2FgC9doN9xolIyouPz9GHl%2BTM%0AvzqFm5lRaFUNK6sEtzIVeyHSReBdFIJdnLjGQsOcDBHQ1a8oX3RSba%2F3djZSvOr2lU%2FgXgCRio%2Bl%0AziLGSig2Ph5%2FXcuVWr0r6XTqZKc0EJ5yKY%2FVWVnMdeWo94Qc0PRRRE8021rVH%2BwFt3Vylyw%3D","buttonTextInfo":"预订","train_no":"6i000D23160A","station_train_code":"D2316","start_station_telecode":"IOQ","end_station_telecode":"XMS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"10:29","arrive_time":"12:16","lishi":"01:47","canWebBuy":"Y","yp_info":"1fFoFBQFn3mPWqX6U3eGL7mv8EHM8lMY3%2F8xtj20L6KvS0Lo","start_train_data":"20190408","train_seat_feature":"3","location_code":"QY","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"3HFmOXuPjvSSID7h9Ym5I%2B1hD1qnVYSp7J1aQKhAOyT3VUNTmabayOawQUhIkQqdvoYPuM01mGde%0Akld4tr9elHHrVU2rzqct6ADqfRBcaBpZdVitl1L44UyfKE766J4GNb9sMiiIKezWoci2gMs0Tk8y%0ARlGI4Jwx0DrfTQgkCehUPwlPge0KX1sNhzdQaV6mgvbOED5L5yUwpybhmtaSnYtJQPTlIyN7cOg5%0A9XGPSY%2FsPOAZmAQo6actibBO4ToMG1kKwtGW4NZDA7E3dyjA91zVWU6LUmTUyiH2s0ToE6s%3D","buttonTextInfo":"预订","train_no":"6i000D22880C","station_train_code":"D2288","start_station_telecode":"IOQ","end_station_telecode":"AOH","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"10:45","arrive_time":"12:31","lishi":"01:46","canWebBuy":"Y","yp_info":"3khxSjlTHTkoC%2BAKnl9smM1FHCCjhYiLPsoN%2BafP6Np2lGnd","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"9","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"B0hs54RFZ%2BKj4z1aDBCf9dD8MX%2B2FDvAN8sio0eLoKJgZFslE5XozN7VsN%2B57F7%2BGuEdtZ34gzsx%0APc1S3YP%2BLJz1fZFRziJFyuD1OqyzXMmd5V3LLpAHu84agtJWg7wUPBNMYlV6dePKNg10Es0cFM9Z%0AGvcFhE8uaE6fzajPI0Z3nXZM%2BTIUPDADYoDHbIk4sjp5Xyzrvg%2FKZa%2Bs2g4MpD71jl3cOccHJEdv%0ApHpP4MZBzaF1igFTnbQoxmqNeFZZcGwGkbVi0lEnwtqGb1ILeNHnDlBHFioud0SkzGxi0MvNs%2Bi1%0AHmKF9E1Cq0E%3D","buttonTextInfo":"预订","train_no":"6c000G632508","station_train_code":"G6328","start_station_telecode":"IZQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"10:56","arrive_time":"12:25","lishi":"01:29","canWebBuy":"Y","yp_info":"GY7ybLnV%2F9vzjI2SFUpOI2qGxgGSgR879BsAwsex2AOuThuHZBnQJAZ5TZE%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"03","to_station_no":"06","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"5","srrb_num":"","yp_ex":"O090M0O0","seat_types":"O9MO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"IC63Ugf%2FHeHAxnqgZtbafY9fQSaqPDACmVn3xaLMs9WyS1v%2Fym6SlQBkrm3pM0wqLB52B2HLgMHh%0A%2Bnwlb%2B9vcVFJb9M4ok7Lv%2FocsWU8kJZQbMwLE0Pi5W5o5cRNlP7y96j6gBqhFhRqyx%2BbXwcuh5tF%0ArzYrWK5QdOANuf7r2R37bVmqbUWouZdSoXirYBJx6hi9GJ%2FGbAw7%2FCjHJ23qhQPkCswiJq9fiwQ%2F%0AcW8tCQ9wX5ErrkRPowgX8IxIv77iGy3cmWcN4mIIZR%2Bfn7TeFuPuFrtUVDR%2BZW8tNJGympM%3D","buttonTextInfo":"预订","train_no":"6i000D74140I","station_train_code":"D7414","start_station_telecode":"IOQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"11:07","arrive_time":"12:53","lishi":"01:46","canWebBuy":"Y","yp_info":"tDr%2Blwzaz3EJq3FiWvZluOwkWnruSnDc5ompQCCKdj4z5VPv","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"vsizajhJkmjqHSJIWudYXyTLkq8lmRRwRIuNdo3epVbypJsNAFZJQwrp1Kkt%2F8JfqkplPK5S%2BglB%0AvHLzGi5SyGx2Zr%2B48WmB8o1bTTYF91UlvOPnRQaQyCpSOy4jR72R5Ejnj1flbFgzYuiB%2FNk3elYx%0AHfAuBRks82gI0Vf09rxvCcSiXyczU62UX1TxmNcUllJeFc7SgtGBcbjTzb9QkJ6bI2FjfL1LDHeR%0A3lGM7VN0jiZxFhlPE8ueCoxgDOI6AnaY%2BDyJG5IMmbpEbhsOKkOidfj5Xl2u0Z84BNQqFbg%3D","buttonTextInfo":"预订","train_no":"6i000D311209","station_train_code":"D3112","start_station_telecode":"IOQ","end_station_telecode":"HGH","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"11:34","arrive_time":"13:14","lishi":"01:40","canWebBuy":"Y","yp_info":"o8Fv3x%2FKJEz2NJnJAMvwPWsE4r59DgMLyKeB1WBPv8gLB4ej","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"7","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"jby4AGaUNK8zSLgMc2l9Ty2j4UKkNyvgBgT1HMnhJvocTDo3R4spn5PS914ipY3oJw%2BWp%2Fczjbq0%0AmcXQQH9OGj4JUP6Rp7kufqIR%2B2Nu2W8WsislJLyFyWBdUjnIA9fH9ESBh0tGsZ8q5a7CMNMHduhr%0A6D%2BdNOcWA6tRoV68%2BD75k8ExmfUG3BYEQ%2FMMz1kxNtNbiEMO%2FUsObZ70KYiRsbYVQJLF4pm2WYMf%0AFqmpDLljh5Bm26sempfcToB5qdzOYNgaU3OoMXFnj2Hd4jzlAZvhirm%2BOzq%2FGhMUnRVrcYU%3D","buttonTextInfo":"预订","train_no":"6i000D231808","station_train_code":"D2318","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"11:49","arrive_time":"13:29","lishi":"01:40","canWebBuy":"Y","yp_info":"MH1YNEV7%2FvhLocx02JAMfJivPUQg%2FJJnReuP9aV8FtMfDsld","start_train_data":"20190408","train_seat_feature":"3","location_code":"QY","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"eEsBy2NmNBA%2BmDrMLM9LV1rHc2O9%2BttkLwD%2BUm1Trq6PfACh4O%2Fe%2Fhl6Svb4oubq06zAUnL%2FCFD6%0ARdszRidOaVqgRTIflMtevCkg9tjc0phb8PMvXVC4V9WnZLL3%2BLm8ocUwQJnaYFl7ZAyXAWlSoMcH%0APdOVTZdmbf7yZ5ETTiD0iLYVCzg0rourvjaGSoNCs%2BI5Q2aVBHcAfm4%2BoydlEY1FjhZxJkt1fnd9%0Acv%2BcxwEK10DJhUHdyyrvH7joGSzQSmKkkxCn%2B8dQOk2OVJRXFIRxb9IWAp3deMQtK1pLdNc%3D","buttonTextInfo":"预订","train_no":"6i0000D6840H","station_train_code":"D684","start_station_telecode":"IOQ","end_station_telecode":"XMS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"12:20","arrive_time":"13:54","lishi":"01:34","canWebBuy":"Y","yp_info":"BMlp4tyGKLF9WgEg3DaUZ2ciXPuMnMDbJ11bdJ9xddRO88dv","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"18","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"O3SKd2%2B2skPPo%2FhbiyG%2FiVCI6IUh9WsHNHNL%2FhW%2BCybyMA1wyHiqUG193YSB0WhP7c7WFYcbR9ix%0ANFaYwRhUe%2Fcd7agdftl%2BFOkK8HKaDE6YOggQ8k8hJY8lEzZjezZPb0RGajbiXrP1vrKNTeI8JZov%0AUl6CtTjVMsoC0U5AOuL3WuRG33kRvacB%2FaX6%2BSA68BXbgu8aChLCAvK0njEnA614va0cyBI9Unau%0Ac93daxvwIp7VYQnaNHcgAIYygq%2FxENvUFWxKHOb%2FZVDquk2jmtmMiWr%2BLiPCNM2GHNgzCU8%3D","buttonTextInfo":"预订","train_no":"6i000D235804","station_train_code":"D2358","start_station_telecode":"IOQ","end_station_telecode":"GZG","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"13:01","arrive_time":"14:41","lishi":"01:40","canWebBuy":"Y","yp_info":"I6lXIDSdIc%2FHakYG7hx1IXCHhsC%2BlHaX50q5eE1thsDqqYdj","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"17","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"VJbai92elwhDzMyvmUS8OSmMRgJb7FWLbn9mUtFCS7zL%2BTLIJ%2BvQm5G9lytJqkNB275sxUDay8Xr%0Aa49xPDDw94S0EIp9027Fd17gW1r9Z65bHao18a3M36qVk4ZTKmcuqUZt%2Bi5MmtwPfIn4T2HwQlB3%0AV0Zg6Tll2R83dcfoFi59AuKU2oY1wYFzKfUR2tFQ%2BR6rOL9hGFxNs80Qk4UpD3MthrWzUgIS3h5P%0Awad29LIjcYU8fwkEGTejl3UpXalbh%2F62kHLOZ7StKR7Sc7E7cwrMykUzf0YJC4KAvzKQNcY%3D","buttonTextInfo":"预订","train_no":"6i000D333403","station_train_code":"D3334","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"13:06","arrive_time":"14:35","lishi":"01:29","canWebBuy":"Y","yp_info":"xoFk2zUDVaFNf7ldlw%2F%2BnIHDIR9b%2B5U0lYA%2BBvehTktKNTN8","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"17","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"ZSx9KvxFNKstZ6kjfHrD8aQLgrJ3SnAfB93NwNCxEK%2FmQnadb7VjGwldhKJu6vk4kEE5fwlxxdCh%0AkXxeie1C%2B%2BbwrPt7oPHpVLDwDyCMVkU6ZXWLgCag%2BXDFj%2BGQpC5ugmOgp1MOsLUJhHo4UFHn4rC0%0AFEONpyPhIGU0hlojGJECmAEtGTNf%2FgO7WcFRIcZzdJOk9oBYVbHvteaQUtpgZxhQh4ADbN4%2FukQx%0Aff2Kn4iz%2F7tc2H4zPEmhap%2Bt8vuuocKyVa%2FmHqcRtr%2BG6e3qHfBw%2B2Jt38E7bOtZCUI%2Bvbg%3D","buttonTextInfo":"预订","train_no":"6i000D23220B","station_train_code":"D2322","start_station_telecode":"IOQ","end_station_telecode":"NXG","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"13:11","arrive_time":"14:57","lishi":"01:46","canWebBuy":"Y","yp_info":"1fzldUmPsFtHpbdmHa3rgdK1NOicZF7TxWhhMKR2bBSjZBbg","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"2","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"ETRZ7brvyaoVb1lw0Qjz1JLZFPczzol5iCAXeFFaVDs47zvtegRDy5nvpIoaJXFnM5udXD4F%2FnhO%0AwjgrmUVCv2Wp4xwJc7Mv7H5n%2FDqvuMh1tI0U5eGAcwy7fwJtfj6r%2BWzubyrQXqxpLR%2F%2BdsWQnLs4%0AUZa1gvIJW8ZTaaptUsQsSX1GjBJfPWy79Bh9X6vwB2VK6Ka%2BmptCQPVTmZaXtgimL2ESjS19j3wG%0A%2FxkvkpkfNAkaWs6HT2PG1Box4gXkIBpUMD%2FDL5AlFjiPsUNguJsLeAAWvAi8eP2xyWiiedY%3D","buttonTextInfo":"预订","train_no":"6i0000D69203","station_train_code":"D692","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"13:16","arrive_time":"14:51","lishi":"01:35","canWebBuy":"Y","yp_info":"Mm0FPjtHEG5ikzSttXeykF6SjQB4gOgIVoPYGhtS3HEDZ0sc","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"%2BivnHdXZMgi9iVIlYirnhcfV8R800tAcowMrXpFMSGMeLzTCKpz3wJlddKlrw8NHbR3hSAnti31j%0A0NKY%2BviuvyjzOWsI6qIQ%2FOgQJ3jQ0Bd%2BjILbEvAq9O5u8MGhJRMYPlNwiSuMbM8dc7nGxBcwYYXW%0AtRxYfdu3wXE315BF5oxeD2WJinbtdwoscdyyDj6GUUnEjDYJW9ze458mhVgfeg50Maxmidu8QH87%0AMPcI3bQx0rnXSXWr93dm5%2B05sFnZHyVNPDuCjZuWis13kUJpWpucCD%2FgSmjs%2FtYoIp3haa9vjjzh%0APDFP9W3M%2BjY%3D","buttonTextInfo":"预订","train_no":"6e000G634005","station_train_code":"G6340","start_station_telecode":"ZHQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"13:47","arrive_time":"15:27","lishi":"01:40","canWebBuy":"Y","yp_info":"4Czxa0PSENn8qNW5NWj9UcVPoBsm8qcTwjPvdLQq7jFGpojUWvAjh%2B1Ul38%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"04","to_station_no":"07","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"2","swz_num":"3","srrb_num":"","yp_ex":"O090O0M0","seat_types":"O9OM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"D75OopgwSk4PIQ1jksVunpMLfRbOX0Q%2FNkyHufJr3Gq2skcXxMaizcWx3XYVAY0g%2B4VXirA%2FKJSG%0AE%2F6lv4SSrJG1aUWhwCxSy2gYO%2FXChXpDqu4uPxAZE4gPuApa74ZcfAjn44IYkiQhHJJX31%2Fz1cE%2F%0AAuL5DDkPZ9pYjkitv9X%2BUpW5iUeX1mYaVMuKGq%2F6%2FsYaTn4Xw9XabLjGYJzP4VHilFOwMWjWRtVe%0ApiupePg%2FKEAaJ5Jz0qon%2F%2BNuXJyiLK%2BPN3gEohvCuhZ%2BJK7Q2v0YI70dH7jhRzwrfFgNwGY%3D","buttonTextInfo":"预订","train_no":"6i000D235604","station_train_code":"D2356","start_station_telecode":"IOQ","end_station_telecode":"LYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"14:12","arrive_time":"15:41","lishi":"01:29","canWebBuy":"Y","yp_info":"moIlIJl8WKsJOQObrEu0l3ng7oKNGNBq3PwQDZVtzHfaBfJM","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"n6jgTprq0u3S%2Blx4%2FPMWz0e829nyNUSkrYxGhalcmJjWiIz3PXaD%2FdDtec%2BQZerFg4p66ZOK7Lv1%0AxYH2bGqifRe32k6LDSG2qZZGu1bjNMayecrOn7KTuXVgZEVuZ%2B%2BjmXOT157bXNGNiooLjFGeyLmM%0AiXMeyCHa5NKh7XADp3dx3GZ5yHYya2x3mh4l7kluXfJbjh5823g0zsVF%2F1LF2aG5KFe7bYKS7ksc%0AwcVhR2z6mMFBs%2BXKIVrenZaOuD5ekm8%2FBY4pVcPJIcH5zVW8oyftQYgs8pgF8fPGRKTKawE%3D","buttonTextInfo":"预订","train_no":"6i000D74240F","station_train_code":"D7424","start_station_telecode":"IOQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"14:36","arrive_time":"16:16","lishi":"01:40","canWebBuy":"Y","yp_info":"hlA7oS9VyGBkIixj9%2BR6T983Sy%2BMoh%2FNB5JNoUFXiDBCCTzA","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"","buttonTextInfo":"预订","train_no":"6i000D22980F","station_train_code":"D2298","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"14:48","arrive_time":"16:11","lishi":"01:23","canWebBuy":"N","yp_info":"yevNs4ychMvpJAH%2FV1TaYszKEn5rgMkoq2esyzdq79f9votA","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"3Mllp%2F2UktDSEYG1HF99XRzOjdzFYn7xMbwbm1CuP2iOGWZQ7Z1SrAQ87CYGIfkT0VPVIBlza4qk%0Ar9GBUXlAxxwOhYNSPO%2FjIU2jR9%2FVQff6x8c0iX3O0EmmHzUs8LPO%2FE8PiLgsFk1mSmMk2bIMxblB%0Azecj6Ggx2PyQs8Y712LPJWBdNcKpzDWCIUJi4XM9JFKRzs7fEiBhfj0hunVDDzjifK6mt9lu1D9r%0A0xw6u4itxtbNpD96civENvMCIE%2FVuYvKGiiYPVAVpgANVVakqLFjMNpqHkdxqHLpxnMsyogclZEJ%0ATrM3djxr8I8%3D","buttonTextInfo":"预订","train_no":"6c000G631308","station_train_code":"G6316","start_station_telecode":"IZQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"15:15","arrive_time":"16:49","lishi":"01:34","canWebBuy":"Y","yp_info":"o%2FdEDnSJrrrPdxPIdNwpvXPHvV6SfXAG0Pu0xr1UfyuJuinrMVzvRJ8XitY%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"02","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"3","srrb_num":"","yp_ex":"O090M0O0","seat_types":"O9MO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"cZERLD5c2RHIddHyNtVlIk%2FKk1RoJGLhndO1%2FUtC0agMKgEiomvwloQCuW0LIWniXfs64xkBDpdN%0A8SyeOjkR1%2FWdTqzbbnmJQ%2BNLtGh3X%2B2Q3FSQ3iyGuUe2KZ0pp%2Btd%2FsJlRwQku%2Fllj8g0tAFBslrC%0AXi7T%2FGtU1Tv%2Fkm2%2FeGNMYxfMVV1oXYjE4Kb%2B3SNsGLAHOrUBRrXsxHd4fyOzIc11gqnvS5eonnJv%0AmafxsFcMEQgMVN40CZYvKhIJailRUxwpVBKoxch3eoVUoJDK%2FlCcr3prnJ2va44z5OtbHag%3D","buttonTextInfo":"预订","train_no":"6c000G160701","station_train_code":"G1610","start_station_telecode":"IZQ","end_station_telecode":"FZS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"15:47","arrive_time":"17:10","lishi":"01:23","canWebBuy":"Y","yp_info":"ZeiXepuMGIPS9YgPcWPqcyQBb8djGqbhBDIkUGlXKvq857e0","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"03","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"13","swz_num":"9","srrb_num":"","yp_ex":"O0M090","seat_types":"OM9","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"","buttonTextInfo":"预订","train_no":"6x000G300401","station_train_code":"G3004","start_station_telecode":"XJA","end_station_telecode":"XMS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"16:02","arrive_time":"17:42","lishi":"01:40","canWebBuy":"N","yp_info":"nJoNKp88u1wYWFTWHVSOWmdNl04tw0Bh","start_train_data":"20190408","train_seat_feature":"3","location_code":"X1","from_station_no":"03","to_station_no":"06","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0M0","seat_types":"OM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"cCqxNJpzAJ1M3x9BccpXkoqs3Tl6Y4VwDVxBmhLbSefUMcY4qqO4gRUFkpOGwqOJZ9gOOCskoVXN%0AXnTL4NUZzs7nHmM2KpxH6yoRX%2FMXH%2FOfjFxTy%2BGS8hUaRQPFbpIm2t6hZlIiZTepVCSEjmyjuvBf%0AVO0JRSCkppOGfUeXfLTgSutXCBi54N%2F1EZm0yI7Fz1UKZeFGuFONvFto5kZK1EoOCM80ZZikEMyR%0AzMsLh6ycteB8NS%2FSKMqJFHZSo%2BWrdvox55YgzY6UoeVB8f7adPnqu71S%2FKMIaa5M0eaX%2B7U%3D","buttonTextInfo":"预订","train_no":"6i000D234004","station_train_code":"D2340","start_station_telecode":"IOQ","end_station_telecode":"XMS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"16:07","arrive_time":"17:36","lishi":"01:29","canWebBuy":"Y","yp_info":"bL65Kl5qcOPxwZNKzmFLLNV67lclJ05rj0OBjBM3Jhp7XnFW","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"6","swz_num":"无","srrb_num":"","yp_ex":"O0M090","seat_types":"OM9","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"rZDBF1fScjJCuA5fHOFYZDCfCmEgtU%2Bf8uNQRaCH%2FSm7u%2BWaf1pXM9LGXnRvnq9zfe4dI3HUVOJX%0AgYhOLpouX6V1aXl0SeK4uNG4Q2oRV%2FOd0XD2Llk7zx6KXU8hYYkLZWXeG6SX6hCkb9Y2nIokZcde%0ABdLK7FVl6DHFOegIIKOLwJNclUiiYyTy5nL7r2zI%2B1y2HNbGaD6pKPMjkrThdHZaUo2L6c6wRLVn%0A61buHpfUXYVgI0AZkEgq4QE1NA48aag6qgv8DMSGCKUUL5MXtVrp8DCiBuBiYzdP4Rii0CE%3D","buttonTextInfo":"预订","train_no":"6i000D23260S","station_train_code":"D2326","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"16:22","arrive_time":"18:08","lishi":"01:46","canWebBuy":"Y","yp_info":"baKMIejSxRWuXLrHoOqkTLJz5vfmf5dve49Gxoo1hgVpI3z0","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"boLQjHgeU1RKRWmr8m%2BgO2t%2BlEbiVWgIM75A1u3zixsYMbH3BqiHwlk%2FWEDuI9I8Gkq7zf10o84h%0AudVHF8JcDoQMLuYhhSpsC4w5mY77E5dNJlKOAU98UkMQEz%2F%2FLbzAZwmRYh%2F2F48IE7scgVLqgEmR%0AfJO%2F695l4SzyuVzJqglGkuEjeYHvxTtN0R%2Fx8o6zjJE1gipSxCWBCgFpRKv0flSQ5KGAX2KquJBs%0AN3D800sOngsKyg6zb5uk1ztec9tXMq6EG2eUgsahBxVhUfBdGuoUC1mm0rLdU%2BsSnB%2BJIsVJ0zxX%0AeAn1wXMQK5E%3D","buttonTextInfo":"预订","train_no":"6c000G63090B","station_train_code":"G6312","start_station_telecode":"IZQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"16:39","arrive_time":"18:19","lishi":"01:40","canWebBuy":"Y","yp_info":"%2Fdxs%2FCRVCw4zSfI2XHsLQZxF9H6ezFLuqqKtEI1kogevzGXYHh8Ng2JQj%2Bg%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"03","to_station_no":"06","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"3","srrb_num":"","yp_ex":"O090M0O0","seat_types":"O9MO","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"EIMZ7p%2FYVRnupqbRE8xOXhj6XOleD20OfMI2hHZS7nJn4k%2BBV%2BVyE%2FMNruMvMZqW4Und4QJWVg2U%0Ai%2FFqkvZBGn7Cn39Tl6clz3sPWY1O%2Fa7OcPujjfDVBP%2BezWPfs9%2BFK5%2B8X7%2BaiKSWOzp64hK2gZ5M%0AwDDJNl5Ko4Eony1agx0vkYHi%2FXespXTjcrQqD4gVHlNHtmMGYRFdK8E3jG9wPSwfLGkGA2ez8Z89%0AMq%2FaUdifw4oQxXoA7gpJIofRuI5EJ1R%2Fe2%2FG7XL5hburo6G9BckZTvTVW5qIRI343hhuJTY%3D","buttonTextInfo":"预订","train_no":"6i000D23120G","station_train_code":"D2312","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"16:44","arrive_time":"18:13","lishi":"01:29","canWebBuy":"Y","yp_info":"C2EnJpneno6M%2BoRmZPCDmg9UBSSocrmHQhQFSOqlYoaRXevD","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"11","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"pKOGmTOsAfpWCWOCeYc144yMCRMOkYHMIcpnrFJpAMxu1b1edqMQupsQ%2FvlF6t%2BIHXpsPT0gFiBQ%0AI5THnpG3uNNWdSK4TQylnjlciWl3tt%2BYJCgZx9rdNM1ZyASMoP4krwtal1B8FT5ki9rwToJEWWNX%0AHYc%2Bl6TKc1EwAE0FpCNoE2V0d6iFc651zpgmxTgyObt4AGgNN%2FI%2FEa3x%2FJpFEAx5PBU6GItNGOf%2F%0Aem%2FUqvXUfhmkgDc75hNKddbHeQOrxZL73mOl1a7ezAFHe71GDAR2KPJStFjyUUziNHEoa4I%3D","buttonTextInfo":"预订","train_no":"6i000D23300E","station_train_code":"D2330","start_station_telecode":"IOQ","end_station_telecode":"FZS","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"16:59","arrive_time":"18:45","lishi":"01:46","canWebBuy":"Y","yp_info":"lmPvwow6o%2FXmPO1jWSjF3tDmhiHGMQRp6%2Brse6Ux6m%2BwE4iv","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"sq3vAJt8Dya1jbJVPNOQZ4OHISgSIv95Unf38elRQuPM2SqRW4Rfwg3omsoi13wdQzcuqZ6vk2js%0AHIEZ2C%2FAhCz9pruDWD7ON%2BVbfTNHq3DnJyF%2FuPM8BDYsUnbB%2FdkEtq6SA9UBkK33DvWi7eOVZ8m2%0A5wNmH0sqR9VvxZz3CWH5Z0ODZePOvJz6B%2BdKY8tLuHSCoz1Dx38fLudjlS3bfWV6AycqKAWtwyez%0AkhNnfc%2FD7IcjPs8JVbniqhwHINhMHxwafhWcmj5pM%2B1gLv4inCvWk3hgpjiT","buttonTextInfo":"预订","train_no":"6x000G638801","station_train_code":"G6388","start_station_telecode":"XJA","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"17:20","arrive_time":"19:06","lishi":"01:46","canWebBuy":"Y","yp_info":"ooOT6VgqYPMl5oh94Uhewx%2FzktgDon%2Fb","start_train_data":"20190408","train_seat_feature":"3","location_code":"X1","from_station_no":"02","to_station_no":"06","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"无","swz_num":"","srrb_num":"","yp_ex":"O0M0","seat_types":"OM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"n%2BztauNMViKy4Tf1xnf5NTFu5763BRwr0qDeqXteG4ufyMqtaemyPbbMO8zkf2b2Rq%2Bcsh72zacJ%0AmutVsuwdjeWPomJ8nBWt7XBC1hy7Hptq%2BrNigaa2BuUIcY3Otc6%2BnB3JILHLE8BZtxXhoMQbd2%2Bk%0AsUmMbJ%2BMMsoqdGdxJFk0mChprSs12ovA1FQzBpEoFp%2FHlOaIZK7P2P2nqkQYqvx80O5CtH3LakVj%0Ajj7abKh0Qg9HZlG5q5Z0TQrMmu0KARj6U2SPtzX9L2s56EY%2B%2BnsCF2saoDesnwyeVWwjX10%3D","buttonTextInfo":"预订","train_no":"6i000D74100A","station_train_code":"D7410","start_station_telecode":"IOQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"18:19","arrive_time":"19:59","lishi":"01:40","canWebBuy":"Y","yp_info":"iIv%2BXxmz42QWAyZfdmzq%2FLlIX%2BcRQ7Z%2B3kz2bDF1ax0FKjCU","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q6","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"10","swz_num":"","srrb_num":"","yp_ex":"O0M0O0","seat_types":"OMO","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"dpQhABS5Ow%2FgFxOleFr7kQM33o%2BxHvPu25Xg1OnsSpY70mz6HUCeBmArQU89z3oPPUmemZqscnWh%0AR5m4hb99BSkTbij6I9xn3k%2FSmuaCD9LPoSU3U3%2FAgkCcTv%2FTzIbQnkw6uMXNyi3abGatY8yBgX6%2F%0ALbW52vmeD6wXXBCMcXI6z1K9zU8%2FG%2FoBSAoo8YnG7Pp3thNO5JRCEFW%2BKCxIrZ0RF4vw%2Bl5dv0qX%0A%2FPYxe2N8rVxc2%2FsiRENG3j9li7bK6HpF8Tufxx%2B%2F9%2FUA3ACHOVCvmdvQtsNnyyW2wXfviRE%3D","buttonTextInfo":"预订","train_no":"6i0000D69003","station_train_code":"D690","start_station_telecode":"IOQ","end_station_telecode":"XKS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"18:30","arrive_time":"19:53","lishi":"01:23","canWebBuy":"Y","yp_info":"rU6qWklw9nIWRNMuY8Lidg9h7WtCil7yC4gf%2FFdNeBPRMltV","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"无","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"","buttonTextInfo":"列车运行图调整,暂停发售","train_no":"6i000D334208","station_train_code":"D3342","start_station_telecode":"IOQ","end_station_telecode":"FYS","from_station_telecode":"IOQ","to_station_telecode":"KTQ","start_time":"24:00","arrive_time":"24:00","lishi":"99:59","canWebBuy":"IS_TIME_NOT_BUY","yp_info":"","start_train_data":"20190408","train_seat_feature":"","location_code":"Q6","from_station_no":"01","to_station_no":"05","is_support_card":"0","controlled_train_flag":"1","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"","zy_num":"","swz_num":"","srrb_num":"","yp_ex":"","seat_types":"","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"葵潭"},{"secretStr":"poDLzSXT7VenPgO%2BowrT1HH3%2BeLMXqH5TueqqnYZwo3YyPMCpPzmw7xsc0drZxoH0wuuKjGBdPMY%0A9Cm55I9d8EKZe4cXlv%2FiePM%2BDPj%2FTksoOs8R3mzxzDH9D5mt8OUXcMTo%2BkTHGfDYToDW5IAe%2B5Z4%0AGYAaVA6p0DQDFp6Scs0Yq%2FMj9cTFfmzgcaZLCCildWSSniQcOUo5MF0ltjaPszN4UPGL%2FuuCX4h6%0AYx45OREJQGL09X9G%2B4TrzcOXRHU0z%2FBzpttS8NzNo6D%2F4nBP047MnOW36mc2wt5mRYd%2FxjU%3D","buttonTextInfo":"预订","train_no":"6i000D744000","station_train_code":"D7440","start_station_telecode":"IOQ","end_station_telecode":"OTQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"19:13","arrive_time":"20:53","lishi":"01:40","canWebBuy":"Y","yp_info":"OS9hR79EX3yBqaMeff82dZZdGn5ozNSf6WKoJn2cOU3FnLJF","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q7","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"arLFpg61rjmuxqXthnbxW4pzJXNYBQDYHHaDUj8aA7U7jS3kqq2uicHCmv1YP4TjBaIeu1CCUGn5%0AxtLSK6DSfmB4aYYSzsrzth%2FGsJ%2B1VyqSw75BdS8XTAZ9PD%2BH68XKcsB2Url9HHciH1atbkwyGdYz%0A7D9W9S%2Bui%2Fp3w6ET9QLACzLZPKFNwJNn%2FxNOsl0hBO4aRwdrH4IMvFqVC4qg%2FAvAV8JrGondT3d1%0AHBzjuzg6npz9sBM1VZ7Sqs8KZlLE6UptYue34HzKZWV1EOlv1vXLpeOk2j8IdXoo%2FNTgsWc%3D","buttonTextInfo":"预订","train_no":"6c0000D9370F","station_train_code":"D936","start_station_telecode":"IZQ","end_station_telecode":"AOH","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"20:19","arrive_time":"21:47","lishi":"01:28","canWebBuy":"Y","yp_info":"V5sU8qS%2FTS%2Bt3%2B4UxBAY9MFx7uUdSlo99InLetgiB%2Fk41YOA","start_train_data":"20190408","train_seat_feature":"3","location_code":"QZ","from_station_no":"02","to_station_no":"03","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"无","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"","swz_num":"","srrb_num":"有","yp_ex":"A0O0F0","seat_types":"AOF","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"xM%2FJx%2Bu8rHbEkr3dPrlxwpY4z3fRSBHlp2uTetEpfwvMJvsBDgD%2FDV7WRCzwfP2uctxJcbUufz9t%0ArguIRSYIUgN1kWNTyqRH3YI2vM9luaMU1PlWlDnr1%2BoyFuk9jd5a%2FGLQeFktlOyAE5FCdFEWqdRB%0ACg0Ily6m7X5pkKJBVJzzEWh6ok46tnIoTCiSrwp7K1v3lC90Wn20xrEdaGIXknCaFTGtcxhUcsRZ%0AaLSWhkwZQna%2BVNsXVy0gCrhTCYsX4euACb1fQtiukRWeL%2ByF3zKQOlpePEDYbRYaexZZeHeTuomZ%0AUaQakFhBk9M%3D","buttonTextInfo":"预订","train_no":"6c000G634503","station_train_code":"G6348","start_station_telecode":"IZQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"21:15","arrive_time":"22:49","lishi":"01:34","canWebBuy":"Y","yp_info":"7Izhyg7eoyVm7AAnHLC1rEQEF%2FGtELDFwey2%2FUGChXkrCJFcPO0eqWPzyC8%3D","start_train_data":"20190408","train_seat_feature":"3","location_code":"QX","from_station_no":"03","to_station_no":"05","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"无","zy_num":"无","swz_num":"无","srrb_num":"","yp_ex":"O090O0M0","seat_types":"O9OM","exchange_train_flag":"0","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"},{"secretStr":"cRMsqdHVZJyujCY6ksUSTDI5siwHv3mDVzSYGq%2F8inMNXJ0JtqKl%2BMNUJIcgbw8lYgDxeGgkZVF6%0AyngChlp3lJIpRvnI7gLlJ7b4YxQhtwVkKNuX3UM6n7C8dFuJjGkabbdslY9CH9Frm1P%2BQ5wVsCNL%0ArbsYL%2F2QEsJqW7xVP2XWskfepwMkK81GMUZFzCVCQpGF570sC9w3mS5tSa%2F8qV8Fqz66bhUjFh%2Bc%0AWNaoYeE9Pbc83LQTlGS%2BBdlgR5GdgDADGvC1dLCQEbfyp%2FKkRFBXV9v4SDaqqGnhoWkKJIs%3D","buttonTextInfo":"预订","train_no":"6i000D74180A","station_train_code":"D7418","start_station_telecode":"IOQ","end_station_telecode":"CBQ","from_station_telecode":"IOQ","to_station_telecode":"PEQ","start_time":"21:23","arrive_time":"23:03","lishi":"01:40","canWebBuy":"Y","yp_info":"LrTBa94YgkvyUGnqiSZ52eJQJcUOatxSdHnndZc%2BSPP%2Br5E7","start_train_data":"20190408","train_seat_feature":"3","location_code":"Q9","from_station_no":"01","to_station_no":"04","is_support_card":"1","controlled_train_flag":"0","gg_num":"","gr_num":"","qt_num":"","rw_num":"","rz_num":"","tz_num":"","wz_num":"有","yb_num":"","yw_num":"","yz_num":"","ze_num":"有","zy_num":"有","swz_num":"","srrb_num":"","yp_ex":"O0O0M0","seat_types":"OOM","exchange_train_flag":"1","houbu_train_flag":"0","houbu_seat_limit":"null","from_station_name":"深圳北","to_station_name":"普宁"}]
            }
        },
        computed: {
            ticketVmData(){
                return this.ticketData.slice(this.pageIndex*10, 10*this.pageIndex+10);
            },
            ticketDataCount(){
                return this.ticketData.length
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
                this.pageIndex = page-1;
            },
            TicketQuery(){
                let _this = this;
                _this.ticketLoading = true;
                ajax.post('api/Station/ticketQuery', {
                }).then(function(response){
                     _this.ticketData = response.data.data;
                    _this.ticketLoading = false;
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