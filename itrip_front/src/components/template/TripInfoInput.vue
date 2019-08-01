<template>
<div class="trip-info-container">
    <el-popover
        placement="top"
        width="300"
        trigger="click"
         v-model="visible">
        <i class="fas fa-suitcase-rolling" slot="reference" style="cursor:pointer;color:white;"> 開始規劃</i>
        <b-container>
            <b-row class="mb-3">
                <b-col class="px-0" cols="2" style="text-align:center;line-height:40px;">
                    名稱
                </b-col>
                <b-col cols="7">
                    <el-input placeholder="旅行名稱" v-model="tripName"></el-input>
                </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col class="px-0" cols="2" style="text-align:center;line-height:40px;">
                    日期
                </b-col>
                <b-col>
                    <el-date-picker
                    class="ml-0 iDatePicker"
                    v-model="tripDate"
                    type="date"
                    placeholder="選擇日期"
                    style="width:150px;"/>  
                </b-col>
            </b-row>
            <b-row align-h="end">
                <el-button type="primary" @click="submit">送出</el-button>
                <el-button @click="visible = false">取消</el-button>
            </b-row>    
        </b-container>
       
        
    </el-popover>   
</div>

</template>

<script>
import { apiSaveTrip, apiShareTrip } from '../../../utils/api.js'
export default {
    name: 'TripInfoInput',
    props: {
       
    },
    data() {
        return {
           tripDate: new Date(),
           tripName: '我的旅行',
           visible: false,
           currentAccessId: this.$route.query.currentAccessId,
           isSubmit: false,
        }
    },
    methods: {
        submit() {
            this.$router.push({path: '/trip'});
            this.isSubmit = true;
        },
    },
    beforeDestroy() {
        // bug 在此
        if (this.isSubmit){
            let self = this;
            let _id = new Date().getTime();
            let token = this.$store.state.userToken;
            if(token.length > 0) {
                apiSaveTrip(_id, this.tripDate, this.tripName, 1, [], [], [], null, token)
                .then((function (res) {
                    self.$message.success('行程儲存成功!');
                    self.$router.push('/trip/?currentAccessId=' + self.currentAccessId + '&itineraryId=' + _id);
                }))
                .catch(function (error) {
                    console.log(error);
            });
        }
        else {
            apiShareTrip(this.tripDate, this.tripName, 1,[], [])
            .then((function (res) {
                self.$router.push('/trip/?itineraryId=' + _id);
            }))
            .catch(function (error) {
                console.log(error);
            });
        }
        this.$bus.$emit('createTrip', {tripName: this.tripName, tripDate: this.tripDate});
        }
    }

};
</script>

<style scoped>

</style>
