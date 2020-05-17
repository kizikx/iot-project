<template>
  <v-ons-page id="users">
    <v-ons-row>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <v-ons-list>
          <v-ons-list-item
            v-for="user in users"
            :key="user.id"
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
import AddUser from '@/views/AddUser.vue';
import EditUser from '@/views/EditUser.vue';

export default {
  data() {
    return {
      users: [
        {
          id: '3bc45def',
          username: 'User 1',
        },
        {
          id: '34ed81ab',
          username: 'User 2',
        },
      ],
    };
  },
  methods: {
    addUser() {
      this.push(AddUser, 'Nouvel utilisateur');
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
};
</script>

<style scoped>
.edit {
  color: #0076ff;
}

.delete {
  color: #fe3824;
}
</style>
