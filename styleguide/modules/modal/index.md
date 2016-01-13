TODO: Clean up this documentation, at least it's a start

The bsp-modal code uses http://github.hubspot.com/vex/ as it's base much like bsp-carousel uses slick. To create a modal, create a div with the class 'bsp-modal-data' with the data attribute of 'data-bsp-modal' to trigger the JS init. There is an optional id that can be set to override the modal id for custom CSS. Default is 'modal'. Example:

    <div class="bsp-modal-data" data-bsp-modal data-bsp-modal-options='{"id" : "id-here"}'>
This div should have the contents of the modal. To open said modal via a click, create a link with data-bsp-modal-open="id-here". Upon click of the link the modal will open. It can be closed with it's own close button, Esc key, or an off click. Example:

    <a data-bsp-modal-open="id-here" href="#">Open the modal with data-bsp-modal id of "id-here"</a>
When initialized the API for the modal is attached to the data attribute 'bsp-modal' of the original div, so you can:

    $('[data-bsp-modal-id-here]').data('bsp-modal').open()
    or
    $('[data-bsp-modal-id-here]').data('bsp-modal').close()

You can also listen to events on that div:

    $('[data-bsp-modal-id-here]').on('bsp-modal:open', function(){ alert('id-here modal opened!'); });

or on the body

    $('body').on('bsp-modal:open', function(event, modal) {
    // modal is the instance of the modal object so you can close, open, etc
    // example: modal.close();
    });
Multiple modals can be opened on top of each other. They will overlay themselves with the latest being on top.

Lastly, the bsp-modal can just be imported into another JS plugin/module and used to interface with the modal. The open public API allows you to pass a Jquery object, theme and id to open a modal with that content. The modal will self attach to the Esc key and it's own close button, but you can also call the close public API function to close your modal.

    import bsp_modal from './bsp-modal';
    var myModal = Object.create(bsp_modal);
    myModal.open($('<div>asdf</div>');
    myModal.close();
