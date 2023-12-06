import stremioSDK from "stremio-addon-sdk";
import * as TMDB from "./tmdb.js";
import * as Subscene from "./subscene.js";

const { addonBuilder, serveHTTP } = stremioSDK;

// Addon MANIFEST
const MANIFEST = {
	id: "addon.alcompilor.subscene",
	version: "1.0.0",
	name: "Subscene Addon",
	description: `
	This extension allows you to add Subscene subtitles into your preferred movies.
	It is currently in beta and exclusively supports movies.
	-------------------------------------------------------------
	Support this addon: https://www.buymeacoffee.com/alcompilor
	`,
	logo: "https://i.ibb.co/8DK66h9/161690297-padded-logo.png",
	catalogs: [],
	resources: ["subtitles"],
	types: ["movie"],
	
};

// Addon builder Stremio SDK
const builder = new addonBuilder(MANIFEST);

// Subtitles handler Stremio SDK
builder.defineSubtitlesHandler(async function (args) {
	if (args.id) {

        const movieTitle = await TMDB.getTitle(await TMDB.fetchMovieData(args.id));

		const searchResult = await Subscene.search(movieTitle);
		const subsPage = await Subscene.fetchSubsPage(Subscene.selectMovie(searchResult, movieTitle));
		const subtitles = Subscene.parseSubsList(subsPage);

		return Promise.resolve({ subtitles: subtitles });
    } else {
		return Promise.resolve({ subtitles: [] });
    }
});

serveHTTP(builder.getInterface(), { port: 5555 });