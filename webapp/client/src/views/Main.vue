<template>
  <v-container class="w-100 h-100" v-if="!loadComplete">
    <div class="w-100 h-100 d-flex justify-center align-center">
      <v-progress-circular
        :size="70"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>
  <v-container v-else>
    <v-row no-gutters>
      <p
        v-if="hasChaincode"
        class="title font-weight-bold"
      >Installed chaincode packages</p>
      <v-spacer></v-spacer>
      <ActionButton
        v-if="!hasChaincode"
        display="Install Chaincode"
        :action="{ action: 'post', path: '/chaincode/install' }"
        @response="logData"
    ></ActionButton>
    </v-row>
    <v-card class="mx-auto">
      <v-list class="pa-0">
        <v-list-group
          no-action
          disabled
          append-icon
          v-for="(item, index) in network.installed_chaincodes"
          value="true"
          :key="index"
          :class="{ disable_link: !item.references }"
          :ripple="item.references !== undefined"
        >
          <template v-slot:activator>
            <v-list-item class="pa-0">
              <v-list-item-content @click="goTo(item)">
                <v-list-item-title v-text="item.label"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <div v-if="item.references">
            <code>{{ getDefinition(item.references) }}</code>
          </div>
          <div v-else>
            <code>
              Package ID: {{ item.package_id }}
              <ActionButton
                icon
                v-if="approvals[mspId] != true"
                display="mdi-check"
                tooltip-content="Approve chaincode"
                :action="{
                  action: 'post',
                  path: '/chaincode/approve',
                  parameter: { package_id: item.package_id },
                }"
                @response="logData"
              ></ActionButton>

              <ActionButton
                icon
                v-else
                display="mdi-check-all"
                tooltip-content="Commit chaincode"
                :action="{
                  action: 'post',
                  path: '/chaincode/commit',
                }"
                @response="logData"
              ></ActionButton>
            </code>
          </div>
        </v-list-group>
      </v-list>
      <code>{{ approvals }}</code>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import ActionButton from '@/components/ActionButton.vue';

export default {
  name: 'Main',

  components: {
    ActionButton,
  },

  created() {
    this.getNetwork()
      .finally(() => {
        this.poll();
        this.loadComplete = true;
      });
  },

  data: () => ({
    network: {},
    channel: null,
    loadComplete: false,
    approvals: {},
    mspId: null,
  }),

  computed: {
    hasChaincode() {
      return this.network.installed_chaincodes && this.network.installed_chaincodes.length > 0;
    },
  },

  methods: {
    logData(data) {
      console.log(data);
    },

    poll() {
      setInterval(this.getNetwork, 20000);
    },

    getDefinition(references) {
      const chaincodeName = references[this.channel].chaincodes[0].name;

      return this.network.chaincode_definitions.find(({ name }) => name === chaincodeName);
    },

    goTo({ references }) {
      if (references) {
        const { name } = this.getDefinition(references);
        this.$router.push({ name: 'Chaincode', params: { chaincode: name } })
          .catch(() => {});
      }
    },

    getNetwork() {
      return axios.get('/network')
        .then(({ data }) => {
          this.network = data;
          const [channel] = data.channels;
          this.channel = channel;
          this.approvals = data.approvals;
          this.mspId = data.mspId;
        });
    },
  },
};

</script>

<style lang="scss">
  .w-100 {
    width: 100%;
  }
  .h-100 {
    height: 100%;
  }
  code {
    padding: 10px 16px !important;
    color: black !important;
    &:before {
      content: '' !important;
    }

    border-radius: 0 !important;
    width: 100%;
    padding: 10px;
  }

  .disable_link {
    background-color: rgba(0,0,0, 0.1);
    .v-list-item {
      &:hover:before {
        opacity: 0;
      }
    }
  }
</style>
