<template>
  <v-ons-page id="devices">
    <v-ons-pull-hook :action="loadItems"
      threshold-height="100px"
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
            v-for="device in esps"
            :key="device._id"
          >
            <div class="center">
              {{ device.name || device.who }}
            </div>
            <div class="right">
              <v-ons-icon
                icon="ion-ios-information-circle-outline"
                class="list-item__icon edit"
                @click="deviceInfos(device)"
              ></v-ons-icon>
              <v-ons-icon
                icon="ion-ios-create"
                class="list-item__icon edit"
                @click="editDevice(device)"
              ></v-ons-icon>
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import { mapState } from 'vuex';
import DeviceInfos from '@/views/DeviceInfos.vue';
import EditDevice from '@/views/EditDevice.vue';

export default {
  data() {
    return {
      state: 'initial',
    };
  },
  computed: {
    ...mapState('esps', ['status', 'esps']),
  },
  methods: {
    deviceInfos(device) {
      this.push(DeviceInfos, 'Informations', device);
    },
    editDevice(device) {
      this.push(EditDevice, 'Édition', device);
    },
    loadItems(done) {
      this.$store.dispatch('esps/getESPs').then(() => {
        done();
      });
    },
    push(page, key, data = {}) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Appareils',
              title: key,
            },
            data,
          };
        },
      });
    },
  },
  created() {
    this.$store.dispatch('esps/getESPs');
  },
};
</script>

<style scoped>
.edit {
  color: #0076ff;
}

ons-progress-circular {
  margin: 1em;
}
</style>
