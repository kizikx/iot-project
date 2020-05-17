<template>
  <v-ons-page id="users">
    <v-ons-pull-hook :action="loadItems"
      threshold-height="100px"
      height="20px"
      @changestate="state = $event.state"
    >
      <span v-show="state === 'initial'">
        Tirez pour actualiser
      </span>
      <span v-show="state ==='preaction'">
        Tirez pour actualiser
      </span>
    </v-ons-pull-hook>
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <div class="center">
          <v-ons-progress-circular
            v-show="status.fetching"
            indeterminate
            class="loader-icon"
          ></v-ons-progress-circular>
        </div>
        <v-ons-list>
          <v-ons-list-item
            v-for="user in users"
            :key="user._id"
          >
            <div class="center">
              {{ user.username }}
            </div>
            <div class="right">
              <v-ons-icon
                icon="ion-ios-create"
                class="list-item__icon edit"
                @click="editUser(user.id)"
              ></v-ons-icon>
              <v-ons-icon
                icon="ion-ios-trash"
                class="list-item__icon delete"
                @click="deleteUser(user.id)"
              ></v-ons-icon>
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <v-ons-fab
          position="bottom right"
          @click="addUser"
        >
          <v-ons-icon icon="md-plus"></v-ons-icon>
        </v-ons-fab>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';
import AddUser from '@/views/AddUser.vue';
import EditUser from '@/views/EditUser.vue';

export default {
  data() {
    return {
      state: 'initial',
    };
  },
  computed: {
    ...mapState('users', ['status', 'users']),
  },
  methods: {
    addUser() {
      this.push(AddUser, 'Nouveau');
    },
    editUser() {
      this.push(EditUser, '');
    },
    deleteUser(id) {
      this.$ons.notification.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?', {
        buttonLabels: [
          'Non',
          'Oui',
        ],
      }).then((response) => {
        if (response) {
          console.log(`delete ${id}`);
        }
      });
    },
    loadItems(done) {
      this.$store.dispatch('users/getUsers').then(() => {
        done();
      });
    },
    push(page, key, data = {}) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Utilisateurs',
              title: key,
            },
            data,
          };
        },
      });
    },
  },
  created() {
    this.$store.dispatch('users/getUsers');
  },
};
</script>

<style scoped>
.edit {
  color: #0076ff;
}

.delete {
  color: #fe3824;
}

ons-progress-circular {
  margin: 1em;
}
</style>
