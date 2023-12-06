import dotenv from "dotenv";
import * as cheerio from "cheerio";
import leven from "leven";

dotenv.config();
const { baseURL } = process.env;

/**
 * Searches Subscene for a given title.
 * 
 * @param {string} title - The title to search for.
 * @returns {Promise<string>} - The HTML response or an error.
 */
const search = async (title) => {
    const url = `https://subscene.com/subtitles/searchbytitle?query=${title}`;

    try {
        const data = await fetch(url);
        const html = await data.text();
    
        return html;
    } catch (err) {
        console.error("Failed to search Subscene.");
    }
};

/**
 * Selects a movie from Subscene's HTML response.
 * 
 * @param {string} html - The HTML response from Subscene.
 * @param {string} title - The title to search for.
 * @returns {string} - The movie link or "No movie found".
 */
const selectMovie = (html, title) => {
    try {
        const $ = cheerio.load(html);

        let titleUrl;
        $("div.title").each((_, element) => {
            const titleText = $(element).find("a").text();
            const similarity = leven(titleText, title);

            if (similarity < 4) {
                titleUrl = $(element).find("a").attr("href");
                return titleUrl;
            }
        });

        return titleUrl ? titleUrl : "No movie found";  
    } catch (err) {
        console.error("Invalid Subscene HTML");
    }
};

/**
 * Fetches the subtitles page from Subscene.
 * 
 * @param {string} subsUrl - The URL of the subtitles page.
 * @returns {Promise<string>} - The HTML response or an error.
 */
const fetchSubsPage = async (subsUrl) => {
    const url = `https://subscene.com${subsUrl}`;

    try {
        const data = await fetch(url);
        const html = await data.text();
    
        return html;
    } catch (err) {
        console.error("Failed to fetch list of subtitles.");
    }
};

/**
 * Parses the subtitles list from Subscene's HTML response.
 * 
 * @param {string} html - The HTML response from Subscene.
 * @returns {Array<Array<string>>} - An array of subtitle URLs and languages.
 */
const parseSubsList = (html) => {
    try {
        const $ = cheerio.load(html);

        const subtitles = [];

        $("td.a1").each((_, element) => {

            const isBad = $(element).find("a > span.bad-icon").length > 0;
            if (!isBad) {
                const subsceneURL = "https://subscene.com";

                const subUrl = `${baseURL}/subtitles.vtt?from=${subsceneURL + $(element).find("a").attr("href")}`;
                const subLang = `${$(element).find("a > span.l").text().trim()} | Subscene by @alcompilor`;
            
                subtitles.push({
                    url: subUrl,
                    lang: subLang
                });
            }
        });

        return subtitles;
    } catch (err) {
        console.error("Invalid Subscene HTML");
    }
};

export { search, selectMovie, fetchSubsPage, parseSubsList };
