<template>
  <v-ons-page id="edit-device">
    <custom-toolbar v-bind="toolbarInfo">
    </custom-toolbar>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <form>
          <v-ons-card>
            <h2 v-if="data.name">
              {{ data.name }}
            </h2>
            <div>
              <h5>Nom de l'appareil</h5>
              <v-ons-input
                placeholder="Nommez l'appareil"
                v-model="name"
              ></v-ons-input>
            </div>
            <div>
              <h5>Taille sur la carte</h5>
              <v-ons-range
                id="size"
                placeholder="ESP 1"
                v-model="size"
                min="0.01"
                max="0.25"
                step="0.01"
              ></v-ons-range>
            </div>
            <div class="right">
              <v-ons-button
                @click="submit"
                class="submit-button"
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
      name: '',
      size: 0.01,
    };
  },
  methods: {
    submit(event) {
      event.preventDefault();

      this.$store.dispatch('esps/updateESP', {
        // eslint-disable-next-line no-underscore-dangle
        id: this.data._id,
        data: {
          name: this.name,
          size: this.size,
        },
      }).then(() => {
        this.$store.commit('navigator/pop');
        this.$store.dispatch('esps/getESPs');
      });
    },
  },
  computed: {
    modified() {
      return this.name !== this.data.name
        || !(Math.abs(this.size - this.data.size) < Number.EPSILON);
    },
  },
  created() {
    this.name = this.data.name;
    this.size = this.data.size;
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

ons-range {
  display: block;
  width: 50%;
  margin: 0.5em;
}
</style>
