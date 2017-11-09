import Reflux from 'reflux';
import ApiMixin from '../mixins/apiMixin';

const GuideStore = Reflux.createStore({
  init() {
    this._internal = {
        step: -1,
        guide: {
            starting_message: 'Dummy text.',
            complete_message: 'Go to docs.sentry.io/learn/releases to learn more.',
            steps: [
                {
                    title: 'Don\'t get alerts for issues you\'ve fixed.',
                    description: 'Setting up release tracking lets you mark issues as "Resolved in next release". Open your first issue to learn.',
                    target: 'EARTH-4',
                },
                {
                    title: 'A better issue resolution flow',
                    description: 'Once you attach release to your Raven client, you\'ll be able to set an issue as resolved in the next release.',
                    target: 'issue-resolve-drop-down',
                },
                {
                    title: 'Better issue context',
                    description: 'Release data will also show up here.',
                    target: 'issue-sidebar-release-info',
                }
            ]
        }
    };
  },

  mixins: [
    ApiMixin,
  ],

  loadData(guide) {
    if (guide && JSON.stringify(this._internal.guide) != JSON.stringify(guide)) {
      this._internal.guide = guide;
      this.trigger(this._internal);
    }
  },

  set(guide) {
    this._internal.guide = guide;
  },

  getCurrentStep() {
    if (this._internal.step >= 0) {
      return this._internal.guide.steps[this._internal.step];
    }
    return null;
  },

  getFirstStep() {
    return this._internal.guide.steps[0];
  },

  getCurrentGuide() {
    return this._internal.guide || null;
  },

  completeStep() {
    this._internal.step++;
    if (this._internal.step < this._internal.guide.steps.length) {
        this.trigger(this._internal);
    }
  },
});

export default GuideStore;
