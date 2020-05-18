<template>
  <v-ons-page id="dashboard">
    <v-ons-row style="height: 100%">
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
      <v-ons-col>
        <div
          style="width:100%; height:50%;"
          id="viewer-image"
          ref="image"
        ></div>
        <div class="center">
          <small>Cliquez sur la carte pour placer un ESP ou
            sur un des ESPs pour le supprimer</small>
        </div>
        <hr/>
        <v-ons-card>
          <h2 class="center">
            Ajouter un ESP
          </h2>
          <div>
            <v-ons-select
              v-model="selected"
            >
              <option
                v-for="esp in available"
                :key="esp.value"
                :value="esp.value"
              >
                {{ esp.text }}
              </option>
            </v-ons-select>
          </div>
        </v-ons-card>
        <div class="center">
          <v-ons-button
            modifier="outline"
            style="margin: 6px 0"
          >
            Modifier la carte
          </v-ons-button>
        </div>
      </v-ons-col>
      <v-ons-col width="25%" class="hide-md"></v-ons-col>
    </v-ons-row>
  </v-ons-page>
</template>

<script>
import OpenSeadragon from 'openseadragon';
import { mapState } from 'vuex';

window.OpenSeadragon = OpenSeadragon;

export default {
  data() {
    return {
      viewer: null,
      name: '',
      size: 0.01,
      selected: 'abcdef',
      available: [
        {
          value: 'abcdef',
          text: 'ESP 1',
        },
        {
          value: '123456',
          text: 'ESP 2',
        },
      ],
      source: [
        {
          type: 'image',
          // eslint-disable-next-line global-require
          url: require('../assets/plan_miage.jpeg'),
          overlays: [
            /* {
              id: 'example-overlay',
              x: 0.32,
              y: 0.34,
              width: 0.01,
              height: 0.01,
              className: 'highlight',
            },
            {
              id: 'example-overlay-2',
              x: 0.45,
              y: 0.38,
              width: 0.01,
              height: 0.01,
              className: 'highlight',
            }, */
          ],
        },
      ],
    };
  },
  methods: {
    getAllItems(world) {
      const result = [];
      for (let i = 0; i < world.getItemCount(); i += 1) {
        result.push(world.getItemAt(i));
      }
      return result;
    },
    overlayClick(event) {
      console.log(event.target.id);
      this.viewer.removeOverlay(event.target.id);
    },
    addedOverlayClick(event) {
      console.log(event.originalEvent.target.id);
      this.viewer.removeOverlay(event.originalEvent.target.id);
    },
    initViewer() {
      this.viewer = OpenSeadragon({
        id: 'viewer-image',
        maxZoomLevel: 5,
        ajaxWithCredentials: true,
        showNavigator: true,
        homeFillsViewer: true,
        // navigatorId: 'image-navigator',
        // toolbar: 'image-toolbar',
        zoomInButton: 'image-toolbar-zoomin',
        zoomOutButton: 'image-toolbar-zoomout',
        homeButton: 'image-toolbar-reset',
        fullPageButton: 'image-toolbar-fullscreen',
        tileSources: this.source,
      });

      // After OpenSeadragon viewer initialisation
      this.viewer.addHandler('open', () => {
        const points = document.querySelectorAll('.highlight');
        points.forEach((point) => point.addEventListener('click', (event) => this.overlayClick(event)));
      });

      // Disable zoom on click
      this.viewer.zoomPerClick = 1;

      this.viewer.addHandler('canvas-click', (event) => {
        // Filter drag event
        if (event.quick && event.originalEvent.target.tagName === 'CANVAS') {
          if (!this.selected) {
            return;
          }

          console.log('canvas click');
          const webPoint = event.position;
          const viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

          console.log(viewportPoint.toString());
          const elem = document.createElement('a');
          elem.id = this.selected;
          elem.className = 'highlight';
          elem.href = `#/overlay/${this.selected}`;
          this.viewer.addOverlay({
            element: elem,
            width: this.size,
            height: this.size,
            location: new OpenSeadragon.Point(viewportPoint.x, viewportPoint.y),
          });
          // eslint-disable-next-line no-new, no-unused-vars
          const tracker = new OpenSeadragon.MouseTracker({
            element: this.selected,
            clickHandler: (e) => this.addedOverlayClick(e),
          });

          // Remove the ESP from the list
          const espIndex = this.available.findIndex((element) => element.value === this.selected);
          this.available.splice(espIndex, 1);
          if (this.available.length > 0) {
            this.selected = this.available[0].value;
          } else {
            this.selected = '';
          }
        }
      });
    },
  },
  computed: {
    ...mapState('esps', ['esps']),
  },
  mounted() {
    this.initViewer();
  },
};
</script>

<style>
  .highlight {
    background-color: #F80;
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    transform: translateX(-50%) translateY(-50%);
  }

  .center {
    text-align: center;
  }

  .space-top {
    margin-top: 1em;
  }
</style>
