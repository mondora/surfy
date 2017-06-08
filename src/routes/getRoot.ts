import moment = require("moment");

import IRoute from "../typings/IRoute";

import {FACEBOOK_PAGE_ID, MICROSOFT_APP_ID} from "../config";

const messengerLogo = `
    <svg
        class="chat-logo"
        xmlns="http://www.w3.org/2000/svg"
        width="2485"
        height="2500"
        viewBox="96 93 322 324"
    >
        <path d="M257 93c-88.918 0-161 67.157-161 150 0 47.205 23.412 89.311 60 116.807V417l54.819-30.273C225.449 390.801 240.948 393 257 393c88.918 0 161-67.157 161-150S345.918 93 257 93zm16 202l-41-44-80 44 88-94 42 44 79-44-88 94z" fill="#0084ff"/>
    </svg>
`;
const skypeLogo = `
    <svg
        class="chat-logo"
        xmlns="http://www.w3.org/2000/svg"
        width="2464" height="2500"
        viewBox="10.589 10.32 46.699 47.375"
    >
        <path fill="#FFF" d="M34.533 52.561c-9.387 0-20.053-11.307-19.2-20.694.853-8.96 12.8-17.28 21.653-16 7.787 1.066 14.721 10.88 14.293 18.667-.425 8.212-8.533 18.027-16.746 18.027z"/><path fill="#00AFF0" d="M41.254 57.359c-.641-.213-1.601-.426-2.134-.64-.64-.319-1.387-.319-3.733-.213-2.24.106-3.414 0-5.013-.214C21.84 54.8 15.013 48.613 12.56 40.08c-.427-1.6-.533-2.453-.533-6.293 0-4.161-.107-4.48-.64-6.187-3.093-8.427 3.2-17.28 12.16-17.28 1.813 0 4.053.534 5.333 1.173.854.427 1.387.533 4.693.533 2.987 0 4.16.107 5.653.534 6.721 1.707 12.16 6.08 15.04 12.16 1.813 3.733 2.454 7.574 2.026 11.946-.213 2.348-.213 2.561.32 3.947 1.707 5.014.107 10.773-4.053 14.187-1.281 1.067-3.84 2.24-5.44 2.667-1.601.32-4.16.32-5.761-.107h-.104zm-2.881-8.213c3.521-.746 6.613-2.88 7.787-5.439 1.493-3.094 1.066-6.721-.96-8.961-1.707-1.92-4.267-2.986-10.347-4.479-4.054-.96-5.014-1.387-5.867-2.347-.747-.854-.854-1.493-.213-2.453.64-1.067 2.24-1.707 4.373-1.813 3.094-.213 4.48.533 6.293 3.413 1.387 2.134 2.773 2.667 4.588 1.813 2.346-1.173 2.133-5.013-.428-7.253-2.453-2.026-5.119-2.88-9.6-2.88-4.693 0-7.894.96-10.027 3.093-1.707 1.707-2.026 2.667-2.026 5.333 0 2.773.32 3.626 2.133 5.227 1.92 1.813 3.52 2.454 9.279 3.84 4.054.96 5.121 1.493 6.08 2.56.428.534.641.96.641 1.92 0 1.067-.107 1.28-.96 2.134-1.28 1.279-3.2 1.812-5.653 1.707-2.88-.214-4.16-1.067-5.653-4.054-1.067-2.026-1.92-2.773-3.307-2.773-3.094 0-4.16 2.56-2.56 5.866 1.387 2.881 4.16 4.801 7.68 5.547 2.133.427 6.827.427 8.854 0h-.107z"/>
    </svg>
`;

const preReleaseText = `
    <h2>
        Stiamo lavorando per Surfy!
    </h2>
    <h3>
        Torna a trovarci il 23 marzo per la
        <br />
        Convention TeamSystem 2017
    </h3>
`;

const postReleaseText = `
    <div class="chat-links">
        <a
            class="chat-link"
            href="https://www.messenger.com/t/${FACEBOOK_PAGE_ID}/"
        >
            ${messengerLogo}
            <span class="chat-text">
                Chatta con Surfy su Messenger
            </span>
        </a>
        <div class="spacer"></div>
        <a
            class="chat-link"
            href="https://join.skype.com/bot/${MICROSOFT_APP_ID}"
        >
            ${skypeLogo}
            <span class="chat-text">
                Chatta con Surfy su Skype
            </span>
        </a>
    </div>
`;

const getRootHtml = (isPostRelease: boolean) => `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Surfy</title>
            <link
                href="https://unpkg.com/purecss@0.6.2/build/grids-min.css"
                rel="stylesheet"
                type="text/css"
            />
            <link
                href="https://unpkg.com/purecss@0.6.2/build/grids-responsive-min.css"
                rel="stylesheet"
                type="text/css"
            />
            <style>
                body {
                    font-family: Helvetica, sans-serif;
                    color: #149fda;
                }
                .surfy-logo {
                    margin-top: 15%;
                    margin-bottom: 15%;
                    margin-left: 5%;
                    margin-right: 5%;
                    width: 90%;
                    height: auto;
                }
                .chat-links {
                    position: relative;
                    width: 100%;
                }
                .chat-link {
                    display: inline-block;
                    position: relative;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 4px;
                    border-color: #cbcbcb;
                    text-decoration: none;
                    color: #149fda;
                }
                .chat-link:visited {
                    color: #149fda;
                }
                @media screen and (min-width: 64em) {
                    .chat-link {
                        height: 40px;
                        line-height: 40px;
                        width: 80%;
                        margin-left: 10%;
                        margin-right: 10%;
                    }
                    .chat-links .spacer {
                        height: 8px;
                    }
                    .chat-logo {
                        height: 22px;
                        width: 22px;
                        position: absolute;
                        top: 9px;
                        left: 20px;
                    }
                    .chat-text {
                        position: absolute;
                        left: 57px;
                    }
                }
                @media screen and (max-width: 63em) {
                    .chat-link {
                        height: 120px;
                        line-height: 120px;
                        width: 90%;
                        margin-left: 5%;
                        margin-right: 5%;
                        font-size: 40px;
                    }
                    .chat-links .spacer {
                        height: 20px;
                    }
                    .chat-logo {
                        height: 66px;
                        width: 66px;
                        position: absolute;
                        top: 27px;
                        left: 60px;
                    }
                    .chat-text {
                        position: absolute;
                        left: 171px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="pure-g">
                <div class="pure-u-lg-1-3"></div>
                <div class="pure-u-sm-1 pure-u-lg-1-3">
                    <img
                        alt="Surfy"
                        class="surfy-logo"
                        src="https://cdn2.hubspot.net/hubfs/399259/Surfy/logo_surfy.png"
                    />
                    ${isPostRelease ? postReleaseText : preReleaseText}
                </div>
            </div>
        </body>
    </html>
`;

export default (): IRoute => ({
    path: "/",
    method: "get",
    middleware: [],
    handler: async (req, res) => {
        const rootHtml = getRootHtml(
            moment().isAfter("2017-03-22T16:00:00.000Z") ||
            req.query.showReleaseText === "true"
        );
        res
            .type("html")
            .status(200)
            .send(rootHtml);
    }
});
