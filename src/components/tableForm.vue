<template>
    <div class="d-flex flex-column align-items-center" style="transform: scale(0.9); height:120vh;">
        <div class="div-head">
            <img src="https://firebasestorage.googleapis.com/v0/b/stockwebapp-9ad1d.appspot.com/o/footer.png?alt=media&token=dce49b27-8eb6-45de-acc1-6be1acf42ff7"/>
        </div>
        <div class="mb-3 mt-4" style="margin-left: -780px;">
            <b-button class="w-10" variant="outline-light" style="font-weight: bold;" @click="addStock()">新增股票</b-button>
            <b-button @click="closeAll()" style="margin-left: 20px; font-weight: bold;" variant="outline-light">全關</b-button>
        </div>
        <div style="width: 969px; height: auto;">
            <b-table :items="tableData" :fields="fields" sort-icon-left fixed borderless class="text-center" style="color: white;">
                <template #head(number)="row">
                    <div class="tableHeaderFont tableHeader-number">{{row.label}}</div>
                </template>
                <template #head(shareHolding)="row">
                    <div class="tableHeaderFont tableHeader-shareHolding">{{row.label}}</div>
                </template>
                <template #head(shareHoldingPrice)="row">
                    <div class="tableHeaderFont tableHeader-shareHolding">{{row.label}}</div>
                </template>
                <template #head(counts)="row">
                    <div class="tableHeaderFont tableHeader-shareHolding" style="margin-left: -25px;">{{row.label}}</div>
                </template>
                <template #cell(number)="row">
                    <div v-show="!row.item.editing" class="tableCell-number" >
                        <div class="d-flex justify-content-start" @click="row.toggleDetails" style="cursor: pointer;">
                            <div style="margin-top: 15px;">
                                <b-icon v-show="row.detailsShowing" size="sm" icon="caret-down-fill" style="cursor: pointer; color: #dab56e;"></b-icon>
                                <b-icon v-show="!row.detailsShowing" size="sm" icon="caret-right-fill" style="cursor: pointer; color: #dab56e;"></b-icon>
                            </div>
                            <div class="tableCell-number">
                                <div class="tableCell-number tableCell-stockName">{{row.item.stockName}}</div>
                                <div class="tableCell-number">{{row.item.number}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-show="row.item.editing">
                        <div class="d-flex" style="margin-top: 5px;">
                            <b-form-input class="tableCell-stockNameInput" v-model="row.item.stockName" placeholder="輸入股名"></b-form-input>
                            <b-form-input class="tableCell-numberInput" v-model="row.item.number" placeholder="股號" @keypress.enter="saveRow(row)"></b-form-input>
                        </div>
                    </div>
                </template>
                <template #cell(shareHolding)="row">
                    <div class="tableCell-shareHolding">{{getShareHolding(row)}}</div>
                </template>
                <template #cell(shareHoldingPrice)="row">
                    <div class="tableCell-shareHolding tableCell-shareHoldingPrice">{{getShareHoldingPrice(row)}}</div>
                </template>
                <template #cell(counts)="row">
                    <div class="tableCell-count d-flex justify-content-end" style="margin-left: -25px;">
                        <label class="tableCell-count-label">{{getCounts(row)}}</label>
                        <b-icon icon="trash" @click="deteleRow(row)" style="cursor: pointer; margin-top: 5px; background-color: rgb(41, 41, 41);"></b-icon>
                    </div>
                </template>
                <template #row-details="innerRow">
                    <div class="d-flex justify-content-center">
                        <b-table :items="innerRow.item.innerData" :fields="detailFields" sort-icon-left fixed borderless class="text-center innerTable" style="color: rgb(241, 241, 241); width: 920px;" tbody-tr-class="rowClass">
                            <template #head(action)>
                                <div class="tableHead-action">
                                    <b-button @click="addInnerRow(innerRow)" variant="outline-light" size="sm" style="margin-left: -8px; padding: 5px 6.5px; font-size: 13px;">新增交易</b-button>
                                </div>
                            </template>
                            <template #head(date)="data">
                                <div style="margin-left: 5px; width: 80px;">
                                    {{data.label}}
                                </div>
                            </template>
                            <template #head(inHolding)="data">
                                <div style="margin-left: 5px; width: 92px;">
                                    {{data.label}}
                                </div>
                            </template>
                            <template #cell(date)="data">
                                <div v-show="!data.item.editing" class="tableCell-innerRow tableCell-date">{{data.item.date}}</div>
                                <div v-show="data.item.editing">
                                    <DatePicker placeholder="選擇日期" @change="formatDate(data, innerRow.index)" v-model="data.item.date">
                                        <a-icon slot="suffixIcon" />
                                    </DatePicker>
                                    <!-- <datepicker @closed="formatDate(data, innerRow.index)" v-model="dateSelected" format="yyyy-MM-dd" :language="zh"></datepicker> -->
                                    <!-- <datepicker v-model="data.item.date" format="yyyy/M/dd" :language="zh"></datepicker> -->
                                </div>
                            </template>
                            <template #cell(type)="data">
                                <div v-show="!data.item.editing" class="tableCell-innerRow tableCell-type">{{data.item.type}}</div>
                                <div v-show="data.item.editing">
                                    <b-form-select v-model="data.item.type" class="tableInput" :options="selectType"></b-form-select>
                                </div>
                            </template>
                            <template #cell(inHolding)="data">
                                <div v-show="!data.item.editing" class="tableCell-innerRow tableCell-inHolding">{{data.item.inHolding}}</div>
                                <div v-show="data.item.editing">
                                    <b-form-input v-model="data.item.inHolding" class="tableInput"></b-form-input>
                                </div>
                            </template>
                            <template #cell(inHoldingPrice)="data">
                                <div v-show="!data.item.editing" class="tableCell-innerRow ">{{data.item.inHoldingPrice}}</div>
                                <div v-show="data.item.editing">
                                    <b-form-input v-model="data.item.inHoldingPrice" class="tableInput"></b-form-input>
                                </div>
                            </template>
                            <template #cell(fee)="data">
                                <div v-show="!data.item.editing" class="tableCell-innerRow ">{{data.item.fee}}</div>
                                <div v-show="data.item.editing">
                                    <b-form-input v-model="data.item.fee" class="tableInput" @keypress.enter="saveInnerRow(data, innerRow.index)"></b-form-input>
                                </div>
                            </template>
                            <template #cell(total)="data">
                                <div class="tableCell-innerRow">
                                    {{calTotal(data.item)}}
                                </div>
                            </template>
                            <template #cell(action)="data">
                                <div class="d-flex justify-content-end tableCell-action">
                                    <b-button v-show="!data.item.editing" class="tableButton-innerRow" variant="outline-light" size="sm" @click="editInnerRow(data, innerRow.index)">
                                        編 輯
                                    </b-button>
                                    <b-button v-show="data.item.editing" class="tableButton-innerRow" variant="outline-light" size="sm" @click="saveInnerRow(data, innerRow.index)">
                                        儲 存
                                    </b-button>
                                    <b-icon icon="trash" @click="deteleInnerRow(data, innerRow.index)" style="cursor: pointer; margin-right: 6.5px; margin-top: 7.5px;  margin-left: 4px; background-color: rgb(41, 41, 41);"></b-icon>
                                </div>
                            </template>
                        </b-table>
                    </div>
                </template>
            </b-table>
        </div>
        <div class="mb-3 mt-4" style="margin-left: -780px;">
            <b-button class="w-10" variant="outline-light" style="font-weight: bold;" @click="addStockFromBottom()">新增股票</b-button>
            <b-button @click="closeAll()" style="margin-left: 20px; font-weight: bold;" variant="outline-light">全關</b-button>
        </div>
        <div class="div-end">
            <img src="https://firebasestorage.googleapis.com/v0/b/watchapp-e35a6.appspot.com/o/banner.png?alt=media&token=02ae59d2-c30a-4c98-a5be-18cce682ff3f">
        </div>
    </div>
</template>
<style>
body {
    background-color: #333333 !important;
}
.div-head{
    margin-top: -20px;
    position:relative;
    top: -10px;
}
.fontSize {
    font-size: 16px;
}
.tableHeaderFont {
    font-weight: normal;
}
.tableHeader-number {
    width: 250px;
    border-bottom: 1px solid rgba(102, 108, 114, 0.425);
    text-align: center;
}
.tableCell-number{
    margin-left: 2px;
    width: 240px;
    background-color: rgb(41, 41, 41);
    color: rgb(180, 180, 180)
}
.tableCell-stockName{
    font-size: 20px;
    font-weight: bold;
    color: rgb(241, 241, 241)
}
.tableCell-count{
    font-size: 20px;
    font-weight: bold;
    background-color: rgb(41, 41, 41);
    padding: 12px;
}
.tableCell-count-label{
    padding-right: 37px;
    background-color: rgb(41, 41, 41);
}
.tableHeader-shareHolding{
    border-bottom: 1px solid rgba(102, 108, 114, 0.425);
}
.tableCell-shareHolding{
    background-color: rgb(41, 41, 41);
    font-size: 20px;
    font-weight: bold;
    color: rgb(241, 241, 241);
    padding: 12px 0;
}
.tableCell-shareHoldingPrice{
    color: #25e9f0;
}
.tableCell-stockNameInput{
    width: 160px !important;
    height: 40px;
    margin-left: 5px;
    text-align: center;
}
.tableCell-numberInput{
    width: 85px !important;
    height: 40px;
    margin-left: 10px;
    text-align: center;
}
.innerTable{
    border-collapse: separate;
    border-spacing: 0 1em;
}
.rowClass {
    background-color: rgb(39, 39, 39) !important;
    font-weight: bold;
    margin-left: 10px;
    margin-bottom: 10px;
}
.tableCell-innerRow {
    background-color: rgb(39, 39, 39);
    font-size: 20px;
}
.tableCell-inHolding{
    margin-left: -15px;
}
.tableCell-date{
    font-size: 18px;
    font-weight: normal;
}
.tableHead-action{
    margin-right: 15px;
}
.tableCell-action{
    background-color: rgb(39, 39, 39);
}
.tableButton-innerRow{
    margin-right: 12px;
    width: 65.5px;
}
.tableCell-type{
    font-weight: normal;
}
.sr-only {
    display: none;
}
.vdp-datepicker input {
    width: 100px;
    margin-left: 15px;
    margin-top: 3px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid rgb(102, 108, 114);
}
.tableInput {
    width: 115px;
    text-align: center;
    height: 32px;
    border-top: none;
    border-left: none;
    border-right: none;
    font-size: 16px;

}

.custom-select, .custom-select:focus {
    outline: none !important;
    background-color: snow;
    border-radius: 5px;
    color: rgb(39, 39, 39);
    font-size: 16px;
}
select option {
    background-color: snow;
    color: rgb(39, 39, 39);
}
.form-control{
    border-top: none;
    border-left: none;
    border-right: none;
    font-size: 18px;
}
input[type="text"], textarea {
    outline: none;
    box-shadow:none !important;
    background-color: snow;
    border-radius: 5px;
    font-size: 18px;
}
.btn:focus {
  outline: none;
  box-shadow: none;
}
.ant-calendar-picker-icon{
    display: none !important;
}
.ant-calendar-picker-clear{
    display: none !important;
}
.ant-calendar-picker-input{
    padding: 2px 5px 2px 0px !important;
    font-size: 18px !important;
    text-align: center;
}
.div-end{
    height: 500px;
    margin-top: 80px;
    position:relative;
    bottom: 20px;
}

body  .table.b-table>tfoot>tr>[aria-sort=none], body  .table.b-table>thead>tr>th[aria-sort=none]{
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='darkgoldenrod' opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='darkgoldenrod' opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e")!important;
}
body .table.b-table>tfoot>tr>[aria-sort=ascending], body .table.b-table>thead>tr>th[aria-sort=ascending]{
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='darkgoldenrod' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='darkgoldenrod' opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e")!important;
}
body  .table.b-table>tfoot>tr>[aria-sort=descending], body .table.b-table>thead>tr>[aria-sort=descending]{
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='darkgoldenrod' opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='darkgoldenrod' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e")!important;
}
</style>
<script>
//import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import {zh} from 'vuejs-datepicker/dist/locale'
import { usersCollection } from '../includes/firebase'
import DatePicker from 'ant-design-vue/lib/date-picker'; // 加载 JS

export default {
    components: {
        DatePicker
    },
    data() {
        return {
            /*  【外面】股名／代號－持有股數－持股成本均價
                【裡面】交易日期－交易類別－買入股數－買入價格－手續費－合計 */
            //   交易類別(選單): 定期定額 / 主動買入
            zh: zh,
            dateSelected: '',
            transProps: {
                // Transition name
                name: 'flip-list'
            },  
            fields: [
                { key: 'number', label: '股號 / 股名', sortable: true  }, { key: 'blank1', label: '' }, { key: 'shareHolding', label: '持有股數'}, 
                { key: 'shareHoldingPrice', label: '持有成本均價'}, { key: 'blank2', label: ''}, { key: 'blank3', label: ''},
                { key: 'counts', label: '交易筆數'},
            ],
            detailFields: [
                { key: 'date', label: '交易日期', sortable: true, thClass:'tableHeaderFont' }, { key: 'type', label: '交易類別', thClass:'tableHeaderFont'}, 
                { key: 'inHolding', label: '買入股數', thClass:'tableHeaderFont'}, { key: 'inHoldingPrice', label: '買入價格', thClass:'tableHeaderFont'}, 
                { key: 'fee', label: '手續費', thClass:'tableHeaderFont'}, { key: 'total', label: '合計', thClass:'tableHeaderFont'}, 
                { key: 'action', label: '', thClass:'tableHeaderFont tableHead-action'}
            ],
            selectType: [ "主動買入", "定期定額"],
            tableData: []
        }
    },
    created() {
        this.getDataFromDB()
    },
    methods: {
        // login(){
        //     firebase.auth().signInWithEmailAndPassword("siukr01@gmail.com", "`u^|KHk69psRw9'P5#=P")
        //     .then(()=>{
        //         console.log("login success")
        //     }).catch((error)=>{
        //         console.log("login fail, error:", error)
        //     })
        // },
        getDataFromDB(){
            usersCollection.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.tableData.push(doc.data())
                });
            })
        },
        closeAll(){
            this.tableData.forEach(item=>{
                item._showDetails = false
            })
        },
        formatDate(data, parentIndex){
            var date = new Date(this.dateSelected).toLocaleDateString('zh',{ year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            console.log(data)
            console.log(date)
            this.tableData[parentIndex].innerData[data.index].date = date
            this.dateSelected = date
        },
        calTotal(data){
            var total = (parseFloat(data.inHolding)*parseFloat(data.inHoldingPrice))+parseFloat(data.fee)
            return parseInt(total)
        },
        getShareHolding(data){
            var result = 0 
            data.item.innerData.forEach((element) => {
                result = result + parseInt(element.inHolding)
            });
            return result;
        },
        getShareHoldingPrice(data){
            var result = 0 
            data.item.innerData.forEach((element) => {
                result = result + ((parseFloat(element.inHolding)*parseFloat(element.inHoldingPrice))+parseFloat(element.fee))
                result = parseInt(result)
            });
            var count = 0
            data.item.innerData.forEach((element)=>{
                count = count + parseFloat(element.inHolding)
            })
            var final = parseFloat(result/count).toFixed(2)
            return final;
        },
        getCounts(data){
            return data.item.innerData.length;
        },
        addStock(){
            this.tableData.unshift({
                id: this.tableData.length,
                number: '',
                stockName: '',
                shareHolding: null,
                shareHoldingPrice: null,
                counts: null,
                editing: true,
                innerData: []
            })
        },
        addStockFromBottom(){
            this.tableData.push({
                id: this.tableData.length,
                number: '',
                stockName: '',
                shareHolding: null,
                shareHoldingPrice: null,
                counts: null,
                editing: true,
                innerData: []
            })
        },
        saveRow(data){
            usersCollection.doc(this.tableData[data.index].stockName).set({
                id: this.tableData[data.index].id,
                number: this.tableData[data.index].number,
                stockName: this.tableData[data.index].stockName,
                shareHolding: null,
                shareHoldingPrice: null,
                counts: null,
                editing: false,
                innerData: []
            }).then(()=>{
                console.log("Success!")
            }).catch((error)=>{
                console.error("Error writing document: ", error);
            })
            this.tableData[data.index].editing = false;
        },
        addInnerRow(data){
            console.log(data)
            var emptyRow = {
                id: this.tableData[data.index].innerData.length,
                date: '',
                type: '',
                inHolding: null,
                inHoldingPrice: null,
                fee: null,
                editing: true,
                focus: true
            }
            var item = this.$refs[`item-${data.item.innerData.length-1}`]
            console.log('1', item)
            var index = this.tableData.findIndex((el)=>el.id==data.item.id)
            this.tableData[index].innerData.unshift(emptyRow);
        },
        editInnerRow(data, parentIndex){
            var index = this.tableData[parentIndex].innerData.findIndex((el)=>el.id==data.item.id)
            this.tableData[parentIndex].innerData[index].editing = true;
        },
        saveInnerRow(data, parentIndex){
            var index = this.tableData[parentIndex].innerData.findIndex((el)=>el.id==data.item.id)
            this.tableData[parentIndex].innerData[index].editing = false;
            this.tableData[parentIndex].innerData[index].focus = false;
            this.tableData[parentIndex]._showDetails = false;
            usersCollection.doc(this.tableData[parentIndex].stockName).set(this.tableData[parentIndex])
            .then(()=>{
                console.log("Save success.")
            })
            .catch((error)=>{
                alert("修改失敗，請找客服阿逼")
                console.log(error)
            })
            this.tableData[parentIndex]._showDetails = true;
        },
        deteleRow(data){
            if(data.item.stockName == '' || data.item.number == ''){
                this.tableData.splice(data.index, 1)
            } else if (data.item.stockName != null && data.item.number != null){
                usersCollection.doc(data.item.stockName).delete().then(()=>{
                    console.log("delete success.")
                    this.tableData.splice(data.index, 1)
                }).catch((error)=>{
                    alert("刪除失敗，請找工程阿逼")
                    console.log(error)
                })
            }
        },
        deteleInnerRow(data, parentIndex){
            var index = this.tableData[parentIndex].innerData.findIndex((el)=>el.id==data.item.id)
            var tmp = this.tableData[parentIndex].innerData[index];
            this.tableData[parentIndex].innerData.splice(index, 1);
            this.tableData[parentIndex]._showDetails = false;
            usersCollection.doc(this.tableData[parentIndex].stockName).set(this.tableData[parentIndex])
            .then(()=>{
                console.log("delete success.")
            })
            .catch((error)=>{
                alert("刪除失敗，請找工程阿逼")
                console.log(error)
                this.tableData[parentIndex].innerData.push(tmp)
            })
            this.tableData[parentIndex]._showDetails = true;
        }
    },
}
</script>
