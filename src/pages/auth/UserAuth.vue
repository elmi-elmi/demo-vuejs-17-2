<template>
  <div>
    <base-dialog :show="!!error" title="An error occured" @close="handlerError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating...">
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">Email</label>
          <input type="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">what the f this shit</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchForm">
          {{ switchModeButtonCaption }}</base-button
        >
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      mode: 'login',
      formIsValid: true,
      isLoading: false,
      error: null
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Instead signup';
      } else {
        return 'Instead login';
      }
    }
  },
  methods: {
    handlerError() {
      this.error = null;
    },
    switchForm() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
    async submitForm() {
      if (this.email === '') {
        return false;
      }
      if (this.password === '') {
        return false;
      }
      this.isLoading = true;
      const authActionPayload = {
        email: this.email,
        password: this.password
      };
      console.log(authActionPayload);

      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', authActionPayload);
        } else {
          await this.$store.dispatch('signup', authActionPayload);
        }
        const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
        this.$router.replace(redirectUrl);
      } catch (error) {
        console.log(authActionPayload);
        this.error = error.message || 'faild to authenticate. Try later.';
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
