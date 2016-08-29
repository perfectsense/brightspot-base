
import $ from 'jquery.js';
import TextInput from "base/form/TextInput.js";
import TextAreaInput from "base/form/TextAreaInput.js";

import Comment from "community/commenting/Comment.js";
import CommentEntry from "community/commenting/CommentEntry.js";
import Commenting from "community/commenting/Commenting.js";

import Gallery from "base/main/GalleryMain.js";
import { VideoMain } from 'base/main/VideoMain.js';

export default {};

$( document ).ready(function() {

    // How to create a new VideoMain binding
    let $videoMain = $('.VideoMain')
    if ($videoMain.length) {
        new VideoMain($videoMain, { })
    }

})
