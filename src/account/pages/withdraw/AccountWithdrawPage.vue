<template>
    <v-container>
        <v-form class="reason-section">
        <h3>서비스 품질 향상을 위해 탈퇴 사유를 선택해주세요.</h3>
            <v-checkbox
                v-for="(reason, index) in reasons"
                :key="index"
                :label="reason.label"
                :value="reason.value"
                v-model="selectedReason"
            ></v-checkbox>
            <v-btn
                :disabled="!isButtonEnabled"
                @click="submitWithdrawal"
            >
                탈퇴 신청
            </v-btn>
        </v-form>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'

const accountModule = 'accountModule'

export default {
    data () {
        return {
            reasons: [
                { label: '서비스 불만족', value: 'service_dissatisfaction' },
                { label: '개인정보 보호 우려', value: 'privacy_concerns' },
                { label: '기타', value: 'other' },
            ],
            selectedReason: [],
        }
    },
    computed: {
        isButtonEnabled() {
            return this.selectedReason.length > 0;
        }
    },
    methods: {
        ...mapActions(accountModule, ['requestWithdrawalToDjango']),
        submitWithdrawal() {
            console.log('탈퇴 신청 사유:', this.selectedReason);
            this.requestWithdrawalToDjango({ reason: this.selectedReason });
        }
    }
}
</script>

<style scoped>

.reason-section {
    margin-top: 30px;
    margin-bottom: 30px;
}

</style>
