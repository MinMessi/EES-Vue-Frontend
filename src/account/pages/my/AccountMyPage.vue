<template>
  <div class="id-card-container">
    <div class="lanyard"></div>
    <v-card class="id-card mx-auto" max-width="300">
      <div class="company-logo">IT, SHOE</div>
      <v-avatar size="120" class="mt-8 avatar-margin">
        <v-img :src="imageSrc"></v-img>
      </v-avatar>
      <v-card-text>
        <h2 class="text-h5 mb-2">{{ nickname }}</h2>
        <p class="subtitle-1">{{ email }}</p>
        <v-divider class="my-3"></v-divider>
        <v-row dense>
          <v-col cols="6">
            <v-icon>{{ gender === 'man' ? 'mdi-gender-male' : 'mdi-gender-female' }}</v-icon>
            <span class="ml-1">{{ gender === 'man' ? '남성' : '여성' }}</span>
          </v-col>
          <v-col cols="6">
            <v-icon>mdi-calendar</v-icon>
            <span class="ml-1">{{ birthyear }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const accountModule = 'accountModule'

export default {
  data () {
    return {
      imageSrc: require('@/assets/images/fixed/profile_img.png'),
      email: '',
      nickname: '',
      gender: '',
      birthyear: '',
    }
  },
  async created () {
    try {
      const nickname = await this.requestNicknameToDjango()
      const email = await this.requestEmailToDjango()
      const gender = await this.requestGenderToDjango()
      const birthyear = await this.requestBirthyearToDjango()
      this.nickname = nickname
      this.email = email
      this.gender = gender
      this.birthyear = birthyear
    } catch (error) {
      console.log('사용자 정보를 가져오는 과정에서 에러 발생:', error)
    }
  },
  methods: {
    ...mapActions(accountModule, [
      'requestNicknameToDjango',
      'requestEmailToDjango',
      'requestGenderToDjango',
      'requestBirthyearToDjango'
    ]),
    onClickAccountWithdraw () {
      this.$router.push({ name: 'AccountWithdrawPage' })
    },
  }
}
</script>

<style scoped>
.id-card-container {
  position: relative;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  margin-top: 170px;
}

.lanyard {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 170px;
  background-color: #333;
  border-radius: 5px 5px 0 0;
}

.lanyard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 10px;
  background-color: #555;
  border-radius: 5px 5px 0 0;
}

.id-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  padding-top: 20px;
}

.company-logo {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
}

.avatar-margin {
  margin-top: 60px;
}

.v-avatar {
  margin: 0 auto;
  border: 3px solid #f0f0f0;
}
</style>