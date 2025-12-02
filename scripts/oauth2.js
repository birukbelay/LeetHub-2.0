// eslint-disable-next-line no-unused-vars
const oAuth2 = {
  /**
   * Initialize
   */
  init() {
    this.KEY = 'leethub_token';
    this.ACCESS_TOKEN_URL =
      'https://github.com/login/oauth/access_token';
    this.AUTHORIZATION_URL =
      'https://github.com/login/oauth/authorize';
    this.CLIENT_ID = '0114dd35b156d4729fac';
    this.CLIENT_SECRET = 'cfc3301d9745530bf1b31e92528ad9c31fd3f995';
    this.REDIRECT_URL = 'https://github.com/'; // for example, https://github.com
    this.SCOPES = ['repo'];
  },

  /**
   * Begin
   */
  begin() {
    this.init(); // secure token params.

    // Read configured repo (if any) and then start OAuth flow. If a repo
    // (stored as `leethub_hook` like "owner/repo") exists, pass the
    // `repository` parameter to request access for that single repository.
    chrome.storage.local.get('leethub_hook', (data) => {
      const repo = data?.leethub_hook;

      // Build base URL and include redirect_uri correctly.
      let url = `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}`;
      url += `&redirect_uri=${encodeURIComponent(this.REDIRECT_URL)}`;
      url += `&scope=${this.SCOPES.join('%20')}`;

      // If a specific repo is configured, request access to it only.
      if (repo) {
        url += `&repository=${encodeURIComponent(repo)}`;
      }

      chrome.storage.local.set({ pipe_leethub: true }, () => {
        // opening pipe temporarily, redirects to github
        chrome.tabs.create({ url, active: true }, function () {});
      });
    });
  },
};
