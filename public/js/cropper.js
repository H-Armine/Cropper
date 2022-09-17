let $modal = $('#modal');
let image = document.getElementById('image');
let cropper;

$("body").on("change", ".image", function(e){
    let files = e.target.files;
    let done = function (url) {
        image.src = url;
        $modal.modal('show');
    };
    let reader;
    let file;
    let url;

    if (files && files.length > 0) {
        file = files[0];

        if (URL) {
            done(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
                done(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
});

$modal.on('shown.bs.modal', function () {
    cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 3,
        preview: '.preview'
    });

}).on('hidden.bs.modal', function () {
    cropper.destroy();
    cropper = null;
});

$("#crop").click(function(){
    canvas = cropper.getCroppedCanvas({
        width: 160,
        height: 160,
    });

    canvas.toBlob(function(blob) {
        url = URL.createObjectURL(blob);
        let reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            let base64data = reader.result;

            const formData = new FormData;
            formData.append('image', blob);

            $.ajax({
                url:"/save-crop-image",
                type:'POST',
                data: formData,
                cache : false,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },

                success:function(data){
                    $modal.modal('hide');
                    window.location.reload();
                }
            });
        }
    });
})
