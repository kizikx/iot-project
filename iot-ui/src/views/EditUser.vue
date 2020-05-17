<template>
  <v-ons-page id="edit-user">
    <custom-toolbar v-bind="toolbarInfo">
    </custom-toolbar>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <form>
          <v-ons-card>
            <div>
              <h5>Mot de passe</h5>
              <v-ons-input
                placeholder="••••••••"
                v-model="password"
                type="password"
              ></v-ons-input>
            </div>
            <div class="right update">
              <v-ons-button
                @click="submit"
                :disabled="!modified"
              >
                Sauvegarder
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
      password: '',
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();

      const data = {};
      if (this.password !== '') {
        data.password = this.password;
      }
      this.$store.dispatch('users/updateUser', {
        username: this.data.username,
        data,
      }).then(() => {
        this.$store.commit('navigator/pop');
        this.$store.dispatch('users/getUsers');
      });
    },
  },
  computed: {
    modified() {
      return this.password !== '';
    },
  },
};
</script>

<style scoped>
.right {
  text-align: right;
}

.submit-button {
  margin-top: 2em;
}

.align-center {
  align-items: center;
}

.update {
  margin-top: 1em;
}
</style>
