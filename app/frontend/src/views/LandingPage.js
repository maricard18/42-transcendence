import AbstractView from "./AbstractView";
import fetchData from "../functions/fetchData";

export default class LandingPage extends AbstractView {
    constructor() {
        super();
        this.setTitle("Landing Page");
        this.loading = true;
    }

    async createLink() {
        const response = await fetchData("/get-env-vars", "GET", null, null);

        if (response.ok) {
            const data = await response.json();

            let url = "https://api.intra.42.fr/oauth/authorize";
            url += "?client_id=" + encodeURIComponent(data["client_id"]);
            url += "&redirect_uri=" + encodeURIComponent(data["redirect_uri"]);
            url += "&response_type=code";

            this.loading = false;
            return url;
        } else {
            console.log("Error getting env vars!");
        }
    }

    async getHtml() {
        const link = await this.createLink();

        return `
		<div class="container" id="landing-page">
			${
                this.loading
                    ? `<loading-icon size="5rem"></loading-icon>`
                    : `<div class="center">
					<div class="d-flex flex-column justify-content-center">
						<h1 class="header">Transcendence</h1>
						<h6 class="sub-header mb-5">
							Play Beyond Your Limits, Play Transcendence
						</h6>
						<div class="mb-2">
							<nav-button 
								template="primary-button"
								page="/sign-up"
								value="Sign up"
							>
							</nav-button>
						</div>
						<div class="mb-2">
							<nav-button 
								template="secondary-button"
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
				</div>
			`
            }
		</div>
		`;
    }
}
