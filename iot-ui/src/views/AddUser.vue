<template>
  <v-ons-page id="add-user">
    <custom-toolbar v-bind="toolbarInfo">
    </custom-toolbar>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <form>
          <v-ons-card>
            <h5>Nom d'utilisateur</h5>
            <v-ons-input
              placeholder="superviseur"
              v-model="username"
            ></v-ons-input>
            <h5>Mot de passe</h5>
            <v-ons-input
              placeholder="••••••••"
              v-model="password"
              type="password"
            ></v-ons-input>
            <v-ons-row class="align-center">
              <v-ons-col>
                <h5>Administrateur</h5>
              </v-ons-col>
              <v-ons-col class="right">
                <v-ons-switch
                  v-model="administrator"
                ></v-ons-switch>
              </v-ons-col>
            </v-ons-row>
            <div class="right create">
              <v-ons-button
                @click="submit"
                :disabled="!validForm"
              >
                Créer
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
export default {
  data() {
    return {
      username: '',
      password: '',
      administrator: false,
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();

      this.$store.dispatch('users/addUser', {
        username: this.username,
        password: this.password,
        administrator: this.administrator,
      }).then(() => {
        this.$store.commit('navigator/pop');
        this.$store.dispatch('users/getUsers');
      });
    },
  },
  computed: {
    validForm() {
      return (this.username !== '' && this.password !== '');
    },
  },
};
</script>

<style scoped>
.create {
  margin-top: 1em;
}

.align-center {
  align-items: center;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}
</style>
