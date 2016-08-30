/**
 * Our main JS file which is used to compile the JS by including any plugins that are used throughout the project
 * Base has as little JS in it as possible. We try to use reusable JS plugins that have their own repos and can be
 * used across multiple projects. We then compile them in, by bringing them in via bower and they get copied
 * via the bsp-grunt task from their respective repos and compiled in with this file.
 *
 * If you have any project specific JS that you need to write, put it into your own scripts/plugins folder
 * and import from there.
 *
 * If you are going to use any plugins that don't come with base and base components, designate them in your
 * own bower.json and copy them into the scripts/bower folder via a Gruntfile entry
 */

import TextInput from "base/form/TextInput.js";
import TextAreaInput from "base/form/TextAreaInput.js";

import Comment from "community/commenting/Comment.js";
import CommentEntry from "community/commenting/CommentEntry.js";
import Commenting from "community/commenting/Commenting.js";

import Gallery from "base/main/GalleryMain.js";
import { SearchMain } from "base/search/SearchMain.js";

$( document ).ready(function() {

    // Search Main
    let $searchMain = $('.SearchMain')
    if ($searchMain.length) {
        new SearchMain($searchMain, { })
    }

})

export default {};
