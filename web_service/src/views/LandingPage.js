import AbstractView from "./AbstractView";

export default class LandingPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Landing Page");
    }

    async getHtml() {
        const link = "https://api.intra.42.fr/oauth/authorize" +
            "?client_id=" + encodeURIComponent(process.env.SSO_42_CLIENT_ID) +
            "&redirect_uri=" + encodeURIComponent(process.env.SSO_42_REDIRECT_URI) +
            "&response_type=code";

        return `
		<div class="container" id="landing-page">
			${
            this.loading
                ? `<loading-icon template="center" size="5rem"></loading-icon>`
                : `<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<h1 class="header">Transcendence</h1>
						<h6 class="sub-header mb-5">
							Play Beyond Your Limits, Play Transcendence
						</h6>
						<div class="mb-2">
							<nav-button 
								template="primary-button extra-btn-class"
								page="/sign-up"
								value="Sign up"
							>
							</nav-button>
						</div>
						<div class="mb-2">
							<nav-button 
								template="secondary-button extra-btn-class"
								page="${link}"
								value="Sign up with 42"
							>
							</nav-button>
						</div>
						<div class="mt-1">
							<p>
								Already have an account? 
								<nav-link 
									href="/login"
									template="login"
									value="Log in"
								>
								</nav-link>
							</p>
						</div>
					</div>
				</div>`
        }
		</div>
		`;
    }
}
