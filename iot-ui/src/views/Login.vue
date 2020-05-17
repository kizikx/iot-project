<template>
  <v-ons-page id="login">
    <v-ons-toolbar>
      <div class="center">Connexion</div>
    </v-ons-toolbar>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <form>
          <v-ons-card>
            <div class="center">
              <v-ons-input
                float
                placeholder="Nom d'utilisateur"
                v-model="form.username"
              ></v-ons-input>
            </div>

            <div class="center">
              <v-ons-input
                float
                placeholder="••••••••"
                v-model="form.password"
                type="password"
              ></v-ons-input>
            </div>

            <div class="center">
              <v-ons-progress-circular
                v-show="status.loggingIn"
                indeterminate
                class="loader-icon"
              ></v-ons-progress-circular>
            </div>

            <div class="center">
              <v-ons-button
                @click="submit"
              >
                Connexion
              </v-ons-button>
            </div>
          </v-ons-card>
        </form>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions('users', ['login']),
    submit(event) {
      event.preventDefault();

      const { username, password } = this.form;
      this.login({ username, password });
    },
  },
  computed: {
    ...mapState('users', ['status']),
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}

ons-button {
  margin-top: 1em
}

ons-input {
  width: 100%;
  margin-top: .5em;
}
</style>
