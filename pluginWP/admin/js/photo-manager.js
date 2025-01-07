/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */ // Disables console warnings globally in this file
/* eslint-disable no-undef */ // Disables warnings for undefined variables like 'L' or 'establishmentsData'

jQuery(document).ready(function ($) {
  console.log('Photo manager initialized')

  $(document).on('click', '.change-photo-button', function (e) {
    console.log('Button clicked')
    e.preventDefault()

    var button = $(this)
    var observationId = button.data('observation-id')
    var currentPhotoUrl = button.data('current-url')

    console.log('Observation ID:', observationId)
    console.log('Current URL:', currentPhotoUrl)

    var frame = wp.media({
      title: 'Sélectionner une nouvelle photo',
      multiple: false,
      library: {
        type: 'image',
      },
      button: {
        text: 'Utiliser cette image',
      },
    })

    frame.on('select', function () {
      console.log('Image selected')
      var attachment = frame.state().get('selection').first().toJSON()
      console.log('Attachment:', attachment)

      $.post(
        photoManagerParams.ajaxurl,
        {
          action: 'update_observation_photo',
          observation_id: observationId,
          old_url: currentPhotoUrl,
          new_url: attachment.url,
          _wpnonce: photoManagerParams.nonce,
        },
        function (response) {
          console.log('Ajax response:', response)
          if (response.success) {
            location.reload()
          }
        },
      )
    })

    frame.open()
  })
})
