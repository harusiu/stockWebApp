<template>
    <div class="m-4 d-flex flex-column justify-content-center align-items-center" style="transform: scale(0.85);">
        <div>
            <img src="https://firebasestorage.googleapis.com/v0/b/watchapp-e35a6.appspot.com/o/banner.png?alt=media&token=02ae59d2-c30a-4c98-a5be-18cce682ff3f">
        </div>
        <div class="mb-3 mt-4" style="margin-left: -820px;">
            <b-button class="w-10" style="background-color: #dab56e" @click="addStock()">新增股票</b-button>
        </div>
        <div style="width: 969px;">
            <b-table :items="tableData" :fields="fields" sort-icon-left fixed borderless class="text-center" style="color: white;">
                <template #head(stockName)="row">
                    <div style="margin-left: 5px;">{{row.label}}</div>
                </template>
                <template #cell(stockName)="row">
                    <div v-show="!row.item.editing">
                        <label style="margin-left: 3px;">{{row.item.stockName}}</label>
                    </div>
                    <div v-show="row.item.editing">
                        <b-form-input v-model="row.item.stockName" @keypress.enter="saveRow(row)" style="margin-left: 8px;"></b-form-input>
                    </div>
                </template>
                <template #cell(number)="row">
                    <div v-show="!row.item.editing" style="padding-right: 15px;">
                        <b-icon v-show="row.detailsShowing" size="sm" @click="row.toggleDetails" icon="caret-down-fill" style="cursor: pointer; color: #dab56e;"></b-icon>
                        <b-icon v-show="!row.detailsShowing" size="sm" @click="row.toggleDetails" icon="caret-right-fill" style="cursor: pointer; color: #dab56e;"></b-icon>
                        <label style="width: 90px;">{{row.item.number}}</label>
                    </div>
                    <div v-show="row.item.editing">
                        <b-form-input v-model="row.item.number" ></b-form-input>
                    </div>
                </template>
                <template #cell(shareHolding)="row">
                    {{getShareHolding(row)}}
                </template>
                <template #cell(shareHoldingPrice)="row">
                    {{getShareHoldingPrice(row)}}
                </template>
                <template #head(counts)="row">
                    <div style="margin-left: -25px;">{{row.label}}</div>
                </template>
                <template #cell(counts)="row">
                    <div class="d-flex justify-content-end mb-0 pb-0">
                        <label style="padding-right: 38px;">{{getCounts(row)}}</label>
                        <b-icon icon="trash" @click="deteleRow(row)" style="cursor: pointer; margin-top: 5px; margin-right:15px;"></b-icon>
                    </div>
                </template>
                <template #row-details="innerRow">
                    <b-table :items="innerRow.item.innerData" :fields="detailFields" sort-icon-left fixed borderless class="text-center" style="color: white;">
                        <template #head(action)>
                            <b-button @click="addInnerRow(innerRow.index)" size="sm" style="margin-left: -8px; padding: 4px 6.5px; font-size: 13px; background-color: #dab56e; border-color: #dab56e;">新增交易</b-button>
                        </template>
                        <template #head(date)="data">
                            <div style="margin-left: 5px; width: 80px;">
                                {{data.label}}
                            </div>
                        </template>
                        <template #cell(date)="data">
                            <div v-show="!data.item.editing">{{data.item.date}}</div>
                            <div v-show="data.item.editing">
                                <datepicker v-model="data.item.date" format="yyyy/M/dd" :language="zh"></datepicker>
                                <!-- <datepicker v-model="data.item.date" format="yyyy/M/dd" :language="zh"></datepicker> -->
                            </div>
                        </template>
                        <template #cell(type)="data">
                            <div v-show="!data.item.editing">{{data.item.type}}</div>
                            <div v-show="data.item.editing">
                                <b-form-select v-model="data.item.type" class="tableInput" :options="selectType"></b-form-select>
                            </div>
                        </template>
                        <template #cell(inHolding)="data">
                            <div v-show="!data.item.editing">{{data.item.inHolding}}</div>
                            <div v-show="data.item.editing">
                                <b-form-input v-model="data.item.inHolding" class="tableInput"></b-form-input>
                            </div>
                        </template>
                        <template #cell(inHoldingPrice)="data">
                            <div v-show="!data.item.editing">{{data.item.inHoldingPrice}}</div>
                            <div v-show="data.item.editing">
                                <b-form-input v-model="data.item.inHoldingPrice" class="tableInput"></b-form-input>
                            </div>
                        </template>
                        <template #cell(fee)="data">
                            <div v-show="!data.item.editing">{{data.item.fee}}</div>
                            <div v-show="data.item.editing">
                                <b-form-input v-model="data.item.fee" class="tableInput" @keypress.enter="saveInnerRow(data, innerRow.index)"></b-form-input>
                            </div>
                        </template>
                        <template #cell(total)="data">
                            {{calTotal(data.item)}}
                        </template>
                        <template #cell(action)="data">
                            <div class="d-flex justify-content-end">
                                <b-button v-show="!data.item.editing" style="margin-right: 5px; background-color: #dab56e; border-color: #dab56e;" size="sm" @click="editInnerRow(data, innerRow.index)">
                                    <p style="font-size: 10px; margin-bottom: 0; margin-right: 4px; background-color: #dab56e;">
                                        <b-icon icon="pencil" style="cursor: pointer; margin-left: 2px; font-size: 12px; background-color: #dab56e;"></b-icon>
                                        <label style="cursor: pointer; margin-left: 3px; font-size: 13px; background-color: #dab56e;">編輯</label>
                                    </p>
                                </b-button>
                                <b-button v-show="data.item.editing" style="margin-right: 5px; background-color: #dab56e; border-color: #dab56e;" size="sm" @click="saveInnerRow(data, innerRow.index)">
                                    <p style="font-size: 10px; margin-bottom: 0; margin-right: 4px; background-color: #dab56e;">
                                        <b-icon icon="box-arrow-in-right" style="cursor: pointer; margin-left: 5px; font-size: 12px; background-color: #dab56e;"></b-icon>
                                        <label style="cursor: pointer; margin-left: 3px; font-size: 13px; background-color: #dab56e;">儲存</label>
                                    </p>
                                </b-button>
                                <b-icon icon="trash" @click="deteleInnerRow(data, innerRow.index)" style="cursor: pointer; margin-right: 6.5px; margin-top: 6px;  margin-left: 4px;"></b-icon>
                            </div>
                        </template>
                    </b-table>
                </template>
            </b-table>
        </div>
    </div>
</template>
<style>
* {
    background-color: #333333 ;
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
    width: 100px;
    text-align: center;
    height: 30px;
    border-top: none;
    border-left: none;
    border-right: none;
}

.custom-select, .custom-select:focus {
    outline: none !important;
    background-color: snow;
    border-radius: 5px;
}
select option {
    background-color: snow;
}
.form-control{
    border-top: none;
    border-left: none;
    border-right: none;
}
input[type="text"], textarea {
    outline: none;
    box-shadow:none !important;
    background-color: snow;
    border-radius: 5px;
}
.btn:focus {
  outline: none;
  box-shadow: none;
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
import Datepicker from "vuejs-datepicker/dist/vuejs-datepicker.esm.js";
import {zh} from 'vuejs-datepicker/dist/locale'
import { usersCollection } from '../includes/firebase'

export default {
    components: {
        Datepicker
    },
    data() {
        return {
            /*  【外面】股名／代號－持有股數－持股成本均價
                【裡面】交易日期－交易類別－買入股數－買入價格－手續費－合計 */
            //   交易類別(選單): 定期定額 / 主動買入
            zh: zh,
            transProps: {
                // Transition name
                name: 'flip-list'
            },  
            fields: [
                { key: 'number', label: '股號' }, { key: 'stockName', label: '股名' }, { key: 'shareHolding', label: '持有股數'}, 
                { key: 'shareHoldingPrice', label: '持有成本均價'}, { key: 'blank2', label: ''}, { key: 'blank3', label: ''},
                {key: 'counts', label: '交易筆數'},
            ],
            detailFields: [
                { key: 'date', label: '交易日期', sortable: true }, { key: 'type', label: '交易類別'}, { key: 'inHolding', label: '買入股數'}, 
                { key: 'inHoldingPrice', label: '買入價格'}, { key: 'fee', label: '手續費'}, { key: 'total', label: '合計'},
                { key: 'action', label: ''}
            ],
            selectType: ["定期定額", "主動買入"],
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
        calTotal(data){
            var total = (parseFloat(data.inHolding)*parseFloat(data.inHoldingPrice))+parseFloat(data.fee)
            return total
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
        addInnerRow(index){
            var emptyRow = {
                id: this.tableData[index].innerData.length,
                date: '',
                type: '',
                inHolding: null,
                inHoldingPrice: null,
                fee: null,
                editing: true,
            }
            this.tableData[index].innerData.push(emptyRow);
        },
        editInnerRow(data, parentIndex){
            var index = this.tableData[parentIndex].innerData.findIndex((el)=>el.id==data.item.id)
            this.tableData[parentIndex].innerData[index].editing = true;
        },
        saveInnerRow(data, parentIndex){
            var date = new Date(data.item.date).toISOString().slice(0, 10)
            var index = this.tableData[parentIndex].innerData.findIndex((el)=>el.id==data.item.id)
            this.tableData[parentIndex].innerData[index].date = date;
            this.tableData[parentIndex].innerData[index].editing = false;
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
